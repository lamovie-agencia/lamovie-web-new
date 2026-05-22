
import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Database, Globe, ShoppingCart, Stethoscope, Home, Calendar, Zap, Check, Cpu, PhoneCall, Mic, ArrowLeft, Play, Pause, MessageCircle } from 'lucide-react';
import AutomationShowcase from './AutomationShowcase';

interface AIAgentsProps {
  onBack: () => void;
  onOpenForm: () => void;
}

// Icons helper components for local usage
// Defined at the top to ensure they are available when AIAgents renders
const RefreshCwIcon = ({size}: {size:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>;
const SendIcon = ({size}: {size:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;

// Data for Simulation
const nicheSimulations = {
  real_estate: {
    title: "Inmobiliaria",
    botName: "Agente Propiedades",
    dialog: [
      { sender: 'bot', text: "Hola! 👋 Soy el asistente virtual de Luxury Homes. Veo que te interesó el apartamento en Bocagrande. ¿Buscas para compra o arriendo?" },
      { sender: 'user', text: "Hola, para arriendo por favor." },
      { sender: 'bot', text: "Perfecto. Para arriendos en esa zona manejamos presupuestos desde 4M COP. ¿Se ajusta a tu búsqueda?" },
      { sender: 'user', text: "Sí, mi presupuesto es hasta 5M." },
      { sender: 'bot', text: "Excelente. Tengo 3 opciones disponibles con vista al mar. ¿Te gustaría agendar una visita para este fin de semana?" },
      { sender: 'user', text: "Sí, el sábado en la mañana." },
      { sender: 'bot', text: "Listo ✅. Queda pre-agendado para el Sábado 10:00 AM. Un asesor humano te confirmará en breve. ¡Gracias!" }
    ]
  },
  health: {
    title: "Salud / Clínicas",
    botName: "Dra. AI (Asistente)",
    dialog: [
      { sender: 'bot', text: "Bienvenido a Clínica Vital. 🏥 ¿En qué especialidad necesitas tu cita hoy?" },
      { sender: 'user', text: "Necesito dermatología." },
      { sender: 'bot', text: "Entendido. La Dra. Martinez tiene disponibilidad mañana a las 3:00 PM o el Jueves a las 9:00 AM. ¿Cuál prefieres?" },
      { sender: 'user', text: "Mañana a las 3 está bien." },
      { sender: 'bot', text: "Perfecto. Recuerda llegar 15 min antes. ¿Cuentas con medicina prepagada o particular?" },
      { sender: 'user', text: "Particular." },
      { sender: 'bot', text: "Agendado. El valor de la consulta es $180.000. Te envié el link de pago por WhatsApp. 💳" }
    ]
  },
  sales: {
    title: "Ventas / E-commerce",
    botName: "Shop Bot",
    dialog: [
      { sender: 'bot', text: "¡Hola! Vi que dejaste unos tenis en el carrito 🛒. ¿Tuviste algún problema para finalizar la compra?" },
      { sender: 'user', text: "No estoy seguro de la talla." },
      { sender: 'bot', text: "No te preocupes. Nuestra horma es estándar. Si eres 40 en Nike, aquí también eres 40. Además, tenemos cambios gratis. 😉" },
      { sender: 'user', text: "Ah super, ¿tienen envío gratis?" },
      { sender: 'bot', text: "¡Sí! Si compras en los próximos 20 minutos te regalo el envío. ¿Te ayudo a cerrar el pedido?" },
      { sender: 'user', text: "Dale, de una." },
      { sender: 'bot', text: "Generando link de pago con descuento de envío... ⚡ Aquí tienes." }
    ]
  }
};

const AIAgents: React.FC<AIAgentsProps> = ({ onBack, onOpenForm }) => {
  const [activeNiche, setActiveNiche] = useState<keyof typeof nicheSimulations>('real_estate');
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation Effect
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      setVisibleMessages(0);
      let count = 0;
      interval = setInterval(() => {
        count++;
        setVisibleMessages(count);
        if (count >= nicheSimulations[activeNiche].dialog.length) {
          clearInterval(interval);
          setIsSimulating(false);
        }
      }, 1500); // Speed of chat
    } else {
        // Show full chat if not simulating initially
        setVisibleMessages(nicheSimulations[activeNiche].dialog.length);
    }
    return () => clearInterval(interval);
  }, [activeNiche, isSimulating]);

  const handleRestartSim = () => {
    setIsSimulating(true);
  };

  const currentSim = nicheSimulations[activeNiche];

  return (
    <div className="min-h-screen bg-movie-black text-white relative overflow-hidden animate-fade-in">
      
      {/* Navbar for AI Page */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-green-500/20 py-4">
          <div className="container mx-auto px-6 flex justify-between items-center">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white hover:text-green-400 transition-colors font-bold uppercase text-sm tracking-wider group"
              >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Volver al Inicio
              </button>
              <div className="flex items-center gap-2">
                 <Bot className="text-green-500 animate-pulse" />
                 <span className="text-xl font-heading font-bold text-white tracking-widest">
                    LA MOVIE <span className="text-green-500">AI</span>
                 </span>
              </div>
          </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
             <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-900/30 border border-green-500/50 rounded-full mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                 <Cpu size={18} className="text-green-400 animate-spin-slow" />
                 <span className="text-green-400 text-sm font-bold uppercase tracking-widest">Tecnología Neural V4.0</span>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 leading-tight">
                AGENTES QUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-500">PIENSAN</span> <br/>
                Y <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">VENDEN</span> POR TI.
             </h1>
             
             <p className="text-xl text-movie-silver max-w-3xl mx-auto mb-12 leading-relaxed">
                Olvídate de los chatbots tontos. Implementamos <strong>Inteligencia Artificial Generativa</strong> que entiende el contexto, tiene voz propia y cierra ventas en WhatsApp, Web y Teléfono.
             </p>

             <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={onOpenForm} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest rounded shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-3">
                   <Zap size={20} className="fill-white" /> LIBERARME DE LA OPERATIVIDAD
                </button>
                <button onClick={() => document.getElementById('demo')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-transparent border border-white/20 hover:border-green-500 hover:text-green-400 text-white font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-3">
                   <Play size={20} /> PROBAR EL FUTURO AHORA
                </button>
             </div>
        </div>
      </section>

      {/* --- REAL VOICE AGENTS SECTION --- */}
      <section className="py-24 bg-black border-y border-green-900/30 relative">
          <div className="container mx-auto px-6">
             <div className="flex flex-col lg:flex-row items-center gap-16">
                 <div className="w-full lg:w-1/2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-500/10 rounded-full border border-green-500/30 animate-pulse">
                           <PhoneCall className="text-green-400" size={32} />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-wider">Llamadas Reales</h2>
                    </div>
                    <h3 className="text-5xl font-heading font-black text-white mb-6">TU AGENTE TIENE <span className="text-green-500">VOZ.</span></h3>
                    <p className="text-movie-silver text-lg mb-8">
                       No es una grabación robótica. Nuestros agentes de voz pueden sostener conversaciones fluidas, interrumpir, retomar ideas y agendar citas llamando a tus leads en segundos.
                    </p>
                    <ul className="space-y-4 mb-8">
                       <li className="flex items-center gap-3 text-white">
                          <Check className="text-green-500" /> Llamadas salientes (Cold Calling) y entrantes.
                       </li>
                       <li className="flex items-center gap-3 text-white">
                          <Check className="text-green-500" /> Voces hiperrealistas (Acentos locales).
                       </li>
                       <li className="flex items-center gap-3 text-white">
                          <Check className="text-green-500" /> Transcripción y resumen en tu CRM.
                       </li>
                    </ul>
                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-4">
                        <div className="bg-green-500/20 p-2 rounded-full">
                           <Mic size={24} className="text-green-400" />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">Prueba de Audio</p>
                           <div className="flex items-center gap-1 mt-1">
                              <div className="w-1 h-3 bg-green-500 animate-[pulse_1s_infinite]"></div>
                              <div className="w-1 h-5 bg-green-500 animate-[pulse_1.2s_infinite]"></div>
                              <div className="w-1 h-4 bg-green-500 animate-[pulse_0.8s_infinite]"></div>
                              <div className="w-1 h-2 bg-green-500 animate-[pulse_1.5s_infinite]"></div>
                              <span className="text-[10px] text-green-400 ml-2">Reproduciendo...</span>
                           </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Visual Representation of Voice AI */}
                 <div className="w-full lg:w-1/2 relative">
                     <div className="relative z-10 bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 rounded-2xl shadow-2xl">
                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                                 <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80" alt="AI Agent" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <p className="text-white font-bold">Sofia (IA)</p>
                                 <p className="text-green-400 text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> En llamada</p>
                              </div>
                           </div>
                           <div className="text-white/50 text-xl font-mono">00:24</div>
                        </div>
                        
                        {/* Waveform Visualization */}
                        <div className="flex items-center justify-center gap-1 h-24 mb-8">
                           {[...Array(20)].map((_, i) => (
                              <div 
                                 key={i} 
                                 className="w-2 bg-green-500 rounded-full animate-music-bar"
                                 style={{ 
                                    height: `${Math.random() * 100}%`,
                                    animationDelay: `${i * 0.05}s`
                                 }}
                              ></div>
                           ))}
                        </div>
                        
                        <div className="flex justify-center gap-8">
                           <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><Mic size={24}/></button>
                           <button className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-500/30"><PhoneCall size={24} className="rotate-[135deg]" /></button>
                        </div>
                     </div>
                     
                     {/* Decor */}
                     <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>
                     <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
                 </div>
             </div>
          </div>
      </section>

      {/* --- SIMULATOR SECTION --- */}
      <section id="demo" className="py-24 bg-movie-dark relative">
         <div className="container mx-auto px-6">
            <div className="text-center mb-12">
               <h2 className="text-green-500 font-bold tracking-widest uppercase mb-2">Simulador de Nicho</h2>
               <h3 className="text-4xl font-heading font-black text-white">MIRA CÓMO TRABAJA</h3>
               <p className="text-movie-silver mt-4">Selecciona tu industria y observa una conversación típica automatizada.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
               {/* Controls */}
               <div className="w-full lg:w-1/3 space-y-4">
                  {Object.entries(nicheSimulations).map(([key, data]) => (
                     <button
                        key={key}
                        onClick={() => { setActiveNiche(key as any); handleRestartSim(); }}
                        className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                           activeNiche === key 
                           ? 'bg-green-900/20 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
                           : 'bg-black/40 border-white/5 text-movie-silver hover:bg-white/5 hover:text-white'
                        }`}
                     >
                        <span className="font-bold text-lg">{data.title}</span>
                        {activeNiche === key && <Play size={20} className="text-green-400 fill-green-400" />}
                     </button>
                  ))}
                  <div className="mt-8 p-6 bg-black/50 rounded-xl border border-white/10 text-center">
                     <p className="text-sm text-movie-silver mb-4">¿No ves tu industria?</p>
                     <button onClick={onOpenForm} className="text-green-400 font-bold uppercase text-xs border-b border-green-400 pb-1 hover:text-white hover:border-white transition-colors">
                        Solicitar Demo Personalizada
                     </button>
                  </div>
               </div>

               {/* Chat Interface */}
               <div className="w-full lg:w-2/3 bg-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[600px]">
                  {/* Chat Header */}
                  <div className="bg-gray-900 p-4 flex items-center gap-4 border-b border-white/5">
                     <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white relative">
                        <Bot size={20} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                     </div>
                     <div>
                        <h4 className="text-white font-bold">{currentSim.botName}</h4>
                        <p className="text-green-400 text-xs">En línea • Responde al instante</p>
                     </div>
                     <button onClick={handleRestartSim} className="ml-auto text-white/50 hover:text-white p-2" title="Reiniciar chat">
                        <RefreshCwIcon size={18} />
                     </button>
                  </div>

                  {/* Chat Body */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                     {currentSim.dialog.map((msg, idx) => (
                        <div 
                           key={idx} 
                           className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-500 ${idx < visibleMessages ? 'opacity-100' : 'opacity-0 hidden'}`}
                        >
                           <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                              msg.sender === 'user' 
                              ? 'bg-green-600 text-white rounded-tr-none' 
                              : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
                           }`}>
                              {msg.text}
                           </div>
                        </div>
                     ))}
                     {visibleMessages < currentSim.dialog.length && (
                        <div className="flex justify-start">
                           <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Chat Input (Fake) */}
                  <div className="p-4 bg-gray-900 border-t border-white/5 flex gap-3 opacity-50 pointer-events-none">
                     <input type="text" placeholder="Escribe un mensaje..." className="flex-1 bg-black border border-white/10 rounded-full px-4 py-3 text-sm text-white" />
                     <button className="p-3 bg-green-600 rounded-full text-white"><SendIcon size={18} /></button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- NEW AUTOMATION SHOWCASE SECTION --- */}
      <AutomationShowcase />

      {/* --- PRICING & CREDITS --- */}
      <section className="py-24 bg-black relative">
         <div className="absolute inset-0 bg-green-900/5 pointer-events-none"></div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-white font-heading font-black text-4xl mb-4">INVERSIÓN ESCALABLE</h2>
               <p className="text-movie-silver">Elige una suscripción base y añade créditos de voz según lo necesites.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               
               {/* Subscription Card */}
               <div className="bg-movie-dark p-8 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">Licencia Starter</h3>
                  <div className="text-3xl font-black text-white mb-6">Desde $150 USD <span className="text-sm font-normal text-movie-silver">/mes</span></div>
                  <ul className="space-y-3 mb-8 flex-1">
                     <li className="flex gap-2 text-sm text-movie-silver"><Check size={16} className="text-green-500"/> Chatbot WhatsApp (Texto)</li>
                     <li className="flex gap-2 text-sm text-movie-silver"><Check size={16} className="text-green-500"/> Flujos de venta básicos</li>
                     <li className="flex gap-2 text-sm text-movie-silver"><Check size={16} className="text-green-500"/> Soporte horario oficina</li>
                  </ul>
                  <button onClick={onOpenForm} className="w-full py-3 bg-white/5 hover:bg-white hover:text-black text-white font-bold rounded border border-white/10 transition-colors uppercase text-xs tracking-widest">
                     CONTRATAR AGENTE STARTER
                  </button>
               </div>

               {/* Pro Card */}
               <div className="bg-green-900/10 p-8 rounded-2xl border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)] relative transform md:-translate-y-4 flex flex-col">
                  <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMENDADO</div>
                  <h3 className="text-xl font-bold text-white mb-2">Licencia IA Pro</h3>
                  <div className="text-3xl font-black text-white mb-6">Desde $450 USD <span className="text-sm font-normal text-movie-silver">/mes</span></div>
                  <ul className="space-y-3 mb-8 flex-1">
                     <li className="flex gap-2 text-sm text-white"><Check size={16} className="text-green-400"/> IA Generativa (Cerebro propio)</li>
                     <li className="flex gap-2 text-sm text-white"><Check size={16} className="text-green-400"/> Conexión a Base de Datos</li>
                     <li className="flex gap-2 text-sm text-white"><Check size={16} className="text-green-400"/> <strong>Agente de Voz Habilitado</strong></li>
                     <li className="flex gap-2 text-sm text-white"><Check size={16} className="text-green-400"/> Panel de Control en Vivo</li>
                  </ul>
                  <button onClick={onOpenForm} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition-colors uppercase text-xs tracking-widest shadow-lg">
                     CONTRATAR AGENTE 24/7
                  </button>
               </div>

               {/* Credits Card */}
               <div className="bg-movie-dark p-8 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                     <PhoneCall size={18} className="text-cyan-400"/> Bolsa de Minutos
                  </h3>
                  <p className="text-xs text-movie-silver mb-4">Para llamadas de voz salientes/entrantes.</p>
                  
                  <div className="space-y-4 mb-8 flex-1">
                     <div className="p-4 bg-black/40 rounded border border-white/5 flex justify-between items-center cursor-pointer hover:border-cyan-500 transition-colors">
                        <span className="text-white font-bold">100 Minutos</span>
                        <span className="text-cyan-400 font-mono">$40 USD</span>
                     </div>
                     <div className="p-4 bg-black/40 rounded border border-white/5 flex justify-between items-center cursor-pointer hover:border-cyan-500 transition-colors">
                        <span className="text-white font-bold">500 Minutos</span>
                        <span className="text-cyan-400 font-mono">$180 USD</span>
                     </div>
                     <div className="p-4 bg-black/40 rounded border border-white/5 flex justify-between items-center cursor-pointer hover:border-cyan-500 transition-colors">
                        <span className="text-white font-bold">Ilimitado</span>
                        <span className="text-cyan-400 font-mono">Cotizar</span>
                     </div>
                  </div>
                  <button onClick={onOpenForm} className="w-full py-3 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white font-bold rounded border border-cyan-500/50 transition-colors uppercase text-xs tracking-widest">
                     Recargar Créditos
                  </button>
               </div>

            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 text-center bg-black border-t border-white/10">
         <p className="text-movie-silver mb-4">¿Dudas sobre la implementación?</p>
         <button onClick={onBack} className="text-white hover:text-green-400 underline decoration-green-500 underline-offset-4 transition-colors">
            Volver al sitio principal
         </button>
      </section>

    </div>
  );
};

export default AIAgents;