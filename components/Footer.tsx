
import React from 'react';
import { Instagram, Facebook, Globe, Video, ExternalLink, ArrowRight, Send, Mail, MessageCircle, Star, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavAndScroll = (path: string, elementId?: string) => {
    if (elementId) {
        navigate(path, { state: { scrollTo: elementId } });
    } else {
        navigate(path);
    }
  };

  return (
    <footer className="bg-black text-white relative overflow-hidden pt-20 border-t border-white/10">
      
      {/* Massive Background Typography */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-5 leading-none">
        <h1 className="text-[25vw] font-heading font-black text-center text-white whitespace-nowrap -mb-[5vw]">LA MOVIE</h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Top Section: CTA & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 border-b border-white/10 pb-20">
            <div>
                <h2 className="text-5xl md:text-7xl font-heading font-black mb-6 uppercase tracking-tighter">
                    ¿Creamos algo <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-movie-red to-purple-600">Legendario?</span>
                </h2>
                <a 
                    href="https://wa.me/573017355046" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-4 text-xl font-bold uppercase tracking-widest border-b-2 border-movie-red pb-1 hover:text-movie-red transition-colors"
                >
                    HACER HISTORIA JUNTOS <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </a>
            </div>

            <div className="bg-movie-dark/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                    <Mail className="text-movie-silver" />
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Insider Newsletter</h4>
                </div>
                <p className="text-movie-text text-sm mb-6">Recibe tips de marketing, recursos gratis y tendencias antes que tu competencia.</p>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="tu@email.com" 
                        className="flex-1 bg-black border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-movie-red focus:outline-none transition-colors"
                    />
                    <button type="submit" className="bg-white text-black px-6 py-3 rounded font-bold uppercase hover:bg-movie-red hover:text-white transition-colors">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>

        {/* Middle Section: Links & Credits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm mb-20">
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-50">Estudio</h4>
            <ul className="space-y-3 text-movie-silver">
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors text-left">Servicios</button></li>
                <li><button onClick={() => navigate('/portfolio')} className="hover:text-white transition-colors text-left">Portafolio</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors text-left">Nosotros</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors text-left">Contacto</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-50">Market</h4>
            <ul className="space-y-3 text-movie-silver">
                <li><button onClick={() => handleNavAndScroll('/resources', 'templates')} className="hover:text-purple-400 transition-colors text-left">Plantillas</button></li>
                <li><button onClick={() => handleNavAndScroll('/resources', 'print-studio')} className="hover:text-cyan-400 transition-colors text-left">Print Studio</button></li>
                <li><button onClick={() => handleNavAndScroll('/resources', 'print-studio')} className="hover:text-yellow-400 transition-colors text-left">Gran Formato & Estampados</button></li>
                <li><button onClick={() => handleNavAndScroll('/resources', 'pack')} className="hover:text-green-400 transition-colors text-left">Cotizador</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-50">Legal</h4>
            <ul className="space-y-3 text-movie-silver">
                <li><button onClick={() => navigate('/policies')} className="hover:text-white transition-colors text-left">Términos</button></li>
                <li><button onClick={() => navigate('/policies')} className="hover:text-white transition-colors text-left">Privacidad</button></li>
                <li><button onClick={() => navigate('/policies')} className="hover:text-white transition-colors text-left">Métodos de Pago</button></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-50">Connect</h4>
             <div className="flex gap-4 mb-8">
                 <a 
                    href="https://www.instagram.com/ads_yosii/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-movie-red hover:text-white transition-all"
                 >
                     <Instagram size={18} />
                 </a>
                 <a 
                    href="https://wa.me/573017355046" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"
                 >
                     <MessageCircle size={18} />
                 </a>
                 <a 
                    href="mailto:agencialamovie@gmail.com" 
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                 >
                     <Mail size={18} />
                 </a>
             </div>

             {/* Quality Seals in Footer */}
             <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group hover:border-yellow-500/50 transition-colors">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group hover:border-green-500/50 transition-colors">
                  <ShieldCheck size={12} className="text-green-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Secure Service</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group hover:border-movie-red/50 transition-colors">
                  <Globe size={12} className="text-movie-red" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Global Impact</span>
                </div>
             </div>
          </div>

        </div>

        {/* End Credits Block */}
        <div className="border-t border-white/10 pt-12 pb-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-movie-silver font-mono">
           <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center md:text-left">
              <div>
                 <span className="block opacity-30 mb-1">Director</span>
                 Yosimar Zuñiga
              </div>
              <div>
                 <span className="block opacity-30 mb-1">Production</span>
                 La Movie Agency
              </div>
              <div>
                 <span className="block opacity-30 mb-1">Location</span>
                 Cartagena, CO
              </div>
           </div>
           
           <div className="opacity-30 flex items-center gap-4">
              <button onClick={() => navigate('/admin/dashboard')} className="hover:text-movie-red transition-colors">Admin Portal</button>
              <span>© {new Date().getFullYear()} All Rights Reserved</span>
           </div>
        </div>

      </div>
      
      {/* Decorative Bottom Line */}
      <div className="w-full h-1 bg-gradient-to-r from-black via-movie-red to-black"></div>
    </footer>
  );
};

export default Footer;
