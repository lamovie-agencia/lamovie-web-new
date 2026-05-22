import React, { useState, useEffect, useRef } from 'react';
import { Bot, Brain, Cpu, Sparkles, Zap, Loader2, ArrowRight, CheckCircle, ShieldAlert, Award, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { leadsService } from '../lib/leadsService';

const AISection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);
  
  // Embedded Form State
  const [formStep, setFormStep] = useState(1);
  const [bottleNeck, setBottleNeck] = useState("");
  const [leadVolume, setLeadVolume] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientWhatsApp, setClientWhatsApp] = useState("");
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scoreData, setScoreData] = useState({ score: 0, loss: 0, level: "" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateScoreAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientWhatsApp.trim()) return;

    setIsLoadingScore(true);

    // Calculate dynamic scores based on parameters
    let score = 75;
    let baseLoss = 450;

    if (bottleNeck === "Responder Chats") { score += 10; baseLoss += 200; }
    if (bottleNeck === "Cerrar/Agendar citas") { score += 12; baseLoss += 350; }
    if (leadVolume === "+50 leads") { score += 11; baseLoss += 400; }

    let calculatedScore = Math.min(score, 97);
    let calculatedLoss = baseLoss;
    let automationLevel = calculatedScore > 85 ? "Crítico / Alta Prioridad" : "Moderado / Recomendable";

    setScoreData({
      score: calculatedScore,
      loss: calculatedLoss,
      level: automationLevel
    });

    // CRM synchronization
    await leadsService.submitLead({
      name: clientName,
      phone: clientWhatsApp,
      service: "AI Score Test",
      message: `CuelloBotella: ${bottleNeck} | Leads diarios: ${leadVolume} | Score calculado: ${calculatedScore}% | Pérdida estimada: $${calculatedLoss} USD`
    });

    // Simulate analysis processing for 2 seconds
    setTimeout(() => {
      setIsLoadingScore(false);
      setShowResult(true);
    }, 2000);
  };

  const shareScoreOnWhatsApp = () => {
    const message = `🤖 *MI SCORE DE AUTOMATIZACIÓN - LA MOVIE*%0A%0A👤 *Nombre:* ${clientName}%0A🎯 *Puntuación de Automatización:* ${scoreData.score}%25%0A🚨 *Nivel de Vulnerabilidad:* ${scoreData.level}%0A📉 *Pérdida mensual estimada:* $${scoreData.loss} USD%0ADetalles adicionales:%0A- Cuello de botella: ${bottleNeck}%0A- Leads/día: ${leadVolume}%0A%0A_Quiero agendar un zoom para implementar los Agentes IA de Retención._`;
    window.open(`https://wa.me/573017355046?text=${message}`, '_blank');
  };

  return (
    <section ref={containerRef} className="py-24 bg-[#0d0d0d] text-white relative overflow-hidden border-t border-white/5">
      {/* Background decoration consistent with theme */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(176,35,46,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(176,35,46,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"
        style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Editorial Subheader */}
        <div className="text-center md:text-left mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#B0232E]/10 border border-[#B0232E]/20 rounded-full mb-4">
            <Sparkles size={12} className="text-[#B0232E] animate-pulse" />
            <span className="text-[#B0232E] text-[10px] font-bold uppercase tracking-widest">Sistemas Autónomos de Conversión</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight uppercase">
            LA MOVIE AI® INTELLIGENCE
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-3 leading-relaxed">
            Elimina la redundancia operativa. Creamos ecosistemas de venta impulsados por Inteligencia Artificial que trabajan 24/7 sin comisiones ni fatiga.
          </p>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-auto">
          
          {/* Card 1: Editorial Vision Tag (7 cols) */}
          <div className="lg:col-span-7 bg-[#121212] border border-white/5 p-8 md:p-12 rounded-[32px] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#B0232E]/5 blur-3xl -ml-16 -mt-16 rounded-full pointer-events-none"></div>
            
            <div className="space-y-6">
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold font-mono">Doble Impacto: Ahorro & Conversión</span>
              <h3 className="text-3xl md:text-5xl font-black uppercase leading-tight tracking-tight">
                LA IA TRADICIONAL SOLO RESPONDE. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-[#B0232E]">
                  LA NUEVA IA CIERRA VENTAS.
                </span>
              </h3>
              <p className="text-white/60 text-sm max-w-lg leading-relaxed">
                Nuestros agentes inteligentes no actúan bajo un script estático. Comprenden las objeciones en tiempo real, califican el perfil presupuestal del lead y gatillan la pasarela de pago o agendamiento en su punto de mayor calor psicológico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 bg-[#B0232E]/10 border border-[#B0232E]/20 text-[#B0232E] rounded-lg flex items-center justify-center">
                  <Brain size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Nivel Cognitivo Avanzado</h4>
                  <p className="text-[11px] text-white/50 mt-1">Estrategias de venta personalizadas e integración directa con tu CRM.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                  <Cpu size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Ruteo de Voz Ultra-rápido</h4>
                  <p className="text-[11px] text-white/50 mt-1">Llamadas masivas con latencia menor a 600ms que replican humanos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: EMBEDDED GAMIFIED AUTODIAGNOSTICO FORM (5 cols) - CRITICAL CRO */}
          <div className="lg:col-span-5 bg-[#140e0e] border border-white/10 p-8 rounded-[32px] shadow-[0_20px_50px_rgba(176,35,46,0.1)] relative overflow-hidden flex flex-col justify-between group hover:border-[#B0232E]/30 transition-colors">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B0232E]/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>

            <AnimatePresence mode="wait">
              {isLoadingScore ? (
                <motion.div 
                  key="form-loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-grow flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-16 h-16 bg-[#B0232E]/10 border border-[#B0232E]/20 rounded-full flex items-center justify-center text-[#B0232E] animate-spin mb-6">
                    <Loader2 size={32} />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-wider">Modelando Flujo...</h4>
                  <p className="text-xs text-white/50 mt-2 max-w-xs">Calculando ineficiencias y pérdidas operativas por respuesta estancada...</p>
                </motion.div>
              ) : showResult ? (
                <motion.div 
                  key="form-result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono tracking-widest uppercase mb-4">
                      <ShieldAlert size={12} /> Diagnóstico Completado
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 block">Tasa de Viabilidad de Automatización</p>
                    <h4 className="text-6xl font-heading font-black text-[#B0232E] tracking-tighter mt-2">{scoreData.score}%</h4>
                  </div>

                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-3 font-mono text-[11px] leading-relaxed">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Vulnerabilidad:</span>
                      <span className="text-red-400 font-bold uppercase">{scoreData.level}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Fuga Mensual Estimada:</span>
                      <span className="text-white font-bold">${scoreData.loss} USD</span>
                    </div>
                    <p className="text-[10px] text-white/40 italic mt-2">
                      *Debido a la demora humana de agendamiento para {bottleNeck.toLowerCase()}, estás perdiendo prospectos en caliente.
                    </p>
                  </div>

                  <button 
                    onClick={shareScoreOnWhatsApp}
                    className="w-full py-4 bg-[#B0232E] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_25px_rgba(176,35,46,0.3)] flex items-center justify-center gap-2"
                  >
                    Descargar Solución Automatizada ⚡
                  </button>
                  <button 
                    onClick={() => {
                      setShowResult(false);
                      setFormStep(1);
                      setBottleNeck("");
                      setLeadVolume("");
                      setClientName("");
                      setClientWhatsApp("");
                    }}
                    className="w-full text-[10px] text-white/30 hover:text-white uppercase tracking-wider underline text-center block"
                  >
                    Volver a evaluar
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key={`step-${formStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-grow flex flex-col justify-between h-full min-h-[380px]"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#B0232E] font-bold font-mono">Test de Vulnerabilidad</span>
                      <span className="text-[10px] text-white/30 font-mono">Paso {formStep} de 3</span>
                    </div>

                    <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                      ¿Qué tan automatizable es tu proceso de ventas?
                    </h3>
                    <p className="text-white/50 text-[11px] leading-relaxed mt-1 mb-6">
                      Descúbrelo en 3 preguntas cortas de respuesta inmediata.
                    </p>

                    {formStep === 1 && (
                      <div className="space-y-2.5">
                        <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1">¿Dónde está tu cuello de botella crítico?</label>
                        {[
                          "Responder Chats de Dudas",
                          "Cerrar/Agendar citas comerciales",
                          "Registros Manuales en Excel/CRM"
                        ].map(opt => (
                          <button
                            key={opt}
                            onClick={() => { setBottleNeck(opt); setFormStep(2); }}
                            className="w-full text-left p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-red-500 hover:bg-red-500/5 text-xs text-white/70 hover:text-white transition-all font-bold uppercase tracking-wider flex justify-between items-center group"
                          >
                            <span>{opt}</span>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}

                    {formStep === 2 && (
                      <div className="space-y-2.5">
                        <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1">¿Cuál es tu volumen de leads diario?</label>
                        {[
                          "1 a 10 leads/día (Bajo)",
                          "10 a 50 leads/día (Moderado)",
                          "+50 leads/día (Crítico / Responder urgente)"
                        ].map(opt => (
                          <button
                            key={opt}
                            onClick={() => { setLeadVolume(opt); setFormStep(3); }}
                            className="w-full text-left p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-red-500 hover:bg-red-500/5 text-xs text-white/70 hover:text-white transition-all font-bold uppercase tracking-wider flex justify-between items-center group"
                          >
                            <span>{opt}</span>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}

                    {formStep === 3 && (
                      <form onSubmit={calculateScoreAndSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Tu Nombre Comercial</label>
                          <input 
                            type="text" 
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-white focus:border-[#B0232E] focus:outline-none transition-colors"
                            placeholder="Ej. Juan de Burger Co."
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1.5">WhatsApp / Canal de Respuesta</label>
                          <input 
                            type="tel" 
                            required
                            value={clientWhatsApp}
                            onChange={(e) => setClientWhatsApp(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-white focus:border-[#B0232E] focus:outline-none transition-colors"
                            placeholder="Ej. +573017355046"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-4.5 bg-[#B0232E] hover:bg-red-700 text-white font-black uppercase tracking-wider text-[10px] rounded-2xl flex items-center justify-center gap-2 mt-2 transition-all shadow-[0_5px_15px_rgba(176,35,46,0.3)]"
                        >
                          Ver mi Score de Automatización 🤖
                        </button>
                      </form>
                    )}
                  </div>

                  {formStep > 1 && (
                    <button 
                      onClick={() => setFormStep(formStep - 1)}
                      className="text-[#999] hover:text-white text-[9px] uppercase tracking-widest font-mono underline cursor-pointer mt-4 py-2"
                    >
                      Atrás
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card 3: Interactive Logs & Terminal (6 cols) */}
          <div className="lg:col-span-6 bg-[#121212] border border-white/5 p-8 rounded-[32px] overflow-hidden flex flex-col justify-between relative group h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#B0232E] rounded-full animate-ping"></div>
                <span className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Consola n8n_Core Activo</span>
              </div>
              <span className="text-[8px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">STATUS: EXECUTING</span>
            </div>

            <div className="flex-1 bg-black/60 rounded-xl border border-white/5 p-4 font-mono text-[10px] text-cyan-300 h-full overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full p-4 space-y-1">
                <p className="text-white/30">{`[14:11:32] Scanning web processes...`}</p>
                <p className="text-[#B0232E] font-bold">{`[14:11:33] Warning: Conversión estancada por demora humana.`}</p>
                <p className="text-green-400">{`[14:11:34] Agente de Captación n8n activo en WhatsApp.`}</p>
                <p>{`[14:11:35] Optimizando guión semántico...`}</p>
                <p className="text-yellow-400">{`[14:11:36] Integración de base SQL de Leads correcta.`}</p>
                <p className="text-green-400">{`[14:11:37] ROI mensual: +35% Conversiones.`}</p>
                <p className="text-white/40">{`[14:11:38] Procesadores neuronales óptimos.`}</p>
              </div>
            </div>
          </div>

          {/* Card 4: Quick Metrics & Credential (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#121212] to-[#1c0d0e] border border-white/5 p-8 rounded-[32px] flex flex-col justify-between relative group h-[300px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Respuesta Promedio</span>
                <Award size={14} className="text-[#B0232E]" />
              </div>
              <p className="text-sm font-light text-white/70 leading-relaxed max-w-sm">
                Un lead que espera más de 5 minutos para recibir respuesta tiene un <strong className="text-red-400">80% menos de probabilidades</strong> de comprar. Nuestros agentes garantizan respuesta estricta en menos de 2 segundos.
              </p>
            </div>

            <div className="flex items-center gap-10 mt-6 pt-4 border-t border-white/5">
              <div>
                <p className="text-3xl font-heading font-black text-white">0.05s</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Demora de Respuesta</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-black text-[#B0232E]">100%</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Soporte Continuo</p>
              </div>
            </div>
          </div>

          {/* Card 5: BOT DE WHATSAPP OFICIAL ULTRA-SEGURO (12 cols) */}
          <div className="lg:col-span-12 bg-gradient-to-r from-neutral-950 via-[#171212] to-neutral-950 border border-white/10 p-8 md:p-12 rounded-[32px] relative overflow-hidden group hover:border-[#B0232E]/30 transition-all duration-500 shadow-2xl">
            {/* Background glowing effects for maximum prestige */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-[#B0232E]/10 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#B0232E]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Content representation */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Micro Category Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  NUEVO SERVICIO EXCLUSIVO
                </span>

                <h3 className="text-3xl md:text-4xl font-heading font-black text-white leading-none uppercase italic tracking-tighter">
                  BOT WHATSAPP IA | <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-[#B0232E]">ATENCIÓN INMEDIATA</span>
                </h3>

                <p className="text-white/70 text-sm leading-relaxed max-w-2xl font-light">
                  Acelera tus tasas de cierre y elimina los cuellos de botella de soporte. Diseñamos e inyectamos agentes inteligentes entrenados con tu modelo de negocio directamente en tu canal oficial de WhatsApp.
                </p>

                {/* Grid of bold strategic technical benefits */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="flex gap-3">
                    <CheckCircle size={16} className="text-[#B0232E] shrink-0 mt-0.5" />
                    <p className="text-xs text-white/50 leading-relaxed font-light">
                      <strong className="text-white font-bold">Respuesta instantánea:</strong> Diseñado para ofrecer una <strong className="text-white font-bold">respuesta instantánea</strong> 24/7 sin milisegundos de espera para retener leads.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle size={16} className="text-[#B0232E] shrink-0 mt-0.5" />
                    <p className="text-xs text-white/50 leading-relaxed font-light">
                      <strong className="text-[#CCCCCC] font-bold">Tendencias de ventas:</strong> Diseñado para analizar <strong className="text-white font-bold">tendencias de ventas</strong> y objeciones frecuentes en tiempo real.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle size={16} className="text-[#B0232E] shrink-0 mt-0.5" />
                    <p className="text-xs text-white/50 leading-relaxed font-light">
                      <strong className="text-white font-bold">Optimización de procesos:</strong> Logra una <strong className="text-white font-bold">optimización automática de procesos</strong> operativos de forma autónoma.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle size={16} className="text-[#B0232E] shrink-0 mt-0.5" />
                    <p className="text-xs text-white/50 leading-relaxed font-light">
                      <strong className="text-white font-bold">Filtrado avanzado de embudo de ventas:</strong> Realiza un <strong className="text-white font-bold">filtrado avanzado de embudo de ventas</strong> para calificar prospectos antes de que lleguen a un asesor humano.
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure anti-ban validation visual layout - Objections killer */}
              <div className="lg:col-span-5 h-full flex flex-col justify-center">
                <div className="bg-neutral-900/60 border border-[#B0232E]/20 p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between group-hover:border-emerald-500/20 transition-all duration-500 lg:min-h-[280px]">
                  {/* Subtle watermarked background logo */}
                  <div className="absolute top-4 right-4 text-emerald-500/5 select-none font-mono font-bold text-7xl">
                    BSP
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 shrink-0 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl flex items-center justify-center font-black">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-xs font-heading font-black text-white uppercase tracking-wider">Capa de Seguridad Blindada</h4>
                        <span className="text-[9px] text-[#B0232E] font-bold uppercase tracking-widest font-mono">100% Anti-Baneos</span>
                      </div>
                    </div>

                    <div className="font-mono text-[11px] text-white/70 leading-relaxed space-y-3 pt-2">
                      <p className="border-l-2 border-emerald-500/40 pl-3 text-xs">
                        <strong className="text-white font-bold">Ecosistema Potenciado por la API Oficial de Meta | BSP (Business Solution Provider)</strong>.
                      </p>
                      <p className="text-white/50 font-sans text-xs">
                        Garantizamos una <strong className="text-white font-bold">cuenta verificada</strong> y el cumplimiento estricto de las políticas de privacidad, <strong className="text-white font-bold">evitando por completo el bloqueo de cuentas</strong> o números telefónicos.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>POLÍTICAS DE META 2026 OK</span>
                    <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded uppercase">API VERIFICADA</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AISection;
