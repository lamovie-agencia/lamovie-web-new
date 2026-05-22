import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Send, Cpu, DollarSign, ArrowRight, ShieldCheck, Star, Award, Heart, Sparkles, MessageCircle, User, Phone, Loader2 } from 'lucide-react';
import { leadsService } from '../lib/leadsService';

const businessTypes = ["Restaurante/Bar", "Inmobiliaria/Hotel", "Marca Personal", "E-commerce", "Corporativo"];
const services = ["Fotografía Cine", "Video/Reels Virales", "Gestión Redes 360", "Ecosistema Web", "Tomas con Dron 4K"];

const PackCreator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  
  // Final contact details (revealed strictly in step 4)
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && selectedBusiness) setStep(2);
    else if (step === 2 && selectedServices.length > 0) setStep(3);
    else if (step === 3 && budget) setStep(4);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleWhatsAppRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      return;
    }

    setIsSubmitting(true);
    const servicesStr = selectedServices.join(", ") || "Ninguno";
    
    // Register the dynamic lead with real details in PostgreSQL / CRM
    await leadsService.submitLead({
      name: contactName,
      phone: contactPhone,
      service: `Pack Corporativo: ${selectedBusiness}`,
      message: `Servicios Elegidos: ${servicesStr} | Presupuesto Estimado: ${budget} COP | Contacto: ${contactPhone}`
    });

    const message = `👋 *NUEVO PACK CONFIGURADO EN LA WEB*%0A%0A👤 *Cliente:* ${contactName}%0A📞 *WhatsApp/Cel:* ${contactPhone}%0A🏢 *Giro de Negocio:* ${selectedBusiness}%0A🛠 *Servicios Marcados:* ${servicesStr}%0A💰 *Presupuesto Elegido:* ${budget} COP%0A%0A_Quiero agendar la sesión para confirmar términos del presupuesto._`;
    
    setTimeout(() => {
      setIsSubmitting(false);
      window.open(`https://wa.me/573017355046?text=${message}`, '_blank');
    }, 1500);
  };

  return (
    <section id="pack" className="py-32 bg-[#0d0707] text-white relative overflow-hidden">
      {/* Background aesthetics matching slate dark and red accent colors */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(176,35,46,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(176,35,46,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-red-900/5 blur-[180px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Core Header (Premium framing, NOT look advertisement banner) */}
        <div className="text-center mb-20">
          <span className="text-[#B0232E] font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Herramienta Estratégica</span>
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-4 uppercase">
            CALCULADORA DE PRESUPUESTO A LA MEDIDA
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
            Evita fricción y cotizaciones lentas. Configura las variables esenciales y descarga una cotización paramétrica instantánea.
          </p>
        </div>

        {/* Dynamic Multi-Step Wrapper */}
        <div className="bg-[#121212] border border-white/5 p-8 md:p-14 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Neon top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B0232E] to-transparent"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Step Content / Form State (Left Panel: 7cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-[#B0232E]/10 border border-[#B0232E]/20 text-[#B0232E] px-3 py-1 rounded-full font-mono font-bold">Paso 1 de 4</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Selecciona tu categoría de marca</h3>
                    <p className="text-white/50 text-xs">Ajustaremos los costos operacionales ideales según tu tipo de industria.</p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {businessTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedBusiness(type)}
                          className={`p-4 rounded-xl border text-left text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            selectedBusiness === type 
                              ? 'bg-[#B0232E] text-white border-transparent shadow-[0_5px_15px_rgba(176,35,46,0.3)]' 
                              : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/10 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={handleNextStep}
                        disabled={!selectedBusiness}
                        className="px-6 py-4.5 bg-white text-black font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center gap-2 hover:bg-[#B0232E] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
                      >
                        Siguiente <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2">
                      <button onClick={handlePrevStep} className="text-[10px] text-white/40 hover:text-white underline">Ir Atrás</button>
                      <span className="text-xs bg-[#B0232E]/10 border border-[#B0232E]/20 text-[#B0232E] px-3 py-1 rounded-full font-mono font-bold">Paso 2 de 4</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">¿Qué alcances cinemáticos requieres?</h3>
                    <p className="text-white/50 text-xs">Puedes marcar múltiples alcances para estructurar tu cotización.</p>
                    
                    <div className="space-y-2.5 pt-2">
                      {services.map((service) => (
                        <button
                          key={service}
                          onClick={() => toggleService(service)}
                          className={`relative flex items-center justify-between p-4 border rounded-xl w-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            selectedServices.includes(service)
                              ? 'bg-[#B0232E]/10 border-[#B0232E] text-white shadow-[0_0_15px_rgba(176,35,46,0.1)]' 
                              : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                          }`}
                        >
                          {service}
                          <div className={`w-4 h-4 rounded-full border border-white/20 flex items-center justify-center ${selectedServices.includes(service) ? 'bg-[#B0232E] border-transparent' : ''}`}>
                            {selectedServices.includes(service) && <CheckCircle size={10} className="text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-6 flex gap-3">
                      <button
                        onClick={handlePrevStep}
                        className="px-5 py-4.5 bg-white/5 border border-white/10 text-white/70 hover:text-white font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={handleNextStep}
                        disabled={selectedServices.length === 0}
                        className="px-6 py-4.5 bg-white text-black font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center gap-2 hover:bg-[#B0232E] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
                      >
                        Siguiente <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2">
                      <button onClick={handlePrevStep} className="text-[10px] text-white/40 hover:text-white underline">Ir Atrás</button>
                      <span className="text-xs bg-[#B0232E]/10 border border-[#B0232E]/20 text-[#B0232E] px-3 py-1 rounded-full font-mono font-bold">Paso 3 de 4</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Presupuesto / Escala de inversión</h3>
                    <p className="text-white/50 text-xs">Selecciona un rango para modelar las frecuencias de edición y entregas mensuales.</p>
                    
                    <div className="space-y-2.5 pt-2">
                      {["1M - 3M", "3M - 6M", "+6M"].map(val => (
                        <label key={val} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${budget === val ? 'border-[#B0232E] bg-[#B0232E]/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="budget" 
                              value={val} 
                              checked={budget === val}
                              onChange={(e) => setBudget(e.target.value)}
                              className="accent-[#B0232E]"
                            />
                            <span className="font-bold text-xs uppercase tracking-wider text-white">{val} COP</span>
                          </div>
                          <DollarSign size={14} className="text-white/20" />
                        </label>
                      ))}
                    </div>

                    <div className="pt-6 flex gap-3">
                      <button
                        onClick={handlePrevStep}
                        className="px-5 py-4.5 bg-white/5 border border-white/10 text-white/70 hover:text-white font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={handleNextStep}
                        disabled={!budget}
                        className="px-6 py-4.5 bg-white text-black font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center gap-2 hover:bg-[#B0232E] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
                      >
                        Continuar a Resultados <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2">
                      <button onClick={handlePrevStep} className="text-[10px] text-white/40 hover:text-white underline">Ir Atrás</button>
                      <span className="text-xs bg-[#B0232E]/10 border border-[#B0232E]/20 text-[#B0232E] px-3 py-1 rounded-full font-mono font-bold">Último Paso / Validación</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Generar mi propuesta formal</h3>
                    <p className="text-white/50 text-xs">Ingresa tus datos corporativos finales para recibir el informe en tu WhatsApp.</p>

                    <form onSubmit={handleWhatsAppRedirect} className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">Tu Nombre Completo</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30"><User size={14} /></span>
                            <input 
                              type="text" 
                              required
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-xs font-bold text-white focus:border-[#B0232E] focus:outline-none transition-colors"
                              placeholder="Ej. Carlos Mendoza"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">WhatsApp de Trabajo</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30"><Phone size={14} /></span>
                            <input 
                              type="tel" 
                              required
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-xs font-bold text-white focus:border-[#B0232E] focus:outline-none transition-colors"
                              placeholder="Ej. +301 735 5046"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Floating Micro-Testimonial & GoldenSeal near submit - CRITICAL CRO */}
                      <div className="flex flex-col md:flex-row items-center gap-6 p-5 bg-black/40 border border-white/5 rounded-2xl mt-6 relative group/feat">
                        {/* GoldenSeal built-in */}
                        <div id="GoldenSeal" className="flex items-center gap-3 border-r border-white/10 pr-6 shrink-0">
                          <Award size={36} className="text-[#B0232E] drop-shadow-[0_0_15px_rgba(176,35,46,0.3)]" />
                          <div className="text-left font-mono">
                            <p className="text-[10px] text-white font-black leading-tight">EST. 2018</p>
                            <p className="text-[8px] text-[#B0232E] font-bold uppercase tracking-widest">PRO EXCELLENCE</p>
                          </div>
                        </div>
                        {/* Micro-testimonial */}
                        <div className="text-left text-[11px] leading-relaxed text-white/60">
                          <p className="italic font-light">"Elegir el pack de Reels Virales en la calculadora nos salvó semanas de cotizaciones. El retorno fue brutal."</p>
                          <span className="block text-[#B0232E] font-mono text-[9px] font-bold uppercase mt-1">— Sandra V., CEO Burger Co.</span>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={!contactName || !contactPhone || isSubmitting}
                        className="w-full bg-gradient-to-r from-[#B0232E] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black py-4.5 px-6 rounded-2xl tracking-widest text-xs uppercase flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(176,35,46,0.2)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed mt-4"
                      >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
                        Generar mi Presupuesto en WhatsApp ⚡
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Calculations summaries / Live Feedback (Right Panel: 5cols) */}
            <div className="lg:col-span-5 bg-black/40 p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Cpu size={16} className="text-[#B0232E]" />
                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/50 font-bold">Pre-Cotizador Estructura</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Giro Negocio</span>
                    <span className="text-xs font-bold text-white">{selectedBusiness || "Pendiente"}</span>
                  </div>

                  <div className="border-b border-white/5 pb-2.5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Servicios Seleccionados</span>
                    {selectedServices.length > 0 ? (
                      <div className="flex flex-wrap gap-1 px-1 py-1">
                        {selectedServices.map(s => (
                          <span key={s} className="bg-white/5 text-white border border-white/10 px-2 py-0.5 rounded-[4px] text-[9px] font-bold">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-white/30 font-light">Ninguno</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Inversión Elegida</span>
                    <span className="text-xs font-bold text-green-400">{budget ? `${budget} COP` : "Pendiente"}</span>
                  </div>
                </div>
              </div>

              {/* Conversion guarantee label */}
              <div className="mt-8 flex items-center gap-2 text-[9px] font-mono text-white/30 tracking-wider">
                <ShieldCheck size={12} className="text-green-500" />
                <span>NUESTROS PACKS INCLUYEN EDICIÓN ULTRA-ALTA RETENCIÓN</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default PackCreator;
