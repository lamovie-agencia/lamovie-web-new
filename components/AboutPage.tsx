import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Film, Target, Zap, Users, Shield, Rocket, Play, ChevronLeft, ChevronRight, Star, Award, Sparkles, Check } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeId, setActiveId] = useState("yosimar");

  const teamMembers = [
    {
      id: "yosimar",
      name: "YOSIMAR ZUÑIGA",
      role: "DIRECTOR CREATIVO Y PRODUCTOR AUDIOVISUAL",
      team: "EQUIPO MOVIE",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80", // Using high quality Unsplash portraits
      desc: "Estratega publicitario y productor de élite. Codifica la identidad cinematográfica corporativa y esculpe el ritmo e impacto definitivo de cada campaña.",
      capabilities: [
        "Dirección cinematográfica & estética premium",
        "Diseño de ganchos visuales de alta retención",
        "Color grading avanzado de alto contraste",
        "Estrategia de marca e impacto comercial"
      ]
    },
    {
      id: "juliana",
      name: "JULIANA MANCIPE",
      role: "CREADORA DE CONTENIDO",
      team: "EQUIPO MOVIE",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
      desc: "Arquitecta de retención orgánica. Domina la psicología algorítmica de formatos cortos para convertir visualizaciones masivas en interacciones de valor.",
      capabilities: [
        "Estructuración de contenido hiper-viral",
        "Psicología visual y persuasión en 3s",
        "Edición exprés de ritmos de alta fidelidad",
        "Monetización de ganchos orgánicos"
      ]
    },
    {
      id: "josediaz",
      name: "JOSE DIAZ",
      role: "FILMMAKER",
      team: "EQUIPO MOVIE",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      desc: "Esculpe con luz y movimiento. Especializado en cinematografía comercial dinámica y montaje técnico de alto impacto emocional con formato cine.",
      capabilities: [
        "Encuadres y composición de nivel internacional",
        "Esquemas premium de iluminación clave",
        "Edición rítmica de cortes estratégicos",
        "Dirección técnica y óptica avanzada"
      ]
    },
    {
      id: "joseburgos",
      name: "JOSE BURGOS",
      role: "DESARROLLADOR WEB E IA",
      team: "EQUIPO MOVIE",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
      desc: "Ingeniero full-stack enfocado en el desarrollo de interfaces futuristas de alta conversión y la inyección inteligente de automatizaciones con Inteligencia Artificial.",
      capabilities: [
        "Arquitectura interactiva en React & TypeScript",
        "Agentes autónomos de IA y flujos n8n",
        "Integraciones de embudos de alta velocidad",
        "Sistemas blindados de conversión segura"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-movie-black text-white relative overflow-hidden">
      {/* Carbon Ambient Texture */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      
      {/* Backlit Red Ambient Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#B0232E]/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-movie-black/95 backdrop-blur-xl border-b border-white/10 py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 text-white hover:text-[#B0232E] transition-all group font-bold uppercase text-[10px] tracking-[0.2em]"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            VOLVER AL INICIO
          </button>
          <div className="text-xl font-heading font-black text-white tracking-tighter italic font-sans">
            LA MOVIE <span className="text-[#B0232E] font-heading font-black uppercase tracking-tighter italic font-sans">// NOSOTROS</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        
        {/* Header Section */}
        <section className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#B0232E]/10 border border-[#B0232E]/20 text-[#B0232E] text-[9px] font-black uppercase tracking-[0.3em] rounded-full mb-6"
          >
            <Film size={12} />
            <span>ESTUDIO CREATIVO & PERFORMANCE</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-heading font-black tracking-tighter uppercase italic leading-none mb-6"
          >
            EL ESTILO ES <span className="text-[#B0232E]">LEY</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#CCCCCC] max-w-2xl mx-auto font-light leading-relaxed"
          >
            Combinamos dirección de arte del más alto nivel con ingeniería de pauta y conversión. No hacemos videos; creamos activos comerciales letales.
          </motion.p>
        </section>

        {/* Cinematic Grid: 3 Pillars */}
        <section className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            { 
              number: "01",
              title: "ESTÉTICA DE CINE", 
              desc: "Iluminación cinematográfica comercial, sensores full-frame y color grading de alta gama para situar tu marca en la cima de tu categoría." 
            },
            { 
              number: "02",
              title: "TÁCTICA DE RETENCIÓN", 
              desc: "Estructuras de gancho quirúrgicamente probadas. Capturamos la atención del comprador en los primeros 3 segundos del scroll." 
            },
            { 
              number: "03",
              title: "CONVERSIÓN DIRECTA", 
              desc: "Embudos optimizados, pauta digital directa y llamadas a la acción agresivas. Convertimos vistas en clientes de alta fidelidad." 
            }
          ].map((pillar, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="p-8 bg-neutral-950 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-[#B0232E]/30 transition-all duration-300"
            >
              <div className="absolute top-4 right-6 text-6xl font-heading font-black text-[#B0232E]/10 select-none group-hover:text-[#B0232E]/20 transition-colors">
                {pillar.number}
              </div>
              <h3 className="text-lg font-heading font-black text-white italic tracking-wider mb-4 mt-4">
                {pillar.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-light group-hover:text-white/70 transition-colors">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Split Section: The Crew & Leadership (Perfect Match with requested UI mockup) */}
        <section className="mb-24 border-t border-white/5 pt-20 relative overflow-hidden">
          
          {/* Target Orbits Background System */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.04] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] border border-[#B0232E]/[0.02] rounded-full"></div>
          </div>

          {/* Header Block according to the design */}
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-2xl md:text-5xl font-heading font-black text-white uppercase tracking-tight leading-none">
              LA MOVIE <span className="text-[#B0232E]">|</span> EL EQUIPO DE ÉXITO DIGITAL
            </h2>
            <p className="text-[#CCCCCC] text-sm md:text-lg font-light mt-3 tracking-wide">
              expertos en <span className="text-[#B0232E] font-medium italic">retener</span>, <span className="text-white font-semibold">impactar</span> y <span className="text-[#B0232E] font-medium italic">convertir</span>.
            </p>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 max-w-5xl mx-auto px-4">
            
            {/* Left Gold Certificate Badge Column (matching bottom-left badge of mockup) */}
            <div className="shrink-0 flex lg:flex-col items-center justify-center gap-4 lg:py-10">
              <div className="relative w-24 h-24 rounded-full border border-yellow-500/30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md shadow-[0_0_30px_rgba(234,179,8,0.05)] group">
                {/* Outer spinning dash ring */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-yellow-500/30 animate-[spin_40s_linear_infinite]"></div>
                
                {/* Visual badge detail */}
                <Award size={20} className="text-yellow-400 mb-1 animate-pulse" />
                <span className="text-[9px] font-sans font-black text-white tracking-widest text-[#EAB308]">DESDE</span>
                <span className="text-[12px] font-heading font-black text-yellow-400 tracking-tight leading-none mb-1">2018</span>
                <span className="text-[6px] font-mono text-white/50 tracking-widest uppercase font-bold text-center px-2">EXP. PROFESIONAL</span>
              </div>
            </div>

            {/* Slider Controls and Grid Carousel container */}
            <div className="flex-1 w-full flex items-center gap-3">
              
              {/* Prev Button */}
              <button 
                onClick={() => {
                  const currentIndex = teamMembers.findIndex(m => m.id === activeId);
                  const prevIndex = (currentIndex - 1 + teamMembers.length) % teamMembers.length;
                  setActiveId(teamMembers[prevIndex].id);
                }}
                className="w-10 h-10 shrink-0 rounded-full border border-[#B0232E]/30 bg-black/60 text-white/70 hover:text-white hover:border-[#B0232E] hover:bg-[#B0232E]/10 transition-all flex items-center justify-center group"
                aria-label="Anterior"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Members Responsive Cards Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.map((member) => {
                  const isActive = activeId === member.id;
                  
                  return (
                    <div 
                      key={member.id}
                      onClick={() => setActiveId(member.id)}
                      onMouseEnter={() => setActiveId(member.id)}
                      className={`relative aspect-[3/4.5] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 group select-none ${
                        isActive 
                          ? "border-2 border-[#B0232E] shadow-[0_0_30px_rgba(176,35,46,0.3)] scale-[1.02]" 
                          : "border border-white/10 hover:border-white/30 hover:scale-[1.01]"
                      }`}
                    >
                      {/* --- DEFAULT STATE: PHOTO FRAME (If NOT active or on secondary focus) --- */}
                      <div className={`absolute inset-0 transition-all duration-700 ${isActive ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}`}>
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        {/* Shadow vignette */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                        {/* Name Info layered at the bottom of portrait */}
                        <div className="absolute bottom-4 inset-x-4 text-center">
                          <h4 className="text-sm font-black text-white tracking-wider uppercase font-heading">
                            {member.name}
                          </h4>
                          <p className="text-[9px] text-[#B0232E] font-bold tracking-widest mt-1 uppercase">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* --- ACTIVE TECH GRID STATE: THE BLUEPRINT SYSTEM --- */}
                      <div 
                        className={`absolute inset-0 p-5 flex flex-col justify-between transition-all duration-700 bg-neutral-950/95 overflow-hidden ${
                          isActive 
                            ? "opacity-100 scale-100" 
                            : "opacity-0 pointer-events-none scale-105"
                        }`}
                      >
                        {/* High-fidelity Cyber grid background pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none"></div>
                        
                        {/* Ambient copper lighting */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#B0232E]/10 rounded-full blur-2xl pointer-events-none"></div>

                        {/* Text details top */}
                        <div className="relative z-10">
                          <span className="text-[8px] uppercase tracking-[0.2em] text-[#CCCCCC]/60 font-mono block mb-1">
                            {member.team}
                          </span>
                          
                          <h4 className="text-base font-black text-white uppercase tracking-tight leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {member.name}
                          </h4>
                          
                          <span className="text-[9px] font-extrabold text-[#B0232E] uppercase tracking-wider block mt-1">
                            {member.role}
                          </span>

                          <div className="w-8 h-[1px] bg-[#B0232E]/40 my-3"></div>

                          <p className="text-[10px] text-white/70 font-light leading-relaxed mb-4">
                            {member.desc}
                          </p>
                        </div>

                        {/* Tech capabilities checklist bottom */}
                        <div className="relative z-10 space-y-1.5">
                          {member.capabilities.map((cap, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-1.5">
                              <Check size={10} className="text-[#B0232E] shrink-0 mt-0.5" />
                              <span className="text-[8.5px] font-mono text-white/50 leading-tight">
                                {cap}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Active indicator */}
                        <div className="relative z-10 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/30">
                          <span>IA-OPTIMIZED 2026</span>
                          <span className="text-[#B0232E] font-bold animate-pulse">ACTIVE // COBRE</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Next Button */}
              <button 
                onClick={() => {
                  const currentIndex = teamMembers.findIndex(m => m.id === activeId);
                  const nextIndex = (currentIndex + 1) % teamMembers.length;
                  setActiveId(teamMembers[nextIndex].id);
                }}
                className="w-10 h-10 shrink-0 rounded-full border border-[#B0232E]/30 bg-black/60 text-white/70 hover:text-white hover:border-[#B0232E] hover:bg-[#B0232E]/10 transition-all flex items-center justify-center group"
                aria-label="Siguiente"
              >
                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>

          </div>

          {/* Slider Progress Bar Indicator (matching the bottom line slider of mockup) */}
          <div className="max-w-md mx-auto mt-12 flex flex-col items-center gap-2">
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 bottom-0 bg-[#B0232E] transition-all duration-500 rounded-full"
                style={{ 
                  left: `${(teamMembers.findIndex(m => m.id === activeId) / teamMembers.length) * 100}%`,
                  width: `${100 / teamMembers.length}%`
                }}
              ></div>
            </div>
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.25em]">
              Fisgoneando: {teamMembers.findIndex(m => m.id === activeId) + 1} / {teamMembers.length}
            </span>
          </div>

          {/* Decorative 4-point Star Flare (matching bottom right corner flare of mockup) */}
          <div className="absolute bottom-6 right-12 opacity-45 pointer-events-none text-[#B0232E] animate-pulse">
            <Sparkles size={24} />
          </div>

        </section>

        {/* Bulletproof Statement */}
        <section className="text-center py-16 px-8 bg-neutral-950 border border-white/5 rounded-3xl mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B0232E]/5 rounded-full blur-2xl"></div>
          <p className="text-2xl md:text-3xl font-heading font-black uppercase italic max-w-3xl mx-auto leading-tight">
            "NO BUSCAMOS REPRODUCCIONES COMPLACIENTES. <br />
            CONSTRUIREMOS <span className="text-[#B0232E]">ACTIVOS RENTABLES</span> DE COMUNICACIÓN."
          </p>
        </section>

        {/* Minimal CTA */}
        <section className="text-center py-8">
          <button 
            onClick={onBack}
            className="bg-white text-black hover:bg-[#B0232E] hover:text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            ENTRAR EN ACCIÓN
          </button>
        </section>

      </main>

      <footer className="py-12 bg-movie-black border-t border-white/5 text-center relative z-10">
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold">
          LA MOVIE STUDIO • ADS YOSII • 2026
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;
