
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  Crown,
  Film,
  Globe,
  LayoutTemplate,
  Monitor,
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { adminService } from '../lib/adminService';

const iconMap: Record<string, { icon: React.ReactNode; tone: string }> = {
  Film: { icon: <Film size={28} />, tone: 'bg-red-500/10 text-red-300' },
  Crown: { icon: <Crown size={28} />, tone: 'bg-amber-400/10 text-amber-200' },
  Star: { icon: <Star size={28} />, tone: 'bg-fuchsia-500/10 text-fuchsia-200' },
  Monitor: { icon: <Monitor size={28} />, tone: 'bg-cyan-500/10 text-cyan-200' },
  Globe: { icon: <Globe size={28} />, tone: 'bg-emerald-500/10 text-emerald-200' },
  ShoppingBag: { icon: <ShoppingBag size={28} />, tone: 'bg-orange-500/10 text-orange-200' },
  LayoutTemplate: { icon: <LayoutTemplate size={28} />, tone: 'bg-violet-500/10 text-violet-200' },
  Zap: { icon: <Zap size={28} />, tone: 'bg-red-500/10 text-red-300' },
  Sparkles: { icon: <Sparkles size={28} />, tone: 'bg-yellow-400/10 text-yellow-200' },
};

interface PricingProps {
  whatsappNumber?: string;
}

type TabKey = 'social' | 'estrategia' | 'web';

const tabMeta: Record<TabKey, { label: string; headline: string; copy: string; cta: string }> = {
  social: {
    label: 'Social Media',
    headline: 'SOCIAL MEDIA',
    copy: 'Activación orgánica, contenido de alta conversión y una cadencia de publicación que convierte seguidores en demanda.',
    cta: 'ACTIVAR SISTEMA',
  },
  estrategia: {
    label: 'Tráfico & Performance',
    headline: 'TRÁFICO & PERFORMANCE',
    copy: 'Funnel de captura, campañas con hiperespecialización y analítica para escalar cada mes con intención comercial.',
    cta: 'ESCALAR VENTAS',
  },
  web: {
    label: 'Desarrollo Web',
    headline: 'DESARROLLO WEB',
    copy: 'Sitios de alto impacto, autoridad visual y velocidad comercial para convertir visitas en clientes listos para cerrar.',
    cta: 'INICIAR IMPERIO',
  },
};

