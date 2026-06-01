import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Download, X, Check } from 'lucide-react';

interface FrameCaptureProps {
  videoUrl: string;
  onCapture: (imageData: string, timestamp: number) => void;
  onClose: () => void;
}

export const FrameCapture: React.FC<FrameCaptureProps> = ({ videoUrl, onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedFrame(imageData);
  };

  const handleConfirm = () => {
    if (capturedFrame) {
      onCapture(capturedFrame, currentTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-movie-red flex items-center justify-center text-white transition-all"
          >
            <X size={20} />
          </button>

          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white uppercase mb-2">Extractor de Fotogramas</h2>
              <p className="text-white/60 text-sm">Navega el video y captura el fotograma perfecto para portada</p>
            </div>

            <div className="space-y-4">
              {/* Video Preview */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Captured Frame Preview */}
              {capturedFrame && (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-movie-red">
                  <img src={capturedFrame} alt="Fotograma capturado" className="w-full h-full object-contain" />
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-movie-red/90 px-3 py-1 rounded-full text-white text-xs font-black">
                    <Check size={14} /> CAPTURADO
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="bg-white/5 p-4 rounded-lg space-y-4 border border-white/10">
                {/* Timeline */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => {
                      const video = videoRef.current;
                      if (video) video.currentTime = parseFloat(e.target.value);
                    }}
                    className="w-full accent-movie-red"
                  />
                  <div className="flex justify-between text-xs text-white/60 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => skipTime(-5)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
                  >
                    <SkipBack size={20} />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="px-6 py-3 bg-movie-red hover:bg-red-700 text-white rounded-lg font-black uppercase text-xs flex items-center gap-2 transition-all"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? 'PAUSA' : 'REPRODUCIR'}
                  </button>

                  <button
                    onClick={() => skipTime(5)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
                  >
                    <SkipForward size={20} />
                  </button>
                </div>

                {/* Capture Button */}
                <button
                  onClick={captureFrame}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-black uppercase text-xs transition-all border border-white/20"
                >
                  Capturar Fotograma en {formatTime(currentTime)}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-black uppercase text-xs transition-all border border-white/20"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!capturedFrame}
                  className="flex-1 py-3 bg-movie-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-black uppercase text-xs transition-all"
                >
                  Usar Fotograma
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
