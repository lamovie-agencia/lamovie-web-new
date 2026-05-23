import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends VercelRequest {
  user?: { username: string; role: string; iat: number; exp: number };
}

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });
  }

  return pool;
}

export function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

export function authenticateToken(req: AuthenticatedRequest): boolean {
  const authHeader = req.headers.authorization;
  const token = Array.isArray(authHeader) ? authHeader[0]?.split(' ')[1] : authHeader?.split(' ')[1];

  if (!token || !process.env.JWT_SECRET) return false;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) as AuthenticatedRequest['user'];
    return true;
  } catch {
    return false;
  }
}

export function getId(req: VercelRequest): number | null {
  const raw = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function asArray(value: any): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function firstDefined<T>(...values: T[]) {
  return values.find((value) => value !== undefined && value !== null && value !== '') ?? null;
}

export async function ensureCoreSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getPool();
      await db.query(`
        CREATE TABLE IF NOT EXISTS admin_crm_clients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT DEFAULT '',
          phone TEXT DEFAULT '',
          service TEXT DEFAULT '',
          status TEXT DEFAULT 'prospect',
          notes TEXT DEFAULT '',
          value NUMERIC DEFAULT 0,
          tag TEXT DEFAULT '',
          unread INTEGER DEFAULT 0,
          reminder TEXT DEFAULT '',
          origin TEXT DEFAULT 'Formulario Web',
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
          budget NUMERIC DEFAULT 0,
          unread INTEGER DEFAULT 0,
          color TEXT DEFAULT 'from-blue-500 to-purple-500',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS admin_tasks (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT DEFAULT '',
          completed BOOLEAN DEFAULT FALSE,
          status TEXT DEFAULT 'pending',
          priority TEXT DEFAULT 'medium',
          assigned_to TEXT DEFAULT '',
          due_date TEXT DEFAULT '',
          reminder TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS admin_notes (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          reminder TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS site_settings (
          id SERIAL PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS testimonials (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          role TEXT DEFAULT '',
          content TEXT NOT NULL,
          image_url TEXT DEFAULT '',
          rating INTEGER DEFAULT 5,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS services (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          subtitle TEXT DEFAULT '',
          description TEXT DEFAULT '',
          items TEXT[] DEFAULT '{}',
          icon TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS portfolio (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT DEFAULT 'cinema',
          description TEXT DEFAULT '',
          format_type TEXT DEFAULT 'horizontal',
          media_source TEXT DEFAULT 'native',
          media_url TEXT DEFAULT '',
          thumbnail_url TEXT DEFAULT '',
          image_url TEXT DEFAULT '',
          video_url TEXT DEFAULT '',
          views INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          display_order INTEGER DEFAULT 0,
          click_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS client_partners (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          logo_url TEXT NOT NULL,
          website_url TEXT DEFAULT '',
          featured BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS web_showcase (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT DEFAULT '',
          image_url TEXT DEFAULT '',
          live_url TEXT DEFAULT '',
          category TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pricing_packages (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'social',
          price TEXT NOT NULL DEFAULT '0',
          period TEXT DEFAULT '',
          description TEXT DEFAULT '',
          features TEXT[] DEFAULT '{}',
          recommended BOOLEAN DEFAULT FALSE,
          color TEXT DEFAULT '',
          icon TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
          description TEXT DEFAULT '',
          type TEXT DEFAULT 'income',
          amount_usd NUMERIC DEFAULT 0,
          category TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS admin_documents (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          client TEXT DEFAULT '',
          status TEXT DEFAULT 'draft',
          author TEXT DEFAULT '',
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          gcs_object_key TEXT,
          gcs_bucket_name TEXT DEFAULT 'la-movie-documents-prod',
          content_markdown TEXT
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

      await db.query(`
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS service TEXT DEFAULT '';
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS value NUMERIC DEFAULT 0;
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT '';
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS unread INTEGER DEFAULT 0;
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS reminder TEXT DEFAULT '';
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'Formulario Web';
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS ip TEXT;
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS location TEXT;
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS device TEXT;
        ALTER TABLE admin_crm_clients ADD COLUMN IF NOT EXISTS browser TEXT;

        ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES admin_crm_clients(id) ON DELETE SET NULL;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Web App';
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS team TEXT[] DEFAULT '{}';
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS assets INTEGER DEFAULT 0;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS due_date TEXT;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget NUMERIC DEFAULT 0;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS unread INTEGER DEFAULT 0;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'from-blue-500 to-purple-500';

        ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
        ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;
        ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
        ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
        ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS assigned_to TEXT DEFAULT '';
        ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS due_date TEXT DEFAULT '';
        ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS reminder TEXT DEFAULT '';

        ALTER TABLE services ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';
        ALTER TABLE services ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
        ALTER TABLE services ADD COLUMN IF NOT EXISTS items TEXT[] DEFAULT '{}';
        ALTER TABLE services ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '';

        ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
        ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
        ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
        ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;
      `);
    })();
  }

  return schemaReady;
}
