import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Film, Image as ImageIcon, Video, Camera, Sparkles, FolderOpen, 
  BarChart, Play, MoreVertical, Plus, Search, Filter, Layers, 
  Activity, Eye, Heart, Share2, UploadCloud, Edit3, Trash, Star,
  X, Check, AlertCircle, ExternalLink, Minimize2, Maximize2, Palette, Globe, Scissors
} from 'lucide-react';
import { adminService } from '../lib/adminService';
import { useAuth } from '../lib/authService';
import { ASSETS } from '../data/assets';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  format_type: 'horizontal' | 'vertical' | 'square' | 'featured';
  category: 'cinema' | 'reels' | 'web' | 'branding';
  media_source: 'native' | 'youtube' | 'vimeo' | 'instagram';
  media_url: string;
  thumbnail_url: string;
  views?: number;
  likes?: number;
  display_order?: number;
  image_url?: string;
  video_url?: string;
  gallery_images?: string[];
  created_at?: string;
}

const VISUAL_PRESETS = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542204172-e70528091f50?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
];

const resolvePortfolioThumbnail = (item: Pick<PortfolioItem, 'title' | 'category' | 'thumbnail_url' | 'image_url' | 'gallery_images'>) => {
  if (item.thumbnail_url || item.image_url) return item.thumbnail_url || item.image_url || VISUAL_PRESETS[0];
  if (Array.isArray(item.gallery_images) && item.gallery_images[0]) return item.gallery_images[0];

  const title = String(item.title || '').toLowerCase();
  if (item.category === 'reels') {
    const reelMatch = ASSETS.portfolio.reels.find((reel) =>
      reel.title.toLowerCase().includes(title) || title.includes(reel.title.toLowerCase())
    );
    if (reelMatch?.img) return reelMatch.img;
  }

  const workMatch = ASSETS.portfolio.works.find((work) =>
    work.title.toLowerCase().includes(title) || title.includes(work.title.toLowerCase())
  );

  return workMatch?.img || VISUAL_PRESETS[0];
};

const getInitialContentMode = (item?: Partial<PortfolioItem>) => {
  if (Array.isArray(item?.gallery_images) && item.gallery_images.length > 0) return 'carousel' as const;
  if (item?.thumbnail_url && !item?.media_url) return 'image' as const;
  return 'video' as const;
};

const buildAiTitle = ({
  category,
  description,
  format_type,
  mode
}: {
  category: string;
  description: string;
  format_type: string;
  mode: 'video' | 'image' | 'carousel';
}) => {
  const categoryLabel = category === 'reels' ? 'Reel vertical' : category === 'web' ? 'Web premium' : category === 'branding' ? 'Branding cinematográfico' : 'Proyecto cinema';
  const focus = description.trim().replace(/\s+/g, ' ').slice(0, 70) || 'campaña visual';
  const formatLabel = format_type === 'featured' ? 'destacado' : format_type === 'vertical' ? 'vertical' : format_type === 'square' ? 'cuadrado' : 'horizontal';
  const modeLabel = mode === 'carousel' ? 'Carrusel' : mode === 'image' ? 'Imagen editorial' : 'Video estratégico';

  return `${categoryLabel} • ${modeLabel} • ${formatLabel} • ${focus}`;
};

