import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Globe, Cpu, ArrowRight, Calendar, Sparkles, MessageCircle, Play, 
  MapPin, Award, CheckCircle, Users, Heart, Star, Sliders, ChevronRight, Calculator
} from 'lucide-react';
import { leadsService } from '../lib/leadsService';
import SEO from './SEO';

interface CityData {
  name: string;
  slug: string;
  accent: string;
  region: string;
  landmark: string;
  weddingCopy: string;
  businessCopy: string;
  keywords: string;
  stats: { projects: string; satisfaction: string; clients: string };
}

const cities: Record<string, CityData> = {
  cartagena: {
    name: "Cartagena",
    slug: "cartagena",
    accent: "La Heroica",
    region: "Bolívar",
    landmark: "Centro Histórico",
    weddingCopy: "Capturamos bodas de ensueño frente al mar y entre las murallas coloniales del Centro Histórico. Nuestra producción audiovisual cinematográfica inmortaliza cada segundo del día más especial de tu vida en Cartagena.",
    businessCopy: "Impulsamos negocios gastronómicos, hoteleros e inmobiliarios en Bocagrande y el Centro Histórico. Creamos embudos de venta de alta conversión, pauta publicitaria hipersegmentada y páginas web ultrarrápidas.",
    keywords: "Fotógrafo de Bodas en Cartagena, Creación de Contenido Cartagena, Diseño Web Cartagena, Producción Audiovisual Cartagena, Bodas Cartagena, Pauta Digital Cartagena",
    stats: { projects: "150+", satisfaction: "99.2%", clients: "45+ Hoteles/Bar/Bodas" }
  },
  medellin: {
    name: "Medellín",
    slug: "medellin",
    accent: "La Ciudad de la Eterna Primavera",
    region: "Antioquia",
    landmark: "El Poblado",
    weddingCopy: "Inmortalizamos tu boda con la vibrante energía y los paisajes montañosos de Antioquia. Grabación en formato cinematográfico 4K, drones FPV sobrevolando El Poblado y Llano Grande, y un montaje de película.",
    businessCopy: "Aceleramos startups de base tecnológica, e-commerce y marcas personales en El Poblado, Laureles y el Valle de Aburrá. Te ayudamos a escalar con Inteligencia Artificial, automatizaciones eficientes y SEO programático.",
    keywords: "Fotógrafo de Bodas en Medellín, Diseño Web Medellín, Pauta Digital Medellín, Crecimiento E-commerce Medellín, Automatización IA Medellín, Bodas Medellín, Videos Medellín",
    stats: { projects: "280+", satisfaction: "99.6%", clients: "80+ Startups & Marcas" }
  },
  bogota: {
    name: "Bogotá",
    slug: "bogota",
    accent: "La Capital",
    region: "Cundinamarca",
    landmark: "Usaquén",
    weddingCopy: "Estilo sofisticado y elegancia urbana o campestre en la Sabana de Bogotá. Capturamos bodas íntimas en Usaquén y grandes celebraciones con calidad cinematográfica inigualable, luz artística y sonido perfecto.",
    businessCopy: "La agencia preferida de corporaciones y e-commerce en Bogotá. Desarrollamos portales web robustos, campañas publicitarias masivas de alto retorno de inversión en Meta/Google, y automatizaciones VIP con IA.",
    keywords: "Fotógrafo de Bodas en Bogotá, Agencia de Marketing Bogotá, Diseño Web Bogotá, Pauta Publicitaria Bogotá, Agencia Creativa Bogotá, Bodas en la Sabana Bogotá",
    stats: { projects: "340+", satisfaction: "98.9%", clients: "120+ Corporativos & E-commerce" }
  },
  barranquilla: {
    name: "Barranquilla",
    slug: "barranquilla",
    accent: "La Puerta de Oro",
    region: "Atlántico",
    landmark: "Miramar",
    weddingCopy: "Inmortalizamos bodas llenas de color, alegría e intensidad caribeña en el Atlántico. Cobertura ininterrumpida con cámaras profesionales y drones FPV de última generación para capturar momentos inolvidables.",
    businessCopy: "Desarrollamos estrategias de contenido viral y diseño web de clase mundial en Miramar y el sector corporativo del Atlántico. Domina el mercado inmobiliario y comercial con pauta óptima e IA.",
    keywords: "Fotógrafo de Bodas en Barranquilla, Diseño Web Barranquilla, Marketing Digital Barranquilla, Producción Audiovisual Barranquilla, Redes Sociales Barranquilla",
    stats: { projects: "110+", satisfaction: "99.4%", clients: "35+ Empresas e Inmobiliarias" }
  }
};

