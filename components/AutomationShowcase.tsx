import React, { useState } from 'react';
import { Database, Mail, MessageSquare, Zap, Clock, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, User, FileText, DollarSign, Bell } from 'lucide-react';

const workflows = {
  real_estate: {
    id: 'real_estate',
    title: 'Inmobiliaria',
    trigger: 'Nuevo Lead (Portales/Ads)',
    steps: [
      { icon: <Database size={18} />, label: 'Guardar en CRM', color: 'bg-blue-500' },
      { icon: <MessageSquare size={18} />, label: 'WhatsApp Bienvenida', color: 'bg-green-500' },
      { icon: <Bell size={18} />, label: 'Notificar Agente', color: 'bg-yellow-500' },
      { icon: <Clock size={18} />, label: 'Seguimiento (Día 3)', color: 'bg-purple-500' }
    ],
    result: 'Cita Agendada Automáticamente'
  },
  ecommerce: {
    id: 'ecommerce',
    title: 'E-commerce',
    trigger: 'Carrito Abandonado',
    steps: [
      { icon: <Clock size={18} />, label: 'Esperar 1 Hora', color: 'bg-gray-500' },
      { icon: <Mail size={18} />, label: 'Email Recordatorio', color: 'bg-orange-500' },
      { icon: <DollarSign size={18} />, label: 'Ofrecer Cupón 5%', color: 'bg-green-500' },
      { icon: <Database size={18} />, label: 'Actualizar Inventario', color: 'bg-blue-500' }
    ],
    result: 'Recuperación de Venta'
  },
  agency: {
    id: 'agency',
    title: 'Agencias / Servicios',
    trigger: 'Pago Recibido',
    steps: [
      { icon: <FileText size={18} />, label: 'Generar Factura', color: 'bg-red-500' },
      { icon: <Database size={18} />, label: 'Crear Carpeta Drive', color: 'bg-blue-500' },
      { icon: <Mail size={18} />, label: 'Email Onboarding', color: 'bg-purple-500' },
      { icon: <User size={18} />, label: 'Asignar Tareas Equipo', color: 'bg-pink-500' }
    ],
    result: 'Cliente Listo para Iniciar'
  }
};

const AutomationShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof workflows>('real_estate');
  const currentFlow = workflows[activeTab];

  return (
    <section className="py-24 bg-movie-dark border-y border-white/5 relative overflow-hidden">
      {/* Background Grid - Blueprint Style */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Intro */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-full mb-6">
             <Zap size={16} className="text-blue-400 animate-pulse" />
             <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">La Fábrica Invisible</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
            TU NEGOCIO EN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">PILOTO AUTOMÁTICO</span>
          </h2>
          <p className="text-movie-silver max-w-2xl mx-auto text-lg leading-relaxed">
            Mientras tú duermes, nuestros bots trabajan. Conectamos tus apps favoritas (n8n, Make, Zapier) para eliminar el trabajo manual repetitivo.
          </p>
        </div>

        {/* --- COMPARISON TABLE --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
           
           {/* Manual Way */}
           <div className="bg-red-900/5 border border-red-500/20 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 text-red-500/10 opacity-20 group-hover:opacity-40 transition-opacity">
                 <AlertTriangle size={150} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                 <span className="p-2 bg-red-500/20 rounded-lg"><User className="text-red-500" size={20}/></span>
                 El Método Manual
              </h3>
              <ul className="space-y-4">
                 <li className="flex gap-3 text-movie-silver text-sm">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Errores humanos (dedazos, olvidos).</span>
                 </li>
                 <li className="flex gap-3 text-movie-silver text-sm">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Respuesta lenta (El lead se enfría).</span>
                 </li>
                 <li className="flex gap-3 text-movie-silver text-sm">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Costos altos de nómina para tareas simples.</span>
                 </li>
                 <li className="flex gap-3 text-movie-silver text-sm">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>No escalable (Tienes límite de horas).</span>
                 </li>
              </ul>
           </div>

           {/* Automated Way */}
           <div className="bg-green-900/5 border border-green-500/20 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 text-green-500/10 opacity-20 group-hover:opacity-40 transition-opacity">
                 <Zap size={150} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                 <span className="p-2 bg-green-500/20 rounded-lg"><Zap className="text-green-500" size={20}/></span>
                 La Automatización
              </h3>
              <ul className="space-y-4">
                 <li className="flex gap-3 text-movie-silver text-sm">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Cero errores. Ejecución perfecta 24/7.</span>
                 </li>
                 <li className="flex gap-3 text-movie-silver text-sm">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Respuesta inmediata (Conversión x3).</span>
                 </li>
                 <li className="flex gap-3 text-movie-silver text-sm">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Ahorro masivo en costos operativos.</span>
                 </li>
                 <li className="flex gap-3 text-movie-silver text-sm">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Escalabilidad infinita (Procesa 1 o 10k leads).</span>
                 </li>
              </ul>
           </div>

        </div>

        {/* --- INTERACTIVE WORKFLOW VISUALIZER --- */}
        <div className="max-w-6xl mx-auto bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
           
           {/* Controls */}
           <div className="flex border-b border-white/10 overflow-x-auto">
              {Object.values(workflows).map((flow) => (
                 <button
                    key={flow.id}
                    onClick={() => setActiveTab(flow.id as any)}
                    className={`px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all whitespace-nowrap ${
                       activeTab === flow.id 
                       ? 'bg-white/10 text-white border-b-2 border-blue-500' 
                       : 'text-movie-silver hover:text-white hover:bg-white/5'
                    }`}
                 >
                    {flow.title}
                 </button>
              ))}
           </div>

           {/* The Diagram */}
           <div className="p-8 md:p-16 relative min-h-[400px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]">
              
              {/* Animation Layer */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
              </div>

              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                 
                 {/* Trigger */}
                 <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] font-bold border-4 border-gray-200 z-10">
                       INICIO
                    </div>
                    <div className="text-center">
                       <p className="text-xs text-movie-silver uppercase font-bold tracking-widest mb-1">Trigger</p>
                       <p className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded border border-white/10">{currentFlow.trigger}</p>
                    </div>
                 </div>

                 {/* Arrow */}
                 <div className="hidden md:block flex-1 h-1 bg-white/10 relative mx-4">
                    <div className="absolute inset-0 bg-blue-500/50 animate-[shimmer_2s_infinite] w-full origin-left"></div>
                    <ArrowRight className="absolute -right-2 -top-2.5 text-blue-500" />
                 </div>
                 
                 {/* Steps Container */}
                 <div className="flex flex-col md:flex-row gap-4 relative">
                    {/* Mobile Arrow */}
                    <div className="md:hidden h-8 w-1 bg-white/10 mx-auto my-2"></div>
                    
                    {currentFlow.steps.map((step, idx) => (
                       <div key={idx} className="relative group">
                          {idx > 0 && <div className="hidden md:block absolute top-1/2 -left-4 w-4 h-1 bg-white/10"></div>}
                          
                          <div className={`w-32 h-32 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center transition-all duration-500 hover:scale-110 hover:border-white/30 z-10 shadow-lg ${idx * 100}ms-delay animate-fade-in-up`}>
                             <div className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center text-white mb-3 shadow-lg`}>
                                {step.icon}
                             </div>
                             <p className="text-white text-xs font-bold leading-tight">{step.label}</p>
                          </div>

                          {/* Connection Lines (Mobile) */}
                          {idx < currentFlow.steps.length - 1 && (
                             <div className="md:hidden h-8 w-1 bg-white/10 mx-auto"></div>
                          )}
                       </div>
                    ))}
                 </div>

                 {/* Arrow */}
                 <div className="hidden md:block flex-1 h-1 bg-white/10 relative mx-4">
                    <div className="absolute inset-0 bg-green-500/50 animate-[shimmer_2s_infinite_1s] w-full origin-left"></div>
                    <ArrowRight className="absolute -right-2 -top-2.5 text-green-500" />
                 </div>

                 {/* Result */}
                 <div className="flex flex-col items-center gap-4 animate-fade-in delay-500 mt-8 md:mt-0">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] font-bold border-4 border-green-400 z-10 animate-pulse-slow">
                       FIN
                    </div>
                    <div className="text-center">
                       <p className="text-xs text-movie-silver uppercase font-bold tracking-widest mb-1">Resultado</p>
                       <p className="text-green-400 font-bold text-sm bg-black/50 px-3 py-1 rounded border border-green-500/30">{currentFlow.result}</p>
                    </div>
                 </div>

              </div>
           </div>
        </div>

        {/* --- ROI STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto text-center">
           <div className="p-6 bg-white/5 rounded-xl border border-white/5">
              <Clock size={32} className="text-blue-400 mx-auto mb-2" />
              <h4 className="text-3xl font-black text-white mb-1">20h+</h4>
              <p className="text-xs text-movie-silver uppercase tracking-wider">Ahorradas por semana</p>
           </div>
           <div className="p-6 bg-white/5 rounded-xl border border-white/5">
              <TrendingUp size={32} className="text-green-400 mx-auto mb-2" />
              <h4 className="text-3xl font-black text-white mb-1">35%</h4>
              <p className="text-xs text-movie-silver uppercase tracking-wider">Aumento en conversión</p>
           </div>
           <div className="p-6 bg-white/5 rounded-xl border border-white/5">
              <DollarSign size={32} className="text-yellow-400 mx-auto mb-2" />
              <h4 className="text-3xl font-black text-white mb-1">ROI 10x</h4>
              <p className="text-xs text-movie-silver uppercase tracking-wider">Retorno de Inversión</p>
           </div>
        </div>

      </div>
    </section>
  );
};

export default AutomationShowcase;
