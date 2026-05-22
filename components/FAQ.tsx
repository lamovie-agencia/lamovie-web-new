
import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "¿Qué hace diferente a LA MOVIE de otras agencias?",
    answer: "No somos 'toderos'. Somos especialistas en Estética Cinematográfica y Estrategia de Retención. Mientras otros hacen videos 'bonitos', nosotros creamos activos digitales diseñados para retener la atención en los primeros 3 segundos y convertir espectadores en clientes usando psicología visual."
  },
  {
    question: "¿Cómo funcionan los pagos y la contratación?",
    answer: "Trabajamos con un modelo 50/50. El 50% para reservar la fecha de producción o iniciar la estrategia, y el 50% restante contra entrega final. Aceptamos transferencias bancarias (Bancolombia, Davivienda) y pagos digitales (Nequi, Daviplata)."
  },
  {
    question: "¿Entregan los archivos editables?",
    answer: "Por defecto, entregamos los artes finales optimizados para cada plataforma (MP4 4K, JPG Alta, PDF). Los archivos editables (Proyectos de Premiere, PSDs, AIs) son propiedad intelectual de la agencia, pero pueden ser adquiridos por un valor adicional del 30% sobre el proyecto."
  },
  {
    question: "¿Manejan clientes fuera de Cartagena?",
    answer: "¡Sí! El 60% de nuestros clientes son internacionales o de otras ciudades. Para servicios digitales (Redes, Web, Branding) el flujo es 100% remoto. Para producción audiovisual, nuestro equipo viaja a cualquier lugar del mundo (viáticos a cargo del cliente)."
  },
  {
    question: "¿Cuánto tiempo toma ver resultados?",
    answer: "En pauta digital (Ads), los resultados son casi inmediatos (24-48h). En crecimiento orgánico y SEO, se requiere consistencia de 3 a 6 meses. Nuestro enfoque híbrido busca darte victorias rápidas mientras construimos tu imperio a largo plazo."
  }
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-movie-black border-t border-white/5 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute -right-20 top-40 text-[20rem] font-black text-white/5 select-none pointer-events-none rotate-12">?</div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Header Area */}
          <div className="w-full md:w-1/3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
               <HelpCircle size={16} className="text-movie-red" />
               <span className="text-white text-xs font-bold uppercase tracking-widest">Dudas Frecuentes</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
              RESOLVIENDO EL <span className="text-movie-red">GUIÓN</span>
            </h2>
            <p className="text-movie-silver text-lg mb-8 leading-relaxed">
              La claridad es poder. Aquí respondemos lo que todos quieren saber antes de iniciar el rodaje.
            </p>
            <a 
              href="https://wa.me/573017355046" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-white text-black hover:bg-movie-red hover:text-white transition-all font-bold uppercase tracking-widest rounded shadow-lg"
            >
              <MessageCircle size={18} /> Preguntar al Director
            </a>
          </div>

          {/* Accordion */}
          <div className="w-full md:w-2/3 space-y-4">
            {faqs.map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-lg transition-all duration-300 ${activeIndex === index ? 'bg-movie-dark border-movie-red/50 shadow-[0_0_30px_rgba(176,35,46,0.1)]' : 'bg-transparent border-white/10 hover:border-white/30'}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-bold transition-colors ${activeIndex === index ? 'text-white' : 'text-movie-silver'}`}>
                    {item.question}
                  </span>
                  <div className={`p-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-movie-red text-white rotate-180' : 'bg-white/5 text-white/50'}`}>
                    {activeIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-movie-text leading-relaxed border-t border-white/5 mt-2">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;
