import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  isLoading: boolean;
}

const phrases = [
  "Ajustando el foco...",
  "Renderizando ideas...",
  "Calibrando colores...",
  "Preparando el set...",
  "Creando narrativa...",
  "Cargando la magia...",
];

const Preloader: React.FC<PreloaderProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isLoading) {
      // Progress Counter
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Non-linear progress (starts fast, slows down)
          const increment = Math.max(1, Math.floor(Math.random() * 5));
          return Math.min(100, prev + increment);
        });
      }, 100);

      // Phrase cycler
      const phraseInterval = setInterval(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }, 800);

      return () => {
        clearInterval(interval);
        clearInterval(phraseInterval);
      };
    } else {
      // Wait for animation to finish before unmounting visually
      const timer = setTimeout(() => setShow(false), 1000); // Allow exit animation
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-movie-black flex flex-col items-center justify-center transition-transform duration-[1000ms] ease-in-out ${
        !isLoading ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Background Noise/Grid */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_80%)] pointer-events-none"></div>

      {/* Animated Icon: Clapperboard */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-movie-red/20 blur-[40px] rounded-full animate-pulse"></div>
        
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
          {/* Bottom part */}
          <rect x="10" y="40" width="80" height="50" rx="4" fill="#0D0D0D" stroke="white" strokeWidth="2" />
          
          {/* Stripes on bottom */}
          <path d="M20 90L40 40" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
          <path d="M50 90L70 40" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
          
          {/* Top Part (The Clapper) - Animated */}
          <g className="animate-clap origin-[10px_35px]">
             <rect x="10" y="15" width="80" height="20" rx="2" fill="#B0232E" stroke="white" strokeWidth="2" />
             {/* Stripes on top */}
             <path d="M25 35L35 15" stroke="white" strokeWidth="2" />
             <path d="M45 35L55 15" stroke="white" strokeWidth="2" />
             <path d="M65 35L75 15" stroke="white" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Brand Name */}
      <h1 className="text-4xl font-heading font-black tracking-widest text-white mb-2 flex items-center gap-2">
         LA MOVIE
      </h1>

      {/* Creative Phrase */}
      <div className="h-6 overflow-hidden mb-8">
         <p className="text-movie-red font-mono text-xs uppercase tracking-widest animate-pulse text-center">
            {phrases[phraseIndex]}
         </p>
      </div>

      {/* Progress Bar & Counter */}
      <div className="w-64">
         <div className="flex justify-between text-xs font-bold text-white mb-2">
            <span>CARGANDO</span>
            <span>{progress}%</span>
         </div>
         <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-movie-red transition-all duration-200 ease-out shadow-[0_0_10px_#B0232E]"
              style={{ width: `${progress}%` }}
            ></div>
         </div>
      </div>

      {/* Footer Tech Text */}
      <div className="absolute bottom-10 text-[10px] text-white/20 font-mono tracking-[0.5em] uppercase">
         Agency • Creative • Production
      </div>

    </div>
  );
};

export default Preloader;