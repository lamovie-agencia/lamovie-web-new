import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, ExternalLink, Instagram, Play, Heart, Volume2, VolumeX, Plus, Grid, 
  Camera, Clapperboard, Palette, ArrowLeft, MessageCircle, Zap, Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from '../data/assets';

const resolvePortfolioThumbnail = (item: { title?: string; category?: string; thumbnail_url?: string; image_url?: string; gallery_images?: string[] }) => {
  if (item.thumbnail_url || item.image_url) return item.thumbnail_url || item.image_url || '';
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

  return workMatch?.img || "https://images.unsplash.com/photo-1542204172-e70528091f50?auto=format&fit=crop&w=800&q=80";
};

export interface DbPortfolioItem {
  id: number;
  title: string;
  description: string;
  format_type: 'horizontal' | 'vertical' | 'square' | 'featured';
  category: 'cinema' | 'reels' | 'web' | 'branding';
  media_source: 'native' | 'youtube' | 'vimeo' | 'instagram';
  media_url: string;
  thumbnail_url: string;
  image_url?: string;
  video_url?: string;
  gallery_images?: string[];
}

const filterCategories = [
  { id: 'all', label: 'Todo', icon: <Grid size={16} /> },
  { id: 'cinema', label: 'Cine', icon: <Clapperboard size={16} /> },
  { id: 'reels', label: 'Verticales', icon: <Camera size={16} /> },
  { id: 'web', label: 'Web', icon: <Globe size={16} /> },
  { id: 'branding', label: 'Branding', icon: <Palette size={16} /> }
];

interface PortfolioCardProps {
  work: DbPortfolioItem;
  onClick: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ work, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const displayThumbnail = resolvePortfolioThumbnail(work);
  const displayCategory = work.category ?? "cinema";
  const displayFormat = work.format_type ?? "horizontal";
  const hasExplicitPoster = Boolean(work.thumbnail_url || work.image_url || work.gallery_images?.[0]);
  const canUseVideoFrame = !hasExplicitPoster && displayCategory === 'reels' && Boolean(work.media_url) && (work.media_source === 'native' || !work.media_source);

