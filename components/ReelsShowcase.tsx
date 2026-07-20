import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Play, TrendingUp, X } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { VideoMidpointCover } from './VideoMidpointCover';

const resolveReelPoster = (reel: { title?: string; thumbnail_url?: string; image_url?: string; category?: string; media_url?: string; video_url?: string }) => {
  if (reel.thumbnail_url || reel.image_url) return reel.thumbnail_url || reel.image_url || '';
  if (reel.media_url || reel.video_url) return '';

  const title = String(reel.title || '').toLowerCase();
  const fallback = ASSETS.portfolio.reels.find((item) =>
    item.title.toLowerCase().includes(title) || title.includes(item.title.toLowerCase())
  );

  return fallback?.img || ASSETS.portfolio.reels[0]?.img || '';
};

type Reel = {
  id: number;
  title: string;
  description?: string;
  media_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  image_url?: string;
  views?: number;
  likes?: number;
  category?: string;
  format_type?: string;
};

const FALLBACK_REELS: Reel[] = [
  { id: -1, title: 'Reel Cinemático', media_url: 'https://videos.pexels.com/video-files/5896379/5896379-sd_540_960_24fps.mp4', views: 18400, likes: 920 },
  { id: -2, title: 'Vertical Branding', media_url: 'https://videos.pexels.com/video-files/6981410/6981410-sd_540_960_25fps.mp4', views: 32100, likes: 1800 },
  { id: -3, title: 'Social Impact', media_url: 'https://videos.pexels.com/video-files/5309381/5309381-sd_540_960_25fps.mp4', views: 12900, likes: 640 }
];

