
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUp, Cpu, Sparkles, Globe, Video, Printer, MessageCircle } from 'lucide-react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@vercel/analytics/react";
import SEO from './components/SEO';

// Components
import Preloader from './components/Preloader'; 
import Hero from './components/Hero';
import SiteGuide from './components/SiteGuide'; 
import Stats from './components/Stats';
import Services from './components/Services'; 
import AISection from './components/AISection';
import AIAgents from './components/AIAgents';
import Process from './components/Process';
import PrintStudio from './components/PrintStudio'; 
import Templates from './components/Templates'; 
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import PackCreator from './components/PackCreator';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import About from './components/About';
import InteractiveBrief from './components/InteractiveBrief';
import AutomationForm from './components/AutomationForm';
import Policies from './components/Policies';
import FAQ from './components/FAQ'; 
import WebShowcase from './components/WebShowcase';
import EventCoverage from './components/EventCoverage'; // Import New Component
import AboutPage from './components/AboutPage';
import GoldenSeal from './components/GoldenSeal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ViralHome from './components/ViralHome';
import { CookieConsent } from './components/CookieConsent';
import LocalSEOPage from './components/LocalSEOPage';
import ResourcesHub from './components/ResourcesHub';

// Translations
import { translations } from './data/translations';
import { adminService } from './lib/adminService';