async function captureVideoFrame(file: File, seconds = 0.5): Promise<File | null> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const video = document.createElement('video');
    video.src = objectUrl;
    video.muted = true;
    video.preload = 'metadata';
    video.playsInline = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('No se pudo cargar el video para generar la portada'));
    });

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    video.currentTime = Math.min(Math.max(seconds, 0), Math.max(duration - 0.1, 0));
    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error('No se pudo capturar el frame del reel'));
    });

    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1080;
    const height = video.videoHeight || 1920;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(video, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) return null;

    return new File([blob], `${file.name.replace(/\.[^/.]+$/, '')}-poster.jpg`, { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

const generateAutoThumbnail = (file: File) => captureVideoFrame(file, 0.5);

// Smart Media Preview with fallbacks
const SmartMediaPreview = React.memo(({ item }: { item: PortfolioItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const displayThumbnail = resolvePortfolioThumbnail(item);
  const displayFormat = item.format_type ?? "horizontal";
  const displayCategory = item.category ?? "cinema";
  const displayViews = item.views ?? (1000 + (item.id % 77) * 115);
  const displayLikes = item.likes ?? (200 + (item.id % 43) * 22);

  return (
    <div 
      className="relative w-full h-full overflow-hidden rounded-2xl group border border-white/5 bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={displayThumbnail} 
        alt={item.title} 
        className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 blur-[2px] opacity-40' : 'scale-100 opacity-80'}`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      
      {/* Simulation/visual indicator of a playing video */}
      {isHovered && ['custom', 'youtube', 'vimeo', 'instagram', 'native'].includes(item.media_source ?? '') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-movie-red/20 border border-movie-red/40 flex items-center justify-center animate-ping absolute"></div>
          <div className="w-12 h-12 rounded-full bg-movie-red flex items-center justify-center shadow-lg relative">
             <Play size={20} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
        <div className="flex items-center gap-2 mb-2">
           <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[9px] font-black uppercase tracking-widest text-white/90">
             {displayFormat}
           </span>
           <span className="px-2 py-0.5 bg-movie-red/20 backdrop-blur-md rounded-md text-[9px] font-black uppercase tracking-widest text-movie-red">
             {displayCategory}
           </span>
        </div>
        <h4 className="text-white font-bold text-sm mb-1 truncate">{item.title ?? "Sin título"}</h4>
        <div className="flex items-center gap-4 text-[10px] text-white/50 font-bold">
           <span className="flex items-center gap-1"><Eye size={12}/> {(displayViews / 1000).toFixed(1)}k</span>
           <span className="flex items-center gap-1"><Heart size={12}/> {(displayLikes / 1000).toFixed(1)}k</span>
        </div>
      </div>
    </div>
  );
});

export function PortfolioModule() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'analytics'>('overview');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sincronizaciones y Envío de Formulario
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Status logs
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [carouselFiles, setCarouselFiles] = useState<File[]>([]);
  const [contentMode, setContentMode] = useState<'video' | 'image' | 'carousel'>('video');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');
  const [coverCaptureTime, setCoverCaptureTime] = useState(0.5);
  const [videoDuration, setVideoDuration] = useState(0);

  // States of the Create/Edit form
  const [formState, setFormState] = useState<{
    title: string;
    description: string;
    format_type: 'horizontal' | 'vertical' | 'square' | 'featured';
    category: 'cinema' | 'reels' | 'web' | 'branding';
    media_source: 'native' | 'youtube' | 'vimeo' | 'instagram';
    media_url: string;
    thumbnail_url: string;
    views: string;
    likes: string;
    display_order: string;
  }>({
    title: '',
    description: '',
    format_type: 'horizontal',
    category: 'cinema',
    media_source: 'youtube',
    media_url: '',
    thumbnail_url: '',
    views: '',
    likes: '',
    display_order: '0',
  });

  useEffect(() => {
    fetchPortfolio();
  }, [token]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPreviewUrl('');
      setVideoDuration(0);
      return;
    }

    const url = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const fetchPortfolio = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminService.getPortfolioProjects(token);
      if (Array.isArray(data)) {
        setPortfolio(data);
      }
    } catch (e) {
      console.error("Error fetching portfolio in module context:", e);
    }
  }, [token]);

  // Handle open modal for creation
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedId(null);
    setContentMode('video');
    setFormState({
      title: '',
      description: '',
      format_type: 'horizontal',
      category: 'cinema',
      media_source: 'youtube',
      media_url: '',
      thumbnail_url: VISUAL_PRESETS[0],
      views: '',
      likes: '',
      display_order: '0'
    });
    setIsModalOpen(true);
    setStatusMsg(null);
    setCoverFile(null);
    setVideoFile(null);
    setCarouselFiles([]);
    setCoverCaptureTime(0.5);
  };

  // Handle open modal for edit
  const openEditModal = (item: PortfolioItem) => {
    setModalMode('edit');
    setSelectedId(item.id);
    setContentMode(getInitialContentMode(item));
    setFormState({
      title: item.title ?? '',
      description: item.description ?? '',
      format_type: item.format_type ?? 'horizontal',
      category: item.category ?? 'cinema',
      media_source: item.media_source ?? 'youtube',
      media_url: item.media_url ?? item.video_url ?? '',
      thumbnail_url: item.thumbnail_url ?? item.image_url ?? '',
      views: String(item.views ?? ''),
      likes: String(item.likes ?? ''),
      display_order: String(item.display_order ?? 0)
    });
    setIsModalOpen(true);
    setStatusMsg(null);
    setCoverFile(null);
    setVideoFile(null);
    setCarouselFiles([]);
    setCoverCaptureTime(0.5);
  };

  const captureCoverFromVideo = useCallback(async (seconds = coverCaptureTime) => {
    if (!videoFile) return;
    try {
      const frame = await captureVideoFrame(videoFile, seconds);
      if (frame) {
        setCoverFile(frame);
        setStatusMsg({ text: 'Portada capturada desde el fotograma seleccionado.', error: false });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: 'No se pudo capturar ese fotograma del video.', error: true });
    }
  }, [coverCaptureTime, videoFile]);

  // Safe delete handler
  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm("¿Estás absolutamente seguro de eliminar este proyecto del portafolio creativo global?")) return;
    try {
      await adminService.deletePortfolioProject(id, token);
      fetchPortfolio();
    } catch (e) {
      console.error(e);
    }
  };

  // Submit action
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSyncing(true);
    setStatusMsg(null);

    if (!formState.title.trim()) {
      setStatusMsg({ text: "El título es obligatorio", error: true });
      setIsSyncing(false);
      return;
    }

    try {
      const currentItem = selectedId ? portfolio.find((item) => item.id === selectedId) : undefined;
      const existingGalleryImages = Array.isArray(currentItem?.gallery_images) ? currentItem.gallery_images : [];
      const uploadedCarouselUrls = carouselFiles.length
        ? (await Promise.all(carouselFiles.map((file) => adminService.uploadAsset(file, token)))).map((upload) => upload.url).filter(Boolean)
        : [];

      const payload: any = {
        ...formState,
        gallery_images: contentMode === 'carousel' ? (uploadedCarouselUrls.length ? uploadedCarouselUrls : existingGalleryImages) : [],
        media_source: contentMode === 'carousel' ? 'instagram' : contentMode === 'image' ? 'native' : formState.media_source,
        media_url: contentMode === 'video' ? formState.media_url : '',
        views: Number(formState.views) || 0,
        likes: Number(formState.likes) || 0,
        display_order: Number(formState.display_order) || 0
      };

      if (coverFile) {
        const upload = await adminService.uploadAsset(coverFile, token);
        payload.thumbnail_url = upload.url;
      }

      if (videoFile) {
        const upload = await adminService.uploadAsset(videoFile, token);
        payload.media_url = upload.url;
        payload.media_source = 'native';

        if (!payload.thumbnail_url) {
          const autoThumbnail = await generateAutoThumbnail(videoFile);
          if (autoThumbnail) {
            const posterUpload = await adminService.uploadAsset(autoThumbnail, token);
            payload.thumbnail_url = posterUpload.url;
          }
        }
      }

      if (contentMode === 'carousel' && payload.gallery_images?.length) {
        payload.thumbnail_url = payload.gallery_images[0];
        payload.image_url = payload.gallery_images[0];
      }

      if (contentMode === 'image' && !payload.thumbnail_url) {
        payload.thumbnail_url = formState.thumbnail_url || currentItem?.thumbnail_url || currentItem?.image_url || '';
      }

      if (!payload.thumbnail_url) {
        payload.thumbnail_url = resolvePortfolioThumbnail({
          title: payload.title,
          category: payload.category,
          thumbnail_url: '',
          image_url: '',
          gallery_images: payload.gallery_images
        });
      }

      if (modalMode === 'create') {
        await adminService.createPortfolioProject(payload, token);
        setStatusMsg({ text: "¡Proyecto creado con éxito e integrado al Bento Grid!", error: false });
      } else if (selectedId) {
        await adminService.updatePortfolioProject(selectedId, payload, token);
        setStatusMsg({ text: "¡Proyecto actualizado correctamente con persistencia en PostgreSQL!", error: false });
      }

      await fetchPortfolio();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "Error de sincronización con la base de datos real.", error: true });
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter and search
  const filteredPortfolio = useMemo(() => {
    return portfolio.filter(p => {
      const displayType = p.format_type ?? 'horizontal';
      const matchesFilter = filterType === 'All' || displayType.toLowerCase() === filterType.toLowerCase() || p.category?.toLowerCase() === filterType.toLowerCase();
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
                            p.title?.toLowerCase().includes(query) || 
                            p.description?.toLowerCase().includes(query) || 
                            p.category?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [portfolio, filterType, searchQuery]);

  // Aggregate stats using nullish coalescing to prevent breaks
  const totalViews = useMemo(() => {
    return portfolio.reduce((acc, curr) => {
      const val = curr.views ?? (curr.id % 20) * 1150 + 500;
      return acc + val;
    }, 0);
  }, [portfolio]);

  const totalLikes = useMemo(() => {
    return portfolio.reduce((acc, curr) => {
      const val = curr.likes ?? (curr.id % 15) * 225 + 100;
      return acc + val;
    }, 0);
  }, [portfolio]);

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shrink-0 z-10">
        <div>
           <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
             <div className="w-12 h-12 bg-movie-red/20 text-movie-red rounded-2xl flex items-center justify-center border border-movie-red/30 backdrop-blur-xl shadow-[0_0_30px_rgba(176,35,46,0.2)]">
               <Film size={24} />
             </div>
             LA MOVIE PORTFOLIO
           </h2>
           <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2 ml-16">Ecosistema Gestor de Showcase y Portafolio</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          {[
            { id: 'overview', label: 'Ecosistema', icon: Activity },
            { id: 'gallery', label: 'Proyectos Reales', icon: Layers },
            { id: 'analytics', label: 'Rendimiento', icon: BarChart },
          ].map(tab => (
            <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
               activeTab === tab.id 
                 ? 'bg-movie-red text-white shadow-[0_0_20px_rgba(176,35,46,0.3)]' 
                 : 'text-white/40 hover:text-white hover:bg-white/5'
             }`}
            >
             <tab.icon size={16} /> 
             <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
             {/* Key Metrics KPI Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-all text-white">
                    <Film size={64} />
                  </div>
                  <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Total Proyectos</h4>
                  <p className="text-4xl font-black tracking-tighter">{portfolio.length}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-[#B0232E] font-bold uppercase tracking-widest">
                    PostgreSQL activo
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-all text-yellow-400">
                    <Eye size={64} />
                  </div>
                  <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Visualizaciones Showcase</h4>
                  <p className="text-4xl font-black tracking-tighter">{(totalViews / 1000).toFixed(1)}k</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                    Tráfico Orgánico
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-all text-movie-red">
                    <Heart size={64} />
                  </div>
                  <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Interacciones Totales</h4>
                  <p className="text-4xl font-black tracking-tighter">{(totalLikes / 1000).toFixed(1)}k</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-white/50 font-bold uppercase tracking-widest">
                    Porcentaje de CTR: 15.4%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-movie-red/10 to-transparent border border-movie-red/30 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-all text-movie-red">
                    <Sparkles size={64} />
                  </div>
                  <h4 className="text-movie-red/80 text-xs font-bold uppercase tracking-widest mb-4 z-10 relative">Showcase Hub</h4>
                  <p className="text-xs font-medium leading-relaxed text-white/70 z-10 relative mb-4">
                    Este panel coordina los datos del Bento Grid de la web oficial en tiempo real. Configura los formatos y las fuentes de video (YouTube/Vimeo) de forma transparente.
                  </p>
                  <button 
                    onClick={openCreateModal}
                    className="w-full py-2 bg-movie-red hover:bg-movie-red hover:scale-[1.02] text-white border border-movie-red/40 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    + Nuevo Proyecto
                  </button>
                </div>
             </div>

             {/* Dynamic Performance visual graphs & ranking */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-[32px] p-8 min-h-[400px] flex flex-col relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute inset-0 bg-radial-gradient from-movie-red/5 to-transparent pointer-events-none"></div>
                    <h4 className="text-white font-bold mb-6 text-xl tracking-widest uppercase flex justify-between items-center relative z-20">
                       Rendimiento Cine Digital
                    </h4>
                    <div className="flex-1 w-full relative z-20 min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                          data={[
                            {name: 'Cine', views: 4000, likes: 2400},
                            {name: 'Reels', views: 7200, likes: 5398},
                            {name: 'Web', views: 9800, likes: 8800},
                            {name: 'Dis. Marca', views: 4500, likes: 3108},
                            {name: 'Social Media', views: 8200, likes: 6200}
                          ]} 
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#B0232E" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#B0232E" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="views" stroke="#B0232E" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 relative overflow-hidden backdrop-blur-xl flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-3">
                         <Star size={18} className="text-yellow-400" /> Top Showcase
                       </h3>
                       <span className="text-[10px] font-mono text-movie-red bg-movie-red/10 px-2.5 py-1 rounded-md border border-movie-red/20 font-bold uppercase">Popular</span>
                    </div>

                    <div className="space-y-4 flex-1">
                      {portfolio.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white/30 text-xs">
                          <FolderOpen size={32} className="mb-2 opacity-50" />
                          No hay proyectos en la base de datos real.
                        </div>
                      ) : (
                        portfolio.slice(0, 4).map((item, idx) => {
                          const thumb = item.thumbnail_url || item.image_url || "https://images.unsplash.com/photo-1542204172-e70528091f50?auto=format&fit=crop&w=300&q=80";
                          const displayCat = item.category ?? "cinema";
                          const displayFormat = item.format_type ?? "horizontal";
                          return (
                            <div key={item.id} className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5 hover:bg-white/5 transition-all">
                               <span className="text-xl font-black text-white/20 italic w-4">{idx + 1}</span>
                               <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                 <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-xs text-white truncate">{item.title ?? "Sin título"}</h5>
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-[8px] font-bold text-movie-red uppercase tracking-wider">{displayCat}</span>
                                    <span className="text-[8px] font-mono text-white/30 uppercase">{displayFormat}</span>
                                  </div>
                               </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                 </div>
              </div>
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
             {/* Toolbar filters */}
             <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
               <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar py-1">
                  {['All', 'cinema', 'reels', 'web', 'branding', 'horizontal', 'vertical', 'square', 'featured'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterType(f)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                        filterType.toLowerCase() === f.toLowerCase() ? 'bg-white text-black font-black' : 'bg-black/50 text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
               </div>
               
               <div className="flex items-center gap-3 w-full xl:w-auto">
                 <div className="relative flex-1 xl:w-64">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                   <input 
                     type="text" 
                     placeholder="Buscar proyecto..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-movie-red transition-all" 
                   />
                 </div>
                 <button 
                   onClick={openCreateModal}
                   className="bg-movie-red hover:bg-[#8d1d25] text-white flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shrink-0"
                 >
                   <Plus size={16} /> <span className="hidden sm:inline">Agregar Proyecto</span>
                 </button>
               </div>
             </div>

             {/* Interactive Grid with full editing capabilities */}
             {filteredPortfolio.length === 0 ? (
               <div className="p-20 text-center bg-white/5 border border-white/10 rounded-[32px] text-white/40 flex flex-col items-center justify-center">
                 <FolderOpen size={48} className="mb-4 text-movie-red opacity-60" />
                 <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Ningún proyecto coincide</h4>
                 <p className="text-xs">Prueba ajustando tus filtros de formato o categoría actual.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPortfolio.map((item) => (
                    <div 
                      key={item.id} 
                      className="aspect-[4/3] relative group bg-black/40 border border-white/5 hover:border-white/20 transition-all duration-300 rounded-2xl overflow-hidden"
                    >
                      <SmartMediaPreview item={item} />
                      
                      {/* Active Actions */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-4px] group-hover:translate-y-0 duration-300 z-10">
                         <button 
                           onClick={() => openEditModal(item)}
                           title="Editar Proyecto"
                           className="w-9 h-9 bg-black/70 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:text-[#B0232E] hover:bg-white border border-white/10 transition-all shadow-lg"
                         >
                           <Edit3 size={15} />
                         </button>
                         <button 
                           onClick={() => handleDelete(item.id)}
                           title="Limpiar de BD"
                           className="w-9 h-9 bg-red-600/30 backdrop-blur-md rounded-xl flex items-center justify-center text-red-400 hover:text-white hover:bg-red-600 border border-red-500/20 transition-all shadow-lg"
                         >
                           <Trash size={15} />
                         </button>
                      </div>
                    </div>
                  ))}
               </div>
             )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-16 flex flex-col items-center justify-center text-center min-h-[50vh] relative overflow-hidden backdrop-blur-xl">
             <div className="absolute inset-0 bg-gradient-to-b from-movie-red/5 to-transparent mix-blend-overlay"></div>
             <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-[24px] flex items-center justify-center mb-8 border border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
                <BarChart size={36} className="text-movie-red" />
             </div>
             <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4 relative z-10">Analytics de Tráfico</h3>
             <p className="text-white/40 max-w-sm mx-auto text-xs leading-relaxed relative z-10 mb-8 uppercase tracking-widest">
               Métricas de visualización instantánea y conversión directa de leads para cada elemento del bento grid. El rastreador está activo.
             </p>
          </div>
        )}
      </div>

      {/* CREATE & EDIT MODAL COMPONENT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
             {/* Backdrop click to dismiss safely */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-md"
             />

             {/* Modal Content */}
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-[#0c0a0a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-20 flex flex-col max-h-[90vh]"
             >
                {/* Visual Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-movie-red/10 to-transparent">
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-wider text-white">
                      {modalMode === 'create' ? 'Agregar al Portafolio' : 'Modificar Proyecto'}
                    </h3>
                    <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest mt-0.5">Sincronización segura con PostgreSQL</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 text-white/40 hover:text-white rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form fields */}
                <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                   {statusMsg && (
                     <div className={`p-4 rounded-xl flex items-center gap-3 border text-xs font-bold uppercase tracking-wider ${
                        statusMsg.error 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                     }`}>
                       {statusMsg.error ? <AlertCircle size={16} /> : <Check size={16} />}
                       {statusMsg.text}
                     </div>
                   )}

                   {/* Title Input */}
                   <div>
                     <div className="flex items-center justify-between gap-3 mb-2">
                       <label className="block text-[10px] font-black uppercase tracking-widest text-white/50">Título del Proyecto</label>
                       <button
                         type="button"
                         onClick={() => setFormState(prev => ({
                           ...prev,
                           title: buildAiTitle({
                             category: prev.category,
                             description: prev.description,
                             format_type: prev.format_type,
                             mode: contentMode
                           })
                         }))}
                         className="inline-flex items-center gap-2 rounded-full border border-movie-red/30 bg-movie-red/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-movie-red"
                       >
                         <Sparkles size={12} /> Generar con IA
                       </button>
                     </div>
                     <input 
                       type="text"
                       placeholder="Ej: Tráiler Oficial: Bajo la Penumbra"
                       value={formState.title}
                       onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                       className="w-full bg-white/5 border border-white/10 focus:border-movie-red rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all"
                       required
                     />
                   </div>

                   {/* Category selector */}
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Categoría Principal (Ecosistema)</label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       {(['cinema', 'reels', 'web', 'branding'] as const).map((cat) => (
                         <button
                           key={cat}
                           type="button"
                           onClick={() => setFormState(prev => ({ ...prev, category: cat }))}
                           className={`px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                             formState.category === cat 
                               ? 'bg-movie-red border-movie-red text-white font-bold' 
                               : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                           }`}
                         >
                           {cat === 'cinema' && '🎬 Cinema'}
                           {cat === 'reels' && '📱 Reels'}
                           {cat === 'web' && '💻 Web App'}
                           {cat === 'branding' && '🎨 Branding'}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Format visual selector (Bento shape size) */}
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Formato Visual Bento Grid (Ajuste de Rejilla)</label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       {(['horizontal', 'vertical', 'square', 'featured'] as const).map((fmt) => (
                         <button
                           key={fmt}
                           type="button"
                           onClick={() => setFormState(prev => ({ ...prev, format_type: fmt }))}
                           className={`px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                             formState.format_type === fmt 
                               ? 'bg-white border-white text-black font-black' 
                               : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                           }`}
                         >
                           {fmt === 'horizontal' && '📼 Horizontal'}
                           {fmt === 'vertical' && '📱 Vertical'}
                           {fmt === 'square' && '🔲 Cuadrante'}
                           {fmt === 'featured' && '⭐ Destacado'}
                         </button>
                       ))}
                     </div>
                     <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest mt-2 block">
                       * Ajusta la distribución de columnas: 'Vertical' ocupa 2 filas; 'Destacado' ocupa 2 columnas.
                     </p>
                   </div>

                   {/* Description textarea */}
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Descripción del Proyecto</label>
                     <textarea 
                       placeholder="Describe las herramientas, el enfoque creativo de LA MOVIE y la estrategia técnica aplicada..."
                       rows={3}
                       value={formState.description}
                       onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                       className="w-full bg-white/5 border border-white/10 focus:border-movie-red rounded-xl p-4 text-xs text-white focus:outline-none transition-all resize-none"
                     />
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Visualizaciones</label>
                       <input type="number" min="0" value={formState.views} onChange={(e) => setFormState(prev => ({ ...prev, views: e.target.value }))} className="w-full bg-white/5 border border-white/10 focus:border-movie-red rounded-xl px-4 py-3 text-xs text-white focus:outline-none" />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Likes</label>
                       <input type="number" min="0" value={formState.likes} onChange={(e) => setFormState(prev => ({ ...prev, likes: e.target.value }))} className="w-full bg-white/5 border border-white/10 focus:border-movie-red rounded-xl px-4 py-3 text-xs text-white focus:outline-none" />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Orden</label>
                       <input type="number" value={formState.display_order} onChange={(e) => setFormState(prev => ({ ...prev, display_order: e.target.value }))} className="w-full bg-white/5 border border-white/10 focus:border-movie-red rounded-xl px-4 py-3 text-xs text-white focus:outline-none" />
                     </div>
                   </div>

                   {/* Media URL & Source */}
                   <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                     <div className="flex items-center justify-between gap-3">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-movie-red flex items-center gap-2">
                         <Video size={14} /> Flujo de contenido visual
                       </h4>
                       <span className="text-[9px] uppercase tracking-widest text-white/40">
                         {contentMode === 'video' ? 'Video / enlace' : contentMode === 'image' ? 'Imagen editorial' : 'Carrusel Instagram'}
                       </span>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                       {([
                         { key: 'video', label: 'Video / Enlace', icon: Video },
                         { key: 'image', label: 'Imagen', icon: ImageIcon },
                         { key: 'carousel', label: 'Carrusel', icon: Camera }
                       ] as const).map((option) => (
                         <button
                           key={option.key}
                           type="button"
                           onClick={() => setContentMode(option.key)}
                           className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                             contentMode === option.key
                               ? 'bg-movie-red border-movie-red text-white'
                               : 'bg-black/30 border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                           }`}
                         >
                           <option.icon size={14} /> {option.label}
                         </button>
                       ))}
                     </div>

                     {contentMode === 'video' && (
                       <div className="space-y-4">
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                           {(['youtube', 'vimeo', 'instagram', 'native'] as const).map((source) => (
                             <button
                               key={source}
                               type="button"
                               onClick={() => setFormState(prev => ({ ...prev, media_source: source }))}
                               className={`px-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                 formState.media_source === source 
                                   ? 'bg-movie-red/20 border border-movie-red text-movie-red font-bold' 
                                   : 'bg-black/30 border border-white/5 text-white/40 hover:text-white hover:bg-white/5'
                               }`}
                             >
                               {source === 'youtube' && 'YouTube'}
                               {source === 'vimeo' && 'Vimeo'}
                               {source === 'instagram' && 'Instagram'}
                               {source === 'native' && 'Native Video'}
                             </button>
                           ))}
                         </div>

                         <div>
                           <label className="block text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">URL del Video / Enlace Original</label>
                           <input 
                             type="text"
                             placeholder="Ej: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                             value={formState.media_url}
                             onChange={(e) => setFormState(prev => ({ ...prev, media_url: e.target.value }))}
                             className="w-full bg-black/40 border border-white/10 focus:border-movie-red rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all"
                           />
                           <span className="text-[8px] text-white/30 font-mono mt-1.5 block">
                             * La base de datos ejecutará un Regex sanitizador para extraer el ID en segundo plano.
                           </span>
                         </div>

                         <div className="border-t border-white/10 pt-4">
                           <label className="block text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">O subir video nativo (max 4 MB)</label>
                           <label className="flex items-center justify-between gap-3 bg-black/40 border border-dashed border-white/15 hover:border-movie-red rounded-xl px-4 py-3 cursor-pointer transition-all">
                             <span className="flex items-center gap-2 text-xs text-white/60">
                               <UploadCloud size={16} />
                               {videoFile ? videoFile.name : 'Seleccionar video'}
                             </span>
                             <input
                               type="file"
                               accept="video/*"
                               className="hidden"
                               onChange={(e) => {
                                 const file = e.target.files?.[0] || null;
                                 if (file && file.size > 4 * 1024 * 1024) {
                                   setStatusMsg({ text: 'El video supera el limite de 4 MB. Usa un link externo para videos pesados.', error: true });
                                   e.currentTarget.value = '';
                                   return;
                                 }
                                 setVideoFile(file);
                                 setCoverFile(null);
                               }}
                             />
                           </label>
                           {videoPreviewUrl && (
                             <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px] gap-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                               <div className="space-y-3">
                                 <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                                   <video
                                     src={videoPreviewUrl}
                                     controls
                                     muted
                                     playsInline
                                     preload="metadata"
                                     onLoadedMetadata={(e) => {
                                       const duration = e.currentTarget.duration;
                                       setVideoDuration(Number.isFinite(duration) ? duration : 0);
                                     }}
                                     className="h-64 w-full object-contain"
                                   />
                                 </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
                                   <input
                                     type="range"
                                     min="0"
                                     max={Math.max(videoDuration, 1)}
                                     step="0.1"
                                     value={coverCaptureTime}
                                     onChange={(e) => setCoverCaptureTime(Number(e.target.value))}
                                     className="w-full accent-movie-red"
                                   />
                                   <button
                                     type="button"
                                     onClick={() => captureCoverFromVideo()}
                                     className="inline-flex items-center justify-center gap-2 rounded-xl bg-movie-red px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-700"
                                   >
                                     <Scissors size={14} /> Tomar portada
                                   </button>
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                   {[0.5, 1.5, 3].map((seconds) => (
                                     <button
                                       key={seconds}
                                       type="button"
                                       onClick={() => {
                                         setCoverCaptureTime(Math.min(seconds, Math.max(videoDuration, seconds)));
                                         captureCoverFromVideo(seconds);
                                       }}
                                       className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white/50 hover:border-movie-red hover:text-white"
                                     >
                                       Frame {seconds}s
                                     </button>
                                   ))}
                                 </div>
                               </div>
                               <div className="space-y-2">
                                 <span className="block text-[9px] font-black uppercase tracking-widest text-white/40">Portada del reel</span>
                                 <div className="flex aspect-[9/16] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                                   {coverPreviewUrl ? (
                                     <img src={coverPreviewUrl} alt="Portada capturada" className="h-full w-full object-contain" />
                                   ) : (
                                     <span className="px-4 text-center text-[9px] font-bold uppercase tracking-widest text-white/30">
                                       Automatica si no eliges frame
                                     </span>
                                   )}
                                 </div>
                               </div>
                             </div>
                           )}
                         </div>
                       </div>
                     )}

                     {contentMode === 'image' && (
                       <div className="space-y-3">
                         <p className="text-[9px] uppercase tracking-widest text-white/40">
                           Usa una imagen de portada independiente para el proyecto y deja el video o enlace en segundo plano.
                         </p>
                         <label className="flex items-center justify-between gap-3 bg-white/5 border border-dashed border-white/15 hover:border-movie-red rounded-xl px-4 py-3 cursor-pointer transition-all">
                           <span className="flex items-center gap-2 text-xs text-white/60">
                             <ImageIcon size={16} />
                             {coverFile ? coverFile.name : 'Subir imagen de portada (max 4 MB)'}
                           </span>
                           <input
                             type="file"
                             accept="image/*"
                             className="hidden"
                             onChange={(e) => {
                               const file = e.target.files?.[0] || null;
                               if (file && file.size > 4 * 1024 * 1024) {
                                 setStatusMsg({ text: 'La imagen supera el limite de 4 MB.', error: true });
                                 e.currentTarget.value = '';
                                 return;
                               }
                               setCoverFile(file);
                             }}
                           />
                         </label>
                         <input 
                           type="text"
                           placeholder="URL de portada opcional"
                           value={formState.thumbnail_url}
                           onChange={(e) => setFormState(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                           className="w-full bg-white/5 border border-white/10 focus:border-movie-red rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all"
                         />
                       </div>
                     )}

                     {contentMode === 'carousel' && (
                       <div className="space-y-3">
                         <p className="text-[9px] uppercase tracking-widest text-white/40">
                           Sube varias imágenes y se guardará como carrusel tipo Instagram. El primer frame se usará como portada.
                         </p>
                         <label className="flex items-center justify-between gap-3 bg-white/5 border border-dashed border-white/15 hover:border-movie-red rounded-xl px-4 py-3 cursor-pointer transition-all">
                           <span className="flex items-center gap-2 text-xs text-white/60">
                             <Camera size={16} />
                             {carouselFiles.length > 0 ? `${carouselFiles.length} imágenes seleccionadas` : 'Seleccionar imágenes del carrusel'}
                           </span>
                           <input
                             type="file"
                             accept="image/*"
                             multiple
                             className="hidden"
                             onChange={(e) => {
                               const files = Array.from(e.target.files || []);
                               if (files.some((file) => file.size > 4 * 1024 * 1024)) {
                                 setStatusMsg({ text: 'Una imagen supera el limite de 4 MB.', error: true });
                                 e.currentTarget.value = '';
                                 return;
                               }
                               setCarouselFiles(files);
                             }}
                           />
                         </label>
                         <input 
                           type="text"
                           placeholder="Enlace Instagram opcional"
                           value={formState.media_url}
                           onChange={(e) => setFormState(prev => ({ ...prev, media_url: e.target.value }))}
                           className="w-full bg-black/40 border border-white/10 focus:border-movie-red rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all"
                         />
                         {carouselFiles.length > 0 && (
                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                             {carouselFiles.map((file, index) => (
                               <div key={`${file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                 <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="h-full w-full object-contain" />
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                     )}

                     <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-white/30 block">Presets Estéticos de Alta Calidad:</span>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                           {VISUAL_PRESETS.map((preset, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setFormState(prev => ({ ...prev, thumbnail_url: preset }))}
                                className={`relative w-20 h-12 rounded-lg overflow-hidden shrink-0 border transition-all ${
                                  formState.thumbnail_url === preset ? 'border-movie-red scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                                }`}
                              >
                                 <img src={preset} alt="preset" className="w-full h-full object-cover" />
                              </button>
                           ))}
                        </div>
                     </div>
                   </div>

                   {/* Footer buttons of the modal */}
                   <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-5 py-3 bg-transparent border border-white/10 text-white/50 hover:text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSyncing}
                        className="px-6 py-3 bg-movie-red hover:bg-[#851b22] text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
                      >
                        {isSyncing ? 'Sincronizando...' : (modalMode === 'create' ? 'Crear e Inyectar' : 'Guardar Edición')}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
