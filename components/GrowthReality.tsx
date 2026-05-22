import React from 'react';
import { Sprout, Zap, TrendingUp, Clock, Lock, BarChart2 } from 'lucide-react';

const GrowthReality: React.FC = () => {
  return (
    <section className="py-24 bg-movie-dark relative overflow-hidden border-t border-white/5">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-movie-red font-bold tracking-[0.3em] text-sm uppercase mb-4 flex items-center justify-center gap-2">
             <Lock size={14} /> Reality Check
          </h2>
          <h3 className="text-4xl md:text-5xl font-heading font-black text-white">
            LA VERDAD DEL <span className="text-movie-red">CRECIMIENTO</span>
          </h3>
          <p className="text-movie-text max-w-2xl mx-auto mt-4">
            En marketing digital no existe la magia instantánea, existe la estrategia. 
            Así es como se ve realmente el camino al éxito con <strong>LA MOVIE</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: The Timeline */}
          <div className="space-y-8">
            <div className="relative pl-8 border-l-2 border-movie-red/30 space-y-12">
              
              {/* Month 1 */}
              <div className="relative group">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-movie-dark border-4 border-movie-red shadow-[0_0_10px_rgba(176,35,46,0.5)]"></div>
                <div className="bg-movie-black p-6 rounded border border-white/10 hover:border-movie-red/50 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white">Mes 1: Sembrar</h4>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded text-movie-silver">Setup</span>
                   </div>
                   <p className="text-sm text-movie-text leading-relaxed">
                     Auditoría, definición de identidad visual, corrección de perfil y primeros testeos de contenido. <br/>
                     <span className="text-movie-red text-xs font-bold italic">Objetivo: Ordenar la casa y empezar a ser visibles.</span>
                   </p>
                </div>
              </div>

              {/* Month 2 */}
              <div className="relative group">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-movie-dark border-4 border-white/30 group-hover:border-movie-red transition-colors"></div>
                <div className="bg-movie-black p-6 rounded border border-white/10 hover:border-movie-red/50 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white">Mes 2: Regar</h4>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded text-movie-silver">Optimización</span>
                   </div>
                   <p className="text-sm text-movie-text leading-relaxed">
                     Analizamos qué funcionó en el mes 1. Ajustamos horarios, formatos y pauta. La comunidad empieza a interactuar. <br/>
                     <span className="text-movie-red text-xs font-bold italic">Objetivo: Generar confianza y engagement real.</span>
                   </p>
                </div>
              </div>

              {/* Month 3 */}
              <div className="relative group">
                 <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-movie-red border-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse"></div>
                <div className="bg-gradient-to-r from-movie-black to-movie-red/10 p-6 rounded border border-movie-red/50 shadow-[0_0_20px_rgba(176,35,46,0.1)]">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white">Mes 3: Cosechar</h4>
                      <span className="text-xs bg-movie-red text-white px-2 py-1 rounded font-bold">ROI</span>
                   </div>
                   <p className="text-sm text-movie-text leading-relaxed">
                     La estrategia madura. Los clientes potenciales ya confían y preguntan. El algoritmo nos favorece por constancia. <br/>
                     <span className="text-white text-xs font-bold italic">Objetivo: Conversión y Ventas sostenibles.</span>
                   </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Organic vs Paid Visual */}
          <div className="bg-movie-black p-8 rounded-xl border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <BarChart2 size={100} />
             </div>
             
             <h4 className="text-2xl font-heading font-bold text-white mb-8 relative z-10">El Dilema del Tráfico</h4>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                
                {/* Organic Card */}
                <div className="p-4 rounded bg-green-900/10 border border-green-500/30">
                   <div className="flex items-center gap-2 mb-3">
                      <Sprout className="text-green-400" size={20} />
                      <h5 className="font-bold text-white">Orgánico</h5>
                   </div>
                   <div className="h-24 flex items-end gap-1 mb-2 border-b border-white/10 pb-1">
                      <div className="w-1/5 bg-green-500/30 h-[10%] rounded-t"></div>
                      <div className="w-1/5 bg-green-500/40 h-[20%] rounded-t"></div>
                      <div className="w-1/5 bg-green-500/60 h-[35%] rounded-t"></div>
                      <div className="w-1/5 bg-green-500/80 h-[60%] rounded-t"></div>
                      <div className="w-1/5 bg-green-500 h-[90%] rounded-t"></div>
                   </div>
                   <p className="text-xs text-movie-silver">
                      Lento al inicio, pero <strong className="text-white">exponencial</strong> y gratuito a largo plazo. Construye marca real.
                   </p>
                </div>

                {/* Paid Card */}
                <div className="p-4 rounded bg-blue-900/10 border border-blue-500/30">
                   <div className="flex items-center gap-2 mb-3">
                      <Zap className="text-blue-400" size={20} />
                      <h5 className="font-bold text-white">Pauta (Ads)</h5>
                   </div>
                   <div className="h-24 flex items-end gap-1 mb-2 border-b border-white/10 pb-1">
                      <div className="w-1/5 bg-blue-500 h-[80%] rounded-t"></div>
                      <div className="w-1/5 bg-blue-500 h-[80%] rounded-t"></div>
                      <div className="w-1/5 bg-blue-500 h-[80%] rounded-t"></div>
                      <div className="w-1/5 bg-blue-500 h-[80%] rounded-t"></div>
                      <div className="w-1/5 border-2 border-dashed border-white/20 h-[0%] rounded-t flex items-end justify-center text-[8px] text-white/50">OFF</div>
                   </div>
                   <p className="text-xs text-movie-silver">
                      Resultados <strong className="text-white">inmediatos</strong>, pero lineales. Si dejas de pagar, desapareces.
                   </p>
                </div>

             </div>

             <div className="mt-8 p-4 bg-white/5 rounded border-l-4 border-movie-red">
                <div className="flex items-center gap-2 mb-1">
                   <TrendingUp size={16} className="text-movie-red" />
                   <h5 className="font-bold text-white text-sm">La Estrategia Híbrida</h5>
                </div>
                <p className="text-xs text-movie-silver">
                   En <strong>LA MOVIE</strong> usamos Ads para acelerar (visibilidad) y Orgánico para retener (confianza). Es la única forma de escalar sin quemar dinero.
                </p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GrowthReality;