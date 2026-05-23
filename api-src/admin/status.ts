import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let databaseStatus = {
      connected: false,
      type: 'PostgreSQL / Neon',
      url_defined: Boolean(process.env.DATABASE_URL),
      database: null as string | null,
      checked_at: new Date().toISOString()
    };

    if (process.env.DATABASE_URL) {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
      });

      try {
        const result = await pool.query('select current_database() as database');
        databaseStatus = {
          ...databaseStatus,
          connected: true,
          database: result.rows[0]?.database || null
        };
      } finally {
        await pool.end();
      }
    }

    const status = {
      server: 'operational',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        database: databaseStatus,
        auth: 'operational',
        api: 'operational',
        storage: 'operational'
      },
      metrics: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        },
        uptime_hours: Math.round(process.uptime() / 3600)
      }
    };

    return res.status(200).json(status);
  } catch (error) {
    console.error('Error fetching admin status:', error);
    return res.status(500).json({
      server: 'error',
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