export default function LocalSEOPage() {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'audiovisual' | 'digital'>('audiovisual');
  const [showCalculator, setShowCalculator] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [calculatorState, setCalculatorState] = useState({
    videoChecked: true,
    webChecked: false,
    adsChecked: false,
    videoTier: 'premium', // basic, premium, cinematic
    pagesCount: 1,
    adsMonthlyBudget: 1000000,
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    isSending: false
  });

  const rawCitySlug = (city || '').toLowerCase().trim();
  const currentCityKey = cities[rawCitySlug] ? rawCitySlug : 'cartagena';
  const cData = cities[currentCityKey];

  // Dynamically configure meta title and meta descriptions as requested in Phase 1
  const seoTitle = activeTab === 'audiovisual' 
    ? `Fotógrafo de Bodas en ${cData.name} | Captura Cinematográfica`
    : `Diseño Web y Pauta Digital en ${cData.name} | Agencia`;

  const seoDescription = activeTab === 'audiovisual'
    ? `Inmortaliza tu boda en ${cData.name} (${cData.accent}). Producción audiovisual en 4K, drones e historias de amor reales. ¡Verifica disponibilidad de fecha hoy mismo!`
    : `Escala tus ventas en ${cData.name} con pauta digital inteligente, páginas web a medida y automatizaciones de IA de alta conversión de la mano de LA MOVIE.`;

  // Auto scroll to top on city change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentCityKey]);

  // Compute estimate dynamically
  const calculateTotal = () => {
    let total = 0;
    if (calculatorState.videoChecked) {
      if (calculatorState.videoTier === 'basic') total += 1200000;
      else if (calculatorState.videoTier === 'premium') total += 2400000;
      else total += 3800000;
    }
    if (calculatorState.webChecked) {
      total += 1500000 + (calculatorState.pagesCount - 1) * 350000;
    }
    if (calculatorState.adsChecked) {
      total += 800000 + (calculatorState.adsMonthlyBudget * 0.15); // fee base + 15% investment
    }
    return Math.round(total);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const handleCalculatorFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculatorState.leadName || !calculatorState.leadPhone) return;

    setCalculatorState(prev => ({ ...prev, isSending: true }));

    const selectedServices: string[] = [];
    if (calculatorState.videoChecked) selectedServices.push(`Audiovisual (${calculatorState.videoTier})`);
    if (calculatorState.webChecked) selectedServices.push(`Web (${calculatorState.pagesCount} secciones)`);
    if (calculatorState.adsChecked) selectedServices.push(`Ads (Presupuesto de inversión: ${formatCurrency(calculatorState.adsMonthlyBudget)})`);

    const leadInfo = {
      name: calculatorState.leadName,
      email: calculatorState.leadEmail,
      phone: calculatorState.leadPhone,
      service: `Cotizador IA - ${cData.name} (MultiCity)`,
      message: `Presupuesto calculado: ${formatCurrency(calculateTotal())}.\nServicios seleccionados: ${selectedServices.join(', ')}.\nCiudad: ${cData.name}.`
    };

    const response = await leadsService.submitLead(leadInfo);
    setCalculatorState(prev => ({ ...prev, isSending: false }));

    if (response) {
      setIsSubmitSuccessful(true);
      setTimeout(() => {
        setIsSubmitSuccessful(false);
        setShowCalculator(false);
      }, 3500);
    }
  };

  return (
    <div className="bg-movie-black min-h-screen text-white pt-24 pb-16 relative overflow-hidden">
      <SEO 
        title={seoTitle} 
        description={seoDescription} 
        keywords={`${cData.keywords}, LA MOVIE, Marketing Digital ${cData.name}`}
      />

      {/* Decorative localized ambient glowing fields */}
      <div className="absolute top-[10%] left-[-15%] w-[50%] h-[50%] bg-[#B0232E]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[45%] h-[45%] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Multicity Quick Switcher */}
        <div className="flex justify-center flex-wrap gap-2.5 mb-12">
          {Object.values(cities).map((cityObj) => {
            const isActiveCity = cityObj.slug === currentCityKey;
            return (
              <button
                key={cityObj.slug}
                onClick={() => navigate(`/servicios/${cityObj.slug}`)}
                className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 border ${
                  isActiveCity
                    ? 'bg-[#B0232E] text-white border-[#B0232E] shadow-[0_5px_20px_rgba(176,35,46,0.3)]'
                    : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                <MapPin size={12} className={isActiveCity ? "animate-bounce" : ""} />
                {cityObj.name}
              </button>
            );
          })}
        </div>

        {/* Localized Hero Display Segment */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
            <Sparkles size={12} className="text-[#B0232E] animate-pulse" />
            <span className="text-[10px] text-white/80 font-mono uppercase tracking-[0.2em]">Sede Oficial: {cData.name} ({cData.region})</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase italic leading-[0.9] mb-4">
            LA MOVIE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-movie-red to-orange-500">{cData.name}</span>
          </h1>
          <p className="text-movie-silver font-medium text-base md:text-lg mb-4 tracking-wide font-mono">
            Estética Cinematográfica • Conversión Inteligente • {cData.accent}
          </p>
          <p className="text-white/40 text-xs max-w-2xl mx-auto italic">
            Operamos localmente con equipos e iluminación cinematográfica prime de última tecnología en {cData.landmark} y toda el área metropolitana de {cData.name}.
          </p>
        </div>

        {/* Dynamic Niche Selector Toggles */}
        <div className="flex justify-center max-w-xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 mb-16">
          <button
            onClick={() => setActiveTab('audiovisual')}
            className={`flex-1 py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'audiovisual'
                ? 'bg-gradient-to-r from-[#B0232E] to-red-700 text-white shadow-[0_10px_25px_rgba(176,35,46,0.25)]'
                : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Camera size={14} />
              <span>Nicho Audiovisual</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('digital')}
            className={`flex-1 py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'digital'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white shadow-[0_10px_25px_rgba(124,58,237,0.25)]'
                : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe size={14} />
              <span>Nicho Digital & Web</span>
            </div>
          </button>
        </div>

        {/* Main Tab Content with custom spring entry animations */}
        <AnimatePresence mode="wait">
          {activeTab === 'audiovisual' ? (
            <motion.div
              key="audiovisual"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Cinematic text column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block bg-[#B0232E]/20 text-[#B0232E] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border border-[#B0232E]/30">
                  Bodas y Pedidas de Mano
                </div>
                
                <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tighter italic text-white">
                  Fotografía de Bodas en {cData.name} <br />
                  <span className="text-red-500 font-light text-2xl font-sans not-italic block mt-1">
                    Historias contadas a 24 fotogramas por segundo.
                  </span>
                </h2>

                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  {cData.weddingCopy} Usamos ópticas fijas luminosas, estabilizadores avanzados y drones aéreos 4K DJI, logrando ese look cinemático y cálido digno de un festival de cine.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                  <div className="border-l-2 border-[#B0232E] pl-4">
                    <span className="block text-white font-mono font-bold text-lg">{cData.stats.projects}</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Bodas Inmortales</span>
                  </div>
                  <div className="border-l-2 border-[#B0232E] pl-4">
                    <span className="block text-white font-mono font-bold text-lg">Cinema 4K</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Garantizado</span>
                  </div>
                  <div className="border-l-2 border-[#B0232E] pl-4">
                    <span className="block text-white font-mono font-bold text-lg">Next Day</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Teaser Express</span>
                  </div>
                </div>

                {/* Micro SEO dynamic section indexable by crawlers */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs space-y-2 text-white/40">
                  <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest block">Servicios integrales en {cData.name}:</span>
                  <p>Cobertura integral en {cData.landmark}, pre-boda, bodas de destino, fotografía artística, drones FPV y fotógrafos especializados en celebraciones caribeñas e imponentes templos coloniales.</p>
                </div>

                {/* Smart CTA 1: Wedding Call-to-action */}
                <div className="pt-6">
                  <a
                    id="cta-wedding-multicity"
                    href={`https://wa.me/573017355046?text=Hola%20LA%20MOVIE,%20quisiera%20verificar%20la%20disponibilidad%20de%20fecha%20para%20la%20cobertura%20cinematográfica%20de%20mi%20boda%20en%20${cData.name}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3.5 bg-gradient-to-r from-[#B0232E] to-red-600 hover:from-white hover:to-white text-white hover:text-black font-black uppercase tracking-[0.15em] text-xs py-4.5 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_12px_30px_rgba(176,35,46,0.35)] cursor-pointer"
                  >
                    <span>Verificar Disponibilidad de Fecha 📅</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* Graphical visual mockup representation */}
              <div className="lg:col-span-5 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-purple-600/20 rounded-3xl blur-[30px] opacity-20 pointer-events-none group-hover:opacity-40 transition-all duration-500"></div>
                <div className="relative border border-white/10 rounded-3xl overflow-hidden bg-movie-dark aspect-[4/5] shadow-2xl flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop" 
                    alt={`Boda cinematográfica en ${cData.name}`} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 select-none grayscale hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[9px] text-[#B0232E] font-bold uppercase tracking-widest mb-1">CÁMARA SONY FX3 | {cData.name}</span>
                    <h3 className="text-white font-heading font-bold text-lg uppercase">La Película de Tu Amor</h3>
                    <p className="text-white/40 text-[10px] mt-1">Inmortalización cinemática premium en alta fidelidad.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="digital"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Technological details segment */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block bg-purple-900/20 text-purple-400 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border border-purple-800/30">
                  Desarrollo Web & Pauta Digital
                </div>

                <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tighter italic text-white">
                  Diseño Web y Pauta Digital en {cData.name} <br />
                  <span className="text-purple-400 font-light text-2xl font-sans not-italic block mt-1">
                    Tráfico calificado e interfaces web futuristas.
                  </span>
                </h2>

                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  {cData.businessCopy} Escalamos marcas combinando el diseño UI/UX de vanguardia con arquitecturas ultralivianas en Next.js, SEO de alto impacto y campañas omnicanal inteligentes.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                  <div className="border-l-2 border-purple-500 pl-4">
                    <span className="block text-white font-mono font-bold text-lg">{cData.stats.clients}</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Marcas Activas</span>
                  </div>
                  <div className="border-l-2 border-purple-500 pl-4">
                    <span className="block text-white font-mono font-bold text-lg">{cData.stats.satisfaction}</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Satisfacción</span>
                  </div>
                  <div className="border-l-2 border-purple-500 pl-4">
                    <span className="block text-white font-mono font-bold text-lg">IA + Web</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Sincronización</span>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs space-y-2 text-white/40">
                  <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest block">Servicios de posicionamiento en {cData.name}:</span>
                  <p>Configuración de píxeles Meta, Google Analytics (Consent Mode v2 respetuoso), automatización de leads en WhatsApp, diseño web responsivo y optimización de tasa de conversión (CRO) para el comercio de {cData.landmark}.</p>
                </div>

                {/* Smart CTA 2: IA Pricing Estimator trigger */}
                <div className="pt-6">
                  <button
                    id="cta-budget-multicity"
                    onClick={() => setShowCalculator(true)}
                    className="inline-flex items-center gap-3.5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-white hover:to-white text-white hover:text-black font-black uppercase tracking-[0.15em] text-xs py-4.5 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_12px_30px_rgba(124,58,237,0.35)] cursor-pointer"
                  >
                    <Calculator size={14} />
                    <span>Calcular Presupuesto con IA ⚡</span>
                  </button>
                </div>
              </div>

              {/* Graphical representation mock */}
              <div className="lg:col-span-5 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/20 rounded-3xl blur-[30px] opacity-20 pointer-events-none group-hover:opacity-40 transition-all duration-500"></div>
                <div className="relative border border-white/10 rounded-3xl overflow-hidden bg-movie-dark aspect-[4/5] shadow-2xl flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" 
                    alt={`Desarrollo web y anuncios en ${cData.name}`} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 select-none grayscale hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mb-1">CONVERSION ADS & DEV | {cData.name}</span>
                    <h3 className="text-white font-heading font-bold text-lg uppercase">Escalado Exponencial</h3>
                    <p className="text-white/40 text-[10px] mt-1">Interfaces ultra rápidas optimizadas para pauta agresiva.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic bottom localized visual index cards */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <div className="text-center mb-12">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#B0232E] mb-2">Presencia Multiciudad</h3>
            <h4 className="text-2xl md:text-4xl font-heading font-black uppercase">Agencia Nacional con Visión Cinematográfica</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.values(cities).map((cityItem) => {
              const matchesSelected = cityItem.slug === currentCityKey;
              return (
                <div
                  key={cityItem.slug}
                  onClick={() => navigate(`/servicios/${cityItem.slug}`)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    matchesSelected
                      ? 'bg-[#B0232E]/5 border-[#B0232E] shadow-[0_10px_25px_rgba(176,35,46,0.1)]'
                      : 'bg-white/[0.01] border-white/5 hover:border-white/25 hover:bg-white/[0.03]'
                  }`}
                >
                  <MapPin size={20} className={matchesSelected ? "text-[#B0232E]" : "text-white/30"} />
                  <h5 className="text-lg font-bold text-white mt-4 uppercase italic tracking-tight">{cityItem.name}</h5>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-mono">{cityItem.accent}</p>
                  <p className="text-xs text-white/60 mt-3 line-clamp-3">{cityItem.landmark} y alrededores.</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#B0232E] font-bold uppercase tracking-widest mt-4">
                    <span>Ver Servicios</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal: Interactive Pricing Smart Budget Calculator */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-3xl text-white relative my-4"
            >
              <button
                onClick={() => setShowCalculator(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
              >
                ✖
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-900/40 text-purple-400 rounded-xl flex items-center justify-center border border-purple-800/30">
                  <Calculator size={18} />
                </div>
                <div>
                  <h3 className="text-white font-heading font-black text-xs uppercase tracking-[0.2em] leading-none">Smart Quote Estimator</h3>
                  <span className="text-[9px] text-[#B0232E] font-bold uppercase tracking-widest bg-[#B0232E]/10 border border-[#B0232E]/30 px-2 py-0.5 mt-1 inline-block rounded-md">
                    Algoritmo LA MOVIE {cData.name}
                  </span>
                </div>
              </div>

              {!isSubmitSuccessful ? (
                <form onSubmit={handleCalculatorFormSubmit} className="space-y-6">
                  
                  {/* Selected Config Checkboxes */}
                  <div className="space-y-3.5">
                    
                    {/* Video Production Scope */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.04]">
                      <label className="flex items-start gap-3.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={calculatorState.videoChecked}
                          onChange={(e) => setCalculatorState(prev => ({ ...prev, videoChecked: e.target.checked }))}
                          className="mt-1 w-4 h-4 accent-[#B0232E] rounded cursor-pointer"
                        />
                        <div className="flex-grow select-none">
                          <span className="text-xs font-black uppercase tracking-wider text-white">Producción de Video Profesional</span>
                          <p className="text-[10px] text-white/40 mt-0.5">Teaser de alta definición, clips para redes sociales, drones FPV.</p>
                          
                          {calculatorState.videoChecked && (
                            <div className="mt-3 flex gap-2">
                              {['basic', 'premium', 'cinematic'].map(tier => (
                                <button
                                  key={tier}
                                  type="button"
                                  onClick={() => setCalculatorState(prev => ({ ...prev, videoTier: tier }))}
                                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                    calculatorState.videoTier === tier
                                      ? 'bg-red-900/30 text-red-400 border border-red-500/30'
                                      : 'bg-white/5 text-white/40 hover:bg-white/10 border border-transparent'
                                  }`}
                                >
                                  {tier === 'basic' ? 'Basic (1.2M)' : tier === 'premium' ? 'Premium (2.4M)' : 'Cinema (3.8M)'}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Developer Web Scope */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.04]">
                      <label className="flex items-start gap-3.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={calculatorState.webChecked}
                          onChange={(e) => setCalculatorState(prev => ({ ...prev, webChecked: e.target.checked }))}
                          className="mt-1 w-4 h-4 accent-purple-500 rounded cursor-pointer"
                        />
                        <div className="flex-grow select-none">
                          <span className="text-xs font-black uppercase tracking-wider text-white">Desarrollo Web & Landing Page Autoadministrable</span>
                          <p className="text-[10px] text-white/40 mt-0.5">Next.js/React, diseño UI/UX premium personalizado, SEO programático local.</p>
                          
                          {calculatorState.webChecked && (
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[10px] text-white/60 font-semibold uppercase">Cantidad de Secciones / Landings:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCalculatorState(prev => ({ ...prev, pagesCount: Math.max(1, prev.pagesCount - 1) }))}
                                  className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs w-6 text-center text-white">{calculatorState.pagesCount}</span>
                                <button
                                  type="button"
                                  onClick={() => setCalculatorState(prev => ({ ...prev, pagesCount: Math.min(10, prev.pagesCount + 1) }))}
                                  className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Meta Ads Marketing Scope */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.04]">
                      <label className="flex items-start gap-3.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={calculatorState.adsChecked}
                          onChange={(e) => setCalculatorState(prev => ({ ...prev, adsChecked: e.target.checked }))}
                          className="mt-1 w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                        <div className="flex-grow select-none">
                          <span className="text-xs font-black uppercase tracking-wider text-white">Pauta Publicitaria (Meta, Google, Tiktok)</span>
                          <p className="text-[10px] text-white/40 mt-0.5">Campañas completas de generación de leads con reportes semanales.</p>
                          
                          {calculatorState.adsChecked && (
                            <div className="mt-3.5 space-y-2">
                              <div className="flex justify-between text-[10px] text-white/60 uppercase">
                                <span>Inversión Mensual Proyectada:</span>
                                <span className="font-mono text-purple-400 font-bold">{formatCurrency(calculatorState.adsMonthlyBudget)} COP</span>
                              </div>
                              <input
                                type="range"
                                min={500000}
                                max={5000000}
                                step={100000}
                                value={calculatorState.adsMonthlyBudget}
                                onChange={(e) => setCalculatorState(prev => ({ ...prev, adsMonthlyBudget: Number(e.target.value) }))}
                                className="w-full accent-purple-500 cursor-pointer h-1 bg-white/10 rounded"
                              />
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                  </div>

                  {/* Calculated summary bar */}
                  <div className="bg-white/5 border border-white/10 p-4.5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Presupuesto Estimado</span>
                      <div className="text-xl md:text-2xl font-black font-mono text-green-400 mt-1">
                        {calculatorState.videoChecked || calculatorState.webChecked || calculatorState.adsChecked 
                          ? formatCurrency(calculateTotal()) 
                          : "$0 COP"
                        }
                      </div>
                    </div>
                    <span className="text-[9px] text-[#B0232E] font-black uppercase tracking-widest bg-[#B0232E]/10 border border-[#B0232E]/20 px-2 py-1 rounded">
                      En {cData.name}
                    </span>
                  </div>

                  {/* Lead input capture */}
                  <div className="border-t border-white/10 pt-5 space-y-3.5">
                    <span className="text-[10px] text-white/50 uppercase font-black tracking-widest block">Recibir Propuesta Detallada:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Tu Nombre Completó *"
                          value={calculatorState.leadName}
                          onChange={(e) => setCalculatorState(prev => ({ ...prev, leadName: e.target.value }))}
                          className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#B0232E] focus:outline-none py-3 px-4 rounded-xl text-xs placeholder:text-white/30 text-white transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Número de WhatsApp *"
                          value={calculatorState.leadPhone}
                          onChange={(e) => setCalculatorState(prev => ({ ...prev, leadPhone: e.target.value }))}
                          className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#B0232E] focus:outline-none py-3 px-4 rounded-xl text-xs placeholder:text-white/30 text-white transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Correo Electrónico (Opcional)"
                        value={calculatorState.leadEmail}
                        onChange={(e) => setCalculatorState(prev => ({ ...prev, leadEmail: e.target.value }))}
                        className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#B0232E] focus:outline-none py-3 px-4 rounded-xl text-xs placeholder:text-white/30 text-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={calculatorState.isSending || (!calculatorState.videoChecked && !calculatorState.webChecked && !calculatorState.adsChecked)}
                      className="w-full bg-gradient-to-r from-[#B0232E] to-red-600 hover:from-white hover:to-white text-white hover:text-black py-4 px-6 rounded-xl font-black uppercase text-xs tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] cursor-pointer"
                    >
                      {calculatorState.isSending ? 'PROCESANDO PRESUPUESTO...' : 'Enviar Cotización Digital ⚡'}
                    </button>
                    <p className="text-[9px] text-white/30 text-center mt-3">Al presionar, un especialista de LA MOVIE {cData.name} se conectará vía WhatsApp para afinar los detalles.</p>
                  </div>

                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold uppercase tracking-widest text-white">¡Presupuesto Sincronizado!</h4>
                  <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
                    Hemos capturado tus preferencias exitosamente para la sede <strong>{cData.name}</strong>. En unos instantes recibirás la propuesta simplificada en tu WhatsApp.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
