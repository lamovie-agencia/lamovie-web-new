
import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, X, Globe, MousePointer2, ChevronRight, Maximize2 } from 'lucide-react';
import { ASSETS } from '../data/assets'; // IMPORT ASSETS

/**
 * WEB SHOWCASE COMPONENT
 * Displays interactive demos of websites created by the agency.
 * Features: Desktop/Mobile View toggle, Interactive Scroll Simulation.
 * 
 * HOW TO ADD NEW PROJECTS:
 * 1. Go to `src/data/assets.ts`
 * 2. Add a new object to the `webProjects` array.
 * 3. Provide a high-res screenshot for desktop (wide) and mobile (tall).
 */

const WebShowcase: React.FC = () => {
  const [projects, setProjects] = useState<any[]>(ASSETS.webProjects);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const fetchWebShowcase = async () => {
      try {
        const res = await fetch('/api/web-showcase');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            const dbProjects = data.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description || 'Proyecto web de alto impacto.',
              desktopImg: item.image_url || 'https://picsum.photos/seed/web/1200/800',
              mobileImg: item.image_url || 'https://picsum.photos/seed/web-mob/400/800',
              url: item.live_url ? item.live_url.replace('https://', '').replace('http://', '') : 'lamovie.com',
              category: item.category || 'E-commerce',
              color: 'bg-blue-600'
            }));
            setProjects([...dbProjects, ...ASSETS.webProjects]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch web showcase");
      }
    };
    fetchWebShowcase();
  }, []);

  return (
    <section id="web-showcase" className="py-24 bg-movie-dark border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
           <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-full mb-4">
                 <Monitor size={16} className="text-blue-400" />
                 <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Web Development</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-heading font-black text-white">
                 NO HACEMOS PÁGINAS. <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">CONSTRUIMOS ACTIVOS.</span>
              </h2>
           </div>
           <p className="text-movie-silver max-w-md text-right">
              Interactúa con nuestros desarrollos reales. Velocidad, estética y conversión en cada pixel.
           </p>
        </div>

        {/* --- PROJECTS GRID (Pulled from assets.ts) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {projects.map((project) => (
              <div 
                 key={project.id} 
                 className="group relative bg-movie-black border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col"
              >
                 {/* Browser Header Visual */}
                 <div className="bg-[#1a1a1a] p-3 flex items-center gap-2 border-b border-white/5">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 bg-black/50 rounded px-3 py-1 text-[10px] text-white/30 font-mono text-center truncate">
                       https://{project.url}
                    </div>
                 </div>

                 {/* Preview Window (Scrollable on hover effect) */}
                 <div className="relative h-[250px] overflow-hidden group-hover:h-[240px] transition-all">
                    <img 
                       src={project.desktopImg} 
                       alt={project.title} 
                       className="w-full h-auto object-cover object-top transition-transform duration-[4s] ease-linear group-hover:-translate-y-[20%]"
                    />
                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <button 
                          onClick={() => setSelectedProject(project)}
                          className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-colors transform scale-90 group-hover:scale-100"
                       >
                          <Maximize2 size={14} /> EXPERIMENTAR EL DISEÑO
                       </button>
                    </div>
                 </div>

                 {/* Footer Info */}
                 <div className="p-6 bg-movie-black relative z-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold text-white">{project.title}</h3>
                       <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded text-white ${project.color}`}>
                          {project.category}
                       </span>
                    </div>
                    <p className="text-sm text-movie-silver mb-4 leading-relaxed">
                       {project.description}
                    </p>
                    <button 
                       onClick={() => setSelectedProject(project)}
                       className="mt-auto w-full py-3 border border-white/10 hover:border-blue-500/50 hover:bg-blue-900/10 text-white/70 hover:text-white transition-all rounded text-xs font-bold uppercase flex items-center justify-center gap-2"
                    >
                       SENTIR LA VELOCIDAD <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
           ))}
        </div>

      </div>

      {/* --- LIVE DEMO MODAL (The Simulator) --- */}
      {selectedProject && (
         <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in">
            
            {/* 1. Modal Header / Toolbar */}
            <div className="h-16 bg-[#111] border-b border-white/10 flex items-center justify-between px-6 shadow-xl relative z-50">
               <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                     <span className="text-white font-bold text-sm">{selectedProject.title}</span>
                     <span className="text-green-400 text-xs flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div> En Vivo
                     </span>
                  </div>
                  
                  {/* Device Switcher (Desktop vs Mobile) */}
                  <div className="hidden md:flex bg-black p-1 rounded-lg border border-white/10">
                     <button 
                        onClick={() => setViewMode('desktop')}
                        className={`p-2 rounded transition-colors ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                        title="Vista Escritorio"
                     >
                        <Monitor size={18} />
                     </button>
                     <button 
                        onClick={() => setViewMode('mobile')}
                        className={`p-2 rounded transition-colors ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                        title="Vista Móvil"
                     >
                        <Smartphone size={18} />
                     </button>
                  </div>
               </div>

               {/* Fake URL Bar */}
               <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8 bg-black/50 border border-white/5 rounded-full px-4 py-2 text-xs text-movie-silver font-mono">
                  <Globe size={12} className="mr-2 text-blue-400" />
                  https://{selectedProject.url}
               </div>

               <div className="flex items-center gap-4">
                  <a 
                     href={`https://wa.me/573017355046?text=Hola,%20me%20gustó%20el%20ejemplo%20de%20${selectedProject.title},%20quiero%20algo%20así.`} 
                     target="_blank"
                     rel="noreferrer noopener" 
                     className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs rounded transition-colors"
                  >
                     QUIERO UNA WEB ASÍ
                  </a>
                  <button 
                     onClick={() => setSelectedProject(null)}
                     className="p-2 text-white/50 hover:text-red-500 transition-colors"
                  >
                     <X size={24} />
                  </button>
               </div>
            </div>

            {/* 2. Modal Body / Viewport Simulation */}
            <div className="flex-1 bg-neutral-900 overflow-hidden relative flex justify-center items-start pt-8 pb-8">
               
               {/* Simulation Container (Resizes based on viewMode) */}
               <div 
                  className={`relative transition-all duration-500 ease-in-out bg-white shadow-2xl overflow-hidden ${
                     viewMode === 'desktop' 
                     ? 'w-[95%] h-[90%] rounded-lg border border-white/10' 
                     : 'w-[375px] h-[95%] rounded-[3rem] border-[8px] border-black shadow-[0_0_0_2px_#333]'
                  }`}
               >
                  {/* iPhone Notch for Mobile View */}
                  {viewMode === 'mobile' && (
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-50"></div>
                  )}

                  {/* Scrollable Content Area */}
                  <div className="w-full h-full overflow-y-auto scrollbar-hide bg-white relative">
                     {/* 
                        NOTE: We use a Full Page Screenshot (img) to simulate the website.
                        This prevents iframe blocking issues (X-Frame-Options) and is faster.
                     */}
                     <img 
                        src={viewMode === 'desktop' ? selectedProject.desktopImg : selectedProject.mobileImg} 
                        alt="Website Content"
                        className="w-full h-auto" 
                     />
                     
                     {/* Helper Tooltip */}
                     <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none">
                        <div className="bg-black/80 text-white px-4 py-2 rounded-full text-xs animate-bounce flex items-center gap-2 backdrop-blur">
                           <MousePointer2 size={12} /> Haz scroll para navegar
                        </div>
                     </div>
                  </div>

                  {/* Reflection/Glare for mobile realism */}
                  {viewMode === 'mobile' && (
                     <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                  )}
               </div>

            </div>

         </div>
      )}

    </section>
  );
};

export default WebShowcase;
