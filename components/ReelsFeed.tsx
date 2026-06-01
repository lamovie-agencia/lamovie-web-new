import React, { useEffect, useState, useRef, useCallback } from 'react';

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

// Small helper to play/pause videos based on intersection
function useAutoPlayObserver(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const videos = Array.from(container.querySelectorAll('video')) as HTMLVideoElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            el.play().catch(() => {});
          } else {
            try { el.pause(); } catch (e) {}
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );

    videos.forEach((v) => {
      v.muted = true;
      io.observe(v);
    });

    return () => io.disconnect();
  }, [containerRef]);
}

export default function ReelsFeed() {
  const [items, setItems] = useState<Reel[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const reels = data
          .filter((item: any) => item.category === 'reels' || item.format_type === 'vertical')
          .map((item: any) => ({
            ...item,
            media_url: item.media_url || item.video_url || item.media_url,
            thumbnail_url: item.thumbnail_url || item.image_url || ''
          }));
        setItems(reels);
      })
      .catch(() => setItems([]));
  }, []);

  // autoplay observer for visible videos
  useAutoPlayObserver(containerRef);

  // infinite load (client-side pagination)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPage((p) => p + 1);
          }
        });
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  const visible = items.slice(0, Math.min(items.length, (page + 1) * pageSize));

  if (!items || items.length === 0) return null;

  return (
    <section className="relative z-20 py-12 xs:py-14 sm:py-16 md:py-20 overflow-hidden bg-[#050505] border-y border-white/5">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 mb-6 xs:mb-7 sm:mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 xs:gap-5 sm:gap-6">
        <div className="min-w-0">
          <p className="text-movie-red text-[8px] xs:text-[9px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] font-black mb-2 xs:mb-3">Impacto vertical</p>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight md:tracking-tighter leading-[0.95] text-balance">Reels que detienen el scroll</h2>
        </div>
        <p className="text-white/50 max-w-sm text-xs xs:text-sm leading-relaxed">Feed infinito conectado al portafolio. Los videos se reproducen cuando están visibles.</p>
      </div>

      <div ref={containerRef} className="container mx-auto px-4 space-y-6">
        {visible.map((reel) => (
          <article key={reel.id} className="rounded-2xl overflow-hidden bg-neutral-950 border border-white/5">
            {reel.media_url ? (
              <video
                src={reel.media_url}
                poster={reel.thumbnail_url}
                muted
                playsInline
                preload="metadata"
                loop
                className="w-full h-[60vh] md:h-[70vh] object-cover"
              />
            ) : (
              <img src={reel.thumbnail_url || reel.image_url} alt={reel.title} className="w-full h-[60vh] md:h-[70vh] object-cover" />
            )}

            <div className="p-4">
              <h3 className="text-white font-black uppercase text-lg line-clamp-2">{reel.title}</h3>
              {reel.description && <p className="text-white/60 text-sm mt-2 line-clamp-2">{reel.description}</p>}
            </div>
          </article>
        ))}

        <div ref={sentinelRef} className="h-4" />
      </div>
    </section>
  );
}