  // Dynamic layout grid spacing configuration
  const gridClasses = useMemo(() => {
    switch (displayFormat) {
      case 'vertical':
        return 'md:row-span-2 md:col-span-1 min-h-[460px] md:min-h-0';
      case 'featured':
        return 'md:col-span-2 md:row-span-1 min-h-[280px]';
      case 'square':
        return 'col-span-1 row-span-1 min-h-[280px]';
      case 'horizontal':
      default:
        return 'col-span-1 row-span-1 min-h-[280px]';
    }
  }, [displayFormat]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[24px] cursor-pointer bg-[#0a0808] border border-white/5 hover:border-movie-red/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(176,35,46,0.15)] flex flex-col justify-end ${gridClasses}`}
    >
      {/* Background Image backdrop (lazy image loads) */}
      {canUseVideoFrame ? (
        <video
          src={work.media_url}
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-contain object-center transition-transform duration-1000 group-hover:scale-105 ${
            isHovered ? 'scale-105 blur-[1px] opacity-30' : 'scale-100 opacity-90'
          }`}
        />
      ) : (
        <img
          src={displayThumbnail}
          alt={work.title}
          className={`absolute inset-0 w-full h-full object-contain object-center transition-transform duration-1000 group-hover:scale-105 ${
            isHovered ? 'scale-105 blur-[1px] opacity-30' : 'scale-100 opacity-90'
          }`}
          loading="lazy"
        />
      )}
      
      {/* Video Hover auto-playback preview */}
      {isHovered && work.media_url && (
        <div className="absolute inset-0 z-10 w-full h-full overflow-hidden transition-opacity duration-700 animate-fade-in bg-black">
          {work.media_source === 'youtube' && (
            <iframe
              src={`${work.media_url}${work.media_url.includes('?') ? '&' : '?'}autoplay=1&mute=1&controls=0&loop=1&playlist=${work.media_url.split('/').pop()?.split('?')[0] ?? ''}&background=1`}
              className="w-full h-full object-contain pointer-events-none"
              frameBorder="0"
              allow="autoplay; encrypted-media"
            />
          )}
          {work.media_source === 'vimeo' && (
            <iframe
              src={`${work.media_url}${work.media_url.includes('?') ? '&' : '?'}autoplay=1&muted=1&controls=0&loop=1&background=1`}
              className="w-full h-full object-contain pointer-events-none"
              frameBorder="0"
              allow="autoplay; encrypted-media"
            />
          )}
          {work.media_source === 'instagram' && (
            <iframe
              src={work.media_url}
              className="w-full h-full object-contain pointer-events-none"
              frameBorder="0"
              scrolling="no"
              allowTransparency
            />
          )}
          {(work.media_source === 'native' || !work.media_source) && (
            <video
              src={work.media_url}
              autoPlay
              loop
              muted
              playsInline
            className="w-full h-full object-contain object-center"
            />
          )}
        </div>
      )}

      {/* Dark overlay masking */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 z-20"></div>
      
      {/* Visual content descriptor */}
      <div className="p-6 md:p-8 flex flex-col justify-end relative z-30 transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="flex gap-2 items-center mb-2">
          <span className="text-[8px] font-black text-movie-red bg-movie-red/10 border border-movie-red/20 uppercase tracking-[0.3em] px-2.5 py-1 rounded-md">
            {displayCategory}
          </span>
          <span className="text-[8px] font-mono text-white/40 uppercase">
            {displayFormat}
          </span>
        </div>
        <h4 className="text-white text-xl md:text-2xl font-heading font-black truncate uppercase italic tracking-tighter leading-none mb-1">
          {work.title ?? "Proyecto sin título"}
        </h4>
        <p className="text-white/40 text-[11px] line-clamp-2 uppercase tracking-wide">
          {work.description || "Concepto visual producido para el portafolio de LA MOVIE."}
        </p>
        
        <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <div className="h-[1px] flex-1 bg-white/20"></div>
          <span className="text-[9px] font-extrabold text-white uppercase tracking-widest flex items-center gap-1.5">
            REPRODUCIR <Plus size={12} className="text-movie-red animate-pulse" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedWork, setSelectedWork] = useState<DbPortfolioItem | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [dbItems, setDbItems] = useState<DbPortfolioItem[]>([]);
  const [visibleItems, setVisibleItems] = useState(8);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            const mappedDb = data.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description || '',
              format_type: item.format_type || 'horizontal',
              category: item.category || 'cinema',
              media_source: item.media_source || 'native',
              media_url: item.media_url || item.video_url || '',
              thumbnail_url: item.thumbnail_url || item.image_url || '',
              gallery_images: Array.isArray(item.gallery_images) ? item.gallery_images : []
            }));
            setDbItems(mappedDb);
          }
        }
      } catch (err) {
        console.error("Failed to fetch portfolio from API database:", err);
      }
    };
    fetchPortfolio();
  }, []);

  useEffect(() => {
    setGalleryIndex(0);
  }, [selectedWork]);

  // Generación de Fallback Estático si el administrador aún no ingresa nada
  const fallbackWorks = useMemo<DbPortfolioItem[]>(() => {
    return [
      ...ASSETS.portfolio.works.map((w: any) => ({
        id: w.id + 1000,
        title: w.title,
        description: w.desc || "Estrategia de fotografía artística e identidad visual.",
        format_type: (w.id % 4 === 0 ? 'vertical' : w.id % 3 === 0 ? 'featured' : w.id % 2 === 0 ? 'square' : 'horizontal') as any,
        category: (w.category === 'Fotografía' ? 'cinema' : 'branding') as any,
        media_source: 'native' as any,
        media_url: '',
        thumbnail_url: w.img,
      })),
      ...ASSETS.portfolio.reels.map((r: any) => ({
        id: r.id + 2000,
        title: r.title,
        description: "Reel dinámico diseñado para alto engagement en redes sociales.",
        format_type: 'vertical' as any,
        category: 'reels' as any,
        media_source: 'native' as any,
        media_url: r.video,
        thumbnail_url: r.img,
      }))
    ];
  }, []);

  // Combined real-time portfolio timeline
  const combinedItems = useMemo(() => {
    return dbItems;
  }, [dbItems]);

  // Filter items flawlessly based on selected tag
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return combinedItems;
    
    return combinedItems.filter(item => {
      const cat = String(item.category).toLowerCase();
      if (activeFilter === 'cinema') return cat === 'cinema' || cat === 'cine' || cat === 'video';
      if (activeFilter === 'reels') return cat === 'reels' || cat === 'verticales' || cat === 'vertical' || cat === 'reels/verticals';
      if (activeFilter === 'web') return cat === 'web' || cat === 'web app' || cat === 'desarrollo web';
      if (activeFilter === 'branding') return cat === 'branding';
      return cat === activeFilter.toLowerCase();
    });
  }, [combinedItems, activeFilter]);

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 4);
  };

  return (
    <section id="portfolio" className="py-32 bg-movie-black relative min-h-screen">
      {/* Cinematic Glowing Backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-movie-red/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-movie-red/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Title Section */}
        <div className="max-w-4xl mx-auto text-center mb-20 animate-fade-in">
           <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-movie-red/30 bg-movie-red/10 text-movie-red text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
             <Zap size={12} className="fill-movie-red animate-pulse" /> Showcase & Portafolio Mixto 
           </div>
           <h1 className="text-6xl md:text-8xl font-heading font-black text-white mb-8 tracking-tighter uppercase italic">
             SHOWCASE
           </h1>
           <p className="text-movie-silver text-lg md:text-xl font-light max-w-2xl mx-auto mb-12">
             Bento Grid interactivo de producciones cinematográficas y soluciones web de alto impacto impulsadas por LA MOVIE.
           </p>
           
           {/* Modern categories navigation row */}
           <div className="flex flex-wrap justify-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit mx-auto backdrop-blur-xl">
             {filterCategories.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => {
                   setActiveFilter(cat.id);
                   setVisibleItems(8);
                 }}
                 className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 hover:scale-105 ${
                   activeFilter === cat.id 
                     ? 'bg-white text-black shadow-[0_10px_25px_rgba(255,255,255,0.15)] scale-105' 
                     : 'bg-transparent text-white/50 hover:bg-white/10 hover:text-white'
                 }`}
               >
                 {cat.icon} {cat.label}
               </button>
             ))}
           </div>
        </div>

