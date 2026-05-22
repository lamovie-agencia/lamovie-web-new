import React, { useEffect, useState } from 'react';
import { TrendingUp, Eye, Target, ArrowUpRight } from 'lucide-react';

const MarketTrends: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('market-trends');
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="market-trends" className="py-24 bg-movie-dark border-b border-white/5 relative overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          
          {/* Left: The "Problem" / Data */}
          <div className="w-full md:w-1/2">
             <h2 className="text-movie-red font-bold tracking-[0.3em] text-sm uppercase mb-4 flex items-center gap-2">
                <TrendingUp size={16} /> Market Data
             </h2>
             <h3 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
                LO QUE NO SE VE, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-movie-silver to-white">NO SE VENDE.</span>
             </h3>
             <p className="text-movie-text text-lg mb-8 leading-relaxed">
                El cerebro procesa imágenes 60,000 veces más rápido que el texto. Si tu marca no tiene una presencia visual fuerte, estás perdiendo el 80% de tus clientes potenciales antes de que lean tu primera palabra.
             </p>

             {/* Stats Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-movie-black border border-white/5 rounded-lg hover:border-movie-red/50 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                      <Eye className="text-movie-red" />
                      <span className="text-green-500 text-xs font-bold flex items-center">+150% <ArrowUpRight size={12}/></span>
                   </div>
                   <h4 className="text-3xl font-bold text-white mb-1">Video</h4>
                   <p className="text-xs text-movie-silver">Aumento en conversión vs. imagen estática.</p>
                </div>
                <div className="p-6 bg-movie-black border border-white/5 rounded-lg hover:border-movie-red/50 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                      <Target className="text-cyan-400" />
                      <span className="text-green-500 text-xs font-bold flex items-center">+90% <ArrowUpRight size={12}/></span>
                   </div>
                   <h4 className="text-3xl font-bold text-white mb-1">Retención</h4>
                   <p className="text-xs text-movie-silver">Mayor recuerdo de marca en primeros 3s.</p>
                </div>
             </div>
          </div>

          {/* Right: Visual Graph (Animated) */}
          <div className="w-full md:w-1/2 bg-movie-black p-8 rounded-xl border border-white/10 shadow-2xl relative">
             <h4 className="text-white font-bold mb-8">Impacto en Ventas (ROI)</h4>
             
             <div className="space-y-6">
                {/* Bar 1 */}
                <div>
                   <div className="flex justify-between text-xs text-movie-text mb-2">
                      <span>Marcas sin estrategia visual</span>
                      <span>15%</span>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-gray-600 rounded-full transition-all duration-1000 ease-out ${isVisible ? 'w-[15%]' : 'w-0'}`}></div>
                   </div>
                </div>

                {/* Bar 2 */}
                <div>
                   <div className="flex justify-between text-xs text-movie-text mb-2">
                      <span>Marcas con diseño estándar</span>
                      <span>45%</span>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-movie-silver rounded-full transition-all duration-1000 ease-out delay-300 ${isVisible ? 'w-[45%]' : 'w-0'}`}></div>
                   </div>
                </div>

                {/* Bar 3 (Highlight) */}
                <div className="relative">
                   <div className="flex justify-between text-xs font-bold text-white mb-2">
                      <span className="text-movie-red flex items-center gap-2"><div className="w-2 h-2 bg-movie-red rounded-full animate-pulse"></div> Estrategia LA MOVIE</span>
                      <span>95%</span>
                   </div>
                   <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-movie-red/30">
                      <div 
                        className={`h-full bg-gradient-to-r from-movie-red to-red-600 rounded-full transition-all duration-1000 ease-out delay-500 shadow-[0_0_20px_rgba(176,35,46,0.5)] ${isVisible ? 'w-[95%]' : 'w-0'}`}
                      ></div>
                   </div>
                   <div className="absolute top-0 right-0 -mt-8 bg-white text-black text-[10px] font-bold px-2 py-1 rounded transform translate-x-2 rotate-12 shadow-lg">
                      RESULTADOS
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-movie-silver italic">
                   "El diseño no es solo cómo se ve, es cómo funciona." - Steve Jobs
                </p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MarketTrends;