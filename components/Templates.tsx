import React from 'react';
import { Layout, PenTool, Download, TrendingUp, AlertTriangle, CheckCircle2, Palette, Crown, Package, Layers, Image as ImageIcon, Monitor, Zap, MousePointerClick, Lock } from 'lucide-react';

const digitalProducts = [
  {
    id: 1,
    title: "Pack Canva 'Estética Viral'",
    level: "Principiante / Intermedio",
    software: "Canva",
    icon: <Layout size={32} />,
    price: "120.000",
    desc: "La solución rápida para no diseñadores. Deja de perder horas buscando 'algo que se vea bien'. Plantillas estratégicas listas para usar.",
    benefits: ["Ahorra 10h semanales de diseño", "No requiere experiencia", "Edición desde el celular"],
    includes: ["15 Plantillas de Feed (1080x1350)", "5 Stories de Venta", "Tutorial de uso rápido"],
    color: "border-blue-500",
    textAccent: "text-blue-400",
    popular: false
  },
  {
    id: 2,
    title: "Adobe Master Kit",
    level: "Pro / Agencias",
    software: "Ps + Ai",
    icon: <Layers size={32} />,
    price: "250.000",
    desc: "Libertad creativa total. Archivos fuente (.PSD / .AI) con capas organizadas, máscaras de recorte y efectos avanzados que Canva no puede replicar.",
    benefits: ["Acabados de Alta Gama (Texturas/Ruido)", "Vectores Escalables", "Control total de iluminación"],
    includes: ["Archivos Editables por Capas", "Fuentes Premium incluidas", "Mockups 3D de alta resolución"],
    color: "border-movie-red",
    textAccent: "text-movie-red",
    popular: true
  },
  {
    id: 3,
    title: "Grid Infinito (Puzzle)",
    level: "Estratégico",
    software: "Canva / Ps",
    icon: <ImageIcon size={32} />,
    price: "180.000",
    desc: "Estructura visual continua. Ideal para lanzamientos o campañas donde necesitas que el usuario visite tu perfil completo.",
    benefits: ["Aumenta visitas al perfil", "Narrativa visual coherente", "Diferenciación inmediata"],
    includes: ["Plantilla Maestra (1080x1350)", "Guía de corte y secuencia", "Elementos conectores"],
    color: "border-purple-500",
    textAccent: "text-purple-400",
    popular: false
  }
];

const entrepreneurPacks = [
  {
    id: 101,
    title: "Kit Despegue Visual",
    subtitle: "Identidad Básica",
    price: "450.000",
    icon: <Palette size={28} />,
    features: [
      "Diseño de Logotipo (2 Propuestas)",
      "Paleta de Colores & Tipografías",
      "Marca de Agua (PNG)",
      "3 Plantillas Básicas para Redes"
    ],
    cta: "Iniciar Básico",
    highlight: false
  },
  {
    id: 102,
    title: "Emprendedor PRO 360",
    subtitle: "Todo en uno",
    price: "1.300.000",
    icon: <Crown size={28} />,
    features: [
      "Branding Completo (Logo, Manual, Usos)",
      "Optimización de Perfil (Bio, Highlights)",
      "Pack de 15 Plantillas Editables (Canva)",
      "Estrategia de Contenido (1 Mes)",
      "Configuración de Linktree / Bio Site",
      "Asesoría de 1 hora por Zoom"
    ],
    cta: "Lo Quiero Todo",
    highlight: true
  },
  {
    id: 103,
    title: "Marca Líder Digital",
    subtitle: "Branding + Web",
    price: "2.200.000",
    icon: <Monitor size={28} />,
    features: [
      "Todo lo del plan PRO 360",
      "Landing Page One-Page (Ventas)",
      "Dominio .com (1 año)",
      "Correo Corporativo",
      "Configuración de Pixel de Meta"
    ],
    cta: "Dominar Mercado",
    highlight: false
  }
];

