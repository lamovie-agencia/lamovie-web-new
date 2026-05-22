
import React from 'react';
import { Camera, Radio, Mic2, Plane, Aperture, Users, Calendar, Zap, Play, ArrowRight, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { ASSETS } from '../data/assets';

const EventCoverage: React.FC = () => {
  return (
    <div className="animate-reveal">
      
      {/* 1. HERO SECTION: CINEMATIC VIDEO BACKGROUND */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-movie-black">
         <div className="absolute inset-0 z-0">
             <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
                <source src={ASSETS.events.heroVideo} type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-t from-movie-black via-transparent to-black/60"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10 text-center">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="inline-flex items-center gap-2 px-6 py-2 bg-movie-red/20 border border-movie-red/50 rounded-full mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(176,35,46,0.3)] animate-pulse-slow"
             >
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                 <span className="text-white text-xs font-bold uppercase tracking-widest">Live Production & Cinema</span>
             </motion.div>
             
             <motion.h1 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="text-6xl md:text-8xl font-heading font-black text-white mb-6 leading-[0.9] tracking-tighter"
             >
                COBERTURA <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-movie-red to-orange-600">INMORTAL</span>
             </motion.h1>
             
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1, delay: 0.4 }}
               className="text-xl md:text-2xl text-movie-silver max-w-3xl mx-auto mb-10 font-light leading-relaxed"
             >
                No recordamos días, recordamos momentos. <br/>
                Capturamos la euforia de tu evento con <strong className="text-white">Drones FPV, Streaming Multi-Cámara y Cine 4K.</strong>
             </motion.p>

             <motion.a 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                href="https://wa.me/573017355046?text=Hola%20LA%20MOVIE,%20quisiera%20verificar%20la%20disponibilidad%20de%20fecha%20para%20la%20cobertura%20cinematográfica%20de%20mi%20boda." 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-4 px-10 py-5 bg-movie-red hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-sm transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(176,35,46,0.5)] skew-x-[-10deg]"
             >
                <span className="skew-x-[10deg] flex items-center gap-2">Verificar Disponibilidad de Fecha 📅 <ArrowRight size={18} /></span>
             </motion.a>
         </div>
         
         {/* Scroll Indicator */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowRight size={24} className="text-white rotate-90" />
         </div>
      </section>

      {/* 2. SERVICES BREAKDOWN: HIGH TECH GEAR */}
      <section className="py-24 bg-movie-black border-y border-white/5 relative">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               
               {/* Service 1: Drone */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0 }}
                 className="bg-movie-dark p-8 rounded-2xl border border-white/5 group hover:border-movie-red/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(176,35,46,0.15)]"
               >
                  <div className="w-14 h-14 bg-movie-black rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                     <Plane size={28} className="text-white group-hover:text-movie-red" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase italic">Drone Unit</h3>
                  <p className="text-movie-silver text-sm mb-4">Tomas aéreas espectaculares. Pilotos certificados FPV para tomas de acción y drones de cine para planos estáticos.</p>
                  <ul className="text-xs text-white/60 space-y-1">
                     <li className="flex items-center gap-2"><Zap size={10} className="text-movie-red"/> Resolución 4K/60fps</li>
                     <li className="flex items-center gap-2"><Zap size={10} className="text-movie-red"/> Vuelos en Interiores</li>
                  </ul>
               </motion.div>

               {/* Service 2: Streaming */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="bg-movie-dark p-8 rounded-2xl border border-white/5 group hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
               >
                  <div className="w-14 h-14 bg-movie-black rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                     <Radio size={28} className="text-white group-hover:text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase italic">Live Streaming</h3>
                  <p className="text-movie-silver text-sm mb-4">Trasmisión en vivo profesional multi-cámara. Lleva tu evento a YouTube, Facebook o Web Privada en tiempo real.</p>
                  <ul className="text-xs text-white/60 space-y-1">
                     <li className="flex items-center gap-2"><Zap size={10} className="text-blue-500"/> Switcher de Video (Vmix)</li>
                     <li className="flex items-center gap-2"><Zap size={10} className="text-blue-500"/> Gráficos en Pantalla</li>
                  </ul>
               </motion.div>

               {/* Service 3: Cinema */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="bg-movie-dark p-8 rounded-2xl border border-white/5 group hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]"
               >
                  <div className="w-14 h-14 bg-movie-black rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                     <Video size={28} className="text-white group-hover:text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase italic">Cinema 4K</h3>
                  <p className="text-movie-silver text-sm mb-4">Cámaras de cine Sony FX3/A7SIII. Estabilizadores electrónicos y óptica prime para un look de película.</p>
                  <ul className="text-xs text-white/60 space-y-1">
                     <li className="flex items-center gap-2"><Zap size={10} className="text-yellow-500"/> Color Grading Profesional</li>
                     <li className="flex items-center gap-2"><Zap size={10} className="text-yellow-500"/> Slow Motion 120fps</li>
                  </ul>
               </motion.div>

               {/* Service 4: Audio */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
                 className="bg-movie-dark p-8 rounded-2xl border border-white/5 group hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
               >
                  <div className="w-14 h-14 bg-movie-black rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                     <Mic2 size={28} className="text-white group-hover:text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase italic">Audio Pro</h3>
                  <p className="text-movie-silver text-sm mb-4">El sonido es el 50% del video. Grabación de audio externa, micrófonos inalámbricos y captura de consola.</p>
                  <ul className="text-xs text-white/60 space-y-1">
                     <li className="flex items-center gap-2"><Zap size={10} className="text-purple-500"/> Audio Limpio y Cristalino</li>
                     <li className="flex items-center gap-2"><Zap size={10} className="text-purple-500"/> Entrevistas en Sitio</li>
                  </ul>
               </motion.div>

            </div>
         </div>
      </section>

      {/* 3. EVENT TYPES: SPLIT SECTION */}
      <section className="bg-black relative">
          
          {/* Section 1: SOCIAL (Weddings, XV) */}
          <div className="flex flex-col lg:flex-row h-auto lg:h-[600px]">
             <div className="w-full lg:w-1/2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                <img src={ASSETS.events.weddingImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Wedding Coverage" />
                <div className="absolute bottom-0 left-0 p-10 z-20">
                    <h3 className="text-5xl font-heading font-black text-white mb-2 tracking-tighter">SOCIALES</h3>
                    <p className="text-xl text-white/90 mb-6 font-light italic">Bodas • XV Años • Fiestas Privadas</p>
                    <p className="text-sm text-movie-silver max-w-md mb-8">
                       Capturamos la emoción, las lágrimas y la fiesta. Creamos un Aftermovie que querrás ver mil veces. Entregas express para redes sociales al día siguiente.
                    </p>
                    <button onClick={() => window.open('https://wa.me/573017355046?text=Hola%20LA%20MOVIE,%20quisiera%20verificar%20la%20disponibilidad%20de%20fecha%20para%20la%20cobertura%20cinematográfica%20de%20mi%20boda.', '_blank')} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-movie-red hover:text-white transition-all flex items-center justify-center gap-2">
                        Verificar Disponibilidad de Fecha 📅
                    </button>
                </div>
             </div>
             
             {/* Section 2: CORPORATE (Launches, Congress) */}
             <div className="w-full lg:w-1/2 relative overflow-hidden group border-t lg:border-t-0 lg:border-l border-white/10">
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-700 z-10"></div>
                <img src={ASSETS.events.corporateImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Corporate Event" />
                <div className="absolute bottom-0 left-0 p-10 z-20">
                    <h3 className="text-5xl font-heading font-black text-white mb-2 tracking-tighter">CORPORATIVO</h3>
                    <p className="text-xl text-white/90 mb-6 font-light italic">Lanzamientos • Congresos • Activaciones</p>
                    <p className="text-sm text-movie-silver max-w-md mb-8">
                       Cobertura que proyecta autoridad. Streaming en vivo para audiencias remotas, fotografía de prensa y videos resumen para PR y marketing.
                    </p>
                    <button onClick={() => window.open('https://wa.me/573017355046?text=Quiero%20cotizar%20un%20Evento%20Corporativo', '_blank')} className="px-8 py-3 bg-movie-red text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                       COTIZAR EMPRESARIAL
                    </button>
                </div>
             </div>
          </div>
      </section>

      {/* 4. TECH SPECS BAR */}
      <section className="py-12 bg-movie-dark border-t border-white/10">
         <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 hover:opacity-100 transition-opacity duration-500">
               <span className="text-white font-bold uppercase tracking-widest flex items-center gap-2"><Aperture/> Sony Cinema Line</span>
               <span className="text-white font-bold uppercase tracking-widest flex items-center gap-2"><Plane/> DJI Enterprise</span>
               <span className="text-white font-bold uppercase tracking-widest flex items-center gap-2"><Mic2/> Rode Wireless</span>
               <span className="text-white font-bold uppercase tracking-widest flex items-center gap-2"><Radio/> Blackmagic Design</span>
            </div>
         </div>
      </section>

    </div>
  );
};

export default EventCoverage;
