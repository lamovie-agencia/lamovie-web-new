import { VercelRequest, VercelResponse } from '@vercel/node';
import adminLogin from '../api-src/admin/login';
import adminProfile from '../api-src/admin/profile';
import adminStatus from '../api-src/admin/status';
import adminCrm from '../api-src/admin-crm';
import adminCrmItem from '../api-src/admin-crm/[id]';
import adminNotes from '../api-src/admin-notes';
import adminNotesItem from '../api-src/admin-notes/[id]';
import adminTasks from '../api-src/admin-tasks';
import adminTasksItem from '../api-src/admin-tasks/[id]';
import aiLogs from '../api-src/ai-logs';
import assetItem from '../api-src/assets/[id]';
import assetUpload from '../api-src/assets/upload';
import docsDocuments from '../api-src/docs/documents';
import docsDocumentItem from '../api-src/docs/documents/[id]';
import docsSignedUrl from '../api-src/docs/documents/[id]/signed-url';
import docsDownloadSecure from '../api-src/docs/download-secure';
import financeContracts from '../api-src/finance/contracts';
import financeContractItem from '../api-src/finance/contracts/[id]';
import financeTransactions from '../api-src/finance/transactions';
import leads from '../api-src/leads';
import partners from '../api-src/partners';
import partnerItem from '../api-src/partners/[id]';
import portfolio from '../api-src/portfolio';
import pricing from '../api-src/pricing';
import pricingItem from '../api-src/pricing/[id]';
import projects from '../api-src/projects';
import projectItem from '../api-src/projects/[id]';
import services from '../api-src/services';
import serviceItem from '../api-src/services/[id]';
import settings from '../api-src/settings';
import testimonials from '../api-src/testimonials';
import testimonialItem from '../api-src/testimonials/[id]';
import v1AiLogs from '../api-src/v1/ai-logs';
import webShowcase from '../api-src/web-showcase';
import webShowcaseItem from '../api-src/web-showcase/[id]';

type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<any> | any;

const routeHandlers: Record<string, ApiHandler> = {
  'admin/login': adminLogin,
  'admin/profile': adminProfile,
  'admin/status': adminStatus,
  'admin-crm': adminCrm,
  'admin-crm/[id]': adminCrmItem,
  'admin-notes': adminNotes,
  'admin-notes/[id]': adminNotesItem,
  'admin-tasks': adminTasks,
  'admin-tasks/[id]': adminTasksItem,
  'ai-logs': aiLogs,
  'assets/[id]': assetItem,
  'assets/upload': assetUpload,
  'docs/documents': docsDocuments,
  'docs/documents/[id]': docsDocumentItem,
  'docs/documents/[id]/signed-url': docsSignedUrl,
  'docs/download-secure': docsDownloadSecure,
  'finance/contracts': financeContracts,
  'finance/contracts/[id]': financeContractItem,
  'finance/transactions': financeTransactions,
  'leads': leads,
  'partners': partners,
  'partners/[id]': partnerItem,
  'portfolio': portfolio,
  'pricing': pricing,
  'pricing/[id]': pricingItem,
  'projects': projects,
  'projects/[id]': projectItem,
  'services': services,
  'services/[id]': serviceItem,
  'settings': settings,
  'testimonials': testimonials,
  'testimonials/[id]': testimonialItem,
  'v1/ai-logs': v1AiLogs,
  'web-showcase': webShowcase,
  'web-showcase/[id]': webShowcaseItem
};

function normalizePath(req: VercelRequest) {
  const rawPath = req.query.path;
  const parts = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : req.url?.split('?')[0]?.replace(/^\/api\/?/, '').split('/') || [];
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

  return routeHandlers[key](req, res);
}
