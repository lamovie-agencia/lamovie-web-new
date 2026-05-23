import { VercelRequest, VercelResponse } from '@vercel/node';
import adminLogin from '../api-src/admin/login.js';
import adminProfile from '../api-src/admin/profile.js';
import adminStatus from '../api-src/admin/status.js';
import adminCrm from '../api-src/admin-crm.js';
import adminCrmItem from '../api-src/admin-crm/[id].js';
import adminNotes from '../api-src/admin-notes.js';
import adminNotesItem from '../api-src/admin-notes/[id].js';
import adminTasks from '../api-src/admin-tasks.js';
import adminTasksItem from '../api-src/admin-tasks/[id].js';
import aiLogs from '../api-src/ai-logs.js';
import assetItem from '../api-src/assets/[id].js';
import assetUpload from '../api-src/assets/upload.js';
import docsDocuments from '../api-src/docs/documents.js';
import docsDocumentItem from '../api-src/docs/documents/[id].js';
import docsSignedUrl from '../api-src/docs/documents/[id]/signed-url.js';
import docsDownloadSecure from '../api-src/docs/download-secure.js';
import financeContracts from '../api-src/finance/contracts.js';
import financeContractItem from '../api-src/finance/contracts/[id].js';
import financeTransactions from '../api-src/finance/transactions.js';
import leads from '../api-src/leads.js';
import partners from '../api-src/partners.js';
import partnerItem from '../api-src/partners/[id].js';
import portfolio from '../api-src/portfolio.js';
import pricing from '../api-src/pricing.js';
import pricingItem from '../api-src/pricing/[id].js';
import projects from '../api-src/projects.js';
import projectItem from '../api-src/projects/[id].js';
import services from '../api-src/services.js';
import serviceItem from '../api-src/services/[id].js';
import settings from '../api-src/settings.js';
import testimonials from '../api-src/testimonials.js';
import testimonialItem from '../api-src/testimonials/[id].js';
import teamMembers from '../api-src/team-members.js';
import teamMemberItem from '../api-src/team-members/[id].js';
import v1AiLogs from '../api-src/v1/ai-logs.js';
import webShowcase from '../api-src/web-showcase.js';
import webShowcaseItem from '../api-src/web-showcase/[id].js';

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
  'portfolio/[id]': portfolio,
  'pricing': pricing,
  'pricing/[id]': pricingItem,
  'projects': projects,
  'projects/[id]': projectItem,
  'services': services,
  'services/[id]': serviceItem,
  'settings': settings,
  'testimonials': testimonials,
  'testimonials/[id]': testimonialItem,
  'team-members': teamMembers,
  'team-members/[id]': teamMemberItem,
  'v1/ai-logs': v1AiLogs,
  'web-showcase': webShowcase,
  'web-showcase/[id]': webShowcaseItem
};

function normalizePath(req: VercelRequest) {
  const rawPath = req.query.path;
  const parts = Array.isArray(rawPath) ? rawPath : rawPath ? String(rawPath).split('/') : req.url?.split('?')[0]?.replace(/^\/api\/?/, '').split('/') || [];
  return parts.flatMap((part) => String(part).split('/')).filter(Boolean);
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
