
import React from 'react';
import { LayoutGrid, Clapperboard, ShoppingBag, Cpu, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SiteGuide: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      path: '/services',
      icon: <LayoutGrid size={32} />,
      title: "ECOSISTEMA",
      subtitle: "Servicios Integrales",
      desc: "Marketing, Web, Branding. La máquina completa.",
      color: "group-hover:text-blue-400",
      border: "group-hover:border-blue-500"
    },
    {
      path: '/portfolio',
      icon: <Clapperboard size={32} />,
      title: "SHOWCASE",
      subtitle: "Portafolio",
      desc: "Nuestros mejores casos de éxito. Resultados reales.",
      color: "group-hover:text-movie-red",
      border: "group-hover:border-movie-red"
    },
    {
      path: '/resources',
      icon: <ShoppingBag size={32} />,
      title: "MARKET",
      subtitle: "Recursos & Tienda",
      desc: "Descarga plantillas, kits y herramientas de diseño.",
      color: "group-hover:text-purple-400",
      border: "group-hover:border-purple-500"
    },
    {
      path: '/ai',
      icon: <Cpu size={32} />,
      title: "CEREBRO IA",
      subtitle: "Inteligencia Artificial",
      desc: "Automatización y agentes inteligentes para tu negocio.",
      color: "group-hover:text-green-400",
      border: "group-hover:border-green-500"
    }
  ];

  return (
    <section id="site-guide" className="py-20 bg-movie-black border-y border-white/5 relative">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
           <div>
              <h2 className="text-movie-red font-bold tracking-[0.3em] text-xs uppercase mb-3">Mapa de Navegación</h2>
              <h3 className="text-3xl md:text-4xl font-heading font-black text-white">ELIGE TU <span className="text-movie-silver">MISIÓN</span></h3>
           </div>
           <p className="text-movie-text text-sm max-w-md text-right md:text-left">
              Diseñamos esta experiencia para que encuentres exactamente lo que necesitas para escalar.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {sections.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(item.path)}
                className={`group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${item.border}`}
              >
                 {/* Hover Glow */}
                 <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

                 <div className={`mb-4 text-movie-silver transition-colors duration-300 ${item.color}`}>
                    {item.icon}
                 </div>
                 
                 <div className="mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-movie-silver group-hover:text-white transition-colors">{item.subtitle}</p>
                    <h4 className="text-xl font-heading font-black text-white">{item.title}</h4>
                 </div>
                 
                 <p className="text-xs text-white/60 leading-relaxed mb-4 group-hover:text-white/80">
                    {item.desc}
                 </p>

                 <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity ${item.color}`}>
                    Explorar <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                 </div>
              </div>
           ))}
        </div>

      </div>
    </section>
  );
};

export default SiteGuide;
