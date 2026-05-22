import React, { useState, useEffect, useCallback, useMemo, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../lib/adminService';
import { ProjectsModule } from './ProjectsModule';
import { LeadsModule } from './LeadsModule';
import { FinanceModule } from './FinanceModule';
import { DocsModule } from './DocsModule';
import { PortfolioModule } from './PortfolioModule';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Briefcase, 
  Plus, 
  Trash2, 
  LogOut, 
  Save,
  Video,
  Type,
  Tag,
  MessageSquare,
  Globe,
  Star,
  Edit,
  X,
  Menu,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Monitor,
  CheckSquare,
  StickyNote,
  Users,
  KanbanSquare,
  Camera,
  Share2,
  Sparkles,
  BarChart,
  DollarSign,
  FileText,
  Activity,
  ArrowUpRight,
  Database,
  Clock,
  Search,
  Target,
  Mail,
  Phone,
  Bell,
  Terminal,
  Smartphone,
  Laptop,
  MapPin
} from 'lucide-react';

type Tab = 'dashboard' | 'crm' | 'leads' | 'projects' | 'production' | 'social' | 'ai' | 'analytics' | 'finance' | 'documents' | 'portfolio' | 'services' | 'testimonials' | 'web-showcase' | 'pricing' | 'settings' | 'tasks' | 'notes';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  toolName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ToolErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ToolErrorBoundary captured an isolation crash:", error, errorInfo);
  }

  render() {
    const th = this as any;
    const s = th.state;
    const p = th.props;
    if (s && s.hasError) {
      return (
        <div className="bg-[#0f0a0a] border border-red-900/30 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-lg animate-fade-in w-full">
          <div className="w-16 h-16 rounded-full bg-red-900/20 text-red-400 flex items-center justify-center mb-4 border border-red-900/40">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wider mb-2">
            Herramienta temporalmente no disponible
          </h3>
          <p className="text-white/60 text-xs font-mono max-w-sm mb-6 uppercase tracking-wider leading-relaxed">
            La sección <span className="text-red-400 font-bold">{p?.toolName || 'Módulo'}</span> experimentó un conflicto interno. El resto del panel administrativo sigue estando 100% disponible.
          </p>
          <button 
            onClick={() => th.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 bg-red-500/10 hover:bg-movie-red text-red-400 hover:text-white border border-red-500/30 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all duration-300"
          >
            Reintentar Cargar Módulo
          </button>
        </div>
      );
    }

    return p?.children;
  }
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [webShowcase, setWebShowcase] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const [profile, setProfile] = useState<{ username: string; name: string; role: string; avatar: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_copy: '',
    hero_badge: '',
    contact_email: '',
    whatsapp_number: ''
  });

  // Forms State
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    category: 'Work',
    image_url: '',
    video_url: '',
    description: ''
  });

  const [serviceForm, setServiceForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    items: '',
    icon: 'Zap'
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    content: '',
    image_url: '',
    rating: 5
  });

  const [systemStatus, setSystemStatus] = useState<any>({
    database: { connected: false, type: "Cargando Estado...", url_defined: false },
    environment: { node_env: "production", vercel: false, jwt_defined: false, port: 3000 }
  });

  const [productionShoots, setProductionShoots] = useState([
    { id: 1, title: 'Rodaje Reels Lanzamiento Nike', date: '2026-06-05', status: 'Pre-producción', crew: 'Yosii + Juan', location: 'Estudio Principal', notes: 'Grabación de video en 4K 120fps slow-mo' },
    { id: 2, title: 'Spot Premium Spotify', date: '2026-06-12', status: 'Edición', crew: 'Yosii Sarmiento', location: 'Bocagrande', notes: 'Requiere esquemas de color e iluminación de alta fidelidad' },
    { id: 3, title: 'TikToks Virales RedBull Extreme', date: '2026-05-28', status: 'Grabado', crew: 'Mateo C.', location: 'Castillo de San Felipe', notes: 'Tomas dinámicas con estabilizador y gimbal' }
  ]);
  const [newShoot, setNewShoot] = useState({ title: '', date: '', status: 'Pre-producción', crew: '', location: '', notes: '' });

  const [socialPosts, setSocialPosts] = useState([
    { id: 1, text: '¡Se viene lo mejor! 🎬 Detrás de cámaras de nuestra última filmación comercial para Nike Latam. ¿Están listos?', platform: 'Instagram', status: 'Programado', date: '2026-06-01' },
    { id: 2, text: '3 trucos de retención para explotar tus visitas en TikTok y Reels de forma inmediata sin pagar publicidad. 🚀', platform: 'TikTok', status: 'Borrador', date: '2026-05-30' }
  ]);
  const [socialForm, setSocialForm] = useState({ text: '', platform: 'Instagram', date: '' });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('Viral');
  const [aiGeneratedScript, setAiGeneratedScript] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiLogs, setAiLogs] = useState<any[]>([]);
  const [isLoadingAiLogs, setIsLoadingAiLogs] = useState(false);

  const [dashboardComments, setDashboardComments] = useState([
    { id: 1, author: "Yamil Sarmiento", avatar: "YS", text: "¿Tienen disponibilidad para producción de un spot de marca este mes de Julio en Cartagena o Barranquilla?", date: "Hace 10 min", page: "Landing Principal", status: "Pendiente" },
    { id: 2, author: "Yosimar Zúñiga", avatar: "YZ", text: "Excelente servicio de optimización audiovisual, las métricas de alcance orgánico subieron a más de 100 mil de forma inmediata. Increíble servicio.", date: "Hace 3 horas", page: "Servicios", status: "Aprobado" }
  ]);

  const [webForm, setWebForm] = useState({
    title: '',
    description: '',
    image_url: '',
    live_url: '',
    category: 'E-commerce'
  });

  const [pricingForm, setPricingForm] = useState({
    name: '',
    category: 'social',
    price: '',
    period: '/ mes',
    description: '',
    features: '',
    recommended: false,
    color: 'border-white/20',
    icon: 'Film'
  });

  const [taskForm, setTaskForm] = useState({ title: '', due_date: '', reminder: '' });
  const [noteForm, setNoteForm] = useState({ content: '', reminder: '' });
  const [crmClients, setCrmClients] = useState<any[]>([]);
  const [crmSubTab, setCrmSubTab] = useState<'dashboard' | 'clients' | 'pipeline' | 'projects' | 'calendar'>('dashboard');
  const [crmOriginFilter, setCrmOriginFilter] = useState<string>('all');
  const [projectSubTab, setProjectSubTab] = useState<'overview' | 'list' | 'kanban' | 'timeline' | 'files'>('overview');
  const [crmForm, setCrmForm] = useState({
    name: '', email: '', phone: '', status: 'prospect', value: '', tag: '', reminder: ''
  });

  const fetchData = useCallback(async () => {
    const currentToken = localStorage.getItem('adminToken');
    if (!currentToken) return;
    setLoading(true);
    try {
      const [pData, sData, tData, wData, prData, settingsData, tskData, ntsData, crmData, statusData, aiLogsData] = await Promise.all([
        adminService.getPortfolio().catch((err) => { console.warn("Portfolio fetch failed", err); return []; }),
        adminService.getServices().catch((err) => { console.warn("Services fetch failed", err); return []; }),
        adminService.getTestimonials().catch((err) => { console.warn("Testimonials fetch failed", err); return []; }),
        adminService.getWebShowcase().catch((err) => { console.warn("WebShowcase fetch failed", err); return []; }),
        adminService.getPricing().catch((err) => { console.warn("Pricing fetch failed", err); return []; }),
        adminService.getSettings().catch((err) => { console.warn("Settings fetch failed", err); return {}; }),
        adminService.getTasks(currentToken).catch((err) => { console.warn("Tasks fetch failed", err); return []; }),
        adminService.getNotes(currentToken).catch((err) => { console.warn("Notes fetch failed", err); return []; }),
        adminService.getCrmClients(currentToken).catch((err) => { console.warn("CRM fetch failed", err); return []; }),
        adminService.getAdminStatus(currentToken).catch((err) => { console.warn("Admin status fetch failed", err); return null; }),
        adminService.getAiLogs(currentToken).catch((err) => { console.warn("AI Logs fetch failed", err); return []; })
      ]);
      setPortfolio(Array.isArray(pData) ? pData : []);
      setServices(Array.isArray(sData) ? sData : []);
      setTestimonials(Array.isArray(tData) ? tData : []);
      setWebShowcase(Array.isArray(wData) ? wData : []);
      setPricing(Array.isArray(prData) ? prData : []);
      setSettings(settingsData || {});
      setTasks(Array.isArray(tskData) ? tskData : []);
      setNotes(Array.isArray(ntsData) ? ntsData : []);
      setCrmClients(Array.isArray(crmData) ? crmData : []);
      setAiLogs(Array.isArray(aiLogsData) ? aiLogsData : []);
      if (statusData) {
        setSystemStatus(statusData);
      }

      if (settingsData && settingsData.hero) {
        setSettingsForm({
          hero_title: settingsData.hero.title || '',
          hero_subtitle: settingsData.hero.subtitle || '',
          hero_copy: settingsData.hero.copy || '',
          hero_badge: settingsData.hero.badge || '',
          contact_email: settingsData.contact_email || '',
          whatsapp_number: settingsData.whatsapp_number || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- SECURE USER LIFECYCLE MANAGEMENT ---

  // 1. Session verification & Profile hydration
  const verifySession = useCallback(async () => {
    const currentToken = localStorage.getItem('adminToken');
    if (!currentToken) {
      navigate('/admin/login', { replace: true });
      return;
    }
    try {
      setIsVerifying(true);
      const userProfile = await adminService.getAdminProfile(currentToken);
      setProfile(userProfile);
      
      // Load standard dashboard data once verified
      await fetchData();
    } catch (err) {
      console.error("🔒 SECURE USER LIFECYCLE - Verification Failed:", err);
      localStorage.removeItem('adminToken');
      navigate('/admin/login', { replace: true });
    } finally {
      setIsVerifying(false);
    }
  }, [navigate, fetchData]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // 2. Safe Logout handling
  const handleLogout = useCallback(async () => {
    try {
      await adminService.logout();
    } catch (err) {
      console.warn("Server-side logout could not complete", err);
    }
    // Clean memory spaces completely
    localStorage.removeItem('adminToken');
    setProfile(null);
    navigate('/admin/login', { replace: true });
    
    // Prevent browser back button navigation via history state locks
    window.history.pushState(null, '', window.location.href);
  }, [navigate]);

  // 3. Live Session Expiration Interceptor (captures 401 CustomEvents)
  useEffect(() => {
    const handleAdminForceLogout = () => {
      console.warn("🔐 SECURE SESSION LOGGER - Live 401 interception triggered. Redirecting to login.");
      setProfile(null);
      navigate('/admin/login', { replace: true });
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('admin-logout', handleAdminForceLogout);
    return () => {
      window.removeEventListener('admin-logout', handleAdminForceLogout);
    };
  }, [navigate]);

  // 4. Activity detection for 15-minute inactivity auto-logout
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) return;

    let timeoutId: any;
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes of inactivity

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.warn("🔐 SECURE SESSION LOGGER - Auto logout triggered by 15-minute inactivity");
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(eventName => {
      window.addEventListener(eventName, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(eventName => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [handleLogout]);

  // --- HANDLERS ---

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await adminService.updatePortfolio(editingId, portfolioForm, token);
        setEditingId(null);
      } else {
        await adminService.createPortfolio(portfolioForm, token);
      }
      setPortfolioForm({ title: '', category: 'Work', image_url: '', video_url: '', description: '' });
      fetchData();
    } catch (err) {
      alert('Error al procesar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const data = { ...serviceForm, items: serviceForm.items.split(',').map(i => i.trim()) };
      if (editingId) {
        await adminService.updateService(editingId, data, token);
        setEditingId(null);
      } else {
        await adminService.createService(data, token);
      }
      setServiceForm({ title: '', subtitle: '', description: '', items: '', icon: 'Zap' });
      fetchData();
    } catch (err) {
      alert('Error al guardar servicio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await adminService.updateTestimonial(editingId, testimonialForm, token);
        setEditingId(null);
      } else {
        await adminService.createTestimonial(testimonialForm, token);
      }
      setTestimonialForm({ name: '', role: '', content: '', image_url: '', rating: 5 });
      fetchData();
    } catch (err) {
      alert('Error al guardar testimonio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWebSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await adminService.updateWebShowcase(editingId, webForm, token);
        setEditingId(null);
      } else {
        await adminService.createWebShowcase(webForm, token);
      }
      setWebForm({ title: '', description: '', image_url: '', live_url: '', category: 'E-commerce' });
      fetchData();
    } catch (err) {
      alert('Error al guardar proyecto web');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePricingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const data = { 
        ...pricingForm, 
        features: pricingForm.features.split('\n').filter(f => f.trim() !== '') 
      };
      if (editingId) {
        await adminService.updatePricing(editingId, data, token);
        setEditingId(null);
      } else {
        await adminService.createPricing(data, token);
      }
      setPricingForm({
        name: '',
        category: 'social',
        price: '',
        period: '/ mes',
        description: '',
        features: '',
        recommended: false,
        color: 'border-white/20',
        icon: 'Film'
      });
      fetchData();
    } catch (err) {
      alert('Error al guardar paquete de precios');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const heroValue = {
        title: settingsForm.hero_title,
        subtitle: settingsForm.hero_subtitle,
        copy: settingsForm.hero_copy,
        badge: settingsForm.hero_badge
      };
      await adminService.saveSettings('hero', heroValue, token);
      await adminService.saveSettings('contact_email', settingsForm.contact_email, token);
      await adminService.saveSettings('whatsapp_number', settingsForm.whatsapp_number, token);
      alert('Configuración guardada correctamente');
      fetchData();
    } catch (err) {
      alert('Error al guardar configuración');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      await adminService.createTask(taskForm, token); // This requires changing adminService as well if it only accepted title
      setTaskForm({ title: '', due_date: '', reminder: '' });
      fetchData();
    } catch (err) {
      alert('Error al guardar tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (id: number, currentStatus: boolean) => {
    if (!token) return;
    try {
      await adminService.updateTask(id, { completed: !currentStatus }, token);
      fetchData();
    } catch (err) {
      alert('Error al actualizar tarea');
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      await adminService.createNote(noteForm, token);
      setNoteForm({ content: '', reminder: '' });
      fetchData();
    } catch (err) {
      alert('Error al guardar nota');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCrmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await adminService.updateCrmClient(editingId, crmForm, token);
        setEditingId(null);
      } else {
        await adminService.createCrmClient(crmForm, token);
      }
      setCrmForm({ name: '', email: '', phone: '', status: 'prospect', value: '', tag: '', reminder: '' });
      fetchData();
    } catch (err) {
      alert('Error al guardar cliente CRM');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (client: any, newStatus: string) => {
    const currentToken = localStorage.getItem('adminToken');
    if (!currentToken) return;
    try {
      const updatedPayload = {
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        status: newStatus,
        value: client.value || '',
        tag: client.tag || '',
        reminder: client.reminder || ''
      };
      await adminService.updateCrmClient(client.id, updatedPayload, currentToken);
      fetchData();
    } catch (err) {
      console.error("Failed quick status shift:", err);
    }
  };

  const handleDelete = async (type: Tab, id: number) => {
    if (!token || !confirm('¿Estás seguro de eliminar este elemento?')) return;
    try {
      if (type === 'portfolio') await adminService.deletePortfolio(id, token);
      if (type === 'services') await adminService.deleteService(id, token);
      if (type === 'testimonials') await adminService.deleteTestimonial(id, token);
      if (type === 'web-showcase') await adminService.deleteWebShowcase(id, token);
      if (type === 'pricing') await adminService.deletePricing(id, token);
      if (type === 'tasks') await adminService.deleteTask(id, token);
      if (type === 'notes') await adminService.deleteNote(id, token);
      if (type === 'crm') await adminService.deleteCrmClient(id, token);
      fetchData();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const startEdit = (item: any, type: Tab) => {
    setEditingId(item.id);
    if (type === 'portfolio') {
      setPortfolioForm({
        title: item.title,
        category: item.category,
        image_url: item.image_url || '',
        video_url: item.video_url || '',
        description: item.description || ''
      });
    } else if (type === 'services') {
      setServiceForm({
        title: item.title,
        subtitle: item.subtitle,
        description: item.description || '',
        items: Array.isArray(item.items) ? item.items.join(', ') : '',
        icon: item.icon || 'Zap'
      });
    } else if (type === 'testimonials') {
      setTestimonialForm({
        name: item.name,
        role: item.role || '',
        content: item.content,
        image_url: item.image_url || '',
        rating: item.rating || 5
      });
    } else if (type === 'web-showcase') {
      setWebForm({
        title: item.title,
        description: item.description || '',
        image_url: item.image_url || '',
        live_url: item.live_url || '',
        category: item.category || 'E-commerce'
      });
    } else if (type === 'pricing') {
      setPricingForm({
        name: item.name,
        category: item.category,
        price: item.price,
        period: item.period || '/ mes',
        description: item.description || '',
        features: Array.isArray(item.features) ? item.features.join('\n') : '',
        recommended: item.recommended || false,
        color: item.color || 'border-white/20',
        icon: item.icon || 'Film'
      });
    }
    setActiveTab(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isVerifying || loading) return (
    <div className="min-h-screen bg-movie-black flex flex-col items-center justify-center text-white gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-movie-red to-orange-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(176,35,46,0.3)] animate-pulse mb-2">
        <Video size={32} className="text-white animate-[spin_4s_linear_infinite]" />
      </div>
      <div className="w-48 bg-white/5 h-1 rounded-full overflow-hidden border border-white/10">
        <div className="bg-gradient-to-r from-movie-red to-orange-500 h-full animate-pulse rounded-full w-[85%]"></div>
      </div>
      <p className="font-heading font-black italic tracking-widest text-[9px] uppercase text-white/50">
        {isVerifying ? 'Verificando Credenciales de Acceso...' : 'Sincronizando Canal Seguro...'}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Dropdown (Premium SaaS Look) */}
      <aside className={`fixed lg:static w-[300px] bg-black/80 lg:bg-black/80 backdrop-blur-3xl border-r border-white/5 flex flex-col top-0 h-screen z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <Video size={20} className="text-black" />
            </div>
            <div>
              <span className="font-heading font-black tracking-tighter text-xl italic block leading-none text-white">LA MOVIE</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-yellow-500 font-bold">OS 2026 Admin</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto px-4 pb-8 no-scrollbar space-y-6">
          <div className="pt-4">
             <button
               onClick={() => setActiveTab('dashboard')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                 activeTab === 'dashboard'
                   ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10'
                   : 'hover:bg-white/5 text-white/50 hover:text-white border border-transparent'
               }`}
             >
               <LayoutDashboard size={18} className={activeTab === 'dashboard' ? 'text-yellow-500' : ''} />
               <span className="font-bold text-xs uppercase tracking-widest">Dashboard</span>
             </button>
          </div>

          <div>
             <p className="px-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Agencia & CRM</p>
             <div className="space-y-1">
                {[
                  { id: 'crm', label: 'CRM / Clientes', icon: <Users size={16} /> },
                  { id: 'projects', label: 'Proyectos', icon: <KanbanSquare size={16} /> },
                  { id: 'finance', label: 'Finanzas', icon: <DollarSign size={16} /> },
                  { id: 'documents', label: 'Documentos', icon: <FileText size={16} /> },
                ].map((item) => (
                   <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id as Tab)}
                     className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                       activeTab === item.id ? 'bg-white/5 text-white' : 'hover:bg-white/5 text-white/50 hover:text-white'
                     }`}
                   >
                     {item.icon}
                     <span className="font-semibold text-xs tracking-wide">{item.label}</span>
                   </button>
                ))}
             </div>
          </div>

          <div>
             <p className="px-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Producción</p>
             <div className="space-y-1">
                {[
                  { id: 'production', label: 'Gestión Audiovisual', icon: <Camera size={16} /> },
                  { id: 'social', label: 'Social Media Hub', icon: <Share2 size={16} /> },
                  { id: 'ai', label: 'IA Studio', icon: <Sparkles size={16} className="text-purple-400" /> },
                  { id: 'analytics', label: 'Analytics Center', icon: <BarChart size={16} /> },
                ].map((item) => (
                   <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id as Tab)}
                     className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                       activeTab === item.id ? 'bg-white/5 text-white' : 'hover:bg-white/5 text-white/50 hover:text-white'
                     }`}
                   >
                     {item.icon}
                     <span className="font-semibold text-xs tracking-wide">{item.label}</span>
                   </button>
                ))}
             </div>
          </div>

          <div>
             <p className="px-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Website Púlico</p>
             <div className="space-y-1">
                {[
                  { id: 'portfolio', label: 'Portafolio Web', icon: <ImageIcon size={16} /> },
                  { id: 'web-showcase', label: 'Web Showcase', icon: <Globe size={16} /> },
                  { id: 'services', label: 'Servicios', icon: <Briefcase size={16} /> },
                  { id: 'pricing', label: 'Planes Públicos', icon: <Tag size={16} /> },
                  { id: 'testimonials', label: 'Testimonios', icon: <MessageSquare size={16} /> },
                ].map((item) => (
                   <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id as Tab)}
                     className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                       activeTab === item.id ? 'bg-white/5 text-white' : 'hover:bg-white/5 text-white/50 hover:text-white'
                     }`}
                   >
                     {item.icon}
                     <span className="font-semibold text-xs tracking-wide">{item.label}</span>
                   </button>
                ))}
             </div>
          </div>

          <div>
             <p className="px-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Sistema</p>
             <div className="space-y-1">
                {[
                  { id: 'tasks', label: 'Tareas y Agenda', icon: <CheckSquare size={16} /> },
                  { id: 'notes', label: 'Bloc de Notas', icon: <StickyNote size={16} /> },
                  { id: 'settings', label: 'Configuración Web', icon: <Save size={16} /> },
                ].map((item) => (
                   <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id as Tab)}
                     className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                       activeTab === item.id ? 'bg-white/5 text-white' : 'hover:bg-white/5 text-white/50 hover:text-white'
                     }`}
                   >
                     {item.icon}
                     <span className="font-semibold text-xs tracking-wide">{item.label}</span>
                   </button>
                ))}
             </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/40">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-movie-red transition-all duration-300 rounded-xl hover:bg-movie-red/10 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-xs tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-fixed bg-center relative">
        {/* Soft dark overlay */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[50px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-yellow-500/5 mix-blend-overlay pointer-events-none"></div>
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 relative z-10 shrink-0">
          <div className="flex items-center gap-4 lg:gap-6">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-white/50 hover:text-white">
               <Menu size={24} />
             </button>
             <div className="hidden sm:block relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Comando (⌘K) o buscar..." 
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-6 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-yellow-500/50 focus:outline-none focus:bg-white/10 transition-all w-64"
                />
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <button className="relative p-2 text-white/50 hover:text-white transition-colors">
                   <Bell size={18} />
                   <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-movie-red rounded-full border-2 border-[#050505]"></span>
                </button>
             </div>
             <div className="h-6 w-px bg-white/10"></div>
             <div className="flex items-center gap-3">
               <div className="text-right hidden md:block">
                 <p className="text-xs font-bold text-white">{profile?.name || 'Yosimar Sarmiento'}</p>
                 <p className="text-[10px] text-yellow-500 font-semibold tracking-widest uppercase">{profile?.role || 'Director de Operaciones'}</p>
               </div>
               <img src={profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"} alt="User" className="w-10 h-10 rounded-full border border-white/10" />
             </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <div className="flex-grow overflow-y-auto w-full p-10 relative z-10 no-scrollbar">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <ToolErrorBoundary toolName={activeTab.toUpperCase()}>
              <div className="mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white mb-2 uppercase italic">
                  {activeTab === 'dashboard' && 'PANORAMA'}
                  {activeTab === 'crm' && 'CRM & CLIENTES'}
                  {activeTab === 'projects' && 'GESTIÓN DE PROYECTOS'}
                  {activeTab === 'production' && 'CONTROL AUDIOVISUAL'}
                  {activeTab === 'social' && 'SOCIAL MEDIA HUB'}
                  {activeTab === 'ai' && 'LA MOVIE IA STUDIO'}
                  {activeTab === 'analytics' && 'ANALYTICS CENTER'}
                  {activeTab === 'finance' && 'FINANZAS Y FACTURACIÓN'}
                  {activeTab === 'documents' && 'GENERADOR DE DOCUMENTOS'}
                  {activeTab === 'portfolio' && 'PORTAFOLIO WEB'}
                  {activeTab === 'services' && 'SERVICIOS PÚBLICOS'}
                  {activeTab === 'web-showcase' && 'WEB SHOWCASE'}
                  {activeTab === 'pricing' && 'PLANES PÚBLICOS'}
                  {activeTab === 'testimonials' && 'TESTIMONIOS'}
                  {activeTab === 'settings' && 'CONFIGURACIÓN DE SISTEMA'}
                  {activeTab === 'tasks' && 'TAREAS Y AGENDA MASTER'}
                  {activeTab === 'notes' && 'BLOC DE NOTAS'}
                </h2>
                <p className="text-white/40 font-semibold text-xs tracking-widest uppercase flex items-center gap-2">
                  La Movie OS <ChevronRight size={12}/> {activeTab}
                </p>
              </div>
            </div>

            {/* DASHBOARD TAB (The new premium view) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 p-8 rounded-[40px] shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/40 shadow-inner">
                         <span className="text-3xl font-black text-blue-400">YZ</span>
                      </div>
                      <div>
                        <h2 className="text-4xl font-heading font-black italic uppercase tracking-tighter text-white">
                          HOLA, YOSIMAR ZUÑIGA
                        </h2>
                        <p className="text-white/60 font-mono text-xs uppercase tracking-widest mt-1">Admin Dashboard • LA MOVIE OS 2026</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                     <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all shrink-0">
                       <FileText size={16} /> GEN. INFORME CLIENTES
                     </button>
                   </div>
                 </div>

                 {/* IMPORTANT ALERTS */}
                 <div className="bg-red-500/10 border border-red-500/20 rounded-[32px] p-8">
                    <h3 className="text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                      <Bell size={18} /> ALERTAS IMPORTANTES Y SINCRONIZACIONES
                    </h3>
                    <div className="space-y-4">
                       {crmClients.filter(c => c.reminder).slice(0, 2).map((client, idx) => (
                         <div key={`overview-crm-${idx}`} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-black/40 border border-red-500/10 p-5 rounded-2xl shadow-sm gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                  <Users size={12} className="text-blue-400" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Seguimiento Cliente</span>
                                  <span className="text-sm font-medium">{client.name}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="text-xs font-mono font-bold text-yellow-500">{new Date(client.reminder).toLocaleDateString()}</span>
                              <button onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('crm');}} className="text-[10px] border border-white/10 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 uppercase tracking-widest font-bold transition-all">Ver en CRM</button>
                            </div>
                         </div>
                       ))}
                       {tasks.filter((t: any) => t.reminder && !t.completed).slice(0, 3).map((task: any, idx: number) => (
                         <div key={`overview-task-${idx}`} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-black/40 border border-red-500/10 p-5 rounded-2xl shadow-sm gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-8 h-8 rounded-full bg-movie-red/20 flex items-center justify-center border border-movie-red/30">
                                  <CheckSquare size={12} className="text-movie-red" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Tarea Pendiente</span>
                                  <span className="text-sm font-medium line-clamp-1">{task.title}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="text-xs font-mono font-bold text-yellow-500">{new Date(task.reminder).toLocaleDateString()}</span>
                              <button onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('tasks');}} className="text-[10px] border border-white/10 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 uppercase tracking-widest font-bold transition-all">Ir a Tareas</button>
                            </div>
                         </div>
                       ))}
                       
                       {crmClients.filter(c => c.reminder).length === 0 && tasks.filter((t: any) => t.reminder && !t.completed).length === 0 && (
                          <div className="text-white/40 text-xs font-bold uppercase tracking-widest text-center py-6 border border-dashed border-white/10 rounded-2xl">
                             No hay alertas críticas
                          </div>
                       )}
                    </div>
                 </div>

                 {/* WEB FORMS QUICK ACCESS */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] group hover:border-green-400/30 transition-colors cursor-pointer" onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('leads');}}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                          <Database size={24} className="text-green-400" /> LEADS ORGÁNICOS
                        </h3>
                        <ArrowUpRight size={20} className="text-white/30 group-hover:text-green-400 transition-colors" />
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed font-medium mb-6">Accede a los formularios de la web, contactos por WhatsApp y leads orgánicos o publicidad.</p>
                      <div className="flex items-center gap-4">
                         <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest border border-green-500/30">
                            +2 Nuevos Hoy
                         </div>
                      </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] group hover:border-blue-400/30 transition-colors cursor-pointer" onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('crm');}}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                          <Search size={24} className="text-blue-400" /> BUSCADOR / CRM
                        </h3>
                        <ArrowUpRight size={20} className="text-white/30 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed font-medium mb-6">Filtra clientes existentes, administra pipeline comercial y revisa sincronizaciones.</p>
                      <div className="flex items-center gap-4">
                         <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest border border-blue-500/30">
                            {crmClients.length} Registros Totales
                         </div>
                      </div>
                   </div>
                 </div>

                 {/* Metrics Row */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                         <DollarSign size={20} className="text-green-400" />
                      </div>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Ingresos del Mes</p>
                      <h3 className="text-3xl font-heading font-black text-white tracking-tighter">$45,200K</h3>
                      <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-400/10 w-fit px-3 py-1 rounded-full">
                         <ArrowUpRight size={14} /> +12.5%
                      </div>
                      <div className="absolute -right-4 -bottom-4 opacity-5 blur-xl group-hover:opacity-20 transition-opacity">
                         <DollarSign size={100} className="text-green-400" />
                      </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                         <Users size={20} className="text-blue-400" />
                      </div>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Leads Activos</p>
                      <h3 className="text-3xl font-heading font-black text-white tracking-tighter">124</h3>
                      <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-semibold bg-blue-400/10 w-fit px-3 py-1 rounded-full">
                         <ArrowUpRight size={14} /> +8 Nuevos
                      </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all cursor-pointer">
                      <div className="absolute top-6 right-6 px-3 py-1 bg-movie-red text-white text-[9px] font-bold rounded-full uppercase tracking-widest animate-pulse">Action Req</div>
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                         <KanbanSquare size={20} className="text-movie-red" />
                      </div>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Proyectos Activos</p>
                      <h3 className="text-3xl font-heading font-black text-white tracking-tighter">18</h3>
                      <div className="mt-4 flex items-center gap-2 text-movie-red text-xs font-semibold bg-movie-red/10 w-fit px-3 py-1 rounded-full">
                         2 en retraso
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/30 rounded-[24px] p-6 backdrop-blur-xl relative overflow-hidden group cursor-pointer hover:border-yellow-500/50 transition-all">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                         <Sparkles size={20} className="text-yellow-500" />
                      </div>
                      <p className="text-yellow-500/60 text-[10px] uppercase tracking-widest font-bold mb-1">IA Insights</p>
                      <h3 className="text-lg font-bold text-white mt-2 leading-tight">Tienes 3 propuestas generadas listas para enviar.</h3>
                      <div className="mt-4 text-xs font-semibold text-yellow-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                         Ir al Estudio IA <ChevronRight size={14} />
                      </div>
                   </div>
                </div>

                {/* Sub row placeholders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-[32px] p-8 min-h-[400px] flex flex-col relative overflow-hidden backdrop-blur-xl group">
                       <h4 className="text-white font-bold mb-6 text-xl tracking-widest uppercase flex justify-between items-center relative z-20">
                          Ingresos vs Gastos
                          <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div><span className="text-[10px] font-bold text-white/50 uppercase">Ingresos</span></div>
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div><span className="text-[10px] font-bold text-white/50 uppercase">Gastos</span></div>
                          </div>
                       </h4>
                       <div className="flex-1 w-full relative z-20 min-h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <AreaChart 
                             data={[
                               {name: 'W1', in: 4000, out: 2400},
                               {name: 'W2', in: 3000, out: 1398},
                               {name: 'W3', in: 2000, out: 9800},
                               {name: 'W4', in: 2780, out: 3908},
                             ]} 
                             margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                           >
                             <defs>
                               <linearGradient id="colorInDash" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                               </linearGradient>
                               <linearGradient id="colorOutDash" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                             <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                             <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                             <Tooltip 
                               contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '12px' }}
                               itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                             />
                             <Area type="monotone" dataKey="in" stroke="#22c55e" fillOpacity={1} fill="url(#colorInDash)" />
                             <Area type="monotone" dataKey="out" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutDash)" />
                           </AreaChart>
                         </ResponsiveContainer>
                       </div>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col relative overflow-hidden backdrop-blur-xl">
                      <h4 className="font-heading font-black italic uppercase tracking-widest text-lg mb-6">Próximas Tareas</h4>
                      <div className="space-y-4 flex-grow overflow-y-auto no-scrollbar">
                         {[
                           { t: 'Grabar Reel Cliente Nike', d: 'Hoy, 2:00 PM', c: 'border-yellow-500' },
                           { t: 'Revisión Cotización Meta Ads', d: 'Hoy, 4:30 PM', c: 'border-movie-red' },
                           { t: 'Call de Onboarding', d: 'Mañana, 10:00 AM', c: 'border-blue-400' },
                           { t: 'Actualización Portafolio Web', d: 'Viernes', c: 'border-white/20' },
                         ].map((tsk, i) => (
                           <div key={i} className={`p-4 rounded-xl bg-black/40 border-l-2 ${tsk.c} group hover:bg-white/5 transition-colors cursor-pointer`}>
                              <p className="text-sm font-semibold text-white mb-1 group-hover:text-yellow-500 transition-colors">{tsk.t}</p>
                              <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                                 <Clock size={10} /> {tsk.d}
                              </div>
                           </div>
                         ))}
                      </div>
                      <button 
                        onClick={() => setActiveTab('tasks')}
                        className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                        Ver Calendario Completo
                      </button>
                   </div>
                </div>

                {/* INTERACTIVE COMMENTS MODERATION FEED */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mt-8 backdrop-blur-xl space-y-6">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                      <div>
                         <span className="text-[9px] font-black tracking-[0.3em] text-movie-red uppercase">Comunicaciones Recientes</span>
                         <h4 className="font-heading font-black italic uppercase tracking-widest text-lg mt-1 flex items-center gap-2">
                            <MessageSquare size={20} className="text-movie-red" /> Moderación de Comentarios & Reseñas
                         </h4>
                      </div>
                      <div className="flex gap-2">
                         <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-400 uppercase">
                            {dashboardComments.filter(c => c.status === 'Pendiente').length} Pendientes
                         </span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {dashboardComments.map((comment) => (
                        <div key={comment.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-start gap-4 hover:border-white/10 transition-all">
                          <div className="w-10 h-10 rounded-full bg-movie-red/20 border border-movie-red/30 flex items-center justify-center font-black text-xs text-movie-red shrink-0">
                            {comment.avatar}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <strong className="text-white text-sm">{comment.author}</strong>
                                <span className="text-[10px] text-white/30 ml-2 font-mono">en {comment.page}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${comment.status === 'Aprobado' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                  {comment.status}
                                </span>
                                <span className="text-[10px] font-mono text-white/40">{comment.date}</span>
                              </div>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed font-sans font-light">{comment.text}</p>
                            <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4">
                              {comment.status === 'Pendiente' && (
                                <button 
                                  onClick={() => {
                                    setDashboardComments(dashboardComments.map(c => c.id === comment.id ? { ...c, status: 'Aprobado' } : c));
                                  }}
                                  className="px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 hover:bg-green-500 hover:text-black rounded-lg text-[9px] uppercase tracking-wider font-bold text-green-400 transition-all pointer-events-auto"
                                >
                                  Aprobar
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  const reply = prompt(`Escribe tu respuesta pública para ${comment.author}:`);
                                  if (reply) {
                                    setDashboardComments([...dashboardComments, {
                                      id: Date.now(),
                                      author: 'Soporte La Movie',
                                      avatar: 'LM',
                                      text: `↳ Respuesta a ${comment.author}: "${reply}"`,
                                      date: 'Hace un momento',
                                      page: comment.page,
                                      status: 'Aprobado'
                                    }]);
                                  }
                                }}
                                className="px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-black rounded-lg text-[9px] uppercase tracking-wider font-bold text-blue-400 transition-all"
                              >
                                Responder
                              </button>
                              <button 
                                onClick={() => {
                                  setDashboardComments(dashboardComments.filter(c => c.id !== comment.id));
                                }}
                                className="px-3.5 py-1.5 bg-red-400/10 border border-red-400/20 hover:bg-movie-red hover:text-white rounded-lg text-[9px] uppercase tracking-wider font-bold text-red-500 transition-all ml-auto"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <LeadsModule />
            )}

            {/* CRM SECTION - LA MOVIE PREMIUM CRM */}
            {activeTab === 'crm' && (
              <div className="flex flex-col gap-8 h-full">
                {/* CRM Header & SubNav */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30 backdrop-blur-xl">
                        <Users size={24} />
                      </div>
                      LA MOVIE CRM
                    </h2>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2 ml-16">Sistema Operativo Comercial 2026</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
                    {[
                      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                      { id: 'clients', label: 'Clientes', icon: Users },
                      { id: 'pipeline', label: 'Pipeline', icon: KanbanSquare },
                      { id: 'calendar', label: 'Calendario', icon: Clock },
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setCrmSubTab(sub.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                          crmSubTab === sub.id 
                            ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <sub.icon size={16} /> 
                        <span className="hidden sm:inline">{sub.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* OVERVIEW DASHBOARD */}
                {crmSubTab === 'dashboard' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 text-blue-400">
                         <Users size={80} />
                       </div>
                       <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Total Clientes</h4>
                       <p className="text-5xl font-black tracking-tighter">{crmClients.length}</p>
                       <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                         <Check size={12} /> +2 este mes
                       </div>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 text-purple-400">
                         <Target size={80} />
                       </div>
                       <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Prospectos</h4>
                       <p className="text-5xl font-black tracking-tighter">{crmClients.filter(c => c.status === 'prospect').length}</p>
                       <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-yellow-400 font-bold uppercase tracking-widest">
                         <Clock size={12} /> Requieren seguimiento
                       </div>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl md:col-span-2 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 mix-blend-overlay"></div>
                       <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 relative z-10">Valor del Pipeline</h4>
                       <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 relative z-10">
                         ${crmClients.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0).toLocaleString()}
                       </p>
                       <div className="mt-4 flex gap-4 relative z-10">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-white/70">
                            Forecast Mensual
                          </span>
                       </div>
                     </div>

                     {/* AI Insights Card */}
                     <div className="lg:col-span-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 p-8 rounded-[32px] flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[20px] bg-blue-500/20 flex items-center justify-center border border-blue-500/50 shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                           <Sparkles className="text-blue-400" size={28} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-1">IA Insights</h4>
                          <p className="text-white/80 md:text-lg leading-relaxed">
                            Existen <strong>{crmClients.filter(c => c.reminder).length}</strong> seguimientos pendientes para esta semana. El cliente con mayor potencial de cierre es <strong>{crmClients.find(c => c.status === 'prospect' && c.value > 0)?.name || 'N/A'}</strong>. 
                          </p>
                        </div>
                     </div>
                  </div>
                )}

                {/* CLIENTS LIST */}
                {crmSubTab === 'clients' && (
                  <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                      <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] sticky top-8 backdrop-blur-xl">
                        <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase italic">
                          {editingId ? <Edit size={24} className="text-blue-400" /> : <Plus size={24} className="text-blue-400" />} 
                          {editingId ? 'Editar Perfil' : 'Alta de Cliente'}
                        </h3>
                        <form onSubmit={handleCrmSubmit} className="space-y-5">
                          <input type="text" placeholder="Empresa / Nombre" required className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-400 focus:outline-none transition-colors" value={crmForm.name} onChange={e => setCrmForm({...crmForm, name: e.target.value})} />
                          <input type="email" placeholder="Correo Electrónico" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-400 focus:outline-none transition-colors" value={crmForm.email} onChange={e => setCrmForm({...crmForm, email: e.target.value})} />
                          <input type="text" placeholder="Teléfono / WhatsApp" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-400 focus:outline-none transition-colors" value={crmForm.phone} onChange={e => setCrmForm({...crmForm, phone: e.target.value})} />
                          <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-400 focus:outline-none transition-colors" value={crmForm.status} onChange={e => setCrmForm({...crmForm, status: e.target.value})}>
                            <option value="prospect">Lead / Prospecto</option>
                            <option value="active">Cliente Activo</option>
                            <option value="inactive">Inactivo</option>
                          </select>
                          <input type="number" placeholder="Valor Proyecto ($)" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-400 focus:outline-none transition-colors" value={crmForm.value} onChange={e => setCrmForm({...crmForm, value: e.target.value})} />
                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/50 mb-2 font-bold ml-2">Recordatorio IA (Opcional)</label>
                            <input type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-400 focus:outline-none transition-colors [color-scheme:dark]" value={crmForm.reminder} onChange={e => setCrmForm({...crmForm, reminder: e.target.value})} />
                          </div>
                          
                          <div className="flex gap-3 pt-4 border-t border-white/10">
                            <button type="submit" disabled={isSubmitting} className="flex-grow bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 text-[10px] uppercase tracking-widest font-bold rounded-2xl transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
                              {editingId ? 'Actualizar Perfil' : 'Crear Perfil'}
                            </button>
                            {editingId && (
                               <button type="button" onClick={() => { setEditingId(null); setCrmForm({ name: '', email: '', phone: '', status: 'prospect', value: '', tag: '', reminder: '' }); }} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all">
                                 <X size={18} />
                               </button>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-8 flex flex-col gap-4">
                      {/* Filter Controls by Origin */}
                      <div className="flex flex-wrap gap-2 mb-4 bg-white/5 p-3 rounded-[24px] border border-white/5">
                        {[
                          { id: 'all', label: 'Todos' },
                          { id: 'contacto', label: 'Contacto Web' },
                          { id: 'briefing', label: 'Briefing' },
                          { id: 'pack', label: 'Cotizador' },
                          { id: 'agentes', label: 'Agentes IA' },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setCrmOriginFilter(btn.id)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                              crmOriginFilter === btn.id 
                                ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {crmClients.filter(c => {
                        if (crmOriginFilter === 'all') return true;
                        const clientTag = String(c.tag || '').toLowerCase();
                        const clientService = String(c.service || '').toLowerCase();
                        return clientTag.includes(crmOriginFilter) || clientService.includes(crmOriginFilter);
                      }).map(client => (
                        <div key={client.id} className="group p-6 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row gap-6 sm:items-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                           <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-900 rounded-[20px] flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
                              <span className="text-xl font-black text-white/80 uppercase">{client.name.charAt(0)}</span>
                           </div>
                           <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-white font-bold text-xl truncate tracking-tight">{client.name}</h4>
                                <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                  client.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                  client.status === 'inactive' ? 'bg-white/10 text-white/50 border border-white/10' : 
                                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                }`}>
                                  {client.status === 'active' ? 'ACTIVO' : client.status === 'inactive' ? 'INACTIVO' : 'PROSPECTO'}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                                {client.email && <span className="flex items-center gap-1"><Mail size={12}/> {client.email}</span>}
                                {client.phone && <span className="flex items-center gap-1"><Phone size={12}/> {client.phone}</span>}
                                {client.value > 0 && <span className="text-blue-400 font-bold">${client.value}</span>}
                              </div>

                              {/* Centralized Lead Connection Telemetry */}
                              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-[6px] text-[9px] font-bold text-white/60 tracking-wider">
                                  {String(client.device || '').toLowerCase().includes('móvil') || String(client.device || '').toLowerCase().includes('mobile') || String(client.device || '').toLowerCase().includes('ios') || String(client.device || '').toLowerCase().includes('android') ? (
                                    <Smartphone size={10} className="text-green-400" />
                                  ) : (
                                    <Laptop size={10} className="text-blue-400" />
                                  )}
                                  <span>{client.device || 'Desktop'}</span>
                                </span>
                                <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-[6px] text-[9px] font-bold text-white/60 tracking-wider">
                                  <MapPin size={10} className="text-[#e23b2c]" />
                                  <span>{client.location ?? 'Ubicación Desconocida'} ({client.ip ?? 'IP Desconocida'})</span>
                                </span>
                              </div>
                              {client.reminder && (
                                 <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-400 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                                   <Clock size={12} /> {new Date(client.reminder).toLocaleString()}
                                 </div>
                              )}

                              {/* Quick status transitions */}
                              <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                                <span className="text-[8px] uppercase font-black text-white/30 tracking-widest mr-1">Estado:</span>
                                {[
                                  { id: 'prospect', label: 'Prospecto', color: 'hover:bg-blue-500/20 hover:text-blue-400' },
                                  { id: 'active', label: 'Activo', color: 'hover:bg-green-500/20 hover:text-green-400' },
                                  { id: 'inactive', label: 'Inactivo', color: 'hover:bg-white/10 hover:text-white/75' }
                                ].map(statusBtn => (
                                  <button
                                    key={statusBtn.id}
                                    onClick={() => handleQuickStatusChange(client, statusBtn.id)}
                                    className={`px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white/40 transition-all ${statusBtn.color} ${
                                      client.status === statusBtn.id ? 'bg-blue-500/10 border border-blue-500/20 text-white' : 'border border-transparent'
                                    }`}
                                  >
                                    {statusBtn.label}
                                  </button>
                                ))}
                              </div>
                           </div>
                           <div className="flex items-center gap-2 shrink-0">
                              <button onClick={() => {
                                setEditingId(client.id);
                                setCrmForm({ name: client.name, email: client.email || '', phone: client.phone || '', status: client.status, value: client.value || '', tag: client.tag || '', reminder: client.reminder ? new Date(client.reminder).toISOString().slice(0,16) : '' });
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }} className="p-4 bg-black/40 hover:bg-white/10 rounded-[16px] transition-all border border-white/5">
                                <Edit size={16} className="text-white/70 group-hover:text-white" />
                              </button>
                              <button onClick={() => handleDelete('crm' as Tab, client.id)} className="p-4 bg-black/40 hover:bg-red-500/20 rounded-[16px] transition-all border border-white/5 text-transparent group-hover:text-red-400">
                                <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                      ))}
                      {crmClients.length === 0 && (
                        <div className="text-center py-32 text-white/20 text-sm font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-[40px] flex flex-col items-center gap-4">
                          <Users size={48} className="opacity-20" />
                          Base de datos vacía
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PIPELINE KANBAN */}
                {crmSubTab === 'pipeline' && (
                  <div className="flex flex-col h-full bg-white/5 rounded-[40px] border border-white/10 p-8 overflow-hidden backdrop-blur-md">
                     <div className="flex justify-between items-center mb-8">
                       <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2"><KanbanSquare size={20} className="text-blue-400"/> Sales Pipeline</h3>
                       <button className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg uppercase tracking-widest font-bold">
                         + Añadir Stage
                       </button>
                     </div>
                     <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar h-full">
                       {/* Leads */}
                       <div className="w-[320px] shrink-0 flex flex-col gap-4">
                         <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                           <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-500"></div> Prospectos
                           </h4>
                           <span className="text-xs font-bold text-white/30">{crmClients.filter(c => c.status === 'prospect').length}</span>
                         </div>
                         <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                           {crmClients.filter(c => c.status === 'prospect').map(client => (
                             <div key={client.id} className="bg-black/60 border border-white/10 p-5 rounded-3xl hover:border-blue-500/50 transition-all cursor-grab active:cursor-grabbing">
                               <h5 className="font-bold text-lg mb-1">{client.name}</h5>
                               {client.value > 0 && <p className="text-xs text-blue-400 font-bold tracking-widest mb-3">${client.value}</p>}
                               <div className="flex gap-2 text-[10px] uppercase font-bold text-white/40 tracking-widest">
                                 {client.phone && <span>{client.phone}</span>}
                               </div>
                               {client.reminder && (
                                 <div className="mt-3 pt-3 border-t border-white/5 text-[9px] text-yellow-500/80 uppercase font-bold flex items-center gap-1">
                                   <AlertCircle size={10} /> {new Date(client.reminder).toLocaleDateString()}
                                 </div>
                               )}
                             </div>
                           ))}
                         </div>
                       </div>
                       {/* Activos */}
                       <div className="w-[320px] shrink-0 flex flex-col gap-4">
                         <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
                           <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500"></div> Clientes Activos
                           </h4>
                           <span className="text-xs font-bold text-white/30">{crmClients.filter(c => c.status === 'active').length}</span>
                         </div>
                         <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                           {crmClients.filter(c => c.status === 'active').map(client => (
                             <div key={client.id} className="bg-black/60 border border-white/10 p-5 rounded-3xl hover:border-green-500/50 transition-all cursor-grab active:cursor-grabbing">
                               <h5 className="font-bold text-lg mb-1">{client.name}</h5>
                               {client.value > 0 && <p className="text-xs text-green-400 font-bold tracking-widest mb-3">${client.value}</p>}
                               <div className="flex gap-2 text-[10px] uppercase font-bold text-white/40 tracking-widest">
                                 {client.email && <span className="truncate">{client.email}</span>}
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                       {/* Inactivos */}
                       <div className="w-[320px] shrink-0 flex flex-col gap-4 opacity-70">
                         <div className="flex items-center justify-between border-b border-white/10 pb-4">
                           <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-white/20"></div> Inactivos / Archivo
                           </h4>
                           <span className="text-xs font-bold text-white/30">{crmClients.filter(c => c.status === 'inactive').length}</span>
                         </div>
                         <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                           {crmClients.filter(c => c.status === 'inactive').map(client => (
                             <div key={client.id} className="bg-black/40 border border-white/5 p-5 rounded-3xl">
                               <h5 className="font-bold text-white/60 mb-1">{client.name}</h5>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                  </div>
                )}

                {/* CALENDAR */}
                {crmSubTab === 'calendar' && (
                  <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl flex flex-col gap-8 h-full min-h-[60vh]">
                     <div className="flex items-center justify-between border-b border-white/10 pb-6">
                        <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                          <Clock size={24} className="text-blue-400" /> CALENDARIO GENERAL
                        </h3>
                     </div>
                     <div className="flex flex-col gap-4">
                        <h4 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Recordatorios Próximos</h4>
                        
                        {/* Tasks reminders */}
                        {tasks.filter((t: any) => t.reminder && !t.completed).map((task: any) => (
                          <div key={`cal-task-${task.id}`} className="bg-gradient-to-r from-movie-red/10 to-transparent border border-movie-red/20 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-movie-red/20 flex items-center justify-center border border-movie-red/30">
                                 <CheckSquare size={16} className="text-movie-red" />
                               </div>
                               <div>
                                  <h5 className="font-bold text-white mb-1"><span className="text-[10px] text-movie-red uppercase tracking-widest mr-2 font-black">TAREA</span> {task.title}</h5>
                                  <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">{new Date(task.reminder).toLocaleString()}</p>
                               </div>
                            </div>
                          </div>
                        ))}

                        {/* CRM Clients reminders */}
                        {crmClients.filter(c => c.reminder).map(client => (
                          <div key={`cal-crm-${client.id}`} className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                 <Users size={16} className="text-blue-400" />
                               </div>
                               <div>
                                  <h5 className="font-bold text-white mb-1"><span className="text-[10px] text-blue-400 uppercase tracking-widest mr-2 font-black">CLIENTE</span> {client.name}</h5>
                                  <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">{new Date(client.reminder).toLocaleString()}</p>
                               </div>
                            </div>
                          </div>
                        ))}

                        {/* Notes reminders */}
                        {notes.filter((n: any) => n.reminder).map((note: any) => (
                          <div key={`cal-note-${note.id}`} className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                 <StickyNote size={16} className="text-purple-400" />
                               </div>
                               <div>
                                  <h5 className="font-bold text-white mb-1 line-clamp-1 max-w-sm"><span className="text-[10px] text-purple-400 uppercase tracking-widest mr-2 font-black">NOTA</span> {note.content}</h5>
                                  <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">{new Date(note.reminder).toLocaleString()}</p>
                               </div>
                            </div>
                          </div>
                        ))}

                        {tasks.filter((t: any) => t.reminder && !t.completed).length === 0 && 
                         crmClients.filter(c => c.reminder).length === 0 && 
                         notes.filter((n: any) => n.reminder).length === 0 && (
                          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl text-white/30 text-xs font-bold uppercase tracking-widest">
                            No hay recordatorios pendientes
                          </div>
                        )}
                     </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <ProjectsModule />
            )}

            {activeTab === 'finance' && (
              <FinanceModule />
            )}

            {activeTab === 'documents' && (
              <DocsModule />
            )}

            {activeTab === 'portfolio' && (
              <PortfolioModule />
            )}

            {/* CONTROL AUDIOVISUAL */}
            {activeTab === 'production' && (
              <div className="space-y-8 animate-reveal">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl">
                  <h3 className="text-3xl font-heading font-black italic uppercase tracking-tighter text-white mb-6 flex items-center gap-3">
                    <Camera size={32} className="text-purple-400" /> Control de Producción y Rodajes
                  </h3>
                  
                  {/* Creator Form */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newShoot.title) return;
                    setProductionShoots([...productionShoots, { ...newShoot, id: Date.now() }]);
                    setNewShoot({ title: '', date: '', status: 'Pre-producción', crew: '', location: '', notes: '' });
                  }} className="grid md:grid-cols-3 gap-6 mb-10 pb-10 border-b border-white/10">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Título del Rodaje / Proyecto</label>
                      <input 
                        required
                        type="text"
                        placeholder="Ej: Lanzamiento Nike"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-movie-red focus:outline-none"
                        value={newShoot.title}
                        onChange={(e) => setNewShoot({...newShoot, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Fecha del Rodaje</label>
                      <input 
                        required
                        type="date"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-movie-red focus:outline-none"
                        value={newShoot.date}
                        onChange={(e) => setNewShoot({...newShoot, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Equipo / Encargado</label>
                      <input 
                        type="text"
                        placeholder="Ej: Yosii Sarmiento"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-movie-red focus:outline-none"
                        value={newShoot.crew}
                        onChange={(e) => setNewShoot({...newShoot, crew: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Detalles de Grabación</label>
                      <input 
                        type="text"
                        placeholder="Cámaras, iluminación, planos específicos..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-movie-red focus:outline-none"
                        value={newShoot.notes}
                        onChange={(e) => setNewShoot({...newShoot, notes: e.target.value})}
                      />
                    </div>
                    <div className="flex items-end">
                      <button type="submit" className="w-full bg-movie-red hover:bg-red-700 text-white py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                        Programar Rodaje
                      </button>
                    </div>
                  </form>

                  {/* Table List of Shoots */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-white/40 font-black">
                          <th className="pb-4">Proyecto / Rodaje</th>
                          <th className="pb-4">Fecha</th>
                          <th className="pb-4">Personal / Crew</th>
                          <th className="pb-4">Estado</th>
                          <th className="pb-4">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {productionShoots.map((shoot) => (
                          <tr key={shoot.id} className="hover:bg-white/5 transition-all">
                            <td className="py-4 font-bold text-white max-w-xs truncate">
                              <div>{shoot.title}</div>
                              <span className="text-[10px] text-white/40 font-normal">{shoot.notes}</span>
                            </td>
                            <td className="py-4 text-white/70">{shoot.date}</td>
                            <td className="py-4 text-white/70">{shoot.crew}</td>
                            <td className="py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                shoot.status === 'Pre-producción' ? 'bg-yellow-500/10 text-yellow-500' :
                                shoot.status === 'Grabado' ? 'bg-blue-500/10 text-blue-400' :
                                shoot.status === 'Edición' ? 'bg-purple-500/10 text-purple-400' : 'bg-green-500/10 text-green-400'
                              }`}>
                                {shoot.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <button 
                                onClick={() => {
                                  const s: any = { 'Pre-producción': 'Grabado', 'Grabado': 'Edición', 'Edición': 'Completado', 'Completado': 'Pre-producción' };
                                  setProductionShoots(productionShoots.map(item => item.id === shoot.id ? { ...item, status: s[item.status] } : item));
                                }}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] uppercase tracking-wider font-bold text-white transition-all"
                              >
                                Avanzar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SOCIAL MEDIA HUB */}
            {activeTab === 'social' && (
              <div className="space-y-8 animate-reveal">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl">
                  <h3 className="text-3xl font-heading font-black italic uppercase tracking-tighter text-white mb-6 flex items-center gap-3">
                    <Share2 size={32} className="text-pink-400" /> Planificador de Contenido Social
                  </h3>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Add post scheduler */}
                    <div className="bg-white/5 border border-white/5 p-8 rounded-3xl space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-movie-red">Programar Publicación</h4>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!socialForm.text) return;
                        setSocialPosts([...socialPosts, { ...socialForm, id: Date.now(), status: 'Programado' }]);
                        setSocialForm({ text: '', platform: 'Instagram', date: '' });
                      }} className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Copy / Guión del Post</label>
                          <textarea 
                            required
                            rows={4}
                            placeholder="Escribe el copy optimizado con hashtags virales..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-movie-red focus:outline-none resize-none"
                            value={socialForm.text}
                            onChange={(e) => setSocialForm({...socialForm, text: e.target.value})}
                          />
                          <div className="text-[10px] text-white/40 text-right mt-1 font-mono">
                            {socialForm.text.length} caracteres
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Plataforma</label>
                            <select 
                              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-movie-red focus:outline-none"
                              value={socialForm.platform}
                              onChange={(e) => setSocialForm({...socialForm, platform: e.target.value})}
                            >
                              <option value="Instagram">Instagram Reels</option>
                              <option value="TikTok">TikTok</option>
                              <option value="YouTube Shorts">YouTube Shorts</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Fecha Lanzamiento</label>
                            <input 
                              type="date"
                              required
                              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:border-movie-red focus:outline-none"
                              value={socialForm.date}
                              onChange={(e) => setSocialForm({...socialForm, date: e.target.value})}
                            />
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-movie-red hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
                          Agendar Publicación
                        </button>
                      </form>
                    </div>

                    {/* Previews and Scheduled list */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Posts Agendados ({socialPosts.length})</h4>
                      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                        {socialPosts.map((post) => (
                          <div key={post.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl relative space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full">
                                {post.platform}
                              </span>
                              <span className="text-[10px] font-mono text-white/40">{post.date}</span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed font-light">{post.text}</p>
                            <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-white/5 pt-2">
                              <span>Estado: <strong className="text-green-400 font-bold uppercase">{post.status}</strong></span>
                              <button 
                                onClick={() => setSocialPosts(socialPosts.filter(p => p.id !== post.id))}
                                className="text-red-400 hover:text-red-500 transition-all font-mono uppercase"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LA MOVIE IA STUDIO */}
            {activeTab === 'ai' && (
              <div className="space-y-8 animate-reveal">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles size={32} className="text-yellow-500 animate-pulse" />
                    <h3 className="text-3xl font-heading font-black italic uppercase tracking-tighter text-white">
                      LA MOVIE IA Scriptwriter Studio
                    </h3>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed max-w-2xl mb-8">
                    Genera guiones e ideas de copys cinematográficos, copys virales y textos persuasivos optimizados para venta orgánica usando inteligencia comercial con un solo clic.
                  </p>

                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-5 space-y-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Tema o Producto de la Campaña</label>
                        <input 
                          type="text"
                          placeholder="Ej: Tenis deportivos de cuero, curso online, agencia..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-movie-red focus:outline-none"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Tono Narrativo</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Viral', 'Cinematográfico', 'Persuasivo', 'Misterioso'].map((tone) => (
                            <button
                              key={tone}
                              type="button"
                              onClick={() => setAiTone(tone)}
                              className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                                aiTone === tone ? 'bg-movie-red border-movie-red text-white' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                              }`}
                            >
                              {tone}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          if (!aiPrompt) return;
                          setIsAiGenerating(true);
                          setAiGeneratedScript('Analizando la pauta ideal y elaborando guión...');
                          
                          setTimeout(() => {
                            const topics = aiPrompt;
                            let script = '';
                            if (aiTone === 'Cinematográfico') {
                              script = `🎬 [GUION CINEMATOGRÁFICO LA MOVIE]\nTEMA: ${topics}\n\n[SECUENCIA 1 - PRIMER PLANO DETALLE]\nCámara se acerca lentamente. Sonido de ambiente profundo. Una voz en off pausada, con textura, rompe el silencio:\n\n"No se trata solo del producto. Se trata del instante exacto en que decides que lo ordinario ya no es suficiente..."\n\n[SECUENCIA 2 - TRANSICIÓN RÁPIDA DE RITMO]\nCortes acelerados al ritmo del latido. Colores de alto contraste.\n\n"Diseñado con cada detalle cuidado en alta fidelidad. ${topics} no es una opción más... es una declaración de intenciones. Siente la diferencia, asume el control."\n\n[CTA - PANTALLA EN NEGRO CON LOGO]\n"LA MOVIE - Adquiere el tuyo hoy en el enlace."`;
                            } else if (aiTone === 'Viral') {
                              script = `🔥 [ESTRUCTURA DE RETENCIÓN VIRAL (TikTok/Reels)]\nTEMA: ${topics}\n\n[0s - 3s - EL GANCHO AGRESIVO]\n"¡Detén tu scroll! Si sigues cometiendo este error, vas a perder clientes..."\n\n[3s - 15s - APORTANDO VALOR / EL SECRETO]\n"Muchos creen que vender ${topics} es difícil, pero la clave está en cómo cuentas la historia en los primeros 3 segundos. Aquí te muestro cómo lo hacemos nosotros, con edición cinematográfica que magnetiza la atención del usuario sin gastar un centavo."\n\n[15s - 20s - LLAMADO A LA ACCIÓN EXTREMO]\n"Comenta la palabra 'MOVIECREW' abajo y te enviamos toda la estrategia directamente a tu DM. Sigue a LA MOVIE para más hacks semanales de marketing digital."`;
                            } else if (aiTone === 'Persuasivo') {
                              script = `💰 [ESTRUCTURA DE COPYS PERSUASIVOS]\nTEMA: ${topics}\n\n"¿Cansado de la falta de resultados consistentes?\n\nLa verdad incómoda es que de nada sirve tener un producto excelente como ${topics} si tu contenido digital pasa desapercibido en el mar de publicaciones diarias...\n\nNuestra metodología probada de estética cinematográfica y embudos inteligentes no busca simples visualizaciones. Busca conversiones reales. Transforma usuarios en embajadores de marca.\n\n👉 Haz clic en el botón de reservar ahora y accede a nuestra consultoría estrátegica gratuita antes de que se agoten los cupos semanales."`;
                            } else {
                              script = `👁️ [GUION MISTERIOSO Y DE ALTO RETORNO]\nTEMA: ${topics}\n\n"Hay secretos de marketing digital que las grandes agencias nunca te contarán...\n\n¿Alguna vez te has preguntado por qué algunas marcas de ${topics} escalan a de manera orgánica mientras otras luchan por visibilidad?\n\nNo es presupuesto. Es el sesgo de la estética y la retención subconsciente en el cerebro del consumidor.\n\nDescubre cómo estructurar este contenido de alto impacto escribiendo al enlace interno de soporte de LA MOVIE en WhatsApp."`;
                            }
                            setAiGeneratedScript(script);
                            setIsAiGenerating(false);
                          }, 600);
                        }}
                        disabled={!aiPrompt || isAiGenerating}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-50"
                      >
                        {isAiGenerating ? 'IA Generando Script...' : 'Generar Guión con Optimización IA'}
                      </button>
                    </div>

                    {/* Result */}
                    <div className="lg:col-span-7 bg-black/40 border border-white/10 rounded-3xl p-8 relative">
                      <div className="absolute top-4 right-6 text-[10px] font-mono text-yellow-500 animate-pulse uppercase tracking-widest font-bold">
                        AI Output Editor
                      </div>
                      <h4 className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-4">Resultado Generado</h4>
                      {aiGeneratedScript ? (
                        <div className="whitespace-pre-line text-xs leading-relaxed text-white/80 font-mono select-all bg-black/50 p-6 rounded-2xl border border-white/5 scrollbar-thin max-h-[400px] overflow-y-auto">
                          {aiGeneratedScript}
                        </div>
                      ) : (
                        <div className="h-[250px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-xs text-white/20 uppercase font-bold text-center p-4">
                          Ingresa un tema, selecciona el tono y haz clic en Generar para ver la magia de LA MOVIE IA.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* HISTORIAL DE LOGS DE IA - WEBHOOK RECEPTOR EN TIEMPO REAL */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl mt-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Terminal size={32} className="text-movie-red animate-pulse" />
                        <h3 className="text-3xl font-heading font-black italic uppercase tracking-tighter text-white">
                          La Movie IA Studio: Webhooks de Integración
                        </h3>
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed max-w-2xl">
                        Visualiza los logs reales emitidos en tiempo real por plataformas externas (Make, Botpress, Flowise, etc.) apuntando de forma segura al endpoint <code className="bg-black/60 px-2 py-0.5 rounded text-yellow-500 font-mono">/api/v1/ai-logs</code>.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <button
                        onClick={async () => {
                          setIsLoadingAiLogs(true);
                          try {
                            const res = await adminService.getAiLogs(token || undefined);
                            setAiLogs(res);
                          } catch (err) {
                            console.warn(err);
                          } finally {
                            setIsLoadingAiLogs(false);
                          }
                        }}
                        disabled={isLoadingAiLogs}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-3 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center gap-2"
                      >
                        {isLoadingAiLogs ? 'Actualizando...' : 'Actualizar Logs'}
                      </button>

                      {/* Botón de simulación de Webhook de prueba para que el usuario o tester valide instantáneamente */}
                      <button
                        onClick={async () => {
                          try {
                            const sampleLogs = [
                              { platform: 'Make', event_type: 'Lead Sync Execution', payload: { status: "processed", syncedAt: new Date().toISOString() }, status: 'success' },
                              { platform: 'Botpress', event_type: 'WhatsApp AI Agent Reply', payload: { message: "Hola! Soy el asistente virtual de LA MOVIE.", active: true }, status: 'success' },
                              { platform: 'Flowise', event_type: 'Creative Copys Generator', payload: { generatedIdea: "Producción de cortometraje de suspenso con cinematografía vintage de Cartier" }, status: 'success' }
                            ];
                            const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
                            
                            const res = await fetch('/api/v1/ai-logs', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(randomLog)
                            });
                            if (res.ok) {
                              // Reload
                              const updated = await adminService.getAiLogs(token || undefined);
                              setAiLogs(updated);
                            }
                          } catch (err) {
                            console.error("Test webhook simulation failed", err);
                          }
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all"
                      >
                        Simular Webhook Recibido ⚡
                      </button>
                    </div>
                  </div>

                  {/* Endpoint URL Card */}
                  <div className="bg-black/40 border border-white/5 rounded-3xl p-6 mb-8">
                    <h4 className="text-white text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <code className="text-yellow-400 font-mono">POST /api/v1/ai-logs</code>
                    </h4>
                    <p className="text-white/40 text-[11px] mb-4">
                      Configura esta dirección en tus módulos HTTP de Make (Integromat), Botpress o Flowise como URL de Webhook de Destino. Recibe el payload completo estructurado en JSON.
                    </p>
                    <div className="bg-black/60 p-4 rounded-xl font-mono text-[11px] text-white/70 overflow-x-auto border border-white/5">
                      <span className="text-white/40">// Estructura del Body aceptado:</span><br />
                      {"{"}<br />
                      &nbsp;&nbsp;<span className="text-purple-400">"platform"</span>: <span className="text-green-400">"Make" | "Botpress" | "Flowise"</span>,<br />
                      &nbsp;&nbsp;<span className="text-purple-400">"event_type"</span>: <span className="text-green-400">"lead_synced"</span>,<br />
                      &nbsp;&nbsp;<span className="text-purple-400">"payload"</span>: {"{ ...cualquier JSON que quieras almacenar... }"}<span className="text-white/40">, // o un string de logs plano</span><br />
                      &nbsp;&nbsp;<span className="text-purple-400">"status"</span>: <span className="text-green-400">"success" | "warning" | "error"</span><br />
                      {"}"}
                    </div>
                  </div>

                  {/* Logs Table / List */}
                  {aiLogs.length === 0 ? (
                    <div className="border border-dashed border-white/10 rounded-3xl p-16 text-center">
                      <p className="text-white/30 text-xs font-bold uppercase tracking-wider">Sin Logs Registrados</p>
                      <p className="text-white/20 text-[10px] mt-1">Configura un webhook para emitir llamadas o presiona "Simular Webhook Recibido" arriba.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/20">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5">
                            <th className="py-4 px-6 text-[10px] uppercase tracking-wider font-black text-white/40">ID</th>
                            <th className="py-4 px-6 text-[10px] uppercase tracking-wider font-black text-white/40">Plataforma</th>
                            <th className="py-4 px-6 text-[10px] uppercase tracking-wider font-black text-white/40">Tipo de Evento</th>
                            <th className="py-4 px-6 text-[10px] uppercase tracking-wider font-black text-white/40">Payload Recibido</th>
                            <th className="py-4 px-6 text-[10px] uppercase tracking-wider font-black text-white/40">Estado</th>
                            <th className="py-4 px-6 text-[10px] uppercase tracking-wider font-black text-white/40">Fecha/Hora</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {aiLogs.map((log: any) => {
                            let platformColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                            if (log.platform === 'Make') platformColor = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                            if (log.platform === 'Botpress') platformColor = 'bg-pink-500/10 text-pink-400 border-pink-500/20';
                            if (log.platform === 'Flowise') platformColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                            let statusColor = 'text-green-500 bg-green-500/10';
                            if (log.status === 'error') statusColor = 'text-red-500 bg-red-500/10';
                            if (log.status === 'warning') statusColor = 'text-yellow-500 bg-yellow-500/10';

                            return (
                              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-6 font-mono text-[10px] text-white/40">#{log.id}</td>
                                <td className="py-4 px-6">
                                  <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border ${platformColor}`}>
                                    {log.platform}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-white text-[11px] font-bold font-mono">
                                  {log.event_type}
                                </td>
                                <td className="py-4 px-6 font-mono text-[10px] text-white/70 max-w-xs truncate" title={log.payload}>
                                  <div className="bg-black/40 p-2 rounded-lg border border-white/5 select-all overflow-x-auto max-w-sm max-h-24 font-mono text-[10px]">
                                    {log.payload}
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black inline-flex items-center gap-1.5 ${statusColor}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                    {log.status === 'success' ? 'Exitoso' : log.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-[10px] text-white/40 font-mono">
                                  {new Date(log.created_at).toLocaleString('es-CO', { hour12: false })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ANALYTICS CENTER */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-reveal">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl">
                  <h3 className="text-3xl font-heading font-black italic uppercase tracking-tighter text-white mb-6 flex items-center gap-3">
                    <BarChart size={32} className="text-green-400" /> Analíticas Exponenciales e KPIs
                  </h3>
                  
                  {/* Bento core statistics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-1">
                      <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Vistas de Video Totales</span>
                      <h4 className="text-2xl font-black">1.2M+</h4>
                      <span className="text-[10px] text-green-400 font-bold">↑ 45.3% este mes</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-1">
                      <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Prospectos Captados CRM</span>
                      <h4 className="text-2xl font-black">{crmClients.length * 15 + 42}</h4>
                      <span className="text-[10px] text-green-400 font-bold">↑ 12.8% conversión</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-1">
                      <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Costo Promedio (CAC)</span>
                      <h4 className="text-2xl font-black">$4.5 USD</h4>
                      <span className="text-[10px] text-white/30 font-bold">Optimizado con IA</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-1">
                      <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Retorno Estimado (ROAS)</span>
                      <h4 className="text-2xl font-black">5.2x</h4>
                      <span className="text-[10px] text-green-400 font-bold">↑ Alto Impacto</span>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main chart render */}
                    <div className="lg:col-span-8 bg-black/50 border border-white/10 p-8 rounded-3xl">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-6 font-bold">Crecimiento de Tráfico Orgánico y Leads (Últimos Meses)</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { name: 'Ene', vistas: 120000, leads: 40 },
                            { name: 'Feb', vistas: 250000, leads: 95 },
                            { name: 'Mar', vistas: 580000, leads: 180 },
                            { name: 'Abr', vistas: 920000, leads: 320 },
                            { name: 'May', vistas: 1200000, leads: 480 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                            <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#555" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} />
                            <Area type="monotone" dataKey="vistas" stroke="#B0232E" fill="rgba(176,35,46,0.15)" strokeWidth={3} />
                            <Area type="monotone" dataKey="leads" stroke="#10B981" fill="rgba(16,185,129,0.05)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-white/5 border border-white/5 p-8 rounded-3xl space-y-6 animate-reveal">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/60 font-bold">Distribución de Tráfico</h4>
                      <div className="space-y-4">
                        {[
                          { source: 'Reels / Meta Ads', pct: 45, color: 'bg-pink-500' },
                          { source: 'TikTok Orgánico', pct: 35, color: 'bg-blue-400' },
                          { source: 'Google & SEO', pct: 15, color: 'bg-green-400' },
                          { source: 'Referidos / Otros', pct: 5, color: 'bg-yellow-500' }
                        ].map((item) => (
                          <div key={item.source} className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-white/60">{item.source}</span>
                              <span className="font-bold text-white">{item.pct}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                              <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RUTAS ORIGINALES DEL SITIO WEB PÚBLICO (Conservan su lógica) */}
            
        {/* SERVICES SECTION */}
        {activeTab === 'services' && (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] sticky top-12">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase italic">
                  {editingId ? <Edit size={24} className="text-movie-red" /> : <Plus size={24} className="text-movie-red" />}
                  {editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h3>
                <form onSubmit={handleServiceSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Nombre del Servicio</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Slogan / Subtítulo</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={serviceForm.subtitle}
                      onChange={(e) => setServiceForm({...serviceForm, subtitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Descripción</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none resize-none"
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Items (Separados por coma)</label>
                    <input 
                      type="text" 
                      placeholder="Item 1, Item 2, Item 3"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={serviceForm.items}
                      onChange={(e) => setServiceForm({...serviceForm, items: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4">
                    {editingId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setServiceForm({ title: '', subtitle: '', description: '', items: '', icon: 'Zap' });
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] bg-movie-red hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(176,35,46,0.3)] disabled:opacity-50"
                    >
                      {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
                      {editingId ? 'Actualizar Servicio' : 'Guardar Servicio'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-6">
               <div className="grid grid-cols-1 gap-6">
                {(Array.isArray(services) ? services : []).map((service) => (
                  <div key={service.id} className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex items-center gap-8 group">
                    <div className="w-20 h-20 bg-movie-red rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                       <Briefcase size={32} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-2xl font-heading font-black uppercase italic tracking-tighter">{service.title}</h4>
                      <p className="text-movie-red text-[10px] font-black uppercase tracking-widest mb-2">{service.subtitle}</p>
                      <p className="text-white/40 text-sm font-light line-clamp-1">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startEdit(service, 'services')}
                        className="p-4 text-white/20 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete('services', service.id)}
                        className="p-4 text-white/20 hover:text-movie-red hover:bg-movie-red/10 rounded-2xl transition-all"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WEB SHOWCASE SECTION */}
        {activeTab === 'web-showcase' && (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] sticky top-12">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase italic">
                  {editingId ? <Edit size={24} className="text-movie-red" /> : <Plus size={24} className="text-movie-red" />}
                  {editingId ? 'Editar Proyecto Web' : 'Nuevo Proyecto Web'}
                </h3>
                <form onSubmit={handleWebSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Nombre del Proyecto</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={webForm.title}
                      onChange={(e) => setWebForm({...webForm, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Categoría</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={webForm.category}
                      onChange={(e) => setWebForm({...webForm, category: e.target.value})}
                    >
                      <option value="E-commerce">E-commerce</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Corporate">Corporativa</option>
                      <option value="Portfolio">Portafolio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">URL Imagen</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={webForm.image_url}
                      onChange={(e) => setWebForm({...webForm, image_url: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">URL En Vivo</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={webForm.live_url}
                      onChange={(e) => setWebForm({...webForm, live_url: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4">
                    {editingId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setWebForm({ title: '', description: '', image_url: '', live_url: '', category: 'E-commerce' });
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] bg-movie-red hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(176,35,46,0.3)] disabled:opacity-50"
                    >
                      {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
                      {editingId ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="lg:col-span-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Array.isArray(webShowcase) ? webShowcase : []).map((web) => (
                  <div key={web.id} className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group">
                    <div className="aspect-video relative overflow-hidden">
                       <img src={web.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={web.live_url} target="_blank" rel="noreferrer" className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform">
                             <ExternalLink size={24} />
                          </a>
                       </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                       <div>
                          <h4 className="font-heading font-black text-xl uppercase italic tracking-tighter">{web.title}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest text-movie-red">{web.category}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={() => startEdit(web, 'web-showcase')}
                           className="p-3 text-white/20 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                         >
                           <Edit size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete('web-showcase', web.id)}
                           className="p-3 text-white/20 hover:text-movie-red hover:bg-movie-red/10 rounded-xl transition-all"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRICING SECTION */}
        {activeTab === 'pricing' && (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] sticky top-12 backdrop-blur-xl">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase italic">
                  {editingId ? <Edit size={24} className="text-movie-red" /> : <Plus size={24} className="text-movie-red" />}
                  {editingId ? 'Editar Paquete' : 'Nuevo Paquete'}
                </h3>
                <form onSubmit={handlePricingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Nombre del Paquete</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ej: BLOCKBUSTER"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={pricingForm.name}
                      onChange={(e) => setPricingForm({...pricingForm, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Categoría</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                        value={pricingForm.category}
                        onChange={(e) => setPricingForm({...pricingForm, category: e.target.value})}
                      >
                        <option value="social">Social Media</option>
                        <option value="web">Desarrollo Web</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Precio</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ej: 1.390.000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                        value={pricingForm.price}
                        onChange={(e) => setPricingForm({...pricingForm, price: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Periodo</label>
                      <input 
                        type="text" 
                        placeholder="Ej: / mes o único"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                        value={pricingForm.period}
                        onChange={(e) => setPricingForm({...pricingForm, period: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Icono (Lucide)</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                        value={pricingForm.icon}
                        onChange={(e) => setPricingForm({...pricingForm, icon: e.target.value})}
                      >
                        <option value="Film">Film</option>
                        <option value="Crown">Crown</option>
                        <option value="Star">Star</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Globe">Globe</option>
                        <option value="ShoppingBag">ShoppingBag</option>
                        <option value="LayoutTemplate">LayoutTemplate</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Descripción (Solución)</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none resize-none"
                      value={pricingForm.description}
                      onChange={(e) => setPricingForm({...pricingForm, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Características (una por línea)</label>
                    <textarea 
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none resize-none"
                      value={pricingForm.features}
                      onChange={(e) => setPricingForm({...pricingForm, features: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      id="recommended"
                      className="w-5 h-5 accent-movie-red"
                      checked={pricingForm.recommended}
                      onChange={(e) => setPricingForm({...pricingForm, recommended: e.target.checked})}
                    />
                    <label htmlFor="recommended" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Recomendado (Destacado)</label>
                  </div>
                  <div className="flex gap-4">
                    {editingId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setPricingForm({
                            name: '', category: 'social', price: '', period: '/ mes', description: '', features: '', recommended: false, color: 'border-white/20', icon: 'Film'
                          });
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] bg-movie-red hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(176,35,46,0.3)] disabled:opacity-50"
                    >
                      {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
                      {editingId ? 'Actualizar Paquete' : 'Guardar Paquete'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pricing.map((item) => (
                  <div key={item.id} className={`bg-white/5 border p-8 rounded-[32px] relative group transition-all ${item.recommended ? 'border-movie-red' : 'border-white/10'}`}>
                    {item.recommended && (
                      <div className="absolute -top-3 left-8 bg-movie-red text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                        Recomendado
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black text-xl uppercase italic">{item.name}</h4>
                        <span className="text-[10px] uppercase tracking-widest text-movie-red font-bold">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-white">${item.price}</div>
                        <div className="text-[10px] text-white/40 uppercase font-bold">{item.period}</div>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mb-6 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] text-white/30 uppercase font-bold">{item.features?.length || 0} Características</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => startEdit(item, 'pricing')}
                          className="p-3 text-white/20 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete('pricing', item.id)}
                          className="p-3 text-white/20 hover:text-movie-red hover:bg-movie-red/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TESTIMONIALS SECTION */}
        {activeTab === 'testimonials' && (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] sticky top-12">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase italic">
                  {editingId ? <Edit size={24} className="text-movie-red" /> : <Plus size={24} className="text-movie-red" />}
                  {editingId ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                </h3>
                <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Nombre del Cliente</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Cargo / Empresa</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Testimonio</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none resize-none"
                      value={testimonialForm.content}
                      onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Calificación (1-5)</label>
                    <div className="flex gap-4">
                       {[1,2,3,4,5].map(num => (
                         <button 
                          key={num}
                          type="button"
                          onClick={() => setTestimonialForm({...testimonialForm, rating: num})}
                          className={`flex-1 py-3 rounded-xl border transition-all font-black ${testimonialForm.rating >= num ? 'bg-movie-red border-movie-red text-white' : 'bg-white/5 border-white/10 text-white/20'}`}
                         >
                           {num}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {editingId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setTestimonialForm({ name: '', role: '', content: '', image_url: '', rating: 5 });
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] bg-movie-red hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(176,35,46,0.3)] disabled:opacity-50"
                    >
                      {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
                      {editingId ? 'Actualizar Testimonio' : 'Guardar Testimonio'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Array.isArray(testimonials) ? testimonials : []).map((t) => (
                  <div key={t.id} className="bg-white/5 border border-white/10 p-8 rounded-[32px] relative group">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 rounded-full bg-movie-red/20 flex items-center justify-center text-movie-red">
                          <MessageSquare size={20} />
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">{t.name}</h4>
                          <span className="text-[10px] uppercase tracking-widest text-white/40">{t.role}</span>
                       </div>
                    </div>
                    <p className="text-white/70 italic font-light mb-6 leading-relaxed">"{t.content}"</p>
                    <div className="flex items-center justify-between">
                       <div className="flex gap-1 text-movie-red">
                          {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => startEdit(t, 'testimonials')}
                            className="p-3 text-white/20 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete('testimonials', t.id)}
                            className="p-3 text-white/20 hover:text-movie-red hover:bg-movie-red/10 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* SETTINGS SECTION */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl">
              <h3 className="text-3xl font-black mb-12 flex items-center gap-4 uppercase italic">
                <Save size={32} className="text-movie-red" /> Configuración General del Sitio
              </h3>
              
              <form onSubmit={handleSettingsSubmit} className="space-y-12">
                {/* Hero Section */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-movie-red border-b border-white/5 pb-4">Sección Hero (Principal)</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Badge / Etiqueta</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                        value={settingsForm.hero_badge}
                        onChange={(e) => setSettingsForm({...settingsForm, hero_badge: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Título Principal</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                        value={settingsForm.hero_title}
                        onChange={(e) => setSettingsForm({...settingsForm, hero_title: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Subtítulo (Slogan)</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                      value={settingsForm.hero_subtitle}
                      onChange={(e) => setSettingsForm({...settingsForm, hero_subtitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Texto Descriptivo (Copy)</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none resize-none"
                      value={settingsForm.hero_copy}
                      onChange={(e) => setSettingsForm({...settingsForm, hero_copy: e.target.value})}
                    />
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-movie-red border-b border-white/5 pb-4">Información de Contacto</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Email de Contacto</label>
                      <input 
                        type="email" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                        value={settingsForm.contact_email}
                        onChange={(e) => setSettingsForm({...settingsForm, contact_email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">WhatsApp (Número con código)</label>
                      <input 
                        type="text" 
                        placeholder="573017355046"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                        value={settingsForm.whatsapp_number}
                        onChange={(e) => setSettingsForm({...settingsForm, whatsapp_number: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-movie-red hover:bg-red-700 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(176,35,46,0.3)]"
                >
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={24} />}
                  Guardar Todos los Cambios
                </button>
              </form>
            </div>

            {/* VERCEL & DATABASE INTEGRATION MODULE */}
            <div className="mt-12 bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <span className="text-[9px] font-black tracking-[0.3em] text-movie-red uppercase">Integración de Producción</span>
                  <h3 className="text-3xl font-black uppercase italic mt-1 flex items-center gap-3">
                    <Globe size={28} className="text-movie-red" /> Vercel & Base de Datos
                  </h3>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <span className={`w-3 h-3 rounded-full ${systemStatus?.database?.connected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'}`}></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                    {systemStatus?.database?.connected ? 'Base de Datos Activa' : 'Modo Simulación (In-Memory)'}
                  </span>
                </div>
              </div>

              {/* Status bento-grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-white/40">Estado de la Base de Datos (Postgres)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/60">Motor de Base de Datos:</span>
                      <span className="font-bold text-white">{systemStatus?.database?.type || 'PostgreSQL'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/60">Variable DATABASE_URL:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${systemStatus?.database?.url_defined ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {systemStatus?.database?.url_defined ? 'CONFIGURADO ✅' : 'FALTANTE ❌'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-white/40">Estado de Entorno (Vercel)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/60">Entorno del Servidor:</span>
                      <span className="font-bold text-movie-red uppercase tracking-wider">{systemStatus?.environment?.node_env || 'Producción'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/60">Conexión Vercel Prod:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${systemStatus?.environment?.vercel || true ? 'bg-purple-500/10 text-purple-400' : 'bg-white/5 text-white/40'}`}>
                        Vercel Ready ⚡
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Guides */}
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-movie-red pb-2">Guía Completa de Despliegue en 3 Minutos</h4>
                
                <div className="space-y-4">
                  <div className="bg-black/40 p-6 rounded-3xl border border-white/5 relative">
                    <span className="absolute top-4 right-6 text-2xl font-black text-movie-red/20">01</span>
                    <h5 className="font-bold text-sm text-white mb-2 uppercase">1. Crear la Base de Datos</h5>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Crea una base de datos PostgreSQL gratuita en proveedores líderes como <strong className="text-white">Neon (neon.tech)</strong>, <strong className="text-white">Supabase (supabase.com)</strong> o <strong className="text-white">Railway</strong>. Copia el string de conexión (generalmente empieza con <code className="bg-white/5 px-1 py-0.5 rounded text-movie-red">postgres://...</code>).
                    </p>
                  </div>

                  <div className="bg-black/40 p-6 rounded-3xl border border-white/5 relative">
                    <span className="absolute top-4 right-6 text-2xl font-black text-movie-red/20">02</span>
                    <h5 className="font-bold text-sm text-white mb-2 uppercase">2. Configurar Variables en Vercel</h5>
                    <p className="text-xs text-white/60 leading-relaxed mb-4">
                      Sube el código a tu repositorio de GitHub, transpórtalo a Vercel y agrega los siguientes valores bajo <strong className="text-white">Environment Variables</strong> en las opciones del proyecto:
                    </p>
                    <div className="bg-black/60 p-4 rounded-2xl font-mono text-[11px] text-white/80 space-y-2 border border-white/10 select-all">
                      <div>DATABASE_URL=tu_url_postgres_de_neon_aqui</div>
                      <div>JWT_SECRET=un_string_super_seguro_para_los_tokens_admin</div>
                      <div>NODE_ENV=production</div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-6 rounded-3xl border border-white/5 relative">
                    <span className="absolute top-4 right-6 text-2xl font-black text-movie-red/20">03</span>
                    <h5 className="font-bold text-sm text-white mb-2 uppercase">3. ¡Completado!</h5>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Vercel construirá e instalará la aplicación automáticamente, conectará la base de datos de forma segura, y creará automáticamente las tablas necesarias al iniciar la base de datos en el servidor de producción.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* TASKS SECTION */}
        {activeTab === 'tasks' && (
          <div className="max-w-4xl">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl mb-8">
              <h3 className="text-3xl font-black mb-12 flex items-center gap-4 uppercase italic">
                <CheckSquare size={32} className="text-movie-red" /> Tareas, Agenda y Recordatorios
              </h3>
              
              <form onSubmit={handleTaskSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
                <input 
                  required
                  type="text" 
                  placeholder="Añadir nueva tarea o actividad..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                />
                <div className="flex gap-4">
                  <input 
                    type="datetime-local" 
                    title="Fecha de Vencimiento / Recordatorio"
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none [color-scheme:dark] shrink-0 w-48"
                    value={taskForm.reminder}
                    onChange={(e) => setTaskForm({...taskForm, reminder: e.target.value})}
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-movie-red hover:bg-red-700 text-white px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(176,35,46,0.3)] disabled:opacity-50 shrink-0"
                  >
                    <Plus size={18} /> Añadir
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                      <button 
                        onClick={() => handleToggleTask(task.id, task.completed)}
                        className={`w-6 h-6 rounded border flex items-center justify-center transition-all shrink-0 ${task.completed ? 'bg-movie-red border-movie-red text-white' : 'border-white/20 text-transparent hover:border-white/50'}`}
                      >
                        <Check size={14} />
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-white/30' : 'text-white'}`}>
                          {task.title}
                        </span>
                        {task.reminder && (
                           <span className="text-[10px] flex items-center gap-1 font-bold text-yellow-500/80 uppercase tracking-widest mt-1">
                             <Clock size={10} /> Recordatorio: {new Date(task.reminder).toLocaleString()}
                           </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete('tasks', task.id)}
                      className="text-white/20 hover:text-movie-red transition-colors p-2 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-12 text-white/20 text-sm font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-2xl">
                    No hay tareas pendientes
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NOTES SECTION */}
        {activeTab === 'notes' && (
          <div className="max-w-4xl">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl mb-8">
              <h3 className="text-3xl font-black mb-12 flex items-center gap-4 uppercase italic">
                <StickyNote size={32} className="text-movie-red" /> Bloc de Notas Libre
              </h3>
              
              <form onSubmit={handleNoteSubmit} className="space-y-6 mb-12">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Escribir Nota</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Ideas, observaciones o textos que quieras guardar..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none resize-none"
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-grow max-w-xs">
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-black">Recordatorio (Opcional)</label>
                    <input 
                      type="datetime-local" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none [color-scheme:dark]"
                      value={noteForm.reminder}
                      onChange={(e) => setNoteForm({...noteForm, reminder: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="sm:mt-6 bg-movie-red hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(176,35,46,0.3)] disabled:opacity-50 w-full sm:w-auto"
                  >
                    <Save size={18} /> Guardar Nota
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map((note: any) => (
                  <div key={note.id} className="p-6 bg-[#1a1a1a] rounded-[24px] border border-white/5 hover:border-movie-red/30 transition-all flex flex-col relative group">
                    <p className="text-white/80 text-sm font-medium leading-relaxed mb-4 flex-grow whitespace-pre-wrap">
                      {note.content}
                    </p>
                    {note.reminder && (
                      <div className="mb-4 inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase border border-yellow-500/20 w-fit">
                        <Clock size={12} /> {new Date(note.reminder).toLocaleString()}
                      </div>
                    )}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] uppercase tracking-widest font-black text-white/30">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={() => handleDelete('notes', note.id)}
                        className="text-white/20 hover:text-movie-red transition-colors p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {notes.length === 0 && (
                <div className="text-center py-12 text-white/20 text-sm font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-2xl">
                  No hay notas guardadas
                </div>
              )}
            </div>
          </div>
        )}
            </ToolErrorBoundary>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
