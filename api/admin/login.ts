import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUsername || !adminPassword || !jwtSecret) {
      console.error('Missing environment variables for admin authentication');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check credentials
    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Return token
    return res.status(200).json({
      token,
      user: {
        username,
        role: 'admin'
      },
      expiresIn: 86400 // 24 hours in seconds
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
