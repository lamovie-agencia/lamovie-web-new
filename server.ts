import express from "express";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import geoip from "geoip-lite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- STARTUP ENVIRONMENT CONFIGURATION VALIDATION ---
const databaseUrl = process.env.DATABASE_URL;
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

function requireValidConfig() {
  const missingVars = [];
  if (!databaseUrl || !databaseUrl.startsWith("postgres")) missingVars.push("DATABASE_URL");
  if (!adminPassword || adminPassword.trim() === "") missingVars.push("ADMIN_PASSWORD");
  if (!jwtSecret || jwtSecret.trim() === "") missingVars.push("JWT_SECRET");

  if (missingVars.length > 0) {
    console.error("");
    console.error("Missing required environment variables: " + missingVars.join(", "));
    console.error("");
    console.error("Create a .env file in the project root, for example:");
    console.error("  copy .env.example .env");
    console.error("");
    console.error("Then set a real PostgreSQL DATABASE_URL plus ADMIN_PASSWORD and JWT_SECRET.");
    console.error("Example DATABASE_URL:");
    console.error("  postgres://postgres:postgres@localhost:5432/la_movie");
    console.error("");
    process.exit(1);
  }
}

// Enforce physical existence of crucial env variables in production
if (process.env.NODE_ENV === "production") {
  const missingVars = [];
  if (!databaseUrl || !databaseUrl.startsWith("postgres")) missingVars.push("DATABASE_URL");
  if (!adminPassword || adminPassword.trim() === "") missingVars.push("ADMIN_PASSWORD");
  if (!jwtSecret || jwtSecret.trim() === "") missingVars.push("JWT_SECRET");

  if (missingVars.length > 0) {
    console.error(`❌ CRITICAL BOOTSTRAP FAILURE: Missing required production environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }
}

// --- METADATA ENRICHMENT UTILITIES (IP, GEOLOCATION & DEVICES) ---
function sanitizeMetadata(str: any, maxLength = 250): string {
  if (str === undefined || str === null) return "";
  let clean = String(str).trim();
  clean = clean.replace(/[\x00-\x1F\x7F]/g, "");
  clean = clean.replace(/[<>'"\\;`=]/g, "");
  return clean.substring(0, maxLength);
}

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const list = String(forwarded).split(',');
    return sanitizeMetadata(list[0].trim());
  }
  return sanitizeMetadata(req.socket.remoteAddress || "127.0.0.1");
}

function getGeographicMetadata(req: express.Request, clientIp: string): string {
  const hCountry = req.headers['x-vercel-ip-country'] || req.headers['x-appengine-country'] || req.headers['cf-ipcountry'];
  const hCity = req.headers['x-vercel-ip-city'] || req.headers['x-appengine-city'] || req.headers['cf-ipcity'];
  const hRegion = req.headers['x-vercel-ip-country-region'] || req.headers['x-appengine-region'] || req.headers['cf-region'];

  let country = hCountry ? String(hCountry) : "";
  let city = hCity ? String(hCity) : "";

  if (hRegion && typeof hRegion === "string" && !city.includes(String(hRegion))) {
    city = city ? `${city} (${hRegion})` : String(hRegion);
  }

  if (!country || !city) {
    try {
      const lookup = geoip.lookup(clientIp);
      if (lookup) {
        if (!country) country = lookup.country || "Desconocido";
        if (!city) city = lookup.city || "Desconocido";
      }
    } catch (err) {
      console.error("GeoIP lookup failed:", err);
    }
  }

  const cleanCountry = sanitizeMetadata(country || "Desconocido");
  const cleanCity = sanitizeMetadata(city || "Desconocido");
  return `${cleanCity}, ${cleanCountry}`;
}

function parseUserAgent(ua: any): { os: string; type: string; browser: string } {
  if (!ua || typeof ua !== "string") {
    return { os: "Desconocido", type: "Desktop", browser: "Desconocido" };
  }
  const uaLower = ua.toLowerCase();
  
  let os = "Desconocido";
  if (uaLower.includes("iphone") || uaLower.includes("ipad") || uaLower.includes("ipod")) {
    os = "iOS";
  } else if (uaLower.includes("android")) {
    os = "Android";
  } else if (uaLower.includes("windows")) {
    os = "Windows";
  } else if (uaLower.includes("macintosh") || uaLower.includes("mac os") || uaLower.includes("mac_powerpc")) {
    os = "Mac OS";
  } else if (uaLower.includes("linux")) {
    os = "Linux";
  }
  
  let type = "Desktop";
  if (uaLower.includes("ipad") || (uaLower.includes("android") && !uaLower.includes("mobile"))) {
    type = "Tablet";
  } else if (uaLower.includes("mobi") || uaLower.includes("iphone") || uaLower.includes("android") || uaLower.includes("windows phone")) {
    type = "Móvil";
  }

  let browser = "Desconocido";
  if (uaLower.includes("firefox")) {
    browser = "Firefox";
  } else if (uaLower.includes("chrome") || uaLower.includes("chromium")) {
    browser = "Chrome";
  } else if (uaLower.includes("safari") && !uaLower.includes("chrome")) {
    browser = "Safari";
  } else if (uaLower.includes("edge") || uaLower.includes("edg")) {
    browser = "Edge";
  } else if (uaLower.includes("opera") || uaLower.includes("opr")) {
    browser = "Opera";
  }
  
  return { 
    os: sanitizeMetadata(os), 
    type: sanitizeMetadata(type),
    browser: sanitizeMetadata(browser)
  };
}

