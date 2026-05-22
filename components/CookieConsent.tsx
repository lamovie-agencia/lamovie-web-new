import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Cookie, Sliders, Check, X, ShieldCheck } from 'lucide-react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    gtagLoaded?: boolean;
  }
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [adsConsent, setAdsConsent] = useState(true);

  // Initialize Default Consent Mode v2 Settings
  useEffect(() => {
    // Ensure dataLayer and gtag function are initialized safely
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    // Retrieve previous user preferences from Storage
    const savedConsent = localStorage.getItem('la_movie_cookie_consent_v2');

    if (!savedConsent) {
      // Per Google Consent Mode V2 specifications: block tracking by default
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'personalization_storage': 'denied',
        'security_storage': 'granted' // core security defaults to allowed
      });

      // Smooth custom spring entrance triggered after 500ms
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Preferences already saved, initialize with stored configuration
      try {
        const preferences = JSON.parse(savedConsent);
        const hasAnalytics = preferences.analytics_storage === 'granted';
        const hasAds = preferences.ad_storage === 'granted';

        setAnalyticsConsent(hasAnalytics);
        setAdsConsent(hasAds);

        gtag('consent', 'default', {
          'analytics_storage': preferences.analytics_storage || 'denied',
          'ad_storage': preferences.ad_storage || 'denied',
          'ad_user_data': preferences.ad_user_data || 'denied',
          'ad_personalization': preferences.ad_personalization || 'denied',
          'personalization_storage': preferences.personalization_storage || 'denied',
          'security_storage': 'granted'
        });

        // Trigger clean execution of analytics if authorized
        if (hasAnalytics || hasAds) {
          triggerAnalyticsPipeline();
        }
      } catch (e) {
        console.error('Failed to parse previous cookie consent configuration', e);
      }
    }
  }, []);

  // Execution pipeline for tracking scripts (IP anonymized as requested)
  const triggerAnalyticsPipeline = () => {
    if (window.gtagLoaded) return;
    window.gtagLoaded = true;

    const gaId = "G-LAMOVIE2026";
    
    // Inject official scripts dynamically to ensure clean sandboxed loading
    const trackingScriptEl = document.createElement("script");
    trackingScriptEl.async = true;
    trackingScriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(trackingScriptEl);

    const initializationScriptEl = document.createElement("script");
    initializationScriptEl.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', { 
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(initializationScriptEl);
    console.log("🎬 LA MOVIE | Analytics suite initialized securely.");
  };

  const handleAcceptAll = () => {
    const preferences = {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      personalization_storage: 'granted',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('la_movie_cookie_consent_v2', JSON.stringify(preferences));

    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'personalization_storage': 'granted'
      });
    }

    triggerAnalyticsPipeline();
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const preferences = {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      personalization_storage: 'denied',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('la_movie_cookie_consent_v2', JSON.stringify(preferences));

    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'personalization_storage': 'denied'
      });
    }

    // Hide banner fluidly and leave tracking blocked
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    const preferences = {
      analytics_storage: analyticsConsent ? 'granted' : 'denied',
      ad_storage: adsConsent ? 'granted' : 'denied',
      ad_user_data: adsConsent ? 'granted' : 'denied',
      ad_personalization: adsConsent ? 'granted' : 'denied',
      personalization_storage: analyticsConsent ? 'granted' : 'denied',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('la_movie_cookie_consent_v2', JSON.stringify(preferences));

    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': preferences.analytics_storage,
        'ad_storage': preferences.ad_storage,
        'ad_user_data': preferences.ad_user_data,
        'ad_personalization': preferences.ad_personalization,
        'personalization_storage': preferences.personalization_storage
      });
    }

    if (analyticsConsent || adsConsent) {
      triggerAnalyticsPipeline();
    }

    setShowBanner(false);
    setShowConfig(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          id="cookie-consent-modal"
          initial={{ opacity: 0, y: 150, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 95, damping: 14 }}
          className="fixed bottom-6 left-6 z-[99999] w-[calc(100%-3rem)] sm:w-[460px] bg-[#0D0D0D]/95 border border-[#B0232E]/30 rounded-2xl p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_20px_rgba(176,35,46,0.12)] backdrop-blur-md group relative overflow-hidden"
        >
          {/* Subtle Aesthetic Red Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#B0232E]/10 blur-[80px] rounded-full group-hover:bg-[#B0232E]/15 transition-all duration-700 pointer-events-none"></div>

          {!showConfig ? (
            <div className="relative z-10 flex flex-col h-full">
              {/* Header Box */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#B0232E]/20 to-[#B0232E]/5 text-[#B0232E] rounded-xl flex items-center justify-center border border-[#B0232E]/20">
                    <Cookie size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-white font-heading font-black text-xs uppercase tracking-widest leading-none">CONFIGURACIÓN CINÉFILA</h4>
                    <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 mt-1 inline-block">Consent Mode v2</span>
                  </div>
                </div>
              </div>

              {/* Persuative Copywriting text as required */}
              <p className="text-white/80 text-xs md:text-[13px] leading-relaxed mb-6 font-medium">
                🚨 <span className="text-[#B0232E] font-black uppercase font-mono">PLOT TWIST:</span> Usamos cookies. No de las que te rompen la dieta, sino de las que evitan que esta web cargue a <span className="text-white font-bold font-mono">2 FPS</span> como un mal streaming. ¿Aceptas el <span className="text-white underline decoration-[#B0232E] decoration-2">Director's Cut</span> o prefieres la versión censurada?
              </p>

              {/* Visual Divider */}
              <div className="w-full h-[1px] bg-white/5 mb-5" />

              {/* Bottom Action Grid */}
              <div className="flex flex-col gap-3">
                <button
                  id="cookie-btn-accept"
                  onClick={handleAcceptAll}
                  className="w-full bg-[#B0232E] hover:bg-red-700 text-white py-4 px-6 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(176,35,46,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Aceptar Director's Cut 🎥
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="cookie-btn-reject"
                    onClick={handleRejectAll}
                    className="w-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/90 border border-white/5 py-3 rounded-lg text-[9px] uppercase font-bold tracking-widest transition-colors duration-200 cursor-pointer text-center"
                  >
                    Versión censurada
                  </button>
                  <button
                    id="cookie-btn-configure"
                    onClick={() => setShowConfig(true)}
                    className="w-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/90 border border-white/5 py-3 rounded-lg text-[9px] uppercase font-bold tracking-widest transition-colors duration-200 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sliders size={12} /> Configurar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col">
              {/* Header Configuration */}
              <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders size={16} className="text-[#B0232E]" />
                  <h4 className="text-white font-heading font-black text-xs uppercase tracking-widest">CONTROL DE METADATOS</h4>
                </div>
                <button 
                  onClick={() => setShowConfig(false)}
                  className="text-white/40 hover:text-white hover:bg-white/5 p-1 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Interactive Multi-Scope Settings */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-xl transition-all hover:bg-white/[0.04] hover:border-white/10">
                  <div className="pr-4">
                    <h5 className="text-white font-bold text-[11px] uppercase tracking-wider">Métricas de Audiencia (GA4)</h5>
                    <p className="text-[9px] text-white/40 leading-relaxed mt-0.5">Permite medir el rendimiento del reproductor de video y resolver caídas.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnalyticsConsent(!analyticsConsent)}
                    className={`shrink-0 w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 pointer-events-auto ${
                      analyticsConsent ? 'bg-[#50b246]' : 'bg-white/10'
                    }`}
                  >
                    <div className={`bg-white w-4.5 h-4.5 rounded-full shadow transition-transform duration-300 ${
                      analyticsConsent ? 'translate-x-[18px]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-xl transition-all hover:bg-white/[0.04] hover:border-white/10">
                  <div className="pr-4">
                    <h5 className="text-white font-bold text-[11px] uppercase tracking-wider">Atribución de Tráfico</h5>
                    <p className="text-[9px] text-white/40 leading-relaxed mt-0.5">Estadísticas precisas de conversiones desde Meta Ads y referidos.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdsConsent(!adsConsent)}
                    className={`shrink-0 w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 pointer-events-auto ${
                      adsConsent ? 'bg-[#50b246]' : 'bg-white/10'
                    }`}
                  >
                    <div className={`bg-white w-4.5 h-4.5 rounded-full shadow transition-transform duration-300 ${
                      adsConsent ? 'translate-x-[18px]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Action triggers */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleSaveCustom}
                  className="flex-1 bg-[#B0232E] hover:bg-red-700 text-white py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_5px_15px_rgba(176,35,46,0.2)]"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setShowConfig(false)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Atrás
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
