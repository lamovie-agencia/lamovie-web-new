import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play, Zap, ArrowRight, Star, TrendingUp, CheckCircle2, ChevronRight, Video, Target, Users, ZapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Process from './Process';
import About from './About';
import Contact from './Contact';
import Pricing from './Pricing';
import SEO from './SEO';

const REELS = [
  "https://videos.pexels.com/video-files/5896379/5896379-sd_540_960_24fps.mp4",
  "https://videos.pexels.com/video-files/6981410/6981410-sd_540_960_25fps.mp4",
  "https://videos.pexels.com/video-files/5309381/5309381-sd_540_960_25fps.mp4",
  "https://videos.pexels.com/video-files/7989673/7989673-sd_540_960_25fps.mp4",
  "https://videos.pexels.com/video-files/4955030/4955030-sd_540_960_25fps.mp4",
];

const BRAND_LOGOS = [
  { name: "papi", src: "https://distribuidorapapis.com/wp-content/uploads/2024/06/cropped-LOGO-DP-BLANCO.png" },
  { name: "aym", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZQ87zs1z5Q_P-KqD39dr8unOdZTCwAtlOjw&s" },
  { name: "Cajasai", src: "https://cajasai.com/soporte/wp-content/uploads/2018/03/cropped-LOGO-CAJASAI-VECTORIZADO-2.png" },
  { name: "bahiadelsol", src: "https://static.wixstatic.com/media/fd0487_5c8e753e52084b6d8d35d69cc656e65c~mv2.png/v1/crop/x_0,y_894,w_1641,h_923/fill/w_128,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo-letras-azules.png" },
  { name: "bhk", src: "https://cdn.shopify.com/s/files/1/0700/3052/4636/files/LOGO_BHK_3.png?v=1766181369" },
  { name: "lavitrina", src: "https://www.lavitrinatextil.com/cdn/shop/files/LOGO_LA_VITRINA_TEXTIL_SINFONDO-02.png?v=1770673573&width=1920" },
  { name: "fundacion", src: "https://www.fundacionlaluz.co/_next/image?url=%2FlogoFundacionLaLuz.png&w=96&q=75" },
  { name: "gets", src: "https://getsmobile.shop/wp-content/uploads/2024/06/cropped-logogRecurso-5.png" }
];

const TIPS = [
  { title: "Ganchos Visuales", desc: "Los primeros 3 segundos determinan si el usuario se queda o hace scroll.", icon: <Star className="text-yellow-400" /> },
  { title: "Retención Dinámica", desc: "Cortes rápidos, subtítulos animados y diseño sonoro envolvente.", icon: <ZapIcon className="text-blue-400" /> },
  { title: "Storytelling", desc: "No vendas, cuenta una historia que conecte emocionalmente con tu audiencia.", icon: <TrendingUp className="text-green-400" /> },
  { title: "Llamado a la Acción", desc: "Un CTA claro, creativo y directo aumenta la conversión en un 40%.", icon: <Target className="text-movie-red" /> },
];

const SERVICES = [
  { title: "Estrategia & Consultoría", desc: "Planes de marketing digital a medida para escalar tu posicionamiento en tu sector específico.", icon: <Target size={32} /> },
  { title: "Producción Viral", desc: "Reels y TikToks diseñados algorítmicamente para explotar en visualizaciones y atraer clientes.", icon: <Video size={32} /> },
  { title: "Tráfico Web & SEO", desc: "Campañas en Google, Meta Ads y optimización SEO para multiplicar el tráfico a tus plataformas.", icon: <TrendingUp size={32} /> },
  { title: "Desarrollo & Embudos", desc: "Creación de landing pages de alta conversión y embudos de venta para captar leads y ventas.", icon: <Zap size={32} /> }
];

interface ViralHomeProps {
  lang: 'es' | 'en';
  t: any;
  whatsappNumber?: string;
}

const ViralHome: React.FC<ViralHomeProps> = ({ lang, t, whatsappNumber = '573017355046' }) => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const handleCTA = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Hola%20LA%20MOVIE,%20quiero%20hacer%20mi%20marca%20viral!`, '_blank');
  };

  const [currentWord, setCurrentWord] = React.useState(0);
  const words = ["MARCAS VIRALES", "ECOSISTEMAS WEB", "VENTAS DIARIAS", "TRÁFICO DE PAGO"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#030303] text-white min-h-screen overflow-hidden font-sans selection:bg-movie-red selection:text-white pb-20">
      <SEO 
        title="Inicio | Agencia de Marketing Digital y Tráfico Web" 
        description="Agencia creativa, producción viral, tráfico web y estrategias de marketing digital para marcas y creadores de todas las industrias y nichos."
      />
      {/* 1. HERO CON TEXTURA Y CTA CREATIVO */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-20 overflow-hidden">
        {/* Subtle Background Video */}
        <div className="absolute inset-0 opacity-20 z-[1] mix-blend-screen pointer-events-none">
           <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={REELS[0]} type="video/mp4" />
           </video>
        </div>
        {/* Textura de ruido de fondo */}
        <div className="absolute inset-0 opacity-[0.03] z-[2] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
        {/* Gradiente oscuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505]/90 via-[#050505]/90 to-[#030303] z-[3] pointer-events-none"></div>
        
        {/* Blur shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-movie-red/20 rounded-full blur-[120px] animate-pulse z-[3]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] animate-pulse-slow z-[3]"></div>

        <div className="container mx-auto px-6 relative z-10 text-center mt-20 md:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-movie-red/50 bg-white/5 backdrop-blur-md mb-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-movie-silver shadow-[0_0_20px_rgba(176,35,46,0.2)] animate-pulse-slow"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Domina el Algoritmo. Rompe el Internet.
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[12vw] md:text-[8vw] font-heading font-black uppercase leading-[0.9] tracking-tighter mb-6 min-h-[1em] text-white"
          >
            HACEMOS<br />
            <AnimatePresence mode="wait">
              <motion.span 
                key={currentWord}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-movie-red via-red-500 to-orange-500 italic"
              >
                {words[currentWord]}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/60 font-light max-w-2xl mx-auto mb-10 border-l-2 border-movie-red/50 pl-6 text-left md:text-center leading-relaxed"
          >
            No hacemos <strong className="text-white font-extrabold">"videos bonitos"</strong>. Construimos <strong className="text-white font-extrabold border-b border-movie-red/30">estrategias audiovisuales</strong> diseñadas estratégicamente para <strong className="text-movie-red font-black tracking-wide">retener, impactar y convertir</strong>.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={handleCTA}
            className="group relative overflow-hidden bg-white text-black px-10 md:px-14 py-5 md:py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Quiero ser Viral <Zap size={18} className="text-movie-red group-hover:scale-125 transition-transform" />
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-gray-100 via-white to-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </motion.button>
        </div>
      </section>

      {/* 3. MARCAS QUE CONFÍAN (Infinite Ticker) - Fused directly under Hero */}
      <section className="py-12 border-y border-white/5 bg-black/60 backdrop-blur-md overflow-hidden relative z-20">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.4em] font-black text-white/50">
            MARCAS QUE CONFÍAN EN NUESTRO IMPACTO
          </p>
        </div>
        <div className="flex w-max animate-scroll-film hover:[animation-play-state:paused]">
          {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
            <div key={idx} className="flex-shrink-0 px-8 md:px-16 flex items-center justify-center grayscale opacity-40 hover:opacity-100 hover:grayscale-0 contrast-125 brightness-90 hover:brightness-100 transition-all duration-300">
              <img 
                src={brand.src} 
                alt={brand.name} 
                className="max-h-12 md:max-h-14 w-auto object-contain rounded-md bg-white/5 p-2 backdrop-blur-sm border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2. CARRUSEL DE REELS (Automático) */}
      <section className="relative z-20 pt-16 pb-20 overflow-hidden">
        <div 
          className="flex w-max animate-scroll-film hover:[animation-play-state:paused]"
          style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}
        >
          {[...REELS, ...REELS].map((src, idx) => (
            <div key={idx} className="flex-shrink-0 pr-4">
              <div 
                className="w-[180px] md:w-[240px] aspect-[9/16] bg-neutral-950 rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl"
              >
                <video 
                  src={src} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  preload="metadata"
                  onLoadedData={(e) => {
                    (e.target as HTMLVideoElement).classList.remove('opacity-0');
                  }}
                  className="w-full h-full object-cover opacity-0 transition-opacity duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#B0232E] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(176,35,46,0.5)]">
                      <Play size={12} className="text-white ml-0.5 fill-white" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest truncate">Realizado por nosotros</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRAYECTORIA / ESTADÍSTICAS */}
      <section className="py-32 container mx-auto px-6 relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase italic text-white leading-tight">
              Nuestra <span className="text-movie-red">Trayectoria</span> habla por sí sola.
            </h2>
            <p className="text-white/60 text-lg font-light leading-relaxed">
              No solo "manejamos redes". Dominamos la atención y el <strong>tráfico de pago</strong>. Maximizamos el ROI mediante estrategias omnicanal para E-commerce, Bienes Raíces e Infoproductos.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <div className="text-5xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-movie-red to-white">50+</div>
                <div className="text-xs uppercase tracking-widest text-movie-silver font-bold">Marcas Escaladas</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <div className="text-5xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-movie-red to-white">$2M+</div>
                <div className="text-xs uppercase tracking-widest text-movie-silver font-bold">En Retorno (Ads)</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <div className="text-5xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-movie-red to-white">98%</div>
                <div className="text-xs uppercase tracking-widest text-movie-silver font-bold">Retención Lograda</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                <div className="text-5xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-movie-red to-white">24/7</div>
                <div className="text-xs uppercase tracking-widest text-movie-silver font-bold">Obsesión Pura</div>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-3xl overflow-hidden border border-white/10"
          >
             <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-700">
                <source src={REELS[0]} type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-tr from-movie-red/40 via-transparent to-transparent mix-blend-multiply pointer-events-none"></div>
          </motion.div>
        </div>
      </section>

      {/* NEW: TRAFICO WEB Y PERFORMANCE (NICHE SECTION) */}
      <section className="py-24 bg-[#0a0505] text-white relative overflow-hidden border-y border-white/5 shadow-[0_0_60px_rgba(176,35,46,0.15)]">
        {/* Rich background grid and neon flares mimicking a studio mixer/console layout */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#b0232e/15,transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#f97316/10,transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-4xl mx-auto text-center mb-16"
           >
             <h2 className="text-4xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-red-500 drop-shadow-[0_2px_10px_rgba(176,35,46,0.3)]">
               MÁS ALLÁ DE LOS LIKES:<br/>TRÁFICO & PERFORMANCE
             </h2>
             <p className="text-white/75 font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
               Construimos <strong className="text-white font-extrabold underline decoration-movie-red decoration-2 underline-offset-4">máquinas de ventas</strong>. No solo capturamos miradas efímeras, <strong className="text-amber-400 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">explotamos tu facturación real</strong> de punta a punta.
             </p>
           </motion.div>
 
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="bg-black/80 p-8 rounded-3xl backdrop-blur-md border border-white/5 hover:border-red-500/50 text-white transition-all duration-500 group hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(176,35,46,0.2)] ring-1 ring-white/10 hover:ring-red-500/30 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 bg-movie-red/5 blur-2xl rounded-full group-hover:bg-movie-red/10 transition-all duration-500"></div>
                 <Target size={40} className="mb-4 text-movie-red group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_rgba(176,35,46,0.4)]" />
                 <h3 className="text-2xl font-black uppercase mb-3 text-white tracking-tight">Meta & Google Ads</h3>
                 <p className="font-normal text-white/70 group-hover:text-white/95 leading-relaxed transition-colors">
                   Tráfico quirúrgico de alto impacto. Interceptamos clientes listos con <strong className="text-white font-bold">creatividades cinematográficas</strong> que <strong className="text-movie-red font-bold">rompen el scroll</strong> de forma definitiva.
                 </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="bg-black/80 p-8 rounded-3xl backdrop-blur-md border border-white/5 hover:border-orange-500/50 text-white transition-all duration-500 group hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] ring-1 ring-white/10 hover:ring-orange-500/30 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full group-hover:bg-orange-500/10 transition-all duration-500"></div>
                 <TrendingUp size={40} className="mb-4 text-orange-500 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                 <h3 className="text-2xl font-black uppercase mb-3 text-white tracking-tight">Estrategia SEO</h3>
                 <p className="font-normal text-white/70 group-hover:text-white/95 leading-relaxed transition-colors">
                   Invasión orgánica en buscadores. Conquista la <strong className="text-white font-bold">intención de compra directa</strong> de tu público ideal justo en el momento en que buscan <strong className="text-orange-400 font-bold">tus servicios específicos</strong>.
                 </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="bg-black/80 p-8 rounded-3xl backdrop-blur-md border border-white/5 hover:border-red-400/50 text-white transition-all duration-500 group hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(176,35,46,0.2)] ring-1 ring-white/10 hover:ring-red-400/30 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 bg-red-400/5 blur-2xl rounded-full group-hover:bg-red-400/10 transition-all duration-500"></div>
                 <Users size={40} className="mb-4 text-red-500 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                 <h3 className="text-2xl font-black uppercase mb-3 text-white tracking-tight">Dominio de Nicho</h3>
                 <p className="font-normal text-white/70 group-hover:text-white/95 leading-relaxed transition-colors">
                   Optimizado para <strong className="text-white font-bold">E-commerce, Real Estate y Servicios Corporativos</strong>. Integramos <strong className="text-orange-400 font-bold">embudos de conversión automatizados</strong> a la medida de tu sector.
                 </p>
              </motion.div>
           </div>
        </div>
      </section>
      
      {/* 5. SERVICIOS VIRALES (Grid) */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
         {/* Subtle Background Video */}
         <div className="absolute inset-0 opacity-10 z-[1] mix-blend-lighten pointer-events-none">
           <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={REELS[2]} type="video/mp4" />
           </video>
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-[2]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase text-white mb-4">Lo que hacemos.</h2>
            <p className="text-white/60 text-lg">Servicios diseñados para dominar tu nicho.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            {SERVICES.map((srv, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="group bg-[#111]/80 backdrop-blur-md border border-white/10 p-10 rounded-3xl hover:border-movie-red hover:shadow-[0_0_30px_rgba(176,35,46,0.3)] transition-all duration-500 overflow-hidden relative"
              >
                 <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-transparent to-movie-red opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-movie-red mb-6 bg-movie-red/10 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 group-hover:bg-movie-red group-hover:text-white transition-all duration-300">
                  {srv.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-3 group-hover:text-movie-red transition-colors">{srv.title}</h3>
                <p className="text-white/50 leading-relaxed mb-6 group-hover:text-white/80 transition-colors">{srv.desc}</p>
                <button onClick={() => navigate('/services')} className="font-bold text-[10px] uppercase tracking-widest text-white/50 group-hover:text-movie-red flex items-center gap-2 transition-colors">
                  Descubrir más <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PAQUETES Y SECTORES DE SERVICIO */}
      <Pricing whatsappNumber={whatsappNumber} />

      {/* 6. TIPS CLAVES (Cards horiz) */}
      <section className="py-32 container mx-auto px-6 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303] to-[#111] -z-10 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl border-l-4 border-movie-red pl-6"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-black uppercase text-white mb-4 drop-shadow-lg">Tips Claves para Viralizar</h2>
            <p className="text-white/60 text-lg">El secreto no es suerte. Es psicología, retención y diseño. Aplica esto y verás resultados.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative z-10">
          {TIPS.map((tip, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl flex flex-col items-start hover:bg-[#111] transition-colors overflow-hidden"
            >
              {/* Dynamic Animated Border on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-movie-red/40 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

              <motion.div 
                whileHover={{ scale: 1.2, rotate: 5 }} 
                className="mb-8 p-4 rounded-full bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] relative z-10"
              >
                {tip.icon}
              </motion.div>
              <h4 className="text-xl font-bold text-white mb-4 relative z-10">{tip.title}</h4>
              <p className="text-sm font-light text-white/50 relative z-10 leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. FORMULARIO DE CONTACTO */}
      <div className="relative z-10 pt-10 pb-20 border-y border-white/5 bg-black/50">
        <Contact email="contacto@lamovie.pro" whatsapp={whatsappNumber} />
      </div>

      {/* 8. ESTRATEGIA / COMO LO HACEMOS */}
      <Process />

      {/* 9. NUESTRO ADN */}
      <About />

    </div>
  );
};

export default ViralHome;
