import React, { useRef } from 'react';

interface VideoMidpointCoverProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  title?: string;
}

export const VideoMidpointCover: React.FC<VideoMidpointCoverProps> = ({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = false,
  controls = false,
  title
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const seekToMiddle = () => {
    const video = videoRef.current;
    if (!video) return;

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const midpoint = duration > 0 ? Math.max(0.1, duration * 0.5) : 0.5;
    const safeTime = duration > 0 ? Math.min(midpoint, Math.max(duration - 0.15, 0.1)) : midpoint;

    try {
      video.currentTime = safeTime;
    } catch {
      // Some remote videos block seeking until more data is available. The poster remains as fallback.
    }
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      title={title}
      muted
      playsInline
      loop={loop}
      controls={controls}
      preload="metadata"
      onLoadedMetadata={seekToMiddle}
      onLoadedData={seekToMiddle}
      onSeeked={handleSeeked}
      className={className}
    />
  );
};