function formatMetric(value?: number) {
  const n = Number(value) || 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const isDirectVideoUrl = (url?: string) => /\.(mp4|mov|m4v|webm)(\?|$)/i.test(String(url || ''));

function ReelCard({ reel, onOpen }: { reel: Reel; onOpen: (reel: Reel) => void }) {
  const src = reel.media_url || reel.video_url || '';
  const poster = resolveReelPoster(reel);
  const isFrameSource = !isDirectVideoUrl(src) && /youtube\.com\/embed|player\.vimeo\.com|instagram\.com\/.*\/embed/.test(src);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -8 }}
      onClick={() => onOpen(reel)}
      className="group relative aspect-[9/16] w-[min(62vw,190px)] shrink-0 snap-center overflow-hidden rounded-[20px] border border-white/10 bg-neutral-950 text-left shadow-2xl sm:w-[220px] md:w-[240px] lg:w-[260px] md:rounded-[28px]"
    >
      {isFrameSource ? ( 
        <iframe
          src={src}
          title={reel.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-75 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        />
      ) : (
        <VideoMidpointCover
          src={src}
          poster={poster}
          autoPlay
          loop
          title={reel.title}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-75 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      <div className="absolute top-3 left-1/2 h-0.5 w-14 -translate-x-1/2 rounded-full bg-white/30 sm:w-16" />
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
        <div className="mb-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-movie-red shadow-[0_0_24px_rgba(176,35,46,0.5)] sm:mb-4 sm:h-10 sm:w-10">
          <Play size={15} className="fill-white text-white ml-0.5" />
        </div>
        <h3 className="text-white text-sm sm:text-base font-black uppercase leading-tight line-clamp-2">{reel.title}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/70">
          <span className="inline-flex items-center gap-1"><TrendingUp size={12} /> {formatMetric(reel.views)}</span>
          <span className="inline-flex items-center gap-1"><Heart size={12} /> {formatMetric(reel.likes)}</span>
        </div>
      </div>
    </motion.button>
  );
}

export default function ReelsShowcase() {
  const [items, setItems] = useState<Reel[]>([]);
  const [selected, setSelected] = useState<Reel | null>(null);

  useEffect(() => {
    const loadReels = () => {
      fetch('/api/portfolio')
        .then((res) => res.json())
        .then((data) => {
          console.log('ReelsShowcase: Portfolio data received:', data);
          if (!Array.isArray(data)) {
            console.warn('ReelsShowcase: Portfolio data is not an array');
            return;
          }
          
          // Filtro flexible: cualquier item que sea reel O vertical O tenga video
          // Priorizamos items con media_url/video_url
          const reels = data
            .filter((item) => {
              const hasMedia = !!(item.media_url || item.video_url);
              const isReelCategory = (item.category || '').toLowerCase().includes('reel');
              const isVerticalFormat = (item.format_type || '').toLowerCase() === 'vertical';
              return hasMedia && (isReelCategory || isVerticalFormat);
            })
            .map((item) => ({
              ...item,
              thumbnail_url: item.thumbnail_url || item.image_url || '',
              image_url: item.image_url || item.thumbnail_url || '',
              views: item.views || 0,
              likes: item.likes || 0
            }));
          
          console.log('ReelsShowcase: Filtered reels:', reels);
          
          // SIEMPRE usar portfolio reels, no fallback
          if (reels.length > 0) {
            setItems(reels);
          } else {
            console.warn('ReelsShowcase: No reels found in portfolio with reel/vertical category and media');
            // Si no hay reels en portafolio, intentar cargar TODOS los items como fallback
            const allItems = data
              .filter((item) => item.media_url || item.video_url)
              .map((item) => ({
                ...item,
                thumbnail_url: item.thumbnail_url || item.image_url || '',
                image_url: item.image_url || item.thumbnail_url || '',
                views: item.views || 0,
                likes: item.likes || 0
              }));
            setItems(allItems);
            console.log('ReelsShowcase: Using all portfolio items as fallback:', allItems);
          }
        })
        .catch((err) => {
          console.error('ReelsShowcase: Failed to fetch portfolio:', err);
          // NO usar FALLBACK_REELS en caso de error, solo mostrar vacío
          setItems([]);
        });
    };

    // Cargar al montar
    loadReels();

    // Actualizar cada 10 segundos para captar nuevos reels agregados
    const interval = setInterval(loadReels, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const visible = useMemo(() => items.filter((item) => item.media_url || item.video_url), [items]);
  // Crear carrusel infinito duplicando items
  const loopedReels = useMemo(() => {
    if (visible.length === 0) return [];
    const repeatCount = Math.max(4, Math.ceil(18 / visible.length));
    return Array.from({ length: repeatCount }, () => visible).flat();
  }, [visible]);

  if (visible.length === 0) return null;

  return (
    <section className="relative z-20 overflow-hidden border-y border-white/5 bg-[#050505] py-12 sm:py-16 md:py-20">
      <div className="container mx-auto mb-7 flex flex-col justify-between gap-5 px-4 sm:mb-8 sm:gap-6 sm:px-6 md:mb-10 md:flex-row md:items-end">
        <div className="min-w-0">
          <p className="mb-3 text-[9px] font-black uppercase tracking-[0.25em] text-movie-red sm:text-xs sm:tracking-[0.35em]">Impacto vertical</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight md:tracking-tighter leading-[0.95] text-balance">Reels que detienen el scroll</h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-white/50 sm:text-sm">
          Piezas 9:16 conectadas desde el portafolio, reproduciendose en formato corto automatico y en carrusel continuo.
        </p>
      </div>

      <div className="w-full overflow-hidden px-4 pb-3 sm:px-6 sm:pb-4">
        <div className="flex w-max min-w-full max-w-none flex-shrink-0 justify-start gap-3 sm:gap-4 md:gap-5 animate-scroll-film hover:[animation-play-state:paused]">
          {loopedReels.map((reel, idx) => (
            <React.Fragment key={`${reel.id}-${idx}`}>
              <ReelCard reel={reel} onOpen={setSelected} />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center px-4 sm:mt-10 sm:px-6">
        <p className="text-center text-[10px] uppercase tracking-wider text-white/40 sm:text-xs">
          Desliza para más • {visible.length} reel{visible.length !== 1 ? 's' : ''} disponible{visible.length !== 1 ? 's' : ''}
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white/20 sm:right-5 sm:top-5 sm:h-12 sm:w-12"
              aria-label="Cerrar reel"
            >
              <X size={22} />
            </button>
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="relative aspect-[9/16] h-[82svh] max-h-[90vh] max-w-[92vw] overflow-hidden rounded-[24px] border border-white/10 bg-neutral-950 shadow-2xl sm:h-[88vh] sm:max-w-[85vw] sm:rounded-[32px] md:max-w-[600px]"
            >
              {!isDirectVideoUrl(selected.media_url || selected.video_url) && /youtube\.com\/embed|player\.vimeo\.com|instagram\.com\/.*\/embed/.test(selected.media_url || selected.video_url || '') ? (
                <iframe
                  src={selected.media_url || selected.video_url}
                  title={selected.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-contain"
                />
              ) : (
                <VideoMidpointCover
                  src={selected.media_url || selected.video_url}
                  poster={resolveReelPoster(selected)}
                  autoPlay
                  controls
                  className="w-full h-full object-contain bg-black"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pointer-events-none sm:p-6">
                <h3 className="text-lg sm:text-xl font-black uppercase leading-tight line-clamp-2">{selected.title}</h3>
                <p className="mt-1 text-xs text-white/60 line-clamp-2 sm:text-sm">{selected.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