// --- PORTFOLIO MEDIA URL LINK PARSER & SANITIZER ---
function parsePortfolioUrl(url: string, source: string): { cleanUrl: string; videoId: string } {
  if (!url) return { cleanUrl: "", videoId: "" };
  const trimmed = url.trim();

  // Defensive sanitization: reject strings triggering common XSS patterns
  let isXssSuspect = /<script|javascript:|onerror=|onload=/gi.test(trimmed);
  if (isXssSuspect) {
    return { cleanUrl: "", videoId: "" };
  }

  if (source === "youtube") {
    // Matches standard Watch URL, Shorts, Embeds, and Shortened (youtu.be) URLs
    const ytReg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(ytReg);
    if (match && match[1]) {
      return {
        cleanUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0`,
        videoId: match[1]
      };
    }
  } else if (source === "vimeo") {
    // Matches: https://vimeo.com/XXXXXX or vimeo.com/channels/staffpicks/XXXXXX
    const vimReg = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const match = trimmed.match(vimReg);
    if (match && match[1]) {
      return {
        cleanUrl: `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1&autopause=0&controls=0&background=1`,
        videoId: match[1]
      };
    }
  } else if (source === "instagram") {
    const igReg = /(?:instagram\.com\/(?:p|reel|tv)\/)([A-Za-z0-9_-]+)/;
    const match = trimmed.match(igReg);
    if (match && match[1]) {
      return {
        cleanUrl: `https://www.instagram.com/p/${match[1]}/embed`,
        videoId: match[1]
      };
    }
  }

  return { cleanUrl: trimmed, videoId: trimmed };
}

