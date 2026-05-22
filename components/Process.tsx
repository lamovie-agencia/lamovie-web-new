import React, { useState } from 'react';
import { Coffee, Map, Lightbulb, Camera, Wand2, MessageSquare, Rocket, TrendingUp, Calendar, FileText, CheckCircle, Monitor, Video, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const generalSteps = [
  { id: 1, title: "Conócenos", icon: <Coffee size={24} />, desc: "Reunión inicial para entender tu visión y objetivos." },
  { id: 2, title: "Plan Estratégico", icon: <Map size={24} />, desc: "Diseñamos un plan a medida para que tu marca destaque." },
  { id: 3, title: "Creatividad", icon: <Lightbulb size={24} />, desc: "Generamos ideas frescas y originales. ¡Todo es posible!" },
  { id: 4, title: "Producción", icon: <Camera size={24} />, desc: "Grabamos, fotografiamos y capturamos momentos únicos." },
  { id: 5, title: "Edición Mágica", icon: <Wand2 size={24} />, desc: "Editamos y refinamos el contenido para un toque espectacular." },
  { id: 6, title: "Feedback", icon: <MessageSquare size={24} />, desc: "Revisamos juntos y ajustamos según tus preferencias." },
  { id: 7, title: "Lanzamiento", icon: <Rocket size={24} />, desc: "Compartimos el contenido y monitoreamos el éxito." },
  { id: 8, title: "Siempre Adelante", icon: <TrendingUp size={24} />, desc: "Sigamos creando y haciendo crecer tu marca juntos." },
];

type ServiceType = 'social' | 'web' | 'branding' | 'video';

const detailedTimelines = {
  social: {
    title: "Gestión de Redes (Ciclo Mensual)",
    icon: <MessageSquare />,
    phases: [
      {
        time: "Semana 1: Estrategia & Guion",
        desc: "Análisis de tendencias, definición de pilares de contenido y redacción de parrilla.",
        deliverable: "Calendario de Contenidos + Guiones"
      },
      {
        time: "Semana 2: Producción (Shooting)",
        desc: "Día de rodaje/fotos o diseño gráfico. Capturamos todo el material del mes.",
        deliverable: "Material Bruto / Bocetos Gráficos"
      },
      {
        time: "Semana 3: Post-Producción",
        desc: "Edición de Reels, corrección de color, diseño de carruseles y portadas.",
        deliverable: "Previsualización del Feed"
      },
      {
        time: "Semana 4: Aprobación & Programación",
        desc: "Ronda de feedback final, ajustes y programación en Meta Business Suite.",
        deliverable: "Contenido Programado y Listo"
      }
    ]
  },
  web: {
    title: "Diseño Web & Desarrollo",
    icon: <Monitor />,
    phases: [
      {
        time: "Semana 1: UX & Wireframes",
        desc: "Definición de estructura, mapa del sitio y experiencia de usuario.",
        deliverable: "Wireframes (Esqueleto Web)"
      },
      {
        time: "Semana 2: UI Design (Visual)",
        desc: "Aplicación de marca, selección de fotos y diseño de interfaz alta fidelidad.",
        deliverable: "Mockup Visual Interactivo"
      },
      {
        time: "Semana 3-4: Desarrollo",
        desc: "Maquetación, programación, integración de CMS y optimización móvil.",
        deliverable: "Sitio Web en entorno de pruebas"
      },
      {
        time: "Semana 5: Lanzamiento",
        desc: "Pruebas de carga, SEO básico, conexión de dominio y capacitación.",
        deliverable: "Web en Vivo + Tutorial de uso"
      }
    ]
  },
  branding: {
    title: "Identidad de Marca (Branding)",
    icon: <Palette />,
    phases: [
      {
        time: "Semana 1: Discovery",
        desc: "Investigación de mercado, arquetipos de marca y Moodboard visual.",
        deliverable: "Brief Creativo & Moodboard"
      },
      {
        time: "Semana 2: Bocetación",
        desc: "Exploración creativa y desarrollo de propuestas de logotipo.",
        deliverable: "3 Propuestas de Concepto"
      },
      {
        time: "Semana 3: Desarrollo del Sistema",
        desc: "Selección de propuesta final, paleta de colores, tipografías y patrones.",
        deliverable: "Presentación de Marca"
      },
      {
        time: "Semana 4: Manual & Entrega",
        desc: "Creación del manual de uso y exportación de archivos finales.",
        deliverable: "Brandbook + Kit de Archivos (Ai, Png, Svg)"
      }
    ]
  },
  video: {
    title: "Producción Audiovisual",
    icon: <Video />,
    phases: [
      {
        time: "Pre-Producción",
        desc: "Guion técnico, storyboard, scouting de locaciones y casting.",
        deliverable: "Plan de Rodaje"
      },
      {
        time: "Producción (Rodaje)",
        desc: "Ejecución en set con equipos de cine, iluminación y dirección.",
        deliverable: "Backstage (Historias)"
      },
      {
        time: "Post-Producción",
        desc: "Montaje, color grading, diseño sonoro y efectos visuales (VFX).",
        deliverable: "Corte 1 (Borrador)"
      },
      {
        time: "Entrega Final",
        desc: "Ajustes finales y exportación en formatos para todas las redes.",
        deliverable: "Master Final 4K"
      }
    ]
  }
};

const Process: React.FC = () => {
  const [activeService, setActiveService] = useState<ServiceType>('social');

  return (
    <section id="process" className="py-24 bg-movie-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-movie-red/5 via-movie-black to-movie-black"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-movie-red font-bold tracking-[0.3em] text-sm uppercase mb-4">Metodología</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-black">
            DE LA IDEA A LA <span className="text-movie-red cinematic-glow">MAGIA</span>
          </h3>
          <p className="text-movie-text max-w-2xl mx-auto mt-4">
            Nuestro proceso está diseñado para eliminar el caos y garantizar resultados. 
            Ya sea una web compleja o tu contenido mensual, tenemos una hoja de ruta clara.
          </p>
        </div>

        {/* --- MACRO PROCESS (General) --- */}
        <div className="hidden md:flex justify-between items-start relative mb-32">
          {/* Connecting Line */}
          <div className="absolute top-8 left-0 w-full h-1 bg-white/10 -z-10">
            <div className="h-full bg-movie-red/50 w-3/4"></div>
          </div>

          {generalSteps.map((step, index) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group w-full max-w-[140px] relative"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 mb-6 z-10 bg-movie-black ${
                index % 2 === 0 ? 'border-movie-red text-movie-red shadow-[0_0_15px_rgba(176,35,46,0.5)]' : 'border-white/20 text-white group-hover:border-movie-red group-hover:text-movie-red group-hover:shadow-[0_0_15px_rgba(176,35,46,0.5)]'
              }`}>
                {step.icon}
              </div>
              <div className="bg-movie-black/50 backdrop-blur-sm p-2 rounded transform transition-transform group-hover:-translate-y-1">
                <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-white">{step.title}</h4>
                <p className="text-xs text-movie-text leading-tight">{step.desc}</p>
              </div>
              <span className="absolute top-0 -right-2 text-4xl font-black text-white/5 -z-10 select-none group-hover:text-white/10 transition-colors uppercase animate-pulse-slow">{step.id}</span>
            </motion.div>
          ))}
        </div>

        {/* --- MICRO TIMELINE (Service Specific) --- */}
        <div className="mt-20 border-t border-white/10 pt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-heading font-bold text-white mb-2">LÍNEA DE TIEMPO CREATIVA</h3>
            <p className="text-sm text-movie-silver">Selecciona tu servicio para ver el desglose detallado</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { id: 'social', label: 'Redes Sociales', icon: <MessageSquare size={18} /> },
              { id: 'web', label: 'Diseño Web', icon: <Monitor size={18} /> },
              { id: 'branding', label: 'Branding', icon: <Palette size={18} /> },
              { id: 'video', label: 'Producción', icon: <Video size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveService(tab.id as ServiceType)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                  activeService === tab.id 
                  ? 'bg-movie-red text-white shadow-[0_0_20px_rgba(176,35,46,0.4)] scale-105' 
                  : 'bg-movie-black border border-white/10 text-movie-silver hover:border-white hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Timeline Content */}
          <div className="max-w-5xl mx-auto bg-movie-black/50 border border-white/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="flex items-center gap-4 mb-10">
               <div className="p-4 bg-movie-red/10 rounded-full text-movie-red border border-movie-red/20">
                  {detailedTimelines[activeService].icon}
               </div>
               <h4 className="text-2xl md:text-3xl font-heading font-bold text-white">{detailedTimelines[activeService].title}</h4>
            </div>

            <div className="relative border-l-2 border-white/10 ml-3 md:ml-6 space-y-12">
              {detailedTimelines[activeService].phases.map((phase, idx) => (
                <div key={idx} className="relative pl-8 md:pl-12 group animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  {/* Dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-movie-dark border-2 border-movie-silver group-hover:border-movie-red group-hover:bg-movie-red transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                  
                  <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between bg-white/5 p-6 rounded border border-white/5 hover:border-white/20 transition-all">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-2">
                          <Calendar size={14} className="text-movie-red" />
                          <span className="text-xs font-bold uppercase tracking-widest text-movie-silver">{phase.time}</span>
                       </div>
                       <p className="text-white text-lg mb-2 leading-snug">{phase.desc}</p>
                    </div>
                    
                    <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                       <span className="text-[10px] uppercase tracking-widest text-movie-silver mb-1 flex items-center gap-1"><FileText size={10}/> Entregable</span>
                       <div className="text-movie-red font-bold text-sm flex items-center gap-2">
                          <CheckCircle size={14} /> {phase.deliverable}
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Process;