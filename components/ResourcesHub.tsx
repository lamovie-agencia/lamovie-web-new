import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, Sparkles, LayoutGrid, CheckCircle, Smartphone, Award, Star, 
  MessageCircle, FileText, ArrowUpRight, HelpCircle, Gift, Mail, User, Phone, Check, Film
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { leadsService } from '../lib/leadsService';
import SEO from './SEO';

interface ResourceTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  difficulty: string;
  downloads: string;
  rating: string;
  canvaLink: string;
  imageUrl: string;
}

const resourcesData: ResourceTemplate[] = [
  {
    id: "reels-pack",
    title: "Pack de Reels Virales para Contratistas & Creativos",
    category: "Instagram & TikTok",
    description: "Plantillas de alto impacto con ganchos psicológicos validados para duplicar tu retención. Totalmente editables en Canva Gratis.",
    format: "Plantilla Canva (15 Diseños)",
    difficulty: "Principiante",
    downloads: "4.2K+ Descargados",
    rating: "4.9/5",
    canvaLink: "https://canva.com",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "pitch-deck",
    title: "Pitch Deck de Ventas Cinematográfico para Startups",
    category: "Presentaciones",
    description: "Consigue la atención de inversionistas o grandes empresas con este diseño elegante y oscuro con tipografías premium y transiciones limpias.",
    format: "Presentación Canva (20 Slides)",
    difficulty: "Intermedio",
    downloads: "2.8K+ Descargados",
    rating: "4.8/5",
    canvaLink: "https://canva.com",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "media-kit",
    title: "Media Kit Minimalista para Creadores de Contenido",
    category: "Branding",
    description: "La carta de presentación definitiva para enviar a patrocinadores. Incluye secciones de métricas, audiencia y tarifas profesionales.",
    format: "Folleto Canva (3 Planillas)",
    difficulty: "Principiante",
    downloads: "3.5K+ Descargados",
    rating: "4.9/5",
    canvaLink: "https://canva.com",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "invoice-receipt",
    title: "Plantilla de Facturación y Cotización en Alta Estética",
    category: "Administrativo",
    description: "Impresiona a tus clientes desde el primer número. Diseño limpio, ordenado y completamente automatizable para autónomos y agencias.",
    format: "Documento A4 Canva",
    difficulty: "Principiante",
    downloads: "5.1K+ Descargados",
    rating: "4.7/5",
    canvaLink: "https://canva.com",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "retention-hacks",
    title: "101 Ganchos de Retención & Giones de TikTok",
    category: "Ebook Express",
    description: "PDF ultra práctico con copy directo creado por nuestro Growth Director para evitar los abandonos en los primeros 3 segundos de reproducción.",
    format: "Ebook PDF",
    difficulty: "Avanzado",
    downloads: "8.4K+ Descargados",
    rating: "4.9/5",
    canvaLink: "https://canva.com",
    imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=400&auto=format&fit=crop"
  }
];

