
import React, { useState, useEffect } from 'react';
import { Check, Crown, Film, Globe, Monitor, ShoppingBag, LayoutTemplate, Zap, Star } from 'lucide-react';
import { adminService } from '../lib/adminService';

const iconMap: { [key: string]: React.ReactNode } = {
  Film: <Film size={28} />,
  Crown: <Crown size={32} />,
  Star: <Star size={28} />,
  Monitor: <Monitor size={32} />,
  Globe: <Globe size={28} />,
  ShoppingBag: <ShoppingBag size={28} />,
  LayoutTemplate: <LayoutTemplate size={28} />,
};

interface PricingProps {
  whatsappNumber?: string;
}

const Pricing: React.FC<PricingProps> = ({ whatsappNumber = '573017355046' }) => {
  const [activeTab, setActiveTab] = useState<'social' | 'web' | 'estrategia'>('social');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await adminService.getPricing();
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch pricing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#pricing-web') setActiveTab('web');
      else if (hash === '#pricing-social') setActiveTab('social');
      else if (hash === '#pricing-estrategia') setActiveTab('estrategia');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const currentPlans = plans.filter(p => p.category === activeTab);

  if (loading) return null;

  return (
    <section id="pricing" className="py-24 bg-movie-black relative overflow-hidden">
      {/* Subtle Background Video */}
      <div className="absolute inset-0 opacity-[0.05] z-0 mix-blend-screen pointer-events-none">
         <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4" type="video/mp4" />
         </video>
      </div>
      {/* Neural Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-movie-black via-transparent to-movie-black z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-movie-red font-bold tracking-[0.3em] text-sm uppercase mb-4 flex items-center justify-center gap-2">
            <Zap size={16} /> Inversión Inteligente
          </h2>
          <h3 className="text-4xl md:text-6xl font-heading font-black mb-6 text-white">
            NUESTROS <span className="text-movie-red">PAQUETES</span>
          </h3>
          <p className="text-movie-text max-w-2xl mx-auto text-lg">
             Soluciones por nicho, sector y objetivo. Escoge el ecosistema que encaje con la fase de tu negocio.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16 overflow-x-auto px-4 pb-4">
          <div className="bg-black border border-white/10 p-1.5 rounded-full flex relative shadow-2xl min-w-max">
             <div className={`absolute top-1.5 bottom-1.5 w-[calc(33.33%-4px)] bg-movie-red rounded-full transition-all duration-300 ${activeTab === 'social' ? 'left-1.5' : activeTab === 'estrategia' ? 'left-1/2 -translate-x-1/2 w-[calc(33.33%-1px)]' : 'left-[calc(66.66%+1.5px)]'}`}></div>
             
             <button 
               onClick={() => setActiveTab('social')}
               className={`px-8 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 z-10 w-40 text-center ${activeTab === 'social' ? 'text-white' : 'text-movie-silver hover:text-white'}`}
             >
               Social Media
             </button>
             <button 
               onClick={() => setActiveTab('estrategia')}
               className={`px-8 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 z-10 w-40 text-center ${activeTab === 'estrategia' ? 'text-white' : 'text-movie-silver hover:text-white'}`}
             >
               Tráfico & Performance
             </button>
             <button 
               onClick={() => setActiveTab('web')}
               className={`px-8 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 z-10 w-40 text-center ${activeTab === 'web' ? 'text-white' : 'text-movie-silver hover:text-white'}`}
             >
               Desarrollo Web
             </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {currentPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col h-full bg-movie-dark rounded-2xl border transition-all duration-500 group ${plan.color} ${plan.recommended ? 'scale-105 z-10 bg-movie-dark shadow-2xl' : 'hover:border-white/40 hover:-translate-y-1'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-movie-red text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <Crown size={12} /> Mejor Retorno (ROI)
                </div>
              )}

              <div className="p-8 flex-1">
                <div className={`mb-6 p-4 rounded-xl inline-block ${plan.recommended ? 'bg-movie-red/10 text-movie-red' : 'bg-white/5 text-white'}`}>
                  {iconMap[plan.icon] || <Zap size={28} />}
                </div>
                
                <h4 className="text-2xl font-heading font-black text-white mb-2 uppercase italic">{plan.name}</h4>
                {/* Highlighted Multi-Solution Description */}
                <p className="text-sm text-movie-silver mb-8 min-h-[50px] leading-relaxed border-l-2 border-white/10 pl-3">
                    {plan.description}
                </p>
                
                <div className="mb-8 p-4 bg-black/40 rounded-lg border border-white/5 text-center">
                  <div className="flex items-center justify-center gap-1">
                     <span className="text-sm text-movie-silver font-bold">$</span>
                     <span className="text-4xl font-heading font-black text-white tracking-tighter">{plan.price}</span>
                  </div>
                  <span className="text-[10px] text-movie-silver uppercase font-bold tracking-widest">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-movie-silver group-hover:text-white transition-colors">
                      <div className={`mt-0.5 p-0.5 rounded-full ${plan.recommended ? 'bg-movie-red text-white' : 'bg-white/10 text-white/50'}`}>
                         <Check size={10} />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=Hola,%20me%20interesa%20iniciar%20con%20el%20plan%20${plan.name}%20(${activeTab === 'social' ? 'Redes' : activeTab === 'estrategia' ? 'Tráfico/Performance' : 'Web'})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-lg font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                    plan.recommended 
                      ? 'bg-movie-red text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(176,35,46,0.4)]' 
                      : 'bg-white/5 text-white hover:bg-white hover:text-black border border-white/10'
                  }`}
                >
                  {activeTab === 'social' ? 'ACTIVAR SISTEMA' : activeTab === 'estrategia' ? 'ESCALAR VENTAS' : 'INICIAR IMPERIO'}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Seal */}
        <div className="mt-16 text-center">
            <p className="text-xs text-movie-silver uppercase tracking-widest flex items-center justify-center gap-2 opacity-60">
                <Check size={14} /> Soluciones integrales • Sin proveedores múltiples
            </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
