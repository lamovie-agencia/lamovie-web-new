
import React, { useRef, useState, useEffect } from 'react';
import { Smartphone, Video, Code, PenTool, ArrowRight, Eye, Zap, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

interface ServiceItem {
  icon: React.ReactNode;
  image?: string;
  title: string;
  subtitle: string;
  desc: string;
  items?: string[];
  cta?: string;
  targetPath: string; // Changed from targetView to targetPath
  whatsappMessage?: string;
  actionType?: 'scroll' | 'showcase' | 'print';
  scrollToId?: string; // Add specific ID for scrolling
  price?: number;
}

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            const dbServices = data.map((item: any) => ({
              icon: <Zap size={40} />, // Default icon for DB items
              title: item.title,
              subtitle: item.subtitle,
              desc: item.description,
              items: Array.isArray(item.items) ? item.items : [],
              cta: "MÁS INFORMACIÓN",
              targetPath: '/contact',
              actionType: 'scroll'
            }));
            setServices([...dbServices, ...defaultServices]);
          } else {
            setServices(defaultServices);
          }
        } else {
          setServices(defaultServices);
        }
      } catch (err) {
        setServices(defaultServices);
      }
    };
    fetchServices();
  }, []);

  const defaultServices: ServiceItem[] = [
    {
      icon: <Smartphone size={40} />,
      title: "Social Growth Híbrido",
      subtitle: "Autoridad Visual + Ventas Diarias",
      desc: "Resolvemos dos problemas: la falta de constancia y la falta de conversión. Creamos contenido que construye marca mientras nuestros funnels cierran ventas.",
      items: ["Branding que enamora", "Ads que facturan", "Comunidad activa", "Atención al cliente"],
      cta: "ESCALAR MARCA",
      targetPath: '/services', 
      scrollToId: 'pricing',
      actionType: 'scroll', 
      whatsappMessage: "Hola, me interesa el plan de Social Growth Híbrido (Autoridad + Ventas)."
    },
    {
      icon: <Video size={40} />,
      title: "Cine Publicitario",
      subtitle: "Prestigio + Retención",
      desc: "No es solo un video bonito. Es una pieza de ingeniería visual diseñada para elevar el estatus de tu marca Y retener la atención del usuario hasta el final.",
      items: ["Status de Marca (Cine)", "Formatos Virales (Reels)", "Fotografía Comercial", "Guiones de Venta"],
      cta: "POSICIONARME COMO LÍDER",
      targetPath: '/contact',
      whatsappMessage: "Hola, quiero elevar el estatus de mi marca con Cine Publicitario."
    },
    {
      icon: <Code size={40} />,
      title: "Ecosistemas Web",
      subtitle: "Diseño Premium + Automatización",
      desc: "Tu web no debe ser solo un folleto. La convertimos en tu mejor vendedor 24/7. Estética impecable para generar confianza, backend robusto para cerrar tratos.",
      items: ["UX/UI de Alto Impacto", "Embudos de Venta", "SEO Técnico", "Velocidad Extrema"],
      cta: "VER MÁQUINAS DE VENTA",
      targetPath: '/services',
      scrollToId: 'web-showcase',
      actionType: 'showcase',
      whatsappMessage: "Hola, necesito un Ecosistema Web que venda por mí."
    },
    {
      icon: <PenTool size={40} />,
      title: "Identidad & Print",
      subtitle: "Diferenciación + Tangibilidad",
      desc: "Lo digital es efímero, lo físico es eterno. Creamos identidades visuales que funcionan en una pantalla de 6 pulgadas Y en una valla publicitaria.",
      items: ["Logotipos Memorables", "Merch Corporativo", "Manual de Marca", "Experiencia Unboxing"],
      cta: "MATERIALIZAR MI MARCA",
      targetPath: '/resources',
      scrollToId: 'print-studio',
      actionType: 'print',
      whatsappMessage: "Hola, busco diferenciación total con Identidad y Print."
    },
    {
      icon: <Zap size={40} />,
      title: "Tráfico Web & Performance",
      subtitle: "Conversiones a gran escala",
      desc: "Optimizamos tu inversión en Meta Ads, Google Ads y TikTok Ads para maximizar tu retorno de inversión en diferentes nichos y mercados.",
      items: ["Pautas Publicitarias B2B/B2C", "Retargeting", "Generación de Leads", "Campañas para E-commerce"],
      cta: "DOMINAR ADVERTISING",
      targetPath: '/contact',
      whatsappMessage: "Hola, me gustaría escalar mi negocio con Tráfico Web y Performance."
    },
    {
      icon: <Eye size={40} />,
      title: "Estrategia Omnicanal",
      subtitle: "Impacto Global 360°",
      desc: "Implementamos un sistema unificado que conecta tus ventas por redes sociales, sitio web, email marketing y tiendas físicas.",
      items: ["Email Marketing", "Automatización de WhatsApp", "CRM Integrado", "Fidelización de Clientes"],
      cta: "VER PLANES OMNICANAL",
      targetPath: '/contact',
      whatsappMessage: "Hola, me interesa implementar una Estrategia Omnicanal 360 para mi marca."
    },
    {
      icon: <Printer size={40} />,
      title: "Gran Formato & Estampados",
      subtitle: "Visibilidad Gigante + Merchandising",
      desc: "Llevamos tu marca a las calles. Desde pendones y vallas de gran formato hasta el branding en el pecho de tus clientes con estampados de alta calidad.",
      items: ["Pendones & Vallas", "Vinilos Adhesivos", "Camisetas & Gorras", "Dotación Empresarial"],
      cta: "COTIZAR IMPRESIÓN",
      targetPath: '/resources',
      scrollToId: 'print-studio',
      actionType: 'print',
      whatsappMessage: "Hola, necesito cotizar impresión de gran formato y estampados."
    }
  ];

  return (
    <section id="services" className="py-40 bg-movie-black text-white relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(176,35,46,0.05),transparent_70%)] pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-movie-red/5 to-transparent pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-movie-red/30 bg-movie-red/10 text-movie-red text-[10px] font-black uppercase tracking-[0.3em] mb-8">
             <Zap size={14} className="fill-movie-red" /> Soluciones de Alto Impacto
          </div>
          <h2 className="text-6xl md:text-8xl font-heading font-black mb-8 tracking-tighter uppercase italic">
            UNA INVERSIÓN, <br/> <span className="text-movie-red">MÚLTIPLES</span> VICTORIAS
          </h2>
          <p className="text-movie-silver text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Cada servicio está diseñado para atacar más de una necesidad crítica de tu negocio simultáneamente, fusionando arte cinematográfico con automatizaciones y estrategias de performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {(Array.isArray(services) ? services : []).map((service, index) => (
            <EnhancedServiceCard key={index} service={service} navigate={navigate} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const EnhancedServiceCard: React.FC<{ service: ServiceItem, navigate: any, index: number }> = ({ service, navigate, index }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (service.scrollToId) {
        navigate(service.targetPath, { state: { scrollTo: service.scrollToId } });
    } else {
        navigate(service.targetPath);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 md:p-16 transition-all duration-700 hover:bg-black/60 hover:border-movie-red/40 hover:shadow-[0_40px_100px_rgba(176,35,46,0.3)] overflow-hidden`}
    >
      {/* Background Icon Watermark */}
      <div className="absolute -top-10 -right-10 text-white/5 group-hover:text-movie-red/10 transition-colors duration-700 scale-[3] pointer-events-none">
        {service.icon}
      </div>

      <div className="relative z-10">
        <div className="mb-12 inline-flex p-6 rounded-3xl bg-movie-red text-white shadow-[0_20px_40px_rgba(176,35,46,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          {service.icon}
        </div>
        
        <div className="mb-8">
          <h4 className="text-4xl md:text-5xl font-heading font-black mb-2 text-white uppercase italic tracking-tighter group-hover:text-movie-red transition-colors">
            {service.title}
          </h4>
          <p className="text-sm font-black text-green-400 uppercase tracking-[0.2em]">
             {service.subtitle}
          </p>
        </div>

        <p className="text-movie-silver text-lg mb-12 leading-relaxed font-light max-w-xl">
          {service.desc}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {service.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-sm text-white/70 group-hover:text-white transition-colors">
              <div className="w-2 h-2 bg-movie-red rounded-full shadow-[0_0_10px_#B0232E]"></div>
              {item}
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleClick}
          className="group/btn relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] overflow-hidden transition-all hover:scale-105 hover:bg-movie-red hover:text-white"
        >
          <span className="relative z-10 flex items-center gap-3">
            {service.cta || "Cotizar"} 
            {service.actionType === 'showcase' ? <Eye size={16}/> : <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default Services;
