import React from 'react';
import { Users, Film, Briefcase } from 'lucide-react';

const Stats: React.FC = () => {
  return (
    <section className="py-20 bg-movie-red border-y border-movie-black/20 relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      {/* Animated Background Glows */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 blur-[100px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-black/20 blur-[100px] rounded-full animate-pulse-slow"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          
          <div className="flex flex-col items-center text-center group transition-transform duration-500 hover:scale-110">
            <div className="bg-black/20 p-6 rounded-3xl mb-4 group-hover:bg-black/40 transition-all duration-500 group-hover:rotate-6 shadow-xl">
               <Briefcase className="text-white" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-5xl md:text-6xl font-heading font-black text-white leading-none mb-2 tracking-tighter">+40</h3>
              <p className="text-white/80 font-black uppercase tracking-[0.3em] text-[10px]">Marcas Potenciadas</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center group transition-transform duration-500 hover:scale-110">
            <div className="bg-black/20 p-6 rounded-3xl mb-4 group-hover:bg-black/40 transition-all duration-500 group-hover:-rotate-6 shadow-xl">
               <Film className="text-white" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-5xl md:text-6xl font-heading font-black text-white leading-none mb-2 tracking-tighter">+400</h3>
              <p className="text-white/80 font-black uppercase tracking-[0.3em] text-[10px]">Producciones Realizadas</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center group transition-transform duration-500 hover:scale-110">
            <div className="bg-black/20 p-6 rounded-3xl mb-4 group-hover:bg-black/40 transition-all duration-500 group-hover:rotate-6 shadow-xl">
               <Users className="text-white" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-5xl md:text-6xl font-heading font-black text-white leading-none mb-2 tracking-tighter">+15</h3>
              <p className="text-white/80 font-black uppercase tracking-[0.3em] text-[10px]">Años de Experiencia</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Stats;