        {/* Dynamic Bento Box layout */}
        <div className="animate-fade-in-up">
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px] grid-flow-dense mb-16"
          >
            <AnimatePresence>
              {filteredItems.slice(0, visibleItems).map((work) => (
                <PortfolioCard 
                  key={work.id}
                  work={work}
                  onClick={() => setSelectedWork(work)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {visibleItems < filteredItems.length && (
            <div className="text-center mb-16">
               <button 
                 onClick={handleLoadMore}
                 className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all skew-x-[-10deg] shadow-lg hover:shadow-white/15"
               >
                 <span className="flex items-center gap-3 skew-x-[10deg]">
                   Explorar Más Proyectos <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                 </span>
               </button>
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div className="mt-32 text-center bg-gradient-to-b from-white/5 to-transparent p-16 rounded-[40px] border border-white/5">
          <h3 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 uppercase italic tracking-tighter">¿Tienes una gran visión entre manos?</h3>
          <p className="text-movie-silver text-base mb-10 max-w-xl mx-auto">Conectemos tu idea con producción audiovisual cinematográfica o diseño interactivo premium.</p>
          <a 
            href="https://wa.me/573017355046?text=Hola%20LA%20MOVIE,%20vi%20su%20portafolio%20y%20quiero%20empezar%20un%20proyecto."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-movie-red hover:bg-red-700 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 shadow-[0_20px_50px_rgba(176,35,46,0.3)]"
          >
            Iniciar Mi Proyecto <MessageCircle size={20} />
          </a>
        </div>

      </div>

      {/* FULLSCREEN CINEMATIC LIGHTBOX */}
      <AnimatePresence>
        {selectedWork && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWork(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />
            
            {/* Box Stage */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative max-w-7xl w-full h-[90vh] flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center z-10 p-6"
            >
              {/* Back button */}
              <button 
                onClick={() => setSelectedWork(null)} 
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-all z-50 p-3 bg-white/10 hover:bg-movie-red rounded-full border border-white/10 hover:scale-105"
              >
                <X size={24} />
              </button>
              
              {/* Video Player Display Screen */}
              <div className="w-full lg:col-span-8 h-[50vh] lg:h-full rounded-[32px] overflow-hidden flex items-center justify-center bg-black border border-white/10 relative shadow-2xl">
                {selectedWork.gallery_images && selectedWork.gallery_images.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selectedWork.gallery_images[galleryIndex]}
                      alt={`${selectedWork.title} ${galleryIndex + 1}`}
                      className="w-full h-full object-contain bg-black"
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                      <div className="rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
                        Carrusel {galleryIndex + 1} / {selectedWork.gallery_images.length}
                      </div>
                      <div className="flex gap-2">
                        {selectedWork.gallery_images.map((image, index) => (
                          <button
                            key={image}
                            type="button"
                            onClick={() => setGalleryIndex(index)}
                            className={`h-2.5 rounded-full transition-all ${
                              index === galleryIndex ? 'w-7 bg-movie-red' : 'w-2.5 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : selectedWork.media_url ? (
                  <>
                    {selectedWork.media_source === 'youtube' && (
                      <iframe
                        src={`${selectedWork.media_url}${selectedWork.media_url.includes('?') ? '&' : '?'}autoplay=1&controls=1&rel=0`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    {selectedWork.media_source === 'vimeo' && (
                      <iframe
                        src={`${selectedWork.media_url}${selectedWork.media_url.includes('?') ? '&' : '?'}autoplay=1&controls=1`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    )}
                    {selectedWork.media_source === 'instagram' && (
                      <iframe
                        src={selectedWork.media_url}
                        className="w-full h-full scale-[1.02]"
                        frameBorder="0"
                        scrolling="no"
                      />
                    )}
                    {(selectedWork.media_source === 'native' || !selectedWork.media_source) && (
                      <video 
                        src={selectedWork.media_url} 
                        autoPlay 
                        controls 
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    )}
                  </>
                ) : (
                  <img 
                    src={selectedWork.thumbnail_url || selectedWork.image_url} 
                    alt={selectedWork.title} 
                    className="w-full h-full object-contain" 
                  />
                )}
              </div>
              
              {/* Sidebar item descriptor card */}
              <div className="w-full lg:col-span-4 h-auto lg:h-full flex flex-col justify-center">
                <div className="bg-[#0b0a0a] border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
                  <div className="flex gap-2 items-center mb-4">
                    <span className="inline-block bg-movie-red text-white text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-md">
                       {selectedWork.category ?? 'cinema'}
                    </span>
                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md">
                      {selectedWork.format_type ?? 'horizontal'}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-heading font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
                    {selectedWork.title}
                  </h3>
                  
                  <p className="text-white/60 text-xs font-light leading-relaxed mb-6">
                    {selectedWork.description || "Este proyecto fue diseñado y producido para altos estándares cinemáticos, garantizando el máximo retorno de inversión y engagement en campañas comerciales."}
                  </p>

                  <div className="space-y-3">
                    <a 
                        href={`https://wa.me/573017355046?text=Hola,%20me%20interesa%20un%20proyecto%20similar%20a%20"${encodeURIComponent(selectedWork.title)}"`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-movie-red text-black hover:text-white font-black uppercase tracking-widest text-[9px] transition-all rounded-xl shadow-lg"
                    >
                        Cotizar Proyecto Similar <MessageCircle size={16} />
                    </a>
                    <button 
                      onClick={() => setSelectedWork(null)}
                      className="w-full py-4 bg-white/5 border border-white/15 text-white/60 font-black uppercase tracking-widest text-[9px] hover:text-white hover:border-white/30 transition-all rounded-xl"
                    >
                      Cerrar Pantalla Completa
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Portfolio;
