import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticatedRequest, asArray, authenticateToken, ensureCoreSchema, getPool, setCors } from '../lib/apiDb';

const defaultServices = [
  {
    title: 'Produccion Audiovisual',
    subtitle: 'Contenido cinematografico para marcas',
    description: 'Desde la conceptualizacion hasta la postproduccion.',
    icon: 'film',
    items: ['Preproduccion', 'Produccion', 'Postproduccion', 'Distribucion']
  },
  {
    title: 'Marketing Digital',
    subtitle: 'Estrategia y performance',
    description: 'Estrategias integradas para redes sociales y pauta.',
    icon: 'trending-up',
    items: ['Social Media', 'SEO', 'SEM', 'Email Marketing']
  },
  {
    title: 'Desarrollo Web',
    subtitle: 'Sitios y plataformas modernas',
    description: 'Experiencias web responsivas conectadas a datos.',
    icon: 'code',
    items: ['E-commerce', 'Web Apps', 'Landing Pages', 'API REST']
  }
];

async function seedIfEmpty() {
  const db = getPool();
  const count = await db.query('SELECT COUNT(*)::int AS total FROM services');
  if (count.rows[0]?.total > 0) return;

  for (const service of defaultServices) {
    await db.query(
      'INSERT INTO services (title, subtitle, description, icon, items) VALUES ($1, $2, $3, $4, $5)',
      [service.title, service.subtitle, service.description, service.icon, service.items]
    );
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureCoreSchema();
    await seedIfEmpty();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM services ORDER BY created_at DESC, id DESC');
      return res.status(200).json(result.rows);
    }

    if (!authenticateToken(req as AuthenticatedRequest)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { title, subtitle, description, icon, items, features } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });
      const result = await db.query(
        'INSERT INTO services (title, subtitle, description, icon, items) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, subtitle || '', description || '', icon || '', asArray(items || features)]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Services API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

