import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, ChevronRight, Send, Loader2, Sparkles, User, Target, ArrowRight, ShieldCheck, Trophy, Camera, Heart, HelpCircle } from 'lucide-react';
import { leadsService } from '../lib/leadsService';

interface InteractiveBriefProps {
  isOpen: boolean;
  onClose: () => void;
}

const InteractiveBrief: React.FC<InteractiveBriefProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [answers, setAnswers] = useState({
    name: '',
    brand: '',
    objective: '',
    industry: '',
    style: '',
    budget: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers({ name: '', brand: '', objective: '', industry: '', style: '', budget: '' });
      setIsFinished(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      finishBrief();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleOptionClick = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    nextStep();
  };

  const finishBrief = () => {
    setIsProcessing(true);
    
    // Guardar en CRM
    leadsService.submitLead({
      name: answers.name || "Cliente Briefing",
      service: "Briefing Premium",
      message: `Marca: ${answers.brand || 'No especificada'} | Objetivo: ${answers.objective || 'No especificado'} | Industria: ${answers.industry || 'No especificada'} | Estilo: ${answers.style || 'No especificado'} | Presupuesto: ${answers.budget || 'No especificado'}`
    });

    setTimeout(() => {
      setIsProcessing(false);
      setIsFinished(true);
    }, 2200);
  };

  const sendToWhatsApp = () => {
    const message = `🎬 *APLICACIÓN ESTRATÉGICA - LA MOVIE*%0A%0A👤 *Nombre:* ${answers.name}%0A🏢 *Marca / Empresa:* ${answers.brand}%0A🎯 *Objetivo:* ${answers.objective}%0A🏭 *Industria:* ${answers.industry}%0A🎨 *Estilo Deseado:* ${answers.style}%0A💰 *Inversión:* ${answers.budget}%0A%0A_Acabo de aplicar a la Sesión Estratégica Premium en la web. ¿Cuándo agendamos?_`;
    window.open(`https://wa.me/573017355046?text=${message}`, '_blank');
    onClose();
  };

  // Motion variants for slide/fade of questions
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="w-full max-w-2xl bg-[#0D0D0D] border border-white/10 rounded-[32px] shadow-[0_30px_100px_rgba(176,35,46,0.25)] overflow-hidden relative flex flex-col min-h-[580px]"
          >
            {/* Top Progress bar */}
            {!isFinished && !isProcessing && (
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 z-20">
                <motion.div
                  className="bg-gradient-to-r from-[#B0232E] to-[#FF453A] h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Header */}
            <div className="bg-[#121212] p-6 border-b border-white/5 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B0232E]/70 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B0232E]"></span>
                </span>
                <span className="text-white/60 font-mono text-[10px] tracking-[0.25em] uppercase">Aplicación Privada v2.0</span>
              </div>
              <button 
                type="button" 
                onClick={onClose} 
                className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-grow p-8 md:p-12 flex flex-col justify-center relative">
              <AnimatePresence mode="wait" custom={direction}>
                {isProcessing ? (
                  <motion.div 
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <div className="w-24 h-24 mx-auto mb-8 bg-[#B0232E]/10 rounded-full flex items-center justify-center relative border border-[#B0232E]/20 shadow-[0_0_50px_rgba(176,35,46,0.2)]">
                      <Loader2 size={44} className="text-[#B0232E] animate-spin" />
                      <Sparkles size={20} className="absolute -top-1 -right-1 text-amber-500 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Evaluando Perfil...</h3>
                    <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
                      Nuestros algoritmos están analizando tu marca <span className="text-[#B0232E] font-bold">{answers.brand}</span> para el mercado de contenido viral.
                    </p>
                  </motion.div>
                ) : isFinished ? (
                  <motion.div 
                    key="finished"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-center"
                  >
                    <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                      <ShieldCheck size={36} />
                    </div>
                    <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tight mb-3">Métricas Obtenidas</h3>
                    <p className="text-white/60 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                      ¡Felicidades! Tu marca cumple con los requisitos iniciales. Haz clic abajo para iniciar la sesión estratégica directa con nuestro Director Creativo.
                    </p>

                    <div className="bg-black/50 border border-white/5 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto space-y-3.5 font-mono text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/40">Marca:</span>
                        <span className="text-white font-bold text-right">{answers.brand}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/40">Objetivo:</span>
                        <span className="text-white font-bold text-right truncate max-w-[200px]">{answers.objective}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Inversión:</span>
                        <span className="text-white font-bold text-right text-green-400">{answers.budget}</span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={sendToWhatsApp}
                      className="w-full max-w-md mx-auto py-5 bg-[#B0232E] hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-[0_10px_30px_rgba(176,35,46,0.4)] flex items-center justify-center gap-3 active:scale-95 hover:-translate-y-0.5 transform"
                    >
                      <MessageSquare size={18} /> Iniciar Sesión por WhatsApp ⚡
                    </button>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-4">Redirección directa a WhatsApp corporativo</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                  >
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3.5 text-[#B0232E]">
                          <div className="p-3 bg-[#B0232E]/10 rounded-xl border border-[#B0232E]/20">
                            <User size={20} />
                          </div>
                          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B0232E]">Paso 01 / Identificación</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                          Queremos conocer tu imperio creativo 🎥
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                          Para brindarte una auditoría personalizada de alto calibre, facilítanos tus datos esenciales.
                        </p>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Tu Nombre Completo</label>
                            <input 
                              type="text" 
                              name="name"
                              value={answers.name}
                              onChange={handleInputChange}
                              className="w-full bg-[#121212] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#B0232E] focus:outline-none transition-colors text-sm"
                              placeholder="Ej. Juan Pérez"
                              autoFocus
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Nombre de tu Marca / Empresa</label>
                            <input 
                              type="text" 
                              name="brand"
                              value={answers.brand}
                              onChange={handleInputChange}
                              className="w-full bg-[#121212] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#B0232E] focus:outline-none transition-colors text-sm"
                              placeholder="Ej. Nike Latam"
                            />
                          </div>
                          
                          <button 
                            type="button"
                            onClick={nextStep}
                            disabled={!answers.name || !answers.brand}
                            className="w-full py-4.5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#B0232E] hover:text-white transition-all rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
                          >
                            Siguiente Paso <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3.5 text-blue-400">
                          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Target size={20} />
                          </div>
                          <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400">Paso 02 / Visión</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                          ¿Qué objetivo estratégico persigues?
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                          Hola <strong className="text-white">{answers.name}</strong>, dinos qué hito crítico deseas conquistar en la siguiente fase de tu negocio.
                        </p>

                        <textarea 
                          name="objective"
                          value={answers.objective}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-[#121212] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 focus:outline-none transition-colors text-sm resize-none"
                          placeholder="Ej. Deseo captar leads high-ticket calificados mediante reels de alta retención..."
                        />
                        
                        <div className="flex flex-wrap gap-2">
                          {["Volverse Viral ⚡", "Captar Leads High-Ticket 📈", "Cerrar más Ventas 💰", "Branding Institucional 📽️"].map(opt => (
                            <button 
                              key={opt}
                              type="button"
                              onClick={() => setAnswers(prev => ({...prev, objective: opt}))}
                              className={`text-[10px] px-3.5 py-2 rounded-full border transition-all uppercase tracking-widest font-bold ${
                                answers.objective === opt 
                                  ? 'bg-blue-500/20 border-blue-400 text-white' 
                                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button 
                            type="button"
                            onClick={prevStep}
                            className="w-1/3 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-colors"
                          >
                            Atrás
                          </button>
                          <button 
                            type="button"
                            onClick={nextStep}
                            disabled={!answers.objective}
                            className="w-2/3 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-blue-500 transition-all rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            Continuar <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3.5 text-amber-500">
                          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <Trophy size={20} />
                          </div>
                          <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500">Paso 03 / Terreno</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                          ¿En qué nicho o industria compite tu marca?
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                          {[
                            "E-commerce & Tech / SaaS",
                            "Marcas Personales / Creadores",
                            "Inmobiliaria & Real Estate",
                            "Gastronomía & Restaurantes de Lujo",
                            "Salud, Estética & Belleza",
                            "Servicios Profesionales High-Ticket"
                          ].map((opt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleOptionClick('industry', opt)}
                              className="text-left p-5 rounded-2xl bg-[#121212] border border-white/5 hover:border-[#B0232E] hover:bg-[#B0232E]/5 text-white/70 hover:text-white transition-all duration-300 flex justify-between items-center group text-xs font-bold uppercase tracking-wider"
                            >
                              {opt}
                              <ChevronRight size={16} className="text-white/20 group-hover:text-[#B0232E] group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>

                        <button 
                          type="button"
                          onClick={prevStep}
                          className="w-full py-4.5 bg-white/5 border border-white/5 text-white/50 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-colors"
                        >
                          Atrás
                        </button>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3.5 text-purple-400">
                          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <Camera size={20} />
                          </div>
                          <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400">Paso 04 / Dirección</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                          ¿Cómo visualizas la identidad estética?
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                          {[
                            "Cinematográfico, Vanguardista & Dark",
                            "Minimalista, Limpio & Premium",
                            "Urbano, Enérgico & Atrevido",
                            "Corporativo, Sobrio & Trascendental"
                          ].map((opt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleOptionClick('style', opt)}
                              className="text-left p-5 rounded-2xl bg-[#121212] border border-white/5 hover:border-purple-500 hover:bg-purple-500/5 text-white/70 hover:text-white transition-all duration-300 flex justify-between items-center group text-xs font-bold uppercase tracking-wider"
                            >
                              {opt}
                              <ChevronRight size={16} className="text-white/20 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>

                        <button 
                          type="button"
                          onClick={prevStep}
                          className="w-full py-4.5 bg-white/5 border border-white/5 text-white/50 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-colors"
                        >
                          Atrás
                        </button>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3.5 text-emerald-400">
                          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <Heart size={20} />
                          </div>
                          <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">Paso 05 / Presupuesto</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                          Elige tu escala de inversión proyectada
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                          {[
                            "Menos de 1M COP (Estándar Inicial)",
                            "Entre 1M y 3M COP (Crecimiento)",
                            "Entre 3M y 6M COP (Premium Estables)",
                            "Más de 6M COP (Escalar Viralmente)"
                          ].map((opt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleOptionClick('budget', opt)}
                              className="text-left p-5 rounded-2xl bg-[#121212] border border-white/5 hover:border-emerald-500 hover:bg-[#10B981]/5 text-white/70 hover:text-white transition-all duration-300 flex justify-between items-center group text-xs font-bold uppercase tracking-wider animate-fade-in"
                            >
                              {opt}
                              <ChevronRight size={16} className="text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>

                        <button 
                          type="button"
                          onClick={prevStep}
                          className="w-full py-4.5 bg-white/5 border border-white/5 text-white/50 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-colors"
                        >
                          Atrás
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="bg-[#121212] p-5 border-t border-white/5 text-center flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-white/30" />
              <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.1em]">Cumplimiento Estricto de Privacidad RGPD & Consent Mode v2 Activos</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InteractiveBrief;
