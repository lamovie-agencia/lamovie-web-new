import React from 'react';
import { Award, Star, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const GoldenSeal: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 1, duration: 0.8, type: 'spring' }}
      className="fixed bottom-24 left-6 z-[45] hidden md:block pointer-events-none select-none"
    >
      <div className="relative group pointer-events-auto cursor-help">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full group-hover:bg-amber-500/40 transition-all duration-700 pointer-events-none"></div>
        
        {/* Main Seal Body with multi-stop premium polished physical gold gradient */}
        <div className="relative bg-gradient-to-tr from-[#8a662d] via-[#f7d785] via-[#a87f39] via-[#fff3cc] via-[#b88a38] via-[#e2be6c] to-[#9c7533] p-[3px] rounded-full shadow-[0_0_40px_rgba(218,165,32,0.25)] border border-[#fff2bc]/30 transform group-hover:scale-105 duration-500">
          <div className="bg-[#0c0c0c] rounded-full p-3 flex flex-col items-center justify-center text-center w-28 h-28 border-2 border-gradient-to-tr from-[#bf953f] to-[#fcf6ba] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_-1px_3px_rgba(255,255,255,0.1)] relative overflow-hidden">
            
            {/* Fine metallic micro-radial pattern simulation overlay */}
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-black pointer-events-none"></div>
            
            <Award className="text-amber-400 mb-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" size={20} />
            <span className="text-[8px] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 uppercase tracking-[0.2em] leading-none mb-1">Desde</span>
            <span className="text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 leading-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] mb-0.5">2018</span>
            <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-1"></div>
            <span className="text-[7.5px] font-extrabold text-amber-100/90 uppercase tracking-widest leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Experiencia <br/> Profesional</span>
          </div>
        </div>

        {/* Floating Tooltip/Info on Hover */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-48 bg-movie-dark/90 backdrop-blur-xl border border-yellow-500/30 p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Alto Impacto</span>
          </div>
          <p className="text-[10px] text-movie-silver leading-relaxed mb-3">
            Impulsando <strong className="text-white">PYMES en toda Colombia</strong> y marcas personales a nivel <strong className="text-white">internacional</strong>.
          </p>
          <div className="flex gap-2">
            <div className="bg-yellow-500/10 p-1.5 rounded-lg border border-yellow-500/20">
              <Globe size={12} className="text-yellow-500" />
            </div>
            <div className="bg-yellow-500/10 p-1.5 rounded-lg border border-yellow-500/20">
              <ShieldCheck size={12} className="text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Decorative Ribbons with gold metallic gradients */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-[-1]">
          <div className="w-3 h-7 bg-gradient-to-b from-[#8a662d] to-[#4e3612] rounded-b-sm transform -rotate-12 origin-top shadow-md border-r border-[#8d6a30]/30"></div>
          <div className="w-3 h-7 bg-gradient-to-b from-[#a87f39] to-[#5a3f15] rounded-b-sm transform rotate-12 origin-top shadow-md border-l border-[#ebd281]/20"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default GoldenSeal;