const Templates: React.FC = () => {
  const handleBuy = (product: string) => {
    const message = `Hola LA MOVIE, me interesa el *${product}*. ¿Me pueden dar más detalles y link de pago?`;
    window.open(`https://wa.me/573017355046?text=${message}`, '_blank');
  };

  return (
    <section id="templates" className="py-24 bg-movie-black border-t border-white/5 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-movie-red/20 to-purple-900/20 border border-movie-red/30 rounded-full mb-6 backdrop-blur-md">
              <TrendingUp size={16} className="text-movie-red" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Eleva tu Valor Percibido</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 leading-tight">
             RESOURCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-movie-red to-purple-500">STORE</span>
           </h2>
           <p className="text-movie-silver text-lg max-w-3xl mx-auto leading-relaxed">
             Recursos de diseño profesional para quienes entienden que la imagen lo es todo.
           </p>
        </div>

        {/* --- EDUCATIONAL SALES MODULE: WHY DIFFERENTIATE? --- */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 mb-24">
            {/* Module 1: Differentiation */}
            <div className="bg-gradient-to-br from-movie-dark to-black p-8 rounded-2xl border border-white/5 hover:border-movie-red/30 transition-all duration-300 group">
                <div className="w-14 h-14 bg-movie-red/10 rounded-full flex items-center justify-center text-movie-red mb-6 border border-movie-red/20 group-hover:scale-110 transition-transform">
                    <Zap size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Rompe el "Patrón Visual"</h3>
                <p className="text-movie-silver text-sm leading-relaxed mb-4">
                    El cerebro humano está entrenado para ignorar lo repetitivo. Si usas las mismas plantillas gratuitas de Canva que tu competencia, eres invisible.
                </p>
                <p className="text-white text-sm font-bold border-l-2 border-movie-red pl-4">
                    Nuestros diseños usan psicología del color y composición atípica para detener el scroll.
                </p>
            </div>

            {/* Module 2: Algorithm */}
            <div className="bg-gradient-to-br from-movie-dark to-black p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <MousePointerClick size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Hackea el Algoritmo</h3>
                <p className="text-movie-silver text-sm leading-relaxed mb-4">
                    El algoritmo no lee imágenes, mide el <strong className="text-white">Tiempo de Retención</strong>. 
                </p>
                <ul className="space-y-2 text-sm text-movie-silver">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Diseño limpio = Lectura fácil.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Jerarquía visual = Mayor tiempo en pantalla.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Mayor tiempo = <span className="text-white font-bold">Viralidad.</span></li>
                </ul>
            </div>
        </div>

        {/* --- SECTION 1: DIGITAL ASSETS (Do It Yourself) --- */}
        <div className="mb-24">
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-heading font-bold text-white uppercase italic">Plantillas Editables</h3>
                <div className="h-px bg-white/10 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {digitalProducts.map((product) => (
                <div key={product.id} className={`bg-movie-dark/50 backdrop-blur-sm p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group flex flex-col h-full ${product.color} ${product.popular ? 'border-opacity-100 bg-movie-dark shadow-[0_0_30px_rgba(176,35,46,0.15)]' : 'border-opacity-20 border-white hover:border-opacity-50'}`}>
                    
                    {product.popular && (
                        <div className="absolute -top-3 right-6 bg-movie-red text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                            Más Vendido
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-6">
                        <div className={`${product.textAccent} group-hover:scale-110 transition-transform`}>
                            {product.icon}
                        </div>
                        <div className="text-[10px] font-bold uppercase bg-white/5 text-movie-silver px-2 py-1 rounded border border-white/5">
                            {product.software}
                        </div>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-2">{product.title}</h4>
                    <p className="text-xs text-movie-silver mb-4 font-bold uppercase tracking-wider">{product.level}</p>
                    <p className="text-sm text-white/80 mb-6 leading-relaxed">{product.desc}</p>

                    <div className="bg-black/30 p-4 rounded-lg mb-6 flex-1">
                       <p className="text-[10px] text-movie-silver uppercase font-bold mb-2">Beneficios Clave:</p>
                       <ul className="space-y-2">
                          {product.benefits.map((benefit, i) => (
                             <li key={i} className="flex items-start gap-2 text-xs text-white">
                                <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0"/> {benefit}
                             </li>
                          ))}
                       </ul>
                    </div>

                    <div className="flex items-end justify-between pt-6 border-t border-white/10 mt-auto">
                        <div>
                            <span className="block text-[10px] text-movie-silver uppercase">Inversión</span>
                            <span className="text-2xl font-black text-white">${product.price}</span>
                        </div>
                        <button 
                            onClick={() => handleBuy(product.title)}
                            className="px-4 py-2 bg-white text-black hover:bg-movie-red hover:text-white transition-colors rounded-lg font-bold text-xs uppercase flex items-center gap-2"
                        >
                            <Download size={14} /> Comprar
                        </button>
                    </div>
                </div>
              ))}
            </div>
        </div>

        {/* --- SECTION 2: ENTREPRENEUR PACKS (Done For You) --- */}
        <div className="bg-gradient-to-b from-movie-black to-movie-dark rounded-3xl border border-white/10 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-movie-red via-purple-600 to-blue-600"></div>
            
            <div className="text-center mb-12 relative z-10">
               <h3 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">PACKS EMPRENDEDORES</h3>
               <p className="text-movie-silver">Soluciones "Llave en mano". Te entregamos todo listo para que empieces a vender.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {entrepreneurPacks.map((pack) => (
                    <div 
                        key={pack.id} 
                        className={`relative rounded-xl p-1 transition-all duration-500 hover:scale-105 ${pack.highlight ? 'bg-gradient-to-b from-movie-red to-purple-900 shadow-[0_0_40px_rgba(176,35,46,0.3)] z-20 lg:-translate-y-4' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        <div className="bg-movie-black h-full rounded-lg p-8 flex flex-col relative overflow-hidden">
                            {pack.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-movie-red text-white text-xs font-black uppercase tracking-widest px-4 py-1 rounded-b-lg shadow-lg">
                                    Recomendado
                                </div>
                            )}

                            <div className="mb-6 pt-4 text-center">
                                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${pack.highlight ? 'bg-movie-red/20 text-movie-red border border-movie-red' : 'bg-white/5 text-white border border-white/10'}`}>
                                    {pack.icon}
                                </div>
                                <p className="text-xs font-bold uppercase text-movie-silver mb-1">{pack.subtitle}</p>
                                <h4 className="text-xl font-black text-white mb-4">{pack.title}</h4>
                                <div className="flex justify-center items-baseline gap-1">
                                    <span className="text-sm text-movie-silver">Desde</span>
                                    <span className={`text-3xl font-bold ${pack.highlight ? 'text-movie-red' : 'text-white'}`}>${pack.price}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                {pack.features.map((feat, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-white/80">
                                        <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${pack.highlight ? 'text-movie-red' : 'text-white/30'}`} />
                                        <span className="leading-tight">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleBuy(pack.title)}
                                className={`w-full py-4 rounded-lg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${pack.highlight ? 'bg-gradient-to-r from-movie-red to-red-600 text-white hover:shadow-[0_0_20px_rgba(176,35,46,0.5)]' : 'bg-white text-black hover:bg-gray-200'}`}
                            >
                                {pack.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Software/Tools Bar */}
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 opacity-50 hover:opacity-100 transition-opacity">
                <p className="text-xs font-bold uppercase text-movie-silver tracking-widest">Archivos compatibles con:</p>
                <div className="flex gap-8 grayscale hover:grayscale-0 transition-all">
                    {['Canva', 'Photoshop', 'Illustrator', 'Figma'].map((tool) => (
                        <span key={tool} className="text-white font-bold text-sm border border-white/20 px-3 py-1 rounded-full hover:bg-white/10 cursor-default">{tool}</span>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Templates;