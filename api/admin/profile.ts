import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends VercelRequest {
  user?: {
    username: string;
    role: string;
    iat: number;
    exp: number;
  };
}

function authenticateToken(req: AuthenticatedRequest): boolean {
  const authHeader = req.headers.authorization;
  const token = Array.isArray(authHeader) ? authHeader[0]?.split(' ')[1] : authHeader?.split(' ')[1];

  if (!token || !process.env.JWT_SECRET) return false;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) as AuthenticatedRequest['user'];
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate token
    if (!authenticateToken(req as AuthenticatedRequest)) {
      return res.status(401).json({ error: 'Unauthorized - Invalid or missing token' });
    }

    const user = (req as AuthenticatedRequest).user;
    
    // Return user profile
    return res.status(200).json({
      username: user?.username,
      role: user?.role,
      name: 'Yosimar Zuñiga',
      avatar: '',
      permissions: [
        'manage_portfolio',
        'manage_services',
        'manage_testimonials',
        'manage_pricing',
        'manage_tasks',
        'manage_crm',
        'manage_projects',
        'manage_documents',
        'manage_contracts',
        'manage_transactions',
        'view_analytics'
      ]
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
