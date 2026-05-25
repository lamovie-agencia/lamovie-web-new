import React, { useEffect, useState } from 'react';
import { adminService } from '../lib/adminService';

const FALLBACK_LOGOS = [
  { name: "Distribuidora Papis", logo_url: "https://distribuidorapapis.com/wp-content/uploads/2024/06/cropped-LOGO-DP-BLANCO.png" },
  { name: "Cajasai", logo_url: "https://cajasai.com/soporte/wp-content/uploads/2018/03/cropped-LOGO-CAJASAI-VECTORIZADO-2.png" },
  { name: "Bahia del Sol", logo_url: "https://static.wixstatic.com/media/fd0487_5c8e753e52084b6d8d35d69cc656e65c~mv2.png/v1/crop/x_0,y_894,w_1641,h_923/fill/w_128,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo-letras-azules.png" },
  { name: "BHK", logo_url: "https://cdn.shopify.com/s/files/1/0700/3052/4636/files/LOGO_BHK_3.png?v=1766181369" },
  { name: "La Vitrina Textil", logo_url: "https://www.lavitrinatextil.com/cdn/shop/files/LOGO_LA_VITRINA_TEXTIL_SINFONDO-02.png?v=1770673573&width=1920" },
  { name: "Gets Mobile", logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNBl9hqGvovWp2aZV69qQf7KSoCI49ws9m4A&s" },
  { name: "Grupo Educate", logo_url: "https://www.grupoeducatecolombia.com/wp-content/uploads/2025/10/menu-logo-K.png" }
];

export default function ClientLogos() {
  const [logos, setLogos] = useState<any[]>(FALLBACK_LOGOS);

  useEffect(() => {
    adminService.getPartners()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLogos(data);
      })
      .catch(() => setLogos(FALLBACK_LOGOS));
  }, []);

  const loop = [...logos, ...logos, ...logos];

  return (
    <section className="py-10 border-y border-white/5 bg-black/70 backdrop-blur-md overflow-hidden relative z-20">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.4em] font-black text-white/50">
          MARCAS QUE CONFÍAN EN NUESTRO IMPACTO
        </p>
      </div>
      <div className="flex w-max animate-scroll-film hover:[animation-play-state:paused]">
        {loop.map((brand, idx) => (
          <a
            key={`${brand.name}-${idx}`}
            href={brand.website_url || undefined}
            target={brand.website_url ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex-shrink-0 px-8 md:px-16 flex items-center justify-center grayscale opacity-50 hover:opacity-100 hover:grayscale-0 contrast-125 brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300"
            title={brand.name}
          >
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="max-h-12 md:max-h-14 w-auto object-contain"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