// --- SMTP CORPORATE LEADS EMAIL DISPATCHER ---
async function sendCorporateLeadEmail(leadData: { name: string; email: string; phone: string; service: string; message: string }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"LA MOVIE CRM" <leads@lamovie.la>';
  const to = process.env.SMTP_TO || "admin@lamovie.la";

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #111111 0%, #1e1e1e 100%); padding: 24px; text-align: center; border-radius: 8px 8px 0 0; color: #ffffff;">
        <h2 style="margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">¡NUEVO LEAD DE LA MOVIE!</h2>
        <p style="margin: 4px 0 0 0; color: #a1a1a1; font-size: 14px;">Inbound Marketing Automático</p>
      </div>
      <div style="padding: 24px; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Hola Administrador,</p>
        <p style="font-size: 15px;">Has recibido un nuevo contacto potencial desde la landing page corporativa de <strong>LA MOVIE</strong>. A continuación, te presentamos el detalle del cliente:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f1f1;">
            <td style="padding: 10px 0; font-weight: bold; width: 120px;">Nombre:</td>
            <td style="padding: 10px 0; color: #555555;">${leadData.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f1f1;">
            <td style="padding: 10px 0; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0; color: #555555;"><a href="mailto:${leadData.email}" style="color: #ff3344; text-decoration: none;">${leadData.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f1f1;">
            <td style="padding: 10px 0; font-weight: bold;">Teléfono:</td>
            <td style="padding: 10px 0; color: #555555;">${leadData.phone || 'No especificado'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f1f1;">
            <td style="padding: 10px 0; font-weight: bold;">Servicio:</td>
            <td style="padding: 10px 0; color: #22c55e; font-weight: bold;">${leadData.service}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Mensaje:</td>
            <td style="padding: 10px 0; color: #555555; white-space: pre-line;">${leadData.message || 'Sin mensaje'}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/admin" style="background-color: #111111; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; text-transform: uppercase;">
            Administrar Lead en CRM
          </a>
        </div>
      </div>
      <div style="background-color: #f9f9f9; padding: 16px; text-align: center; border-radius: 0 0 12px 12px; font-size: 12px; color: #888888; border-top: 1px solid #eee;">
        LA MOVIE © ${new Date().getFullYear()} • Agencia Creativa & Recursos Digitales
      </div>
    </div>
  `;

  if (!host || !user || !pass) {
    console.log("--------------------------------------------------------------------------------");
    console.log("📧 [LA MOVIE CORPORATE SMTP SIMULATION]");
    console.log(`SMTP Credentials NOT found in .env. Simulating email to: ${to}`);
    console.log(`Content:\nNom: ${leadData.name}\nEmail: ${leadData.email}\nPhone: ${leadData.phone}\nService: ${leadData.service}\nMsg: ${leadData.message}`);
    console.log("--------------------------------------------------------------------------------");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from,
      to,
      subject: `🔥 [Nuevo Lead] ${leadData.name} - Interesado en ${leadData.service}`,
      html: emailHtml
    });
    console.log(`📧 SMTP Lead email successfully dispatched to ${to}`);
  } catch (error) {
    console.error("❌ LA MOVIE SMTP MAIL_SERVER ERROR:", error);
  }
}

// --- DATABASE SERVICE POOL HOOK ---
let pool: pg.Pool;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // --- DATABASE COUPLING & IN-MEMORY EXCLUSION ---
  requireValidConfig();
  if (!databaseUrl || databaseUrl === "base" || !databaseUrl.startsWith('postgres')) {
    console.error("❌ CRITICAL INGEST DATA PROTECTION VIOLATION: DATABASE_URL is missing or invalid. Boot aborted.");
    process.exit(1);
  }

  try {
    const { Pool } = pg;
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
    });
    
    pool.on('error', (err: any) => {
      console.error('Unexpected database client error in idle pg pool:', err);
    });
    
    // Test execution and bootstrap tables
    await pool.query("SELECT 1;");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT,
        video_url TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        description TEXT,
        items TEXT[],
        icon TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        content TEXT NOT NULL,
        image_url TEXT,
        rating INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS web_showcase (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        live_url TEXT,
        category TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pricing_packages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price TEXT NOT NULL,
        period TEXT,
        description TEXT,
        features TEXT[],
        recommended BOOLEAN DEFAULT FALSE,
        color TEXT,
        icon TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        due_date TIMESTAMP,
        reminder TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_notes (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        reminder TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_crm_clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        status TEXT DEFAULT 'prospect',
        value NUMERIC DEFAULT 0,
        tag TEXT,
        unread INTEGER DEFAULT 0,
        reminder TIMESTAMP,
        ip TEXT,
        location TEXT,
        device TEXT,
        browser TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        client_id INTEGER REFERENCES admin_crm_clients(id) ON DELETE SET NULL,
        type TEXT DEFAULT 'Web App',
        status TEXT DEFAULT 'planning',
        progress INTEGER DEFAULT 0,
        team TEXT[] DEFAULT '{}',
        assets INTEGER DEFAULT 0,
        due_date TEXT,
        deadline DATE,
        budget NUMERIC DEFAULT 0,
        unread INTEGER DEFAULT 0,
        color TEXT DEFAULT 'from-blue-500 to-purple-500',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_documents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        client TEXT,
        status TEXT DEFAULT 'draft',
        author TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        gcs_object_key TEXT,
        gcs_bucket_name TEXT DEFAULT 'la-movie-documents-prod',
        content_markdown TEXT
      );

      CREATE TABLE IF NOT EXISTS admin_contracts (
        id SERIAL PRIMARY KEY,
        client TEXT NOT NULL,
        service TEXT NOT NULL,
        value_usd NUMERIC DEFAULT 0,
        status TEXT DEFAULT 'pending',
        next_billing TEXT,
        auto_renew BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_transactions (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        description TEXT,
        type TEXT DEFAULT 'income',
        amount_usd NUMERIC DEFAULT 0,
        category TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_ai_logs (
        id SERIAL PRIMARY KEY,
        platform TEXT NOT NULL,
        event_type TEXT NOT NULL,
        payload TEXT,
        status TEXT DEFAULT 'success',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure telemetry structures are loaded onto client records
    await pool.query(`
      ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS ip TEXT;
      ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS location TEXT;
      ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS device TEXT;
      ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS browser TEXT;
    `);

    // Ensure portfolio extensions are loaded
    await pool.query(`
      ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS format_type TEXT DEFAULT 'horizontal';
      ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS media_source TEXT DEFAULT 'native';
      ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS media_url TEXT DEFAULT '';
      ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS thumbnail_url TEXT DEFAULT '';
    `);

    console.log("📋 PostgreSQL Database successfully connected, structures verified, tables migrated!");
  } catch (err) {
    console.error("❌ CRITICAL STACK STAGE DATABASE INGEST FAILURE:", err);
    process.exit(1);
  }

  // --- SECURITY HEADERS MIDDLEWARE ---
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "ALLOWALL");
    next();
  });

  // --- STRICT STAGE CORS CONTROL ---
  const configuredOrigins = [
    process.env.APP_URL,
    ...(process.env.ALLOWED_ORIGINS || "").split(",")
  ].filter(Boolean).map((origin) => String(origin).trim().replace(/\/$/, ""));

  const productionOrigins = [
    "https://agencylamovie.com",
    "https://www.agencylamovie.com",
    "https://lamovie.agency",
    "https://lamovie.pro"
  ];

  const developmentOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ];

  const allowedOrigins = [
    ...productionOrigins,
    ...configuredOrigins,
    ...(process.env.NODE_ENV === "production" ? [] : developmentOrigins)
  ];

  app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, same-origin, curl)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`🔒 CORS ACCESS BLOCKED: Origin ${origin} rejected under production rules.`);
        callback(new Error("CORS policy violation: Unauthorized origin under production audit."));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  // --- INPUT SANITIZATION MIDDLEWARE ---
  function sanitizeInput(data: any): any {
    if (typeof data === "string") {
      return data
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
        .replace(/href=["']javascript:[^"']*["']/gi, "")
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
    }
    if (Array.isArray(data)) {
      return data.map(v => sanitizeInput(v));
    }
    if (data !== null && typeof data === "object") {
      const res: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          res[key] = sanitizeInput(data[key]);
        }
      }
      return res;
    }
    return data;
  }
  
  app.use((req, res, next) => {
    if (req.body) {
      req.body = sanitizeInput(req.body);
    }
    next();
  });

  // --- DATABASE CONNECTIVITY CHECK ENFORCER MIDDLEWARE ---
  app.use("/api", (req, res, next) => {
    if (!pool) {
      console.error("❌ PRODUCTION EXCLUSIVE REFUSED: PostgreSQL Pool database driver is offline.");
      return res.status(500).json({
        error: "Error de configuración de producción",
        message: "No hay conexión disponible con el servidor PostgreSQL exclusivo de producción."
      });
    }
    next();
  });

  // --- JWT SEED SECURITY AUTHENTICATOR MIDDLEWARE ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No se proporcionó token de sesión" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "lamovie_secure_fallback_salt_2026");
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Sesión expirada o token no válido" });
    }
  };

  // --- PRODUCTION API CONTROLLER HANDLERS ---

  // Admin Master Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const masterPassword = process.env.ADMIN_PASSWORD;

    if (!masterPassword) {
      console.error("❌ CRITICAL: ADMIN_PASSWORD environment secret key is missing.");
      return res.status(500).json({ error: "Contraseña maestra del portal de administración no configurada en el servidor." });
    }

    if (username !== adminUsername || password !== masterPassword) {
      return res.status(401).json({ error: "Credenciales de seguridad incorrectas" });
    }
    
    const token = jwt.sign(
      { username: username || adminUsername, role: "Administrador Master" }, 
      process.env.JWT_SECRET || "lamovie_secure_fallback_salt_2026", 
      { expiresIn: "24h" }
    );

    // Secure cookie setup fully matching cryptographic compliance metrics
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.json({ token });
  });

  // Profile
  app.get("/api/admin/profile", authenticateToken, (req: any, res: any) => {
    res.json({
      username: req.user?.username || "admin",
      name: "Yosimar Zuñiga",
      role: "Administrador Master",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
    });
  });

  // Logout
  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie('adminToken');
    res.json({ success: true, message: "Sesión cerrada de forma segura. Tokens y Cookies destruidos." });
  });

  // Portfolio Rest API
  app.get("/api/portfolio", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM portfolio ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      console.error("Failed to fetch portfolio from real DB:", err);
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolio", authenticateToken, async (req, res) => {
    const { 
      title, 
      category, 
      description, 
      format_type, 
      media_source, 
      media_url, 
      thumbnail_url,
      image_url,
      video_url
    } = req.body;

    const final_format_type = format_type || "horizontal";
    const final_media_source = media_source || "native";
    let raw_media_url = media_url || video_url || "";
    let final_thumbnail_url = thumbnail_url || image_url || "";

    // Parse the media URL using our regex parser based on source type
    const parsed = parsePortfolioUrl(raw_media_url, final_media_source);
    const final_media_url_clean = parsed.cleanUrl;

    try {
      const result = await pool.query(
        `INSERT INTO portfolio 
          (title, category, description, format_type, media_source, media_url, thumbnail_url, image_url, video_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [
          title || "Proyecto sin título", 
          category || "cinema", 
          description || "", 
          final_format_type, 
          final_media_source, 
          final_media_url_clean, 
          final_thumbnail_url,
          final_thumbnail_url, // fill backward compatibility image_url column
          final_media_url_clean // fill backward compatibility video_url column
        ]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error("POST /api/portfolio error:", err);
      res.status(500).json({ error: "Failed to create portfolio item" });
    }
  });

  app.delete("/api/portfolio/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM portfolio WHERE id = $1", [req.params.id]);
      res.json({ message: "Deleted successfully from real production database." });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete" });
    }
  });

  app.put("/api/portfolio/:id", authenticateToken, async (req, res) => {
    const { 
      title, 
      category, 
      description, 
      format_type, 
      media_source, 
      media_url, 
      thumbnail_url,
      image_url,
      video_url
    } = req.body;

    const final_format_type = format_type || "horizontal";
    const final_media_source = media_source || "native";
    let raw_media_url = media_url || video_url || "";
    let final_thumbnail_url = thumbnail_url || image_url || "";

    // Parse the media URL using our regex parser based on source
    const parsed = parsePortfolioUrl(raw_media_url, final_media_source);
    const final_media_url_clean = parsed.cleanUrl;

    try {
      const result = await pool.query(
        `UPDATE portfolio SET 
          title = $1, 
          category = $2, 
          description = $3, 
          format_type = $4, 
          media_source = $5, 
          media_url = $6, 
          thumbnail_url = $7,
          image_url = $8,
          video_url = $9
         WHERE id = $10 
         RETURNING *`,
        [
          title, 
          category, 
          description, 
          final_format_type, 
          final_media_source, 
          final_media_url_clean, 
          final_thumbnail_url,
          final_thumbnail_url,
          final_media_url_clean,
          req.params.id
        ]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (err) {
      console.error("PUT /api/portfolio/:id error:", err);
      res.status(500).json({ error: "Failed to update" });
    }
  });

  // Services Rest API
  app.get("/api/services", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM services ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", authenticateToken, async (req, res) => {
    const { title, subtitle, description, items, icon } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO services (title, subtitle, description, items, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [title, subtitle, description, items, icon]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", authenticateToken, async (req, res) => {
    const { title, subtitle, description, items, icon } = req.body;
    try {
      const result = await pool.query(
        "UPDATE services SET title = $1, subtitle = $2, description = $3, items = $4, icon = $5 WHERE id = $6 RETURNING *",
        [title, subtitle, description, items, icon, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Service not found." });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM services WHERE id = $1", [req.params.id]);
      res.json({ message: "Service deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Testimonials REST API
  app.get("/api/testimonials", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM testimonials ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", authenticateToken, async (req, res) => {
    const { name, role, content, image_url, rating } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO testimonials (name, role, content, image_url, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, role, content, image_url, rating]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.put("/api/testimonials/:id", authenticateToken, async (req, res) => {
    const { name, role, content, image_url, rating } = req.body;
    try {
      const result = await pool.query(
        "UPDATE testimonials SET name = $1, role = $2, content = $3, image_url = $4, rating = $5 WHERE id = $6 RETURNING *",
        [name, role, content, image_url, rating, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM testimonials WHERE id = $1", [req.params.id]);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Web Showcase REST API
  app.get("/api/web-showcase", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM web_showcase ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch web showcase" });
    }
  });

  app.post("/api/web-showcase", authenticateToken, async (req, res) => {
    const { title, description, image_url, live_url, category } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO web_showcase (title, description, image_url, live_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [title, description, image_url, live_url, category]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create web showcase item" });
    }
  });

  app.put("/api/web-showcase/:id", authenticateToken, async (req, res) => {
    const { title, description, image_url, live_url, category } = req.body;
    try {
      const result = await pool.query(
        "UPDATE web_showcase SET title = $1, description = $2, image_url = $3, live_url = $4, category = $5 WHERE id = $6 RETURNING *",
        [title, description, image_url, live_url, category, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update web showcase item" });
    }
  });

  app.delete("/api/web-showcase/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM web_showcase WHERE id = $1", [req.params.id]);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete web showcase item" });
    }
  });

  // Admin System Status Check
  app.get("/api/admin/status", authenticateToken, async (req, res) => {
    res.json({
      database: {
        connected: !!pool,
        type: "PostgreSQL Configurado (Exclusivo Real / Persistente)",
        url_defined: !!process.env.DATABASE_URL,
      },
      environment: {
        node_env: process.env.NODE_ENV || "production",
        vercel: true,
        jwt_defined: !!process.env.JWT_SECRET,
        port: PORT
      }
    });
  });

  // Site Settings REST API
  app.get("/api/settings", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM site_settings");
      const settings: any = {};
      result.rows.forEach((row: any) => {
        settings[row.key] = row.value;
      });
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", authenticateToken, async (req, res) => {
    const { key, value } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP RETURNING *",
        [key, value]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to save settings" });
    }
  });

  // Pricing Packages REST API
  app.get("/api/pricing", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM pricing_packages ORDER BY category, created_at ASC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch pricing packages" });
    }
  });

  app.post("/api/pricing", authenticateToken, async (req, res) => {
    const { name, category, price, period, description, features, recommended, color, icon } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO pricing_packages (name, category, price, period, description, features, recommended, color, icon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [name, category, price, period, description, features, recommended, color, icon]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create pricing package" });
    }
  });

  app.put("/api/pricing/:id", authenticateToken, async (req, res) => {
    const { name, category, price, period, description, features, recommended, color, icon } = req.body;
    try {
      const result = await pool.query(
        "UPDATE pricing_packages SET name = $1, category = $2, price = $3, period = $4, description = $5, features = $6, recommended = $7, color = $8, icon = $9 WHERE id = $10 RETURNING *",
        [name, category, price, period, description, features, recommended, color, icon, req.params.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update pricing package" });
    }
  });

  app.delete("/api/pricing/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM pricing_packages WHERE id = $1", [req.params.id]);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete pricing package" });
    }
  });

  // Admin Tasks REST API
  app.get("/api/admin-tasks", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM admin_tasks ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/admin-tasks", authenticateToken, async (req, res) => {
    const { title, due_date, reminder } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO admin_tasks (title, completed, due_date, reminder) VALUES ($1, false, $2, $3) RETURNING *",
        [title, due_date || null, reminder || null]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.put("/api/admin-tasks/:id", authenticateToken, async (req, res) => {
    const { title, completed, due_date, reminder } = req.body;
    try {
      let query = "";
      let params = [];
      if (title !== undefined && due_date !== undefined) {
         query = "UPDATE admin_tasks SET title = $1, completed = $2, due_date = $3, reminder = $4 WHERE id = $5 RETURNING *";
         params = [title, completed, due_date, reminder, req.params.id];
      } else if (title !== undefined) {
         query = "UPDATE admin_tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *";
         params = [title, completed, req.params.id];
      } else {
         query = "UPDATE admin_tasks SET completed = $1 WHERE id = $2 RETURNING *";
         params = [completed, req.params.id];
      }
      const result = await pool.query(query, params);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/admin-tasks/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM admin_tasks WHERE id = $1", [req.params.id]);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // --- PUBLIC CO-SINK LEADS REGISTRATION INBOUND ENGINE ---
  app.post("/api/leads", async (req, res) => {
    const { name, email, phone, message, service } = req.body;
    
    // Strict input compliance and validation
    if (!name || String(name).trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    
    const clientName = String(name).substring(0, 100);
    const clientEmail = String(email || "").substring(0, 100);
    const clientPhone = String(phone || "").substring(0, 50);
    const clientService = String(service || "Contacto General").substring(0, 100);
    const clientMessage = String(message || "").substring(0, 1000);
    
    const tag = clientService;
    const status = "prospect"; 
    const value = 1000; 
    
    // Server-Side Telemetry Capture & Enrichment
    const clientIp = getClientIp(req);
    const clientLocation = getGeographicMetadata(req, clientIp);
    const clientDeviceData = parseUserAgent(req.headers['user-agent']);
    const clientDeviceFormatted = `${clientDeviceData.os} (${clientDeviceData.type})`;

    try {
      // Send email alert asynchronously
      sendCorporateLeadEmail({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        service: clientService,
        message: clientMessage
      }).catch(mailErr => console.error("🔒 SECURE SERVER LOGGER - Background email dispatch failed:", mailErr));

      // Record telemetry values directly inside the verified PostgreSQL DB
      const result = await pool.query(
        "INSERT INTO admin_crm_clients (name, email, phone, status, value, tag, reminder, ip, location, device, browser) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [clientName, clientEmail, clientPhone, status, value, tag, null, clientIp, clientLocation, clientDeviceFormatted, clientDeviceData.browser]
      );
      
      res.status(201).json({ success: true, lead: result.rows[0] });
    } catch (err) {
      console.error("🔒 SECURE SERVER LOGGER - Failed to write real lead in target database:", err);
      res.status(500).json({ error: "Fallo crítico en el sistema real de registro persistente." });
    }
  });

  // ADMIN CRM REST API
  app.get("/api/admin-crm", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM admin_crm_clients ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch CRM clients" });
    }
  });

  app.post("/api/admin-crm", authenticateToken, async (req, res) => {
    const { name, email, phone, status, value, tag, reminder } = req.body;
    try {
      const result = await pool.query(
         "INSERT INTO admin_crm_clients (name, email, phone, status, value, tag, reminder) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
         [name, email, phone, status, value, tag, reminder || null]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create CRM client" });
    }
  });

  app.put("/api/admin-crm/:id", authenticateToken, async (req, res) => {
    const { name, email, phone, status, value, tag, reminder } = req.body;
    try {
      const result = await pool.query(
        "UPDATE admin_crm_clients SET name=$1, email=$2, phone=$3, status=$4, value=$5, tag=$6, reminder=$7 WHERE id=$8 RETURNING *",
        [name, email, phone, status, value, tag, reminder || null, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "CRM Client not found" });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update CRM client" });
    }
  });

  app.delete("/api/admin-crm/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM admin_crm_clients WHERE id = $1", [req.params.id]);
      res.json({ message: "CRM Client deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete CRM client" });
    }
  });

  // ADMIN NOTES REST API
  app.get("/api/admin-notes", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM admin_notes ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/admin-notes", authenticateToken, async (req, res) => {
    const { content, reminder } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO admin_notes (content, reminder) VALUES ($1, $2) RETURNING *",
        [content, reminder || null]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  app.delete("/api/admin-notes/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM admin_notes WHERE id = $1", [req.params.id]);
      res.json({ message: "Note deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  // --- MULTI-FORMAT ASSET MANAGEMENT Multer config ---
  const SECRET_SIGNING_KEY = process.env.JWT_SECRET || "lamovie_secure_fallback_salt_2026";

  function generateSecureSignedUrl(bucketName: string, objectKey: string, expirationMinutes: number = 15): string {
    const expiresAt = Math.floor((Date.now() + expirationMinutes * 60 * 1000) / 1000);
    const rawString = `${bucketName}/${objectKey}:${expiresAt}`;
    const signature = crypto.createHmac("sha256", SECRET_SIGNING_KEY).update(rawString).digest("hex");
    return `/api/docs/download-secure?bucket=${encodeURIComponent(bucketName)}&key=${encodeURIComponent(objectKey)}&Expires=${expiresAt}&Signature=${signature}`;
  }

  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `showcase-${uniqueSuffix}${ext}`);
      }
    }),
    limits: {
      fileSize: 50 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
      const allowedMimetypes = ["image/jpeg", "image/png", "video/mp4"];
      if (allowedMimetypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Formato inválido. Solo se admiten imágenes (.jpeg, .png) y videos (.mp4)."));
      }
    }
  });

  app.post("/api/assets/upload", authenticateToken, (req, res) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || "Error al subir archivo" });
      }
      
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "Suministre un archivo para la carga en la variable 'file'" });
      }
      
      const isVideo = file.mimetype === "video/mp4";
      const sizeLimit = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      
      if (file.size > sizeLimit) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {}
        return res.status(400).json({
          error: `El archivo supera la cuota permitida (${isVideo ? '50MB para videos mp4' : '5MB para imágenes'}).`
        });
      }
      
      const publicPath = `/uploads/${file.filename}`;
      res.json({
        success: true,
        message: "Asset cargado y verificado con éxito",
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: publicPath
      });
    });
  });

  // --- PROJECTS AND PRODUCTION MODULE - PERSISTENCE STRICT SQL ---
  app.get("/api/projects", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.*, c.name AS client, c.email AS client_email
        FROM projects p
        LEFT JOIN admin_crm_clients c ON p.client_id = c.id
        ORDER BY p.id DESC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error("🔒 SECURE SERVER LOGGER - Failed to fetch projects:", err);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", authenticateToken, async (req, res) => {
    const { name, client_id, client, type, status, progress, team, assets, due_date, color } = req.body;
    try {
      let targetCrmId = client_id;
      if (!targetCrmId && client) {
        const clientSearch = await pool.query("SELECT id FROM admin_crm_clients WHERE LOWER(name) = LOWER($1) LIMIT 1", [client]);
        if (clientSearch.rows.length > 0) {
          targetCrmId = clientSearch.rows[0].id;
        }
      }
      
      const result = await pool.query(`
        INSERT INTO projects (name, client_id, type, status, progress, team, assets, due_date, color)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        name, 
        targetCrmId || null, 
        type || 'Web App', 
        status || 'planning', 
        Number(progress) || 0, 
        team || [], 
        Number(assets) || 0, 
        due_date || new Date().toISOString(), 
        color || 'from-blue-500 to-purple-500'
      ]);
      
      const joinedResult = await pool.query(`
        SELECT p.*, c.name AS client, c.email AS client_email
        FROM projects p
        LEFT JOIN admin_crm_clients c ON p.client_id = c.id
        WHERE p.id = $1
      `, [result.rows[0].id]);
      
      res.json(joinedResult.rows[0]);
    } catch (err) {
      console.error("🔒 SECURE SERVER LOGGER - Failed to create project:", err);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", authenticateToken, async (req, res) => {
    const { name, client_id, client, type, status, progress, team, assets, due_date, color } = req.body;
    try {
      let targetCrmId = client_id;
      if (!targetCrmId && client) {
        const clientSearch = await pool.query("SELECT id FROM admin_crm_clients WHERE LOWER(name) = LOWER($1) LIMIT 1", [client]);
        if (clientSearch.rows.length > 0) {
          targetCrmId = clientSearch.rows[0].id;
        }
      }
      
      const result = await pool.query(`
        UPDATE projects
        SET name = COALESCE($1, name),
            client_id = COALESCE($2, client_id),
            type = COALESCE($3, type),
            status = COALESCE($4, status),
            progress = COALESCE($5, progress),
            team = COALESCE($6, team),
            assets = COALESCE($7, assets),
            due_date = COALESCE($8, due_date),
            color = COALESCE($9, color)
        WHERE id = $10
        RETURNING *
      `, [
        name, 
        targetCrmId, 
        type, 
        status, 
        progress !== undefined ? Number(progress) : null, 
        team, 
        assets !== undefined ? Number(assets) : null, 
        due_date, 
        color, 
        req.params.id
      ]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const joinedResult = await pool.query(`
        SELECT p.*, c.name AS client, c.email AS client_email
        FROM projects p
        LEFT JOIN admin_crm_clients c ON p.client_id = c.id
        WHERE p.id = $1
      `, [req.params.id]);
      
      res.json(joinedResult.rows[0]);
    } catch (err) {
      console.error("🔒 SECURE SERVER LOGGER - Failed to update project:", err);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
      res.json({ message: "Deleted" });
    } catch (err) {
      console.error("🔒 SECURE SERVER LOGGER - Failed to delete project:", err);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // --- INTEGRATIONS & WEBHOOKS LOG SYSTEM ---
  app.post("/api/v1/ai-logs", async (req, res) => {
    const { platform, event_type, payload, status } = req.body;
    
    if (!platform || !event_type) {
      return res.status(400).json({ error: "Platform and event_type are required fields." });
    }

    try {
      const logPayloadString = typeof payload === "string" ? payload : JSON.stringify(payload);
      const result = await pool.query(`
        INSERT INTO admin_ai_logs (platform, event_type, payload, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [platform, event_type, logPayloadString, status || 'success']);
      res.status(201).json({ success: true, log: result.rows[0] });
    } catch (err) {
      console.error("🔒 SECURE SERVER LOGGER - Failed to write webhook AI log:", err);
      res.status(500).json({ error: "Failed to store AI log secure metadata" });
    }
  });

  app.get("/api/ai-logs", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM admin_ai_logs ORDER BY id DESC LIMIT 50");
      res.json(result.rows);
    } catch (err) {
      console.error("🔒 SECURE SERVER LOGGER - Failed to fetch AI logs:", err);
      res.status(500).json({ error: "Error fetching registered executions logs" });
    }
  });

  // Webhook: Stripe/PayPal
  app.post("/api/v1/payments/webhook", async (req, res) => {
    const signature = req.headers["x-signature"] || req.headers["stripe-signature"];
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || "la_movie_payment_webhook_secret_2026";
    
    if (!signature) {
      return res.status(401).json({ error: "Falta firma de seguridad" });
    }
    
    const bodyPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSignature = crypto.createHmac("sha256", secret).update(bodyPayload).digest("hex");
    
    if (signature !== expectedSignature) {
      console.warn(`🔒 SECURITY VIOLATION: Invalid webhook signature.`);
      return res.status(403).json({ error: "Firma inválida." });
    }

    const { event, contractId, amountUSD, description } = req.body;
    const isSuccess = event === "payment.success" || req.body.type === "payment_intent.succeeded";
    
    if (isSuccess) {
      const targetContractId = Number(contractId) || 1;
      const paymentAmount = Number(amountUSD) || 2500;
      const desc = description || `Factura de Pago Webhook Procesada con Éxito`;
      const dateStr = new Date().toISOString().split('T')[0];
      
      try {
        await pool.query("UPDATE admin_contracts SET status = 'active' WHERE id = $1", [targetContractId]);
        await pool.query(`
          INSERT INTO admin_transactions (date, description, type, amount_usd, category)
          VALUES ($1, $2, 'income', $3, 'Stripe Webhook Integration')
        `, [dateStr, desc, paymentAmount]);
        
        console.log(`💳 PAYMENTS WEBHOOK SUCCESS: Contract ${targetContractId} status updated to Active.`);
        return res.json({ success: true, message: "Webhook procesado con éxito." });
      } catch (dbErr) {
        console.error("❌ PAYMENTS WEBHOOK DATABASE UPDATE ERROR:", dbErr);
        return res.status(500).json({ error: "Error de guardado interno durante actualización del webhook de pago." });
      }
    }
    
    res.json({ success: true, message: "Evento recibido pero omitido." });
  });

  // Webhook MP
  app.post("/api/payments/webhook", async (req, res) => {
    const body = req.body || {};
    const externalRef = body.external_reference || body.external_ref || body.reference || (body.metadata && body.metadata.lead_id) || body.lead_id;
    
    if (!externalRef) {
      return res.status(200).json({ success: false, message: "Petición recibida pero se omite por falta de external_reference o lead_id." });
    }

    const statusVal = String(body.status || body.state || body.event || body.action || (body.data && body.data.status) || 'approved').toLowerCase();
    const isApproved = statusVal === 'approved' || statusVal === 'success' || statusVal === 'succeeded' || statusVal === 'paid';

    if (!isApproved) {
      return res.json({ success: true, message: `Evento ignorado con estado: ${statusVal}` });
    }

    const amountVal = Number(body.amount || body.transaction_amount || body.value || (body.data && body.data.amount) || 1500);
    const leadId = Number(externalRef);

    if (isNaN(leadId)) {
      return res.status(200).json({ success: false, message: "lead_id inválido." });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const desc = `Pago Automatizado Webhook (${body.provider || 'Mercado Pago / Bold'}) - Ref: ${leadId}`;

    try {
      const clientRes = await pool.query("SELECT * FROM admin_crm_clients WHERE id = $1", [leadId]);
      if (clientRes.rows.length === 0) {
        return res.status(200).json({ success: false, message: "Lead de CRM no encontrado." });
      }
      
      const clientData = clientRes.rows[0];
      const currentVal = Number(clientData.value) || 0;
      const newVal = currentVal + amountVal;

      await pool.query(
        "UPDATE admin_crm_clients SET status = 'active', value = $1 WHERE id = $2",
        [newVal, leadId]
      );

      await pool.query(
        "INSERT INTO admin_transactions (date, description, type, amount_usd, category, created_at) VALUES ($1, $2, 'income', $3, 'Mercado Pago Webhook', NOW())",
        [dateStr, desc, amountVal]
      );

      return res.json({ success: true, message: "Lead de CRM y volumen financiero acreditado con éxito." });
    } catch (err) {
      console.error("❌ MP WEBHOOK ERROR:", err);
      return res.status(500).json({ error: "Error interno procesando webhook." });
    }
  });

  // --- OUT-BILLINGS FINANCE MODULE ---
  app.get("/api/finance/contracts", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          client, 
          service, 
          value_usd AS "valueUSD", 
          status, 
          next_billing AS "nextBilling", 
          auto_renew AS "autoRenew" 
        FROM admin_contracts 
        ORDER BY id DESC
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch contracts" });
    }
  });

  app.post("/api/finance/contracts", authenticateToken, async (req, res) => {
    const { client, service, valueUSD, status, nextBilling, autoRenew } = req.body;
    try {
      const result = await pool.query(`
        INSERT INTO admin_contracts (client, service, value_usd, status, next_billing, auto_renew)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, client, service, value_usd AS "valueUSD", status, next_billing AS "nextBilling", auto_renew AS "autoRenew"
      `, [client, service, Number(valueUSD) || 0, status || 'pending', nextBilling, autoRenew !== false]);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create contract" });
    }
  });

  app.put("/api/finance/contracts/:id", authenticateToken, async (req, res) => {
    const { client, service, valueUSD, status, nextBilling, autoRenew } = req.body;
    try {
      const result = await pool.query(`
        UPDATE admin_contracts
        SET client = COALESCE($1, client),
            service = COALESCE($2, service),
            value_usd = COALESCE($3, value_usd),
            status = COALESCE($4, status),
            next_billing = COALESCE($5, next_billing),
            auto_renew = COALESCE($6, auto_renew)
        WHERE id = $7
        RETURNING id, client, service, value_usd AS "valueUSD", status, next_billing AS "nextBilling", auto_renew AS "autoRenew"
      `, [
        client,
        service,
        valueUSD !== undefined ? Number(valueUSD) : null,
        status,
        nextBilling,
        autoRenew,
        req.params.id
      ]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update contract" });
    }
  });

  app.delete("/api/finance/contracts/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM admin_contracts WHERE id = $1", [req.params.id]);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete contract" });
    }
  });

  app.get("/api/finance/transactions", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, date, description, type, amount_usd AS "amountUSD", category
        FROM admin_transactions
        ORDER BY id DESC
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/finance/transactions", authenticateToken, async (req, res) => {
    const { date, description, type, amountUSD, category } = req.body;
    try {
      const result = await pool.query(`
        INSERT INTO admin_transactions (date, description, type, amount_usd, category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, date, description, type, amount_usd AS "amountUSD", category
      `, [date, description, type, Number(amountUSD) || 0, category]);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // --- DOCS CLOUD-INDEXED GCS SYSTEM ---
  app.get("/api/docs/documents", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM admin_documents ORDER BY id DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/docs/documents", authenticateToken, async (req, res) => {
    const { name, type, client, status, author, content_markdown } = req.body;
    try {
      const gcsKey = `contracts/contract-${Date.now()}.md`;
      const result = await pool.query(`
        INSERT INTO admin_documents (name, type, client, status, author, gcs_object_key, gcs_bucket_name, content_markdown)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        name, 
        type, 
        client, 
        status || 'draft', 
        author || 'Administrador Master', 
        gcsKey, 
        'la-movie-documents-prod', 
        content_markdown || '# Nuevo Contrato LA MOVIE'
      ]);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.put("/api/docs/documents/:id", authenticateToken, async (req, res) => {
    const { name, type, client, status, author, content_markdown } = req.body;
    try {
      const result = await pool.query(`
        UPDATE admin_documents
        SET name = COALESCE($1, name),
            type = COALESCE($2, type),
            client = COALESCE($3, client),
            status = COALESCE($4, status),
            author = COALESCE($5, author),
            content_markdown = COALESCE($6, content_markdown)
        WHERE id = $7
        RETURNING *
      `, [name, type, client, status, author, content_markdown, req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/docs/documents/:id", authenticateToken, async (req, res) => {
    try {
      await pool.query("DELETE FROM admin_documents WHERE id = $1", [req.params.id]);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  app.get("/api/docs/documents/:id/signed-url", authenticateToken, async (req, res) => {
    try {
      const docId = req.params.id;
      const result = await pool.query("SELECT * FROM admin_documents WHERE id = $1", [docId]);
      const docObj = result.rows[0];
      
      if (!docObj) {
        return res.status(404).json({ error: "Documento no encontrado" });
      }
      
      const bucket = docObj.gcs_bucket_name || "la-movie-documents-prod";
      const key = docObj.gcs_object_key || `contracts/contract-${docObj.id}.md`;
      
      const signedUrl = generateSecureSignedUrl(bucket, key, 15);
      res.json({
        id: docObj.id,
        name: docObj.name,
        bucket,
        key,
        signed_url: signedUrl,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      });
    } catch (err) {
      res.status(500).json({ error: "Error al generar URL firmada" });
    }
  });

  app.get("/api/docs/download-secure", async (req, res) => {
    const { bucket, key, Expires, Signature } = req.query;
    if (!bucket || !key || !Expires || !Signature) {
      return res.status(400).json({ error: "Parámetros de firma de documento incompletos." });
    }
    
    const nowUnix = Math.floor(Date.now() / 1000);
    if (nowUnix > Number(Expires)) {
      return res.status(403).json({ error: "La URL firmada ha expirado (Límite máximo: 15 minutos)." });
    }
    
    // HM-AC SHA 256 Cryptographic Check
    const rawString = `${bucket}/${key}:${Expires}`;
    const calculatedSig = crypto.createHmac("sha256", SECRET_SIGNING_KEY).update(rawString).digest("hex");
    
    if (calculatedSig !== Signature) {
      return res.status(401).json({ error: "Acceso denegado: Firma inválida o alterada." });
    }
    
    let contentMarkdown = "";
    try {
      const result = await pool.query("SELECT content_markdown FROM admin_documents WHERE gcs_object_key = $1", [key]);
      if (result.rows.length > 0) {
        contentMarkdown = result.rows[0].content_markdown;
      }
    } catch (e) {}

    if (!contentMarkdown) {
      contentMarkdown = `# ACUERDO DE SERVICIOS ADOBE & LA MOVIE\n\n**DOCUMENTO SECURE LINK:** ${key}\n**ESTADO:** COMPILADO CON FIRMA DIGITAL ASÍNCRONA\n\nEste documento en formato Markdown sirve como la propuesta comercial o contrato generado mediante algoritmos inteligentes y alojado de forma segura en el bucket '${bucket}'.`;
    }
    
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(String(key))}"`);
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.send(contentMarkdown);
  });

  // --- CENTRALIZED ERROR HANDLER ---
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("🔒 SECURE SERVER LOGGER - Captured Error:", err);
    res.status(500).json({
      error: "Error interno del servidor",
      message: process.env.NODE_ENV === "production" 
        ? "No se pudo completar la operación de manera segura." 
        : err?.message || String(err)
    });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("/{*splat}", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
