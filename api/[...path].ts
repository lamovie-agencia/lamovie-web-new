import { VercelRequest, VercelResponse } from '@vercel/node';

type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<any> | any;

const routeHandlers: Record<string, () => Promise<{ default: ApiHandler }>> = {
  'admin/login': () => import('../api-src/admin/login'),
  'admin/profile': () => import('../api-src/admin/profile'),
  'admin/status': () => import('../api-src/admin/status'),
  'admin-crm': () => import('../api-src/admin-crm'),
  'admin-crm/[id]': () => import('../api-src/admin-crm/[id]'),
  'admin-notes': () => import('../api-src/admin-notes'),
  'admin-notes/[id]': () => import('../api-src/admin-notes/[id]'),
  'admin-tasks': () => import('../api-src/admin-tasks'),
  'admin-tasks/[id]': () => import('../api-src/admin-tasks/[id]'),
  'ai-logs': () => import('../api-src/ai-logs'),
  'assets/[id]': () => import('../api-src/assets/[id]'),
  'assets/upload': () => import('../api-src/assets/upload'),
  'docs/documents': () => import('../api-src/docs/documents'),
  'docs/documents/[id]': () => import('../api-src/docs/documents/[id]'),
  'docs/documents/[id]/signed-url': () => import('../api-src/docs/documents/[id]/signed-url'),
  'docs/download-secure': () => import('../api-src/docs/download-secure'),
  'finance/contracts': () => import('../api-src/finance/contracts'),
  'finance/contracts/[id]': () => import('../api-src/finance/contracts/[id]'),
  'finance/transactions': () => import('../api-src/finance/transactions'),
  'leads': () => import('../api-src/leads'),
  'partners': () => import('../api-src/partners'),
  'partners/[id]': () => import('../api-src/partners/[id]'),
  'portfolio': () => import('../api-src/portfolio'),
  'pricing': () => import('../api-src/pricing'),
  'pricing/[id]': () => import('../api-src/pricing/[id]'),
  'projects': () => import('../api-src/projects'),
  'projects/[id]': () => import('../api-src/projects/[id]'),
  'services': () => import('../api-src/services'),
  'services/[id]': () => import('../api-src/services/[id]'),
  'settings': () => import('../api-src/settings'),
  'testimonials': () => import('../api-src/testimonials'),
  'testimonials/[id]': () => import('../api-src/testimonials/[id]'),
  'v1/ai-logs': () => import('../api-src/v1/ai-logs'),
  'web-showcase': () => import('../api-src/web-showcase'),
  'web-showcase/[id]': () => import('../api-src/web-showcase/[id]')
};

function normalizePath(req: VercelRequest) {
  const rawPath = req.query.path;
  const parts = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : [];
  return parts.map(String).filter(Boolean);
}

function resolveRoute(parts: string[]) {
  const exact = parts.join('/');
  if (routeHandlers[exact]) return { key: exact, id: null as string | null };

  const dynamicCandidates = [
    parts.length === 2 ? `${parts[0]}/[id]` : '',
    parts.length === 3 ? `${parts[0]}/${parts[1]}/[id]` : '',
    parts.length === 4 ? `${parts[0]}/${parts[1]}/[id]/${parts[3]}` : ''
  ].filter(Boolean);

  for (const key of dynamicCandidates) {
    if (routeHandlers[key]) return { key, id: parts[parts.length === 4 ? 2 : parts.length - 1] };
  }

  return { key: null, id: null };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const parts = normalizePath(req);
  const { key, id } = resolveRoute(parts);

  if (!key) {
    return res.status(404).json({ error: 'API route not found' });
  }

  if (id) {
    req.query.id = id;
  }

  const mod = await routeHandlers[key]();
  return mod.default(req, res);
}