export default function ResourcesHub() {
  const [selectedResource, setSelectedResource] = useState<ResourceTemplate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const triggerDownloadModal = (resource: ResourceTemplate) => {
    setSelectedResource(resource);
    setShowModal(true);
    setDownloadSuccess(false);
  };

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;

    setIsSending(true);

    const leadInfo = {
      name: leadName,
      email: leadEmail,
      phone: leadPhone || 'No proporcionado',
      service: `Hub de Recursos - Descarga: ${selectedResource?.title}`,
      message: `Solicitó el recurso premium gratis: ${selectedResource?.title}.\nFormato: ${selectedResource?.format}`
    };

    const response = await leadsService.submitLead(leadInfo);
    setIsSending(false);

    if (response) {
      setDownloadSuccess(true);
      // Create mockup immediate delivery link download trigger
      setDownloadLink(selectedResource?.canvaLink || 'https://canva.com');
      
      // Auto trigger immediate download opening in background after brief delay
      setTimeout(() => {
        window.open(selectedResource?.canvaLink || 'https://canva.com', '_blank');
      }, 1000);
    }
  };

  // Build high-converting Schema.org structured markup for SEO Rich Snippets as requested
  const creativeWorkSchemaList = resourcesData.map((res) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": res.title,
    "genre": res.category,
    "description": res.description,
    "fileFormat": "Canva Template/PDF",
    "contentRating": "G",
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/DownloadAction",
      "userInteractionCount": res.downloads.replace(/\D/g, '')
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock",
      "category": "Free Template"
    }
  }));

  return (
    <div className="bg-movie-black min-h-screen text-white pt-24 pb-16 relative overflow-hidden">
      {/* Helmet SEO and Rich Schema Injection */}
      <SEO 
        title="Plantillas Canva Gratis & Herramientas para Emprendedores" 
        description="Descarga plantillas de Canva gratis de alto impacto visual y recursos premium para potenciar tu marca. Kit de reels, pitch decks y herramientas de conversión."
        keywords="plantillas canva gratis, herramientas para emprendedores, recursos de marketing gratis, plantillas canva marketing, LA MOVIE recursos, reels canva gratis"
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": creativeWorkSchemaList
          })}
        </script>
      </Helmet>

      {/* Decorative gradients */}
      <div className="absolute top-[5%] right-[-10%] w-[45%] h-[45%] bg-movie-red/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[45%] h-[45%] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Cinematic Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-900/15 border border-purple-800/30 rounded-full mb-6 text-purple-400">
            <Gift size={13} className="animate-bounce" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black">RECURSOS GRATUITOS ILIMITADOS</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter uppercase leading-[0.95] mb-5">
            HERRAMIENTAS PARA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-[#B0232E]">EMPRENDEDORES</span>
          </h1>
          
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            Olvídate de la pauta fría y los diseños mediocres que no convierten. Descarga nuestro stock exclusivo de <strong>plantillas canva gratis</strong> y recursos validados por directores de crecimiento de <strong>LA MOVIE</strong> para acelerar tu conversión hoy mismo. Estilo oscuro, estético y 100% editable.
          </p>
        </div>

        {/* Highlight Main VIP Pack Hero Section Banner */}
        <div className="bg-gradient-to-br from-[#0D0D0D] via-[#14080B] to-[#0D0D0D] border border-red-900/25 rounded-3xl p-6 md:p-10 mb-16 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#B0232E]/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="lg:w-7/12 space-y-5 relative z-10">
            <span className="bg-[#B0232E]/10 text-[#B0232E] border border-[#B0232E]/30 text-[9px] font-black tracking-widest px-3 py-1 rounded-md uppercase inline-block font-mono">STARTER PACK COMPLETO</span>
            <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight leading-none uppercase">
              EL MEGA-PACK CREADOR ULTRALIGERO 🎁
            </h2>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed">
              Descarga en un solo archivo comprimido todas nuestras mejores plantillas: ganchos de retención para reels, plantillas para facturación estética, contratos de freelancing, y un set de presentaciones cinemáticas de impacto. Todo editable en minutos con tu cuenta gratuita de Canva.
            </p>
            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-white/50">
              <span className="flex items-center gap-1.5"><Check size={12} className="text-green-500" /> 100% Gratis</span>
              <span className="flex items-center gap-1.5"><Check size={12} className="text-green-500" /> Formatos Editables</span>
              <span className="flex items-center gap-1.5"><Check size={12} className="text-green-500" /> E-E-A-T Validado</span>
            </div>
            
            {/* Mega Pack Trigger */}
            <div className="pt-2">
              <button
                id="mega-pack-download-btn"
                onClick={() => triggerDownloadModal({
                  id: "mega-pack-completo",
                  title: "Mega-Pack Creador Ultraligero Completo",
                  category: "VIP Bundle",
                  description: "Incluye todos los ganchos, giones de TikTok, maquetas de presentaciones y facturas estéticas de LA MOVIE.",
                  format: "ZIP Completo (Templates + PDF)",
                  difficulty: "Cualquiera",
                  downloads: "12K+",
                  rating: "5.0",
                  canvaLink: "https://canva.com",
                  imageUrl: ""
                })}
                className="bg-gradient-to-r from-[#B0232E] to-red-600 hover:from-white hover:to-white text-white hover:text-black py-4 px-8 rounded-xl font-black uppercase text-xs tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-[0_12px_28px_rgba(176,35,46,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={14} className="animate-bounce" />
                <span>Descargar Pack Premium Gratis 🎁</span>
              </button>
            </div>
          </div>

          <div className="lg:w-5/12 flex justify-center">
            <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-movie-dark aspect-video w-full max-w-sm">
              <img 
                src="https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=format&fit=crop" 
                alt="Pack premium gratis para emprendedores" 
                className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-5">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-[#B0232E] text-white px-2.5 py-1.5 rounded rounded-none">
                  <Film size={12} /> CONTENIDO EXCLUSIVO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Cards Grid Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resourcesData.map((res) => (
            <div
              key={res.id}
              className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden flex flex-col group hover:border-[#B0232E]/30 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-movie-dark">
                <img
                  src={res.imageUrl}
                  alt={res.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white/80 font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10">
                  {res.format}
                </div>
              </div>

              {/* Resource Content Info Details */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-400 uppercase font-black tracking-widest">{res.category}</span>
                    <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-1 font-mono">
                      <Star size={10} fill="currentColor" /> {res.rating}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white uppercase italic tracking-tight group-hover:text-red-500 transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed max-w-sm line-clamp-3">
                    {res.description}
                  </p>
                </div>

                {/* Meta stats block */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[10px] text-white/40 font-mono">
                  <span>Dificultad: <strong>{res.difficulty}</strong></span>
                  <span>{res.downloads}</span>
                </div>

                {/* Direct Download Action Trigger Button */}
                <button
                  onClick={() => triggerDownloadModal(res)}
                  className="w-full bg-white/5 hover:bg-[#B0232E] hover:text-white text-white py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 border border-white/5 hover:border-transparent cursor-pointer"
                >
                  <Download size={12} />
                  <span>Descargar Pack Premium Gratis 🎁</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Inbound FAQ section explicitly to target the keywords in search queries */}
        <div className="mt-24 border-t border-white/10 pt-16 max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#B0232E] mb-2">Ayuda y Preguntas Frecuentes</h3>
            <h4 className="text-2xl md:text-4xl font-heading font-black uppercase">Recursos de Valor para Potenciar tu Negocio</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="space-y-2">
              <h5 className="font-bold text-sm text-white uppercase flex items-center gap-2">
                <HelpCircle size={14} className="text-[#B0232E]" /> ¿Por qué son gratis estas plantillas de canva?
              </h5>
              <p className="text-xs text-white/60 leading-relaxed">
                Queremos empoderar la cultura de creación y diseño estético en la región. Al darte acceso gratuito, probamos la autoridad técnica y la entrega cinemática de <strong>LA MOVIE</strong> para que pienses en nosotros cuando decidas escalar al siguiente nivel.
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-bold text-sm text-white uppercase flex items-center gap-2">
                <HelpCircle size={14} className="text-[#B0232E]" /> ¿Cómo editar estas herramientas en Canva Gratis?
              </h5>
              <p className="text-xs text-white/60 leading-relaxed">
                Es inmediato. Al registrarte y descargar el pack, obtienes un PDF con los enlaces directos de canva. Al hacer clic se abrirá el asistente para copiar la plantilla directamente en tu cuenta gratuita sin restricciones de marca de agua.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* LEAD CAPTATION DISCOVERY SUBSCRIPTION OVERLAY MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-[#0D0D0D] border border-[#B0232E]/30 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_20px_rgba(176,35,46,0.12)] text-white relative my-4 overflow-hidden"
            >
              {/* Highlight background red aura */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B0232E]/10 blur-[80px] rounded-full pointer-events-none"></div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
              >
                ✖
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-950/40 text-[#B0232E] rounded-xl flex items-center justify-center border border-red-900/30">
                  <Gift size={18} />
                </div>
                <div>
                  <h3 className="text-white font-heading font-black text-xs uppercase tracking-[0.2em] leading-none">Descargar Recurso VIP</h3>
                  <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest mt-1 inline-block">Suscripción Inmediata</span>
                </div>
              </div>

              {!downloadSuccess ? (
                <form onSubmit={handleDownloadSubmit} className="space-y-5">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono font-bold">Recurso Seleccionado</span>
                    <h4 className="text-white font-bold text-xs uppercase font-heading">{selectedResource?.title}</h4>
                    <p className="text-[9px] text-purple-400 uppercase tracking-widest font-mono mt-1 mt-0.5">{selectedResource?.format} • {selectedResource?.downloads}</p>
                  </div>

                  <p className="text-white/70 text-xs leading-relaxed">
                    Ingresa tus credenciales oficiales para desbloquear el enlace y ser notificado de nuevas actualizaciones y herramientas para emprendedores gratuitas semanales.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className="relative">
                      <User size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        required
                        placeholder="Tu Nombre Completo *"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:border-[#B0232E] focus:outline-none py-3 pl-11 pr-4 rounded-xl text-xs placeholder:text-white/30 text-white transition-all focus:ring-1 focus:ring-[#B0232E]/30"
                      />
                    </div>

                    <div className="relative">
                      <Mail size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="email"
                        required
                        placeholder="Tu Correo Electrónico *"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:border-[#B0232E] focus:outline-none py-3 pl-11 pr-4 rounded-xl text-xs placeholder:text-white/30 text-white transition-all focus:ring-1 focus:ring-[#B0232E]/30"
                      />
                    </div>

                    <div className="relative">
                      <Phone size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        placeholder="WhatsApp (Opcional)"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:border-[#B0232E] focus:outline-none py-3 pl-11 pr-4 rounded-xl text-xs placeholder:text-white/30 text-white transition-all focus:ring-1 focus:ring-[#B0232E]/30"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSending || !leadName || !leadEmail}
                      className="w-full bg-[#B0232E] hover:bg-neutral-100 text-white hover:text-black py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                    >
                      {isSending ? 'AUTORIZANDO CREDENCIALES...' : 'Descargar Pack Premium Gratis 🎁'}
                    </button>
                    <p className="text-[9px] text-white/30 text-center mt-3">Respetamos la privacidad. No vendemos tus datos y enviamos cero spam.</p>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                    <Check size={24} />
                  </div>
                  
                  <h4 className="text-lg font-bold uppercase tracking-wider text-white">¡Desbloqueo Completado!</h4>
                  <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                    El pack <strong>{selectedResource?.title}</strong> se abrirá en una nueva pestaña. Si no se inicia automáticamente, haz clic abajo.
                  </p>

                  <div className="pt-4 grid grid-cols-2 gap-2">
                    <a
                      href={downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-[#B0232E] to-red-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center"
                    >
                      Abrir Canva
                    </a>
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
