
import React, { useState } from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, Smartphone, CheckCircle2, XCircle, Target, Zap } from 'lucide-react';

type TabType = 'tips' | 'networks' | 'mistakes' | 'facts';

const Blog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tips');

  const renderContent = () => {
    switch (activeTab) {
      case 'tips':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
            <div className="bg-movie-dark p-8 rounded border-l-4 border-movie-red hover:translate-x-2 transition-transform duration-300">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Lightbulb className="text-yellow-400" /> No sigas tendencias a ciegas</h4>
              <p className="text-movie-text">Hacer el "baile de moda" puede darte views, pero ¿esas views te compran? Las tendencias te dan alcance, pero el <strong>contenido educativo y de valor</strong> te da clientes. No sacrifiques autoridad por viralidad vacía.</p>
            </div>
            <div className="bg-movie-dark p-8 rounded border-l-4 border-movie-red hover:translate-x-2 transition-transform duration-300">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Target className="text-blue-400" /> Visibilidad vs. Ventas</h4>
              <p className="text-movie-text">Tener 10k seguidores no sirve si ninguno pregunta por tu precio. Es mejor tener 500 seguidores fieles que interactúan y compran, que 100k espectadores mudos. Enfócate en la conversión.</p>
            </div>
            <div className="bg-movie-dark p-8 rounded border-l-4 border-movie-red hover:translate-x-2 transition-transform duration-300">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Smartphone className="text-purple-400" /> El Gancho de 3 Segundos</h4>
              <p className="text-movie-text">El algoritmo de Reels y TikTok prioriza la "Retención". Si no atrapas en los primeros 3 segundos (con una pregunta, un problema o un movimiento rápido), el usuario hace scroll y el algoritmo te penaliza.</p>
            </div>
            <div className="bg-movie-dark p-8 rounded border-l-4 border-movie-red hover:translate-x-2 transition-transform duration-300">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="text-movie-red" /> El poder del Audio</h4>
              <p className="text-movie-text">La gente tolera una imagen un poco oscura, pero odia el mal audio. En video marketing, el 60% de la experiencia es sonora. Usa micrófonos o audios en tendencia con volumen bajo.</p>
            </div>
          </div>
        );
      case 'networks':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 rounded border border-white/10 flex flex-col md:flex-row gap-6 items-center">
               <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center shrink-0">
                 <Smartphone size={32} className="text-white" />
               </div>
               <div>
                 <h4 className="text-2xl font-bold text-white mb-2">Instagram: Tu Vitrina Estética</h4>
                 <p className="text-movie-text text-sm">Aquí se vende "aspiración" y "estilo de vida". El feed debe ser impecable. Funciona increíble para moda, comida, y servicios visuales. <strong className="text-white">Clave:</strong> Stories diarias para fidelizar.</p>
               </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900/40 to-black p-6 rounded border border-white/10 flex flex-col md:flex-row gap-6 items-center">
               <div className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0">
                 <span className="text-2xl font-black text-white tracking-tighter">Tk</span>
               </div>
               <div>
                 <h4 className="text-2xl font-bold text-white mb-2">TikTok: Lo Real y Crudo</h4>
                 <p className="text-movie-text text-sm">Aquí gana lo auténtico. No necesitas producción de cine, necesitas personalidad. El algoritmo es de "descubrimiento", puedes viralizarte con 0 seguidores. <strong className="text-white">Clave:</strong> Cantidad y espontaneidad.</p>
               </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-blue-900/10 p-6 rounded border border-white/10 flex flex-col md:flex-row gap-6 items-center">
               <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                 <span className="text-2xl font-bold text-white">in</span>
               </div>
               <div>
                 <h4 className="text-2xl font-bold text-white mb-2">LinkedIn: B2B y Autoridad</h4>
                 <p className="text-movie-text text-sm">Olvídate de bailar. Aquí vendes conocimiento y resultados. Ideal para empresas que le venden a empresas. <strong className="text-white">Clave:</strong> Textos largos (copywriting) y casos de éxito.</p>
               </div>
            </div>
          </div>
        );
      case 'mistakes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
             <div className="bg-movie-dark p-6 rounded relative overflow-hidden group hover:bg-red-900/10 transition-colors border border-white/5">
                <XCircle className="text-movie-red mb-4 w-12 h-12" />
                <h4 className="font-bold text-white text-lg mb-2">Vender en cada post</h4>
                <p className="text-sm text-movie-silver">Nadie entra a redes a ver comerciales. Aplica la regla 80/20: 80% valor/entretenimiento, 20% venta directa. Si solo vendes, te dejan de seguir.</p>
             </div>
             <div className="bg-movie-dark p-6 rounded relative overflow-hidden group hover:bg-red-900/10 transition-colors border border-white/5">
                <XCircle className="text-movie-red mb-4 w-12 h-12" />
                <h4 className="font-bold text-white text-lg mb-2">Ser inconsistente</h4>
                <p className="text-sm text-movie-silver">Publicar 5 veces hoy y desaparecer 2 semanas mata tu alcance. El algoritmo premia la constancia. Mejor 3 posts semanales fijos que ráfagas aleatorias.</p>
             </div>
             <div className="bg-movie-dark p-6 rounded relative overflow-hidden group hover:bg-red-900/10 transition-colors border border-white/5">
                <XCircle className="text-movie-red mb-4 w-12 h-12" />
                <h4 className="font-bold text-white text-lg mb-2">Ignorar los comentarios</h4>
                <p className="text-sm text-movie-silver">Las redes son "sociales". Si no respondes, el algoritmo asume que tu contenido no genera conversación y deja de mostrarlo.</p>
             </div>
          </div>
        );
      case 'facts':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up text-center">
             <div className="p-6 border border-white/10 rounded bg-movie-dark group hover:border-movie-red transition-colors">
                <h3 className="text-4xl font-black text-movie-red mb-2 group-hover:scale-110 transition-transform">82%</h3>
                <p className="text-xs uppercase tracking-wider text-white">Del tráfico global es Video</p>
             </div>
             <div className="p-6 border border-white/10 rounded bg-movie-dark group hover:border-movie-red transition-colors">
                <h3 className="text-4xl font-black text-movie-red mb-2 group-hover:scale-110 transition-transform">13x</h3>
                <p className="text-xs uppercase tracking-wider text-white">Más ROI en Video Vertical</p>
             </div>
             <div className="p-6 border border-white/10 rounded bg-movie-dark group hover:border-movie-red transition-colors">
                <h3 className="text-4xl font-black text-movie-red mb-2 group-hover:scale-110 transition-transform">7/10</h3>
                <p className="text-xs uppercase tracking-wider text-white">Compran tras ver marca en redes</p>
             </div>
             <div className="p-6 border border-white/10 rounded bg-movie-dark group hover:border-movie-red transition-colors">
                <h3 className="text-4xl font-black text-movie-red mb-2 group-hover:scale-110 transition-transform">3s</h3>
                <p className="text-xs uppercase tracking-wider text-white">Tu tiempo para impactar</p>
             </div>
          </div>
        );
    }
  };

  return (
    <section id="blog" className="py-24 bg-movie-black border-t border-white/5 relative">
       {/* Floating Elements */}
       <div className="absolute top-10 left-10 w-20 h-20 border border-movie-red/20 rounded-full animate-ping hidden md:block"></div>
       <div className="absolute bottom-10 right-10 w-4 h-4 bg-movie-red rounded-full animate-bounce hidden md:block"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-movie-red/30 bg-movie-red/10 text-movie-red text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
             <Zap size={12} className="fill-movie-red" /> Knowledge Base 2.0
           </div>
           <h2 className="text-movie-red font-bold tracking-widest text-sm uppercase mb-4">Academia La Movie</h2>
           <h3 className="text-5xl md:text-7xl font-heading font-black mb-8 tracking-tighter uppercase italic">
             DOMINA EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-movie-red to-red-500">JUEGO DIGITAL</span>
           </h3>
           <p className="text-movie-silver text-lg max-w-2xl mx-auto font-light">
             El marketing cambia todos los días. Aquí te soltamos los "factos" y estrategias de alto impacto para que tu marca no solo participe, sino que lidere.
           </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-white/10 pb-4">
           {[
             { id: 'tips', label: 'Estrategia Real', icon: <Lightbulb size={18} /> },
             { id: 'networks', label: 'Guerra de Redes', icon: <Smartphone size={18} /> },
             { id: 'mistakes', label: 'Errores Comunes', icon: <AlertTriangle size={18} /> },
             { id: 'facts', label: 'Datos Duros', icon: <TrendingUp size={18} /> },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as TabType)}
               className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                 activeTab === tab.id 
                 ? 'bg-movie-red text-white shadow-[0_0_20px_rgba(176,35,46,0.4)] scale-105' 
                 : 'bg-transparent text-movie-silver hover:bg-white/5 hover:text-white'
               }`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="max-w-5xl mx-auto min-h-[300px]">
           {renderContent()}
        </div>
        
        <div className="text-center mt-12">
           <a 
              href="https://www.instagram.com/ads_yosii/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-movie-red border-b border-movie-red hover:text-white hover:border-white transition-colors pb-1 font-bold uppercase text-xs tracking-widest"
           >
              Síguenos para más tips diarios en Instagram <Zap size={14} />
           </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
