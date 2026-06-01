import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Play, TrendingUp, X } from 'lucide-react';
import { ASSETS } from '../data/assets';

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

function ReelCard({ reel, onOpen }: { reel: Reel; onOpen: (reel: Reel) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = reel.media_url || reel.video_url || '';
  const poster = resolveReelPoster(reel);
  const isFrameSource = /youtube\.com\/embed|player\.vimeo\.com|instagram\.com\/.*\/embed/.test(src);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -8 }}
      onClick={() => onOpen(reel)}
      className="group relative aspect-[9/16] w-[min(72vw,220px)] shrink-0 snap-center overflow-hidden rounded-[22px] border border-white/10 bg-neutral-950 text-left shadow-2xl sm:w-[230px] md:w-[250px] md:rounded-[28px]"
    >
      {isFrameSource ? ( 
        <iframe
          src={src}
          title={reel.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-75 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-75 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      <div className="absolute top-2 xs:top-3 left-1/2 -translate-x-1/2 w-12 xs:w-16 h-0.5 rounded-full bg-white/30" />
      <div className="absolute bottom-3 xs:bottom-4 sm:bottom-5 left-3 xs:left-4 sm:left-5 right-3 xs:right-4 sm:right-5">
        <div className="w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 rounded-full bg-movie-red flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 shadow-[0_0_24px_rgba(176,35,46,0.5)] flex-shrink-0">
          <Play size={15} className="fill-white text-white ml-0.5" />
        </div>
        <h3 className="text-white text-xs xs:text-sm sm:text-base font-black uppercase leading-tight line-clamp-2">{reel.title}</h3>
        <div className="mt-2 xs:mt-3 flex flex-wrap items-center gap-x-2 xs:gap-x-3 gap-y-1 text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/70">
          <span className="inline-flex items-center gap-1"><TrendingUp size={12} /> {formatMetric(reel.views)}</span>
          <span className="inline-flex items-center gap-1"><Heart size={12} /> {formatMetric(reel.likes)}</span>
        </div>
      </div>
    </motion.button>
  );
}

export default function ReelsShowcase() {
  const [items, setItems] = useState<Reel[]>(FALLBACK_REELS);
  const [selected, setSelected] = useState<Reel | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        // Filtrar por categoría 'reels' o formato 'vertical', priorizando items con media_url/video_url
        const reels = data
          .filter((item) => {
            const isReel = (item.category || '').toLowerCase() === 'reels' || 
                          (item.format_type || '').toLowerCase() === 'vertical';
            const hasMedia = !!(item.media_url || item.video_url);
            return isReel && hasMedia;
          })
          .map((item) => ({
            ...item,
            thumbnail_url: item.thumbnail_url || item.image_url || '',
            image_url: item.image_url || item.thumbnail_url || '',
            views: item.views || 0,
            likes: item.likes || 0
          }));
        // Solo mostrar portfolio reels si existen, sino fallback
        if (reels.length > 0) {
          setItems(reels);
        }
      })
      .catch(() => setItems(FALLBACK_REELS));
  }, []);

  const visible = useMemo(() => items.filter((item) => item.media_url || item.video_url), [items]);
  // Crear carrusel infinito duplicando items
  const loopedReels = useMemo(() => {
    if (visible.length === 0) return [];
    return [...visible, ...visible, ...visible];
  }, [visible]);

  if (visible.length === 0) return null;

  return (
    <section className="relative z-20 py-12 xs:py-14 sm:py-16 md:py-20 overflow-hidden bg-[#050505] border-y border-white/5">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 mb-6 xs:mb-7 sm:mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 xs:gap-5 sm:gap-6">
        <div className="min-w-0">
          <p className="text-movie-red text-[8px] xs:text-[9px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-black mb-2 xs:mb-3">Impacto vertical</p>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight md:tracking-tighter leading-[0.95] text-balance">Reels que detienen el scroll</h2>
        </div>
        <p className="text-white/50 max-w-sm text-xs xs:text-sm leading-relaxed">
          Piezas 9:16 conectadas desde el portafolio, reproduciendose en formato corto automatico.
        </p>
      </div>

      <div className="w-full overflow-x-auto overscroll-x-contain no-scrollbar px-3 xs:px-4 sm:px-6 pb-2 xs:pb-3 sm:pb-4 snap-x snap-mandatory">
        <div className="mx-auto flex w-max min-w-full max-w-none justify-start gap-2 xs:gap-3 sm:gap-4 md:gap-5 md:justify-center flex-shrink-0">
          {loopedReels.map((reel, idx) => (
            <React.Fragment key={reel.id}>
              <ReelCard key={`${reel.id}-${idx}`} reel={reel} onOpen={setSelected} />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-6 xs:mt-8 sm:mt-10 px-3 xs:px-4 sm:px-6 flex justify-center">
        <p className="text-white/40 text-[10px] xs:text-xs uppercase tracking-wider text-center">
          Desliza para más • {visible.length} reel{visible.length !== 1 ? 's' : ''} disponible{visible.length !== 1 ? 's' : ''}
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 xs:p-3 sm:p-4"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 xs:top-4 right-3 xs:right-4 sm:top-5 sm:right-5 w-10 xs:w-11 sm:w-12 h-10 xs:h-11 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-20 transition-all duration-200"
              aria-label="Cerrar reel"
            >
              <X size={22} />
            </button>
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="relative aspect-[9/16] h-[80svh] xs:h-[82svh] sm:h-[88vh] max-h-[90vh] max-w-[95vw] xs:max-w-[90vw] sm:max-w-[85vw] md:max-w-[600px] overflow-hidden rounded-2xl xs:rounded-[28px] sm:rounded-[32px] border border-white/10 bg-neutral-950 shadow-2xl"
            >
              {/youtube\.com\/embed|player\.vimeo\.com|instagram\.com\/.*\/embed/.test(selected.media_url || selected.video_url || '') ? (
                <iframe
                  src={selected.media_url || selected.video_url}
                  title={selected.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={selected.media_url || selected.video_url}
                  poster={resolveReelPoster(selected)}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none">
                <h3 className="text-base xs:text-lg sm:text-xl font-black uppercase leading-tight line-clamp-2">{selected.title}</h3>
                <p className="text-white/60 text-xs xs:text-sm mt-1 line-clamp-2">{selected.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
