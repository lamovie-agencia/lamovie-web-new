import React, { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';
import { ASSETS } from '../data/assets'; // IMPORT ASSETS

const clients = [
  { name: "papi", src: "https://distribuidorapapis.com/wp-content/uploads/2024/06/cropped-LOGO-DP-BLANCO.png" },
  { name: "aym", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZQ87zs1z5Q_P-KqD39dr8unOdZTCwAtlOjw&s" },
  { name: "Cajasai", src: "https://cajasai.com/soporte/wp-content/uploads/2018/03/cropped-LOGO-CAJASAI-VECTORIZADO-2.png" },
  { name: "bahiadelsol", src: "https://static.wixstatic.com/media/fd0487_5c8e753e52084b6d8d35d69cc656e65c~mv2.png/v1/crop/x_0,y_894,w_1641,h_923/fill/w_128,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo-letras-azules.png" },
  { name: "bhk", src: "https://cdn.shopify.com/s/files/1/0700/3052/4636/files/LOGO_BHK_3.png?v=1766181369" },
  { name: "lavitrina", src: "https://www.lavitrinatextil.com/cdn/shop/files/LOGO_LA_VITRINA_TEXTIL_SINFONDO-02.png?v=1770673573&width=1920" },
  { name: "fundacion", src: "https://www.fundacionlaluz.co/_next/image?url=%2FlogoFundacionLaLuz.png&w=96&q=75" },
  { name: "gets", src: "https://getsmobile.shop/wp-content/uploads/2024/06/cropped-logogRecurso-5.png" }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>(ASSETS.testimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            const dbTestimonials = data.map((item: any) => ({
              quote: item.content,
              author: item.name,
              role: item.role,
              image: item.image_url || `https://picsum.photos/seed/${item.id}/100/100`,
              fallback: `https://picsum.photos/seed/${item.id}/100/100`
            }));
            setTestimonials([...dbTestimonials, ...ASSETS.testimonials]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch testimonials");
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-24 bg-movie-dark border-t border-white/5 relative overflow-hidden">
      <div className="absolute -left-20 top-20 text-[20rem] text-white/5 font-heading font-black leading-none select-none">"</div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Client Logos / Names */}
        <div className="mb-24">
           <p className="text-center text-movie-silver text-xs font-bold uppercase tracking-[0.3em] mb-10">Confían en nosotros</p>
           <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             {clients.map((client, i) => (
               <div key={i} className="flex items-center justify-center transition-transform hover:scale-110">
                 <img src={client.src} alt={client.name} className="max-h-12 md:max-h-16 w-auto object-contain" />
               </div>
             ))}
           </div>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto text-center">
            <div className="relative min-h-[300px]">
              {testimonials.map((item, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center ${
                    index === currentIndex 
                      ? 'opacity-100 transform translate-y-0 pointer-events-auto' 
                      : 'opacity-0 transform translate-y-8 pointer-events-none'
                  }`}
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className="fill-movie-red text-movie-red" />
                    ))}
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-light italic text-white leading-relaxed mb-8">
                    "{item.quote}"
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <img 
                        src={item.image} 
                        onError={(e) => e.currentTarget.src = item.fallback || ""}
                        alt={`Testimonio cliente ${item.author} - ${item.role}`} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-movie-red" 
                    />
                    <div className="text-left">
                      <h5 className="text-white font-bold text-lg">{item.author}</h5>
                      <p className="text-movie-red text-sm uppercase tracking-wider font-semibold">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Dots Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-movie-red w-10' : 'bg-white/20 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;