// Helper component to handle scrolling on route change
const ScrollToTop = () => {
  const { pathname, state } = useLocation();

  useEffect(() => {
    // If state has a scrollTo ID, scroll there
    if (state && (state as any).scrollTo) {
        const elementId = (state as any).scrollTo;
        setTimeout(() => {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Slight delay to ensure render
    } else {
        // Otherwise scroll to top
        window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return null;
};

// Main Layout Component (Header + Footer included)
const Layout: React.FC<{ children: React.ReactNode, lang: 'es' | 'en', toggleLanguage: () => void, whatsappNumber?: string, siteSettings?: any }> = ({ children, lang, toggleLanguage, whatsappNumber = '573017355046', siteSettings }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isDockMinimized, setIsDockMinimized] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const t = translations[lang];
    const brand = siteSettings?.brand || {};
    const headerLogoUrl = brand.header_logo_url || '';
    const headerBrandName = brand.header_name || 'LA MOVIE';

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);
            
            // Auto-hide logic for dock/nav
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                setIsVisible(false); // Hide on scroll down
            } else {
                setIsVisible(true); // Show on scroll up
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const isActive = (path: string) => location.pathname === path;

    const handleNav = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const isAdminPage = location.pathname.startsWith('/admin');

    if (isAdminPage) {
        return <div className="min-h-screen bg-movie-black">{children}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-movie-black text-white selection:bg-movie-red selection:text-white transition-opacity duration-1000">
             
            <GoldenSeal />

            {/* --- FLOATING TOP NAVIGATION (Pill Style) --- */}
            <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 w-[95%] max-w-5xl ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
                <div className={`flex justify-between items-center px-6 py-3 rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-2xl' : 'bg-white/5 backdrop-blur-md'}`}>
                    
                    {/* Logo */}
                    <button onClick={() => handleNav('/')} className="text-xl md:text-2xl font-heading font-black tracking-tighter flex items-center gap-2 group">
                      {headerLogoUrl ? (
                        <img src={headerLogoUrl} alt={headerBrandName} className="h-9 max-w-[120px] object-contain group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-8 h-8 bg-movie-red rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(176,35,46,0.5)] group-hover:scale-110 transition-transform duration-300">
                          <Video size={18} className="text-white" />
                        </div>
                      )}
                      <span className="hidden sm:inline text-white">{headerBrandName}</span>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden xl:flex items-center gap-8 text-[9px] font-black tracking-[0.2em] uppercase">
                        {[
                          { name: t.nav.home, path: '/' },
                          { name: t.nav.services, path: '/services' },
                          { name: t.nav.events, path: '/events' },
                          { name: t.nav.portfolio, path: '/portfolio' },
                          { name: t.nav.about, path: '/about' },
                          { name: t.nav.market, path: '/resources', color: 'text-purple-400' },
                          { name: t.nav.ai, path: '/ai', color: 'text-green-400', icon: <Cpu size={12} className="animate-pulse"/> }
                        ].map((item) => (
                          <button 
                            key={item.path}
                            onClick={() => handleNav(item.path)} 
                            className={`hover:text-movie-red transition-all duration-300 relative group flex items-center gap-2 ${isActive(item.path) ? (item.color || 'text-movie-red') : 'text-white/60'}`}
                          >
                            {item.icon}
                            {item.name}
                            <span className={`absolute -bottom-1 left-0 h-[2px] bg-movie-red transition-all duration-300 ${isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                          </button>
                        ))}
                        
                        <button 
                            onClick={() => handleNav('/contact')}
                            className="bg-movie-red text-white hover:bg-white hover:text-black px-6 py-2.5 transition-all duration-500 font-black shadow-[0_10px_20px_rgba(176,35,46,0.3)] rounded-xl uppercase tracking-widest text-[9px]"
                        >
                            {t.nav.contact}
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="xl:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* --- FLOATING BOTTOM DOCK (Smart Tool) --- */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-700 w-[90%] max-w-4xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
                {isDockMinimized ? (
                    <button 
                        onClick={() => setIsDockMinimized(false)}
                        className="absolute bottom-0 right-0 w-12 h-12 bg-movie-red rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-bounce-slow"
                    >
                        <Sparkles size={20} className="text-white" />
                    </button>
                ) : (
                    <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
                        {/* Quick Links */}
                        <div className="hidden md:flex items-center gap-1 px-2">
                            {[
                                { name: 'Video', path: '/services' },
                                { name: 'Web', path: '/services' },
                                { name: 'Nosotros', path: '/about' },
                                { name: 'IA', path: '/ai' },
                                { name: 'Print', path: '/resources' }
                            ].map(cat => (
                                <button 
                                    key={cat.name}
                                    onClick={() => handleNav(cat.path)}
                                    className="px-3 py-1.5 rounded-xl hover:bg-white/5 text-[8px] font-black tracking-widest text-movie-silver hover:text-white transition-all uppercase"
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Center Info / Suggestion */}
                        <div className="flex-1 flex items-center justify-center md:border-x border-white/10 px-4">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <p className="text-[9px] font-black tracking-widest text-white/80 uppercase truncate max-w-[150px] md:max-w-none">
                                    {lang === 'es' ? '¿Necesitas ayuda con tu proyecto?' : 'Need help with your project?'}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={toggleLanguage}
                                className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px] font-black"
                            >
                                {lang === 'es' ? 'ES' : 'EN'}
                            </button>
                            
                            <a 
                                href={`https://wa.me/${whatsappNumber}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-green-600 text-white px-4 py-2.5 rounded-2xl text-[9px] font-black hover:bg-green-500 transition-all flex items-center gap-2"
                            >
                                <MessageCircle size={14} />
                                <span className="hidden sm:inline">WHATSAPP</span>
                            </a>

                            <button 
                                onClick={() => setIsDockMinimized(true)}
                                className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-movie-red transition-colors group"
                            >
                                <X size={16} className="text-white/40 group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="xl:hidden fixed inset-0 bg-black z-[100] flex flex-col animate-fade-in overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-movie-red blur-[120px] rounded-full animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 blur-[120px] rounded-full animate-pulse-slow"></div>
                    </div>

                    {/* Header */}
                    <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/5 bg-black/50 backdrop-blur-md">
                        <button onClick={() => handleNav('/')} className="text-xl font-black tracking-tighter flex items-center gap-2">
                        <div className="w-8 h-8 bg-movie-red rounded-lg flex items-center justify-center">
                            <Video size={18} className="text-white" />
                        </div>
                        <span>LA MOVIE</span>
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-full border border-white/10 text-white hover:bg-movie-red transition-colors">
                        <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="relative z-10 flex-grow flex flex-col justify-center px-8 space-y-4 overflow-y-auto py-10">
                        {[
                            { name: t.nav.home, path: '/' },
                            { name: t.nav.services, path: '/services' },
                            { name: t.nav.events, path: '/events' },
                            { name: t.nav.portfolio, path: '/portfolio' },
                            { name: t.nav.about, path: '/about' },
                            { name: t.nav.market, path: '/resources', color: 'text-purple-400' },
                            { name: t.nav.ai, path: '/ai', color: 'text-green-400' },
                            { name: t.nav.contact, path: '/contact', color: 'text-movie-red' }
                        ].map((item, idx) => (
                            <button 
                            key={item.path}
                            onClick={() => handleNav(item.path)} 
                            className={`group flex flex-col items-start animate-[fadeInUp_0.5s_ease-out_forwards]`}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                            <span className={`text-4xl md:text-5xl font-heading font-black uppercase italic tracking-tighter transition-all duration-300 group-hover:translate-x-4 ${isActive(item.path) ? (item.color || 'text-movie-red') : 'text-white/90 group-hover:text-white'}`}>
                                {item.name}
                            </span>
                            <span className={`h-1 bg-movie-red transition-all duration-500 ${isActive(item.path) ? 'w-12' : 'w-0 group-hover:w-8'}`}></span>
                            </button>
                        ))}
                    </div>
                    
                    {/* Footer Info */}
                    <div className="relative z-10 p-8 border-t border-white/5 bg-black/80 backdrop-blur-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-movie-silver uppercase font-black tracking-[0.2em]">Idioma / Language:</span>
                            <button 
                            onClick={toggleLanguage} 
                            className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-movie-red hover:text-white transition-colors"
                            >
                            {lang === 'es' ? 'ESPAÑOL' : 'ENGLISH'}
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <a 
                            href="https://www.instagram.com/ads_yosii/" 
                            target="_blank" 
                            className="flex items-center justify-center gap-2 bg-white/5 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                            >
                            INSTAGRAM
                            </a>
                            <a 
                            href={`https://wa.me/${whatsappNumber}`} 
                            target="_blank" 
                            className="flex items-center justify-center gap-2 bg-green-600/10 py-4 rounded-2xl border border-green-500/20 text-[10px] font-black uppercase tracking-widest text-green-400 hover:bg-green-600 hover:text-white transition-all duration-300"
                            >
                            WHATSAPP
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow">
                {children}
            </main>

            <Footer siteSettings={siteSettings} whatsappNumber={whatsappNumber} />
            
            {/* Scroll To Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-6 right-6 z-40 p-4 bg-white text-black rounded-none shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 hover:bg-movie-red hover:text-white ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <ArrowUp size={20} />
            </button>
        </div>
    );
};

// PAGE COMPONENT: HOME
const Home: React.FC<{ lang: 'es' | 'en', t: any, siteSettings?: any }> = ({ lang, t, siteSettings }) => {
    const navigate = useNavigate();
    const whatsappNumber = siteSettings?.whatsapp_number || '573017355046';

    return (
        <div className="animate-reveal">
            <Hero lang={lang} t={t} whatsappNumber={whatsappNumber} />
            
            {/* Scrolling Marquee */}
            <div className="py-4 bg-movie-red overflow-hidden border-y border-white/10">
                    <div className="whitespace-nowrap flex animate-marquee">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-8 text-sm font-bold uppercase tracking-[0.3em] text-white flex items-center gap-4">
                                <Sparkles size={12} className="text-black" /> {t.hero.subtitle}
                            </span>
                        ))}
                    </div>
            </div>

            <Stats />
            
            <SiteGuide />

            {/* VIDEO BENTO GRID */}
            <section className="py-24 container mx-auto px-6 relative">
                <div className="text-center mb-16 reveal-on-scroll relative z-10">
                    <h2 className="text-movie-red font-bold tracking-[0.5em] text-xs uppercase mb-4 flex justify-center items-center gap-2">
                        <div className="w-10 h-[1px] bg-movie-red"></div> {t.sections.services_title} <div className="w-10 h-[1px] bg-movie-red"></div>
                    </h2>
                    <h3 className="text-5xl md:text-7xl font-heading font-black text-white glitch-text" data-text={t.sections.services_subtitle}>{t.sections.services_subtitle}</h3>
                </div>
                         {/* The Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[350px]">
                    
                    {/* Card 1: AGENCY */}
                    <div 
                        onClick={() => navigate('/services')}
                        className="md:col-span-2 relative group overflow-hidden rounded-3xl cursor-pointer border border-white/10 hover:border-movie-red/50 transition-all duration-500"
                    >
                        <div className="absolute inset-0 z-0">
                            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 grayscale group-hover:grayscale-0">
                                <source src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                        
                        <div className="absolute bottom-8 left-8 z-20 transition-transform duration-500 group-hover:translate-x-2">
                            <div className="bg-movie-red text-white text-[10px] font-bold px-2 py-1 inline-block mb-2 uppercase tracking-widest">Core Business</div>
                            <h4 className="text-4xl font-heading font-black mb-1 text-white uppercase italic">{t.nav.services}</h4>
                            <p className="text-movie-silver text-sm max-w-sm">{t.sections.services_subtitle}</p>
                        </div>
                    </div>

                    {/* Card 2: AI TECH */}
                    <div 
                        onClick={() => navigate('/ai')}
                        className="relative group overflow-hidden rounded-3xl cursor-pointer border border-green-500/20 hover:border-green-500/80 transition-all duration-500 bg-black"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-20 animate-pulse-slow"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-black z-10"></div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 group-hover:scale-110 transition-transform duration-500">
                            <Cpu size={64} className="text-green-500 mb-4 animate-bounce" />
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{t.nav.ai}</h4>
                        </div>
                    </div>

                    {/* Card 3: EVENTS */}
                    <div 
                        onClick={() => navigate('/events')}
                        className="relative group overflow-hidden rounded-3xl cursor-pointer border border-yellow-500/20 hover:border-yellow-500/80 transition-all duration-500 bg-[#0a0a0a]"
                    >
                         <div className="absolute inset-0 z-0">
                            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-700">
                                <source src="https://videos.pexels.com/video-files/855428/855428-hd_1920_1080_30fps.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 group-hover:scale-105 transition-transform duration-500 text-center p-4">
                            <Video size={48} className="text-yellow-500 mb-2" />
                            <h4 className="text-3xl font-heading font-black text-white uppercase italic">{t.nav.events}</h4>
                            <span className="text-xs bg-yellow-500 text-black px-2 py-1 font-bold rounded mt-2 uppercase">Streaming + Cine</span>
                        </div>
                    </div>

                    {/* Card 4: PRINT & MERCH (NEW) */}
                    <div 
                        onClick={() => navigate('/resources')}
                        className="relative group overflow-hidden rounded-3xl cursor-pointer border border-cyan-500/20 hover:border-cyan-500/80 transition-all duration-500 bg-[#050505]"
                    >
                        <div className="absolute inset-0 z-0">
                            <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700" referrerPolicy="no-referrer" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 group-hover:scale-105 transition-transform duration-500 text-center p-4">
                            <Printer size={48} className="text-cyan-400 mb-2" />
                            <h4 className="text-3xl font-heading font-black text-white uppercase italic">PRINT & MERCH</h4>
                            <span className="text-[10px] text-cyan-400 font-black tracking-widest mt-2 uppercase">Gran Formato • Estampados</span>
                        </div>
                    </div>

                    {/* Card 5: PORTFOLIO */}
                    <div 
                        onClick={() => navigate('/portfolio')}
                        className="md:col-span-2 relative group overflow-hidden rounded-3xl cursor-pointer border border-white/10 hover:border-white/50 transition-all duration-500"
                    >
                        <div className="absolute inset-0 z-0">
                            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-700">
                                <source src="https://videos.pexels.com/video-files/2792370/2792370-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-movie-red/90 via-transparent to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity"></div>
                        
                        <div className="absolute top-1/2 left-10 -translate-y-1/2 z-20">
                            <h4 className="text-5xl font-heading font-black text-white mb-2">{t.nav.portfolio}</h4>
                            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs">
                                <span className="w-8 h-[1px] bg-white"></span> Ver Proyectos
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <About />
            <AISection />
            <Process />
            <Testimonials />
            <Blog />
        </div>
    );
};

// PAGE COMPONENT: SERVICES
const ServicesPage: React.FC<{ whatsappNumber: string }> = ({ whatsappNumber }) => {
    return (
        <div className="animate-reveal">
            <SEO 
              title="Servicios | Estrategia, Marketing y Performance"
              description="Nuestros paquetes y servicios de marketing digital, estrategias avanzadas y planes para distintos nichos."
            />
            <Services />
            <WebShowcase />
            <Pricing whatsappNumber={whatsappNumber} />
            <Process />
            <PackCreator />
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  const toggleLanguage = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await adminService.getSettings();
        setSiteSettings(settings);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    
    fetchSettings();

    // Fake loading delay for preloader
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Merge translations with site settings
  const t = { ...translations[lang] };
  if (siteSettings && siteSettings.hero) {
    t.hero = {
      ...t.hero,
      title: siteSettings.hero.title || t.hero.title,
      subtitle: siteSettings.hero.subtitle || t.hero.subtitle,
      copy: siteSettings.hero.copy || t.hero.copy,
      badge: siteSettings.hero.badge || t.hero.badge
    };
  }
  
  // Update contact info if available
  const contactEmail = siteSettings?.contact_email || 'contacto@lamovie.pro';
  const whatsappNumber = siteSettings?.whatsapp_number || '573017355046';

  return (
    <HelmetProvider>
      <HashRouter>
          <Preloader isLoading={loading} />
          <ScrollToTop />
          <Layout lang={lang} toggleLanguage={toggleLanguage} whatsappNumber={whatsappNumber} siteSettings={siteSettings}>
              <Routes>
                  <Route path="/" element={<ViralHome lang={lang} t={t} whatsappNumber={whatsappNumber} />} />
                  <Route path="/services" element={<ServicesPage whatsappNumber={whatsappNumber} />} />
                  <Route path="/events" element={<><SEO title="Eventos | Cobertura Cinematográfica" description="Cobertura de eventos presenciales, streaming e innovación digital."/><EventCoverage /></>} />
                  <Route path="/portfolio" element={<><SEO title="Portafolio | Nuestros Casos de Éxito" description="Descubre los proyectos, marcas escaladas y marcas que confían en nosotros."/><Portfolio /></>} />
                  <Route path="/resources" element={<div className="animate-reveal"><SEO title="Recursos & Impresión | Print Studio" description="Material POP, diseño e identidad para potenciar tu marca off-line e in-house."/><Templates /><PrintStudio /><PackCreator /></div>} />
                  <Route path="/ai" element={<div className="animate-reveal"><SEO title="Agentes IA | Automatización de Ventas" description="Automatiza tu atención al cliente, implementa chatbots de ventas con inteligencia artificial."/><AIAgents onBack={() => window.history.back()} onOpenForm={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')} /></div>} />
                  <Route path="/contact" element={<div className="animate-reveal pt-20"><SEO title="Contacto | Hablemos de tu Proyecto" description="Ponte en contacto con nuestro equipo experto en marketing para escalar tu marca."/><Contact email={contactEmail} whatsapp={whatsappNumber} /><FAQ /></div>} />
                  <Route path="/about" element={<><SEO title="Nosotros | Nuestro ADN" description="Conoce el equipo detrás de las estrategias virales y el crecimiento de marcas."/><AboutPage onBack={() => window.history.back()} /></>} />
                  <Route path="/policies" element={<><SEO title="Políticas | Privacidad" description="Políticas y términos de privacidad de LA MOVIE."/><Policies onBack={() => window.history.back()} /></>} />
                  <Route path="/servicios/:city" element={<LocalSEOPage />} />
                  <Route path="/recursos/plantillas-canva-emprendedores" element={<ResourcesHub />} />
                  <Route path="/admin/login" element={<><SEO title="Admin | Iniciar Sesión" description="Gestión administrativa."/><AdminLogin /></>} />
                  <Route path="/admin/dashboard" element={<><SEO title="Admin | Dashboard" description="Panel de administración."/><AdminDashboard /></>} />
              </Routes>
          </Layout>
          
          {/* Global Modals or Overlays can go here */}
          <Analytics />
          <CookieConsent />
      </HashRouter>
    </HelmetProvider>
  );
};

export default App;
