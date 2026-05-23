const API_URL = '/api';

// Interceptor helper: listen for auth failures or logout triggers in the app
export const logoutUser = () => {
  localStorage.removeItem('adminToken');
  window.dispatchEvent(new CustomEvent('admin-logout'));
};

const secureFetch = async (url: string, options: RequestInit = {}, suppliedToken?: string) => {
  const token = suppliedToken || localStorage.getItem('adminToken');
  const headers = {
    ...options.headers,
  } as any;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    
    if (res.status === 401) {
      logoutUser();
      throw new Error('Sesión expirada o token inválido.');
    }
    
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || body.message || `Error HTTP ${res.status}`);
    }

    return res;
  } catch (err) {
    console.error(`🔒 SECURE-FETCH ERROR on ${url}:`, err);
    throw err;
  }
};

export const adminService = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Credenciales incorrectas');
    return res.json();
  },

  logout: async () => {
    try {
      await secureFetch(`${API_URL}/admin/logout`, { method: 'POST' });
    } catch (e) {
      console.warn("Server-side logout token invalidation omitted", e);
    } finally {
      logoutUser();
    }
  },

  getAdminProfile: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/admin/profile`, {}, token);
    return res.json();
  },

  getPortfolio: async () => {
    const res = await secureFetch(`${API_URL}/portfolio`);
    return res.json();
  },

  createPortfolio: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  deletePortfolio: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/portfolio/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  updatePortfolio: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  getServices: async () => {
    const res = await secureFetch(`${API_URL}/services`);
    return res.json();
  },

  createService: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  updateService: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  deleteService: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  // Testimonials
  getTestimonials: async () => {
    const res = await secureFetch(`${API_URL}/testimonials`);
    return res.json();
  },

  createTestimonial: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  updateTestimonial: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  deleteTestimonial: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/testimonials/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  // Web Showcase
  getWebShowcase: async () => {
    const res = await secureFetch(`${API_URL}/web-showcase`);
    return res.json();
  },

  createWebShowcase: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/web-showcase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  updateWebShowcase: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/web-showcase/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  deleteWebShowcase: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/web-showcase/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  // Settings
  getSettings: async () => {
    const res = await secureFetch(`${API_URL}/settings`);
    return res.json();
  },

  saveSettings: async (key: string, value: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    }, token);
    return res.json();
  },

  // Pricing
  getPricing: async () => {
    const res = await secureFetch(`${API_URL}/pricing`);
    return res.json();
  },

  createPricing: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  updatePricing: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/pricing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  deletePricing: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/pricing/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  // Client partners / logos
  getPartners: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/partners`, {}, token);
    return res.json();
  },

  createPartner: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  updatePartner: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/partners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },

  deletePartner: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/partners/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  // Tasks
  getTasks: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-tasks`, {}, token);
    return res.json();
  },
  createTask: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },
  updateTask: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },
  deleteTask: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-tasks/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  // Notes
  getNotes: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-notes`, {}, token);
    return res.json();
  },
  createNote: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },
  deleteNote: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-notes/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  // CRM
  getCrmClients: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-crm`, {}, token);
    return res.json();
  },
  createCrmClient: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-crm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },
  updateCrmClient: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-crm/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, token);
    return res.json();
  },
  deleteCrmClient: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/admin-crm/${id}`, {
      method: 'DELETE',
    }, token);
    return res.json();
  },

  // Projects
  getProjects: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/projects`, {}, token);
    return res.json();
  },
  createProject: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  updateProject: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  deleteProject: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE'
    }, token);
    return res.json();
  },

  // Finance
  getContracts: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/finance/contracts`, {}, token);
    return res.json();
  },
  createContract: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/finance/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  updateContract: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/finance/contracts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  deleteContract: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/finance/contracts/${id}`, {
      method: 'DELETE'
    }, token);
    return res.json();
  },

  getTransactions: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/finance/transactions`, {}, token);
    return res.json();
  },
  createTransaction: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/finance/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },

  // Team
  getTeamMembers: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/team-members`, {}, token);
    return res.json();
  },
  createTeamMember: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/team-members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  updateTeamMember: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/team-members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  deleteTeamMember: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/team-members/${id}`, {
      method: 'DELETE'
    }, token);
    return res.json();
  },

  // Docs
  getDocuments: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/docs/documents`, {}, token);
    return res.json();
  },
  createDocument: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/docs/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  updateDocument: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/docs/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  deleteDocument: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/docs/documents/${id}`, {
      method: 'DELETE'
    }, token);
    return res.json();
  },

  getDocumentSignedUrl: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/docs/documents/${id}/signed-url`, {}, token);
    return res.json();
  },

  uploadAsset: async (file: File, token?: string) => {
    const maxBytes = 4 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error('El archivo supera el límite de 4 MB para publicación directa.');
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const base64 = dataUrl.split(',')[1] || '';

    const res = await secureFetch(`${API_URL}/assets/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        data: base64
      })
    }, token);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'No se pudo subir el archivo');
    }
    return res.json();
  },

  // Portfolio
  getPortfolioProjects: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/portfolio`, {}, token);
    return res.json();
  },
  createPortfolioProject: async (data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  updatePortfolioProject: async (id: number, data: any, token?: string) => {
    const res = await secureFetch(`${API_URL}/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
    return res.json();
  },
  deletePortfolioProject: async (id: number, token?: string) => {
    const res = await secureFetch(`${API_URL}/portfolio/${id}`, {
      method: 'DELETE'
    }, token);
    return res.json();
  },
  getAiLogs: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/ai-logs`, {}, token);
    return res.json();
  },
  getAdminStatus: async (token?: string) => {
    const res = await secureFetch(`${API_URL}/admin/status`, {}, token);
    return res.json();
  }
};