const Pricing: React.FC<PricingProps> = ({ whatsappNumber = '573017355046' }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('social');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [waStatus, setWaStatus] = useState('');
  const [isOpeningWa, setIsOpeningWa] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await adminService.getPricing();
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch pricing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#pricing-web') setActiveTab('web');
      else if (hash === '#pricing-social') setActiveTab('social');
      else if (hash === '#pricing-estrategia') setActiveTab('estrategia');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const currentPlans = useMemo(() => plans.filter((plan) => plan.category === activeTab), [plans, activeTab]);

  const handleOpenWhatsapp = (plan: any) => {
    const name = leadName.trim() || 'Cliente';
    const company = leadCompany.trim() || 'Sin empresa';
    const email = leadEmail.trim() || 'sin correo';

    if (!leadName.trim()) {
      setWaStatus('Escribe tu nombre para continuar por WhatsApp.');
      return;
    }

    setIsOpeningWa(true);
    const message = `Hola, soy ${name}. Quiero conocer el plan ${plan.name} para ${company}. Correo: ${email}.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
    setWaStatus(`Redirigiendo a WhatsApp para ${plan.name}.`);
    setIsOpeningWa(false);
  };

  if (loading) {
    return null;
  }

  return (
    <section id="pricing" className="py-24 bg-[#070707] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] z-0 mix-blend-screen pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,24,58,0.16),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/80 mb-5">
            <Zap size={14} className="text-red-400" /> Inversión Inteligente
          </div>
          <h3 className="text-4xl md:text-6xl font-heading font-black mb-4 text-white">
            NUESTROS <span className="text-red-500">PAQUETES</span>
          </h3>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Configurable, dinámico y listo para vender rápido. Selecciona la vertical y vuelve cada tarjeta una conversación de cierre.
          </p>
        </div>

        <div className="flex justify-center mb-14 px-4">
          <div className="relative flex items-center rounded-full border border-white/10 bg-[#0b0b0b] p-1.5 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur">
            <div
              className={`absolute top-1.5 bottom-1.5 rounded-full bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.55)] transition-all duration-300 ${
                activeTab === 'social'
                  ? 'left-1.5 w-[calc(33.33%-4px)]'
                  : activeTab === 'estrategia'
                    ? 'left-[calc(33.33%+1.5px)] w-[calc(33.33%-4px)]'
                    : 'left-[calc(66.66%+1.5px)] w-[calc(33.33%-4px)]'
              }`}
            />
            {(Object.keys(tabMeta) as TabKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`relative z-10 px-5 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                  activeTab === key ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {tabMeta[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-8">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] px-6 py-5 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.45em] text-red-300 mb-2">{tabMeta[activeTab].headline}</p>
            <p className="text-sm md:text-base text-white/70 leading-relaxed">{tabMeta[activeTab].copy}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {currentPlans.map((plan, index) => {
            const iconEntry = iconMap[plan.icon] || iconMap.Zap;
            const isRecommended = Boolean(plan.recommended);

            return (
              <motion.div
                key={plan.id ?? `${activeTab}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className={`relative flex flex-col rounded-[30px] border bg-[#0a0a0a] overflow-hidden transition-all duration-300 ${
                  isRecommended
                    ? 'border-red-400/80 scale-[1.03] shadow-[0_30px_90px_rgba(239,68,68,0.18)]'
                    : 'border-white/10 hover:border-white/30 hover:-translate-y-1'
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,24,58,0.12),transparent_38%)]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500 px-4 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-white shadow-[0_10px_30px_rgba(239,68,68,0.35)]">
                    <Crown size={12} /> Mejor Retorno (ROI)
                  </div>
                )}

                <div className="p-8 pb-6">
                  <div className={`inline-flex rounded-2xl p-3 ${iconEntry.tone} border border-white/10`}>{iconEntry.icon}</div>
                  <h4 className="mt-6 text-2xl md:text-[1.6rem] font-heading font-black uppercase italic text-white leading-tight">
                    {plan.name}
                  </h4>
                  <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-white/70">
                    Página: {plan.page || 'pricing'}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/70 border-l border-white/10 pl-3 min-h-[88px]">
                    {plan.description || 'Plan dinámico listo para vender con claridad y urgencia comercial.'}
                  </p>
                </div>

                <div className="px-8">
                  <div className="rounded-[24px] border border-white/10 bg-black/40 px-5 py-5 text-center backdrop-blur-sm">
                    <div className="flex items-end justify-center gap-1 text-white">
                      <span className="pb-1 text-sm font-bold text-white/70">$</span>
                      <span className="text-4xl md:text-5xl font-black tracking-tight">{plan.price}</span>
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-white/55">{plan.period || 'Pago único'}</p>
                  </div>
                </div>

                <div className="px-8 py-6 flex-1">
                  <ul className="space-y-3">
                    {(Array.isArray(plan.features) ? plan.features : []).map((feature, featureIndex) => (
                      <li key={`${plan.id}-${featureIndex}`} className="flex items-start gap-3 text-sm text-white/75">
                        <span className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${isRecommended ? 'bg-red-500 text-white' : 'bg-white/10 text-white/80'}`}>
                          <Check size={12} />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-8 pb-8 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setWaStatus('');
                    }}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                      isRecommended
                        ? 'bg-red-500 text-white shadow-[0_20px_45px_rgba(239,68,68,0.35)] hover:bg-white hover:text-black'
                        : 'border border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white hover:text-black'
                    }`}
                  >
                    {tabMeta[activeTab].cta}
                    <span className="text-base">↗</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-10">
            <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#090909] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-red-300 font-black">Formulario previo</p>
                  <h4 className="mt-3 text-2xl font-black uppercase italic text-white">Continuar con {selectedPlan.name}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan(null);
                    setWaStatus('');
                  }}
                  className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70"
                >
                  Cerrar
                </button>
              </div>
              <p className="mt-3 text-sm text-white/70">Completa estos datos para abrir WhatsApp con el paquete correcto y un mensaje listo para enviar.</p>
              <div className="mt-6 space-y-3">
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
                <input
                  type="text"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  placeholder="Empresa o marca"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
              </div>
              {waStatus && <p className="mt-4 text-xs text-yellow-300">{waStatus}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsapp(selectedPlan)}
                  disabled={isOpeningWa}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                >
                  {isOpeningWa ? 'Abriendo...' : 'Enviar a WhatsApp'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/80"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/60">
            <Check size={14} className="text-emerald-300" /> Soluciones integrales • Sin proveedores múltiples
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
