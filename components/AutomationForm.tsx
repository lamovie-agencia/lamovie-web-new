import React, { useState } from 'react';
import { X, Send, Cpu, MessageSquare, Database, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { leadsService } from '../lib/leadsService';

interface AutomationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AutomationForm: React.FC<AutomationFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    objective: '',
    traffic: '',
    tools: [] as string[],
    name: ''
  });

  if (!isOpen) return null;

  const toggleTool = (tool: string) => {
    if (data.tools.includes(tool)) {
      setData({ ...data, tools: data.tools.filter(t => t !== tool) });
    } else {
      setData({ ...data, tools: [...data.tools, tool] });
    }
  };

  const handleFinish = async () => {
    if (!data.name.trim()) {
      alert("Por favor indica tu nombre.");
      return;
    }

    const toolsStr = data.tools.length > 0 ? data.tools.join(', ') : 'Ninguna';
    
    // Register lead
    await leadsService.submitLead({
      name: data.name,
      service: "Agentes IA & Automatización",
      message: `Objetivo: ${data.objective} | Tráfico: ${data.traffic} | Herramientas: ${toolsStr}`
    });

    const message = `🤖 *DIAGNÓSTICO AUTOMATIZACIÓN*%0A%0A👤 *Nombre:* ${data.name}%0A🎯 *Objetivo:* ${data.objective}%0ATraffic *Volumen:* ${data.traffic}%0A🛠 *Herramientas:* ${toolsStr}%0A%0A_Quiero saber cómo implementar Agentes IA y Llamadas Reales._`;
    window.open(`https://wa.me/573017355046?text=${message}`, '_blank');
    onClose();
    setStep(1);
    setData({ objective: '', traffic: '', tools: [], name: '' });
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg bg-movie-dark border border-green-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden relative flex flex-col min-h-[500px]">
        
        {/* Header */}
        <div className="bg-black/50 p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Cpu size={20} className="text-green-500 animate-pulse" />
            <span className="text-white font-bold text-sm tracking-widest uppercase">Configurador de Agentes</span>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="w-full bg-white/5 h-1">
           <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">¿Qué proceso te quita más tiempo?</h3>
              <div className="space-y-3">
                {[
                  { id: 'support', label: 'Responder Preguntas Frecuentes', icon: <MessageSquare size={18}/> },
                  { id: 'sales', label: 'Cerrar Ventas / Agendar', icon: <TrendingUp size={18}/> },
                  { id: 'data', label: 'Organizar Clientes / Excel', icon: <Database size={18}/> }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setData({ ...data, objective: opt.label }); setStep(2); }}
                    className="w-full text-left p-4 rounded-lg bg-white/5 border border-white/10 hover:border-green-500 hover:bg-green-500/10 hover:text-white transition-all flex items-center gap-3 text-movie-silver"
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">¿Cuántos chats/leads recibes al día?</h3>
              <div className="space-y-3">
                {['1 - 10 (Bajo)', '10 - 50 (Medio)', '+50 (Alto / Necesito ayuda urgente)'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setData({ ...data, traffic: opt }); setStep(3); }}
                    className="w-full text-left p-4 rounded-lg bg-white/5 border border-white/10 hover:border-green-500 hover:bg-green-500/10 hover:text-white transition-all text-movie-silver"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">¿Qué usas actualmente? (Selecciona varios)</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['WhatsApp Business', 'Instagram DM', 'Excel / Sheets', 'CRM (HubSpot/Otro)', 'Sitio Web', 'Nada aún'].map((tool) => (
                  <button
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${data.tools.includes(tool) ? 'bg-green-500/20 border-green-500 text-white' : 'bg-white/5 border-white/10 text-movie-silver hover:border-white/30'}`}
                  >
                    {tool}
                    {data.tools.includes(tool) && <CheckCircle size={14} className="text-green-500" />}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(4)}
                className="w-full py-4 bg-white text-black font-bold uppercase hover:bg-green-500 hover:text-white transition-all rounded flex items-center justify-center gap-2"
              >
                Siguiente <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">¡Casi listo! Tu nombre:</h3>
              <input 
                type="text" 
                value={data.name}
                onChange={(e) => setData({...data, name: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded p-4 text-white focus:border-green-500 focus:outline-none transition-colors mb-6"
                placeholder="Ej. Carlos Gomez"
                autoFocus
              />
              <button 
                onClick={handleFinish}
                disabled={!data.name}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-widest rounded shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} /> Obtener Diagnóstico
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AutomationForm;