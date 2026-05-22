import React from 'react';
import { Film, Zap, Target, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ASSETS } from '../data/assets';

const About: React.FC = () => {
  return (
    <section id="about" className="bg-movie-black relative py-24 overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B0232E]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Cinematic Camera Viewport Image Frame */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            {/* Camera Overlay Details for maximum cinematic feeling */}
            <div className="absolute inset-0 border border-white/10 p-2 pointer-events-none z-20 rounded-lg">
              <div className="w-full h-full border border-white/5 relative">
                {/* Viewport crop marks */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/30"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/30"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-white/30"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/30"></div>
                
                {/* Recording indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono tracking-widest text-white/80">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  <span>RAW 4K 24FPS</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono tracking-widest text-white/60">
                  <span>STBY</span>
                </div>
              </div>
            </div>

            {/* Main Image with cinematic treatment */}
            <div className="aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[4/5] rounded-lg overflow-hidden bg-neutral-900 border border-white/10 relative group">
              <img 
                src={ASSETS.about.teamImage}
                onError={(e) => e.currentTarget.src = ASSETS.about.fallbackTeamImage}
                alt="LA MOVIE Creative & High-Performance Team" 
                className="w-full h-full object-cover scale-[1.03] grayscale group-hover:grayscale-0 group-hover:scale-100 transition-all duration-1000 ease-out"
                loading="lazy"
              />
              {/* Dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40 pointer-events-none"></div>
            </div>

            {/* Minimal Decorative Shadow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-movie-red/20 to-transparent blur-xl -z-10 opacity-30 rounded-lg"></div>
          </motion.div>

          {/* Right: Razor-sharp Direct Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#B0232E]/10 border border-[#B0232E]/20 text-[#B0232E] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 max-w-fit"
            >
              <span>NOSOTROS // NUESTRO MANIFIESTO</span>
            </motion.div>

            <motion.h3 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white italic uppercase tracking-tighter leading-none mb-6"
            >
              CINE. ESTRATEGIA. <br />
              <span className="text-[#B0232E]">ALTO RENDIMIENTO.</span>
            </motion.h3>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#CCCCCC] text-base md:text-lg leading-relaxed font-light mb-8 max-w-xl"
            >
              No fabricamos contenido genérico para rellenar feeds. Desarrollamos de forma selectiva <strong className="text-white font-bold">propiedad intelectual audiovisual</strong> y automatizaciones estratégicas diseñadas bajo una sola ley: <strong className="text-white font-bold font-heading italic">dominar la atención y transformarla en facturación recurrente.</strong>
            </motion.p>

            {/* Three ultra-sleek pillars */}
            <div className="grid sm:grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { 
                  icon: <Film size={18} className="text-[#B0232E]" />, 
                  title: "Narrativa Cine", 
                  desc: "Estándar internacional con sensores Full Frame." 
                },
                { 
                  icon: <Target size={18} className="text-[#B0232E]" />, 
                  title: "Retención Viral", 
                  desc: "Estructuras virales probadas en los primeros 3s." 
                },
                { 
                  icon: <Zap size={18} className="text-[#B0232E]" />, 
                  title: "Métricas Reales", 
                  desc: "Sistemas para convertir views en capital neto." 
                }
              ].map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  key={idx} 
                  className="p-4 bg-neutral-950 border border-white/5 rounded-xl hover:border-[#B0232E]/30 transition-all duration-300 group"
                >
                  <div className="mb-3 p-2 bg-white/5 rounded-lg w-fit group-hover:bg-[#B0232E]/10 transition-colors">
                    {item.icon}
                  </div>
                  <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-1.5 italic">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;