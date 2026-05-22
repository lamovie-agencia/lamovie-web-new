import React, { useEffect, useState, useRef } from 'react';
import { Play, Zap, ArrowDown, Mail, Video, Film, Calendar, MessageCircle, Send, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ASSETS } from '../data/assets';
import { translations } from '../data/translations';
import InteractiveBrief from './InteractiveBrief';

interface HeroProps {
  lang: 'es' | 'en';
  t: any;
  whatsappNumber?: string;
}

const Hero: React.FC<HeroProps> = ({ lang, t, whatsappNumber = '573017355046' }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const heroT = t.hero;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-movie-black"
    >
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#050505_90%)] z-20 pointer-events-none"></div>
          <div className="absolute inset-0 film-strip-bg animate-[scrollFilm_40s_linear_infinite] opacity-10 rotate-12 scale-150"></div>
          
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-20 grayscale mix-blend-overlay"
            style={{ transform: `scale(1.1) translate(${mousePos.x * -5}px, ${mousePos.y * -5}px)` }}
          >
             <source src={ASSETS.hero.backgroundVideo} type="video/mp4" />
          </video>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="container mx-auto px-6 relative z-30 pt-28 pb-20 lg:pt-20 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Editorial Copy */}
          <div className="text-left animate-[fadeInUp_0.8s_ease-out_forwards]">
            <div className="inline-flex items-center gap-3 py-2 px-5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-movie-red mb-6 md:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              {heroT.badge}
            </div>

            <h1 className="text-[14vw] lg:text-[90px] font-heading font-black leading-[0.85] tracking-tighter uppercase mb-6 text-white group-hover:glitch-text">
              {heroT.title}
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl font-light text-white/70 tracking-wide mb-8 md:mb-10 max-w-xl border-l-2 border-movie-red pr-6 pl-6">
              {heroT.copy}
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/portfolio')}
                className="w-full sm:w-auto group relative overflow-hidden bg-transparent border border-white/20 hover:border-white text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 skew-x-[-10deg]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 skew-x-[10deg]">
                  <Play size={14} className="fill-white" /> Explorar Reel 📼
                </span>
              </button>
            </div>
          </div>

          {/* Right Side: High-Ticket CRO Interactive Launcher (No fields displayed openly) */}
          <div className="animate-[fadeInUp_1s_ease-out_0.2s_forwards] opacity-0">
            <div className="bg-[#0c0707] border border-white/10 p-8 md:p-12 rounded-[40px] shadow-[0_30px_100px_rgba(176,35,46,0.15)] relative overflow-hidden group hover:border-[#B0232E]/30 transition-all duration-500">
              {/* Glowing vector assets */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#B0232E]/10 blur-[80px] -mr-20 -mt-20 group-hover:bg-[#B0232E]/25 transition-all duration-500 rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px] -ml-20 -mb-20 pointer-events-none rounded-full"></div>
              
              {/* High end content layout */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.25em] text-[#B0232E] font-bold mb-6">
                  <Star size={10} className="fill-[#B0232E] animate-pulse" /> Gold-Class Briefing Suite
                </div>

                <h2 className="text-3xl font-heading font-black text-white tracking-tight uppercase leading-tight mb-4">
                  DIAGNOSTICA TU POTENCIAL VIRAL EN 60 SEGUNDOS
                </h2>
                
                <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                  Aclara tus metas cinemáticas y presupuesto de forma ágil y estructurada con nuestro consultor dinámico.
                </p>

                {/* Single, massive CRO Trigger button */}
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsBriefOpen(true)}
                    className="w-full bg-[#B0232E] hover:bg-red-700 text-white font-black py-5 px-6 rounded-2xl tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(176,35,46,0.4)] hover:shadow-[0_20px_50px_rgba(176,35,46,0.6)] active:scale-95 duration-200 transform hover:-translate-y-0.5"
                  >
                    Quiero Volverme Viral ⚡
                  </button>

                  {/* Micro-confidence text */}
                  <span className="block text-[11px] text-white/40 tracking-wider">
                    Filtro de selección estricto para marcas con visión.
                  </span>
                </div>

                {/* Subtle conversion badges */}
                <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-white/5 text-[9px] text-white/40 uppercase tracking-widest font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>Inversión Segura</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Film size={14} className="text-[#B0232E]" />
                    <span>Cinematic Standards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <span className="text-[9px] uppercase tracking-widest text-white">Scroll</span>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,black_100%)] z-10"></div>

      {/* Interactive Brief Modal container */}
      <InteractiveBrief isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
    </section>
  );
};

export default Hero;
