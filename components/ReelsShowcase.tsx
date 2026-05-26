import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Play, TrendingUp, X } from 'lucide-react';
import { ASSETS } from '../data/assets';

const resolveReelPoster = (reel: { title?: string; thumbnail_url?: string; image_url?: string; category?: string }) => {
  if (reel.thumbnail_url || reel.image_url) return reel.thumbnail_url || reel.image_url || '';

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
      className="group relative aspect-[9/16] w-[72vw] max-w-[230px] shrink-0 snap-center overflow-hidden rounded-[24px] border border-white/10 bg-neutral-950 text-left shadow-2xl sm:w-[230px] md:w-[250px] md:max-w-none md:rounded-[28px]"
    >
      {isFrameSource ? (
        <iframe
          src={src}
          title={reel.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-100 pointer-events-none"
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
          className="absolute inset-0 h-full w-full object-cover object-center opacity-75 transition-opacity group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/30" />
      <div className="absolute bottom-5 left-5 right-5">
        <div className="w-10 h-10 rounded-full bg-movie-red flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(176,35,46,0.5)]">
          <Play size={15} className="fill-white text-white ml-0.5" />
        </div>
        <h3 className="text-white text-base font-black uppercase leading-tight">{reel.title}</h3>
        <div className="mt-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/70">
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
        const reels = data
          .filter((item) => item.category === 'reels' || item.format_type === 'vertical')
          .map((item) => ({
            ...item,
            thumbnail_url: item.thumbnail_url || item.image_url || resolveReelPoster(item),
            image_url: item.image_url || item.thumbnail_url || resolveReelPoster(item)
          }));
        if (reels.length > 0) setItems(reels);
      })
      .catch(() => setItems(FALLBACK_REELS));
  }, []);

  const visible = useMemo(() => items.filter((item) => item.media_url || item.video_url), [items]);

  if (visible.length === 0) return null;

  return (
    <section className="relative z-20 py-20 overflow-hidden bg-[#050505] border-y border-white/5">
      <div className="container mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-movie-red text-xs uppercase tracking-[0.35em] font-black mb-3">Impacto vertical</p>
          <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter">Reels que detienen el scroll</h2>
        </div>
        <p className="text-white/50 max-w-sm text-sm leading-relaxed">
          Piezas 9:16 conectadas desde el portafolio, reproduciendose en formato corto automatico.
        </p>
      </div>

      <div className="overflow-x-auto no-scrollbar px-6 pb-4 snap-x snap-mandatory">
        <div className="mx-auto flex w-max max-w-full gap-4 sm:gap-5 md:max-w-none">
          {visible.map((reel) => (
            <React.Fragment key={reel.id}>
              <ReelCard reel={reel} onOpen={setSelected} />
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-20"
              aria-label="Cerrar reel"
            >
              <X size={22} />
            </button>
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="relative aspect-[9/16] h-[82vh] max-h-[760px] max-w-[92vw] overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 shadow-2xl sm:h-[88vh] sm:rounded-[32px]"
            >
              {/youtube\.com\/embed|player\.vimeo\.com|instagram\.com\/.*\/embed/.test(selected.media_url || selected.video_url || '') ? (
                <iframe
                  src={selected.media_url || selected.video_url}
                  title={selected.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
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
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                <h3 className="text-xl font-black uppercase">{selected.title}</h3>
                <p className="text-white/60 text-sm mt-1">{selected.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
