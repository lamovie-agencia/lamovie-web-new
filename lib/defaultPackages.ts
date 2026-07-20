export type PackageCategory = 'social' | 'estrategia' | 'web';

export interface DefaultPricingPackage {
  name: string;
  category: PackageCategory;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended: boolean;
  icon: string;
  color: string;
  page: string;
}

export const DEFAULT_PRICING_PACKAGES: DefaultPricingPackage[] = [
  {
    name: 'STARTER REELS',
    category: 'social',
    price: '690.000',
    period: '/ mes',
    description: 'Contenido vertical listo para publicar, con portadas, copies y calendario base.',
    features: ['8 reels editados', '8 portadas 9:16', 'Calendario de publicacion', 'Copywriting para captions'],
    recommended: false,
    icon: 'Film',
    color: 'border-white/20',
    page: 'pricing-social'
  },
  {
    name: 'SOCIAL PRO',
    category: 'social',
    price: '1.390.000',
    period: '/ mes',
    description: 'Sistema mensual de contenido para sostener presencia, ventas y reconocimiento.',
    features: ['16 reels editados', '12 piezas graficas', 'Parrilla mensual', 'Reporte de rendimiento'],
    recommended: true,
    icon: 'Star',
    color: 'border-movie-red',
    page: 'pricing-social'
  },
  {
    name: 'TRAFFIC LAUNCH',
    category: 'estrategia',
    price: '1.800.000',
    period: '/ campana',
    description: 'Campanas de trafico con estructura comercial, piezas creativas y medicion clara.',
    features: ['Setup de Meta Ads', '3 audiencias iniciales', 'Creativos de prueba', 'Optimizacion semanal'],
    recommended: true,
    icon: 'Zap',
    color: 'border-movie-red',
    page: 'pricing-estrategia'
  },
  {
    name: 'PERFORMANCE SCALE',
    category: 'estrategia',
    price: '2.900.000',
    period: '/ mes',
    description: 'Escalamiento de pauta, funnel y remarketing para negocios con oferta validada.',
    features: ['Embudo de conversion', 'Remarketing', 'Dashboard de resultados', 'Iteracion creativa'],
    recommended: false,
    icon: 'Crown',
    color: 'border-white/20',
    page: 'pricing-estrategia'
  },
  {
    name: 'LANDING PRO',
    category: 'web',
    price: '1.600.000',
    period: 'pago unico',
    description: 'Landing page rapida, cinematografica y enfocada en conversion por WhatsApp.',
    features: ['Diseno responsive', 'SEO base', 'Formulario o WhatsApp', 'Integracion analytics'],
    recommended: false,
    icon: 'Monitor',
    color: 'border-white/20',
    page: 'pricing-web'
  },
  {
    name: 'WEB BUSINESS',
    category: 'web',
    price: '3.900.000',
    period: 'pago unico',
    description: 'Sitio corporativo completo para vender servicios, mostrar portafolio y captar clientes.',
    features: ['Hasta 6 secciones', 'Portafolio editable', 'Paquetes dinamicos', 'Panel administrativo'],
    recommended: true,
    icon: 'Globe',
    color: 'border-movie-red',
    page: 'pricing-web'
  }
];
