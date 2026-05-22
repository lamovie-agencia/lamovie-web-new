
import React, { useState, useRef } from 'react';
import { Printer, Layers, Maximize, Package, Shirt, Palette, PenTool, ArrowRight, Upload, Image as ImageIcon, RefreshCw, Download, Trash2, Sliders, Move } from 'lucide-react';

const printServices = [
  {
    id: 1,
    title: "Formatos Pequeños",
    icon: <Layers size={32} />,
    items: ["Flyers", "Tarjetas de presentación", "Stickers / Etiquetas", "Volantes", "Menús", "Brochures", "Tickets"],
    accent: "border-cyan-500",
    glow: "shadow-cyan-500/20",
    iconColor: "text-cyan-400"
  },
  {
    id: 2,
    title: "Gran Formato",
    icon: <Maximize size={32} />,
    items: ["Pendones", "Roll Ups (Banners)", "Lonas Front/Back", "Microperforados", "Vinilo Adhesivo", "Backdrops", "Gigantografías"],
    accent: "border-yellow-500",
    glow: "shadow-yellow-500/20",
    iconColor: "text-yellow-400"
  },
  {
    id: 3,
    title: "Identidad & Kits",
    icon: <Palette size={32} />,
    items: ["Kits empresariales", "Papelería corporativa", "Placas acrílicas", "Señalética interna", "Carnets PVC"],
    accent: "border-pink-500",
    glow: "shadow-pink-500/20",
    iconColor: "text-pink-500"
  },
  {
    id: 4,
    title: "Merchandising",
    icon: <Shirt size={32} />,
    items: ["Camisetas estampadas", "Gorras", "Termos", "Libretas", "Bolsas ecológicas", "Souvenirs"],
    accent: "border-green-500",
    glow: "shadow-green-500/20",
    iconColor: "text-green-400"
  },
  {
    id: 5,
    title: "Empaques & Etiquetas",
    icon: <Package size={32} />,
    items: ["Etiquetas adhesivas (Rollo/Pliego)", "Cajas personalizadas", "Tags colgantes", "Stickers troquelados", "Empaques belleza/moda"],
    accent: "border-purple-500",
    glow: "shadow-purple-500/20",
    iconColor: "text-purple-400"
  },
  {
    id: 6,
    title: "Diseño & Acabados",
    icon: <PenTool size={32} />,
    items: ["Diseño gráfico para impresión", "Artes finales", "Asesoría de materiales", "Montaje en sitio", "Acabados premium"],
    accent: "border-white",
    glow: "shadow-white/20",
    iconColor: "text-white"
  }
];

type PreviewType = 'card' | 'rollup' | 'flyer' | 'poster' | 'mug' | 'notebook' | 'tshirt' | 'bag';

const PrintStudio: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState("#B0232E");
  const [previewType, setPreviewType] = useState<PreviewType>('card');
  
  // Adjustment States
  const [logoScale, setLogoScale] = useState(1);
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWhatsApp = (service: string) => {
    const message = `Hola, estoy interesado en los servicios de impresión de PRINT STUDIO (%2A${service}%2A). Me gustaría cotizar.`;
    window.open(`https://wa.me/573017355046?text=${message}`, '_blank');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogo(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetPreview = () => {
    setLogo(null);
    setBrandColor("#B0232E");
    setLogoScale(1);
    setLogoPos({ x: 0, y: 0 });
  };

  const getLogoStyle = () => ({
    transform: `translate(${logoPos.x}px, ${logoPos.y}px) scale(${logoScale})`,
    transition: 'transform 0.1s linear'
  });

  return (
    <section id="print-studio" className="py-24 bg-movie-dark text-white relative overflow-hidden">
      {/* CMYK Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-500 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-4 opacity-0 animate-[fadeInUp_1s_ease-out_forwards]">
             <Printer size={24} className="text-white" />
             <h2 className="text-white font-bold tracking-[0.3em] text-sm uppercase">División de Impresión</h2>
          </div>
          
          <h3 className="text-5xl md:text-7xl font-heading font-black mb-6 uppercase leading-none tracking-tighter">
            PRINT STUDIO <span className="block text-2xl md:text-3xl font-light tracking-normal normal-case mt-2 text-movie-silver">by BRANFIC & LA MOVIE</span>
          </h3>
          
          <p className="text-movie-text max-w-2xl mx-auto text-lg leading-relaxed">
            En LA MOVIE no solo creamos contenido digital: <strong className="text-white">lo llevamos a la realidad.</strong><br/>
            Impresión profesional de alto impacto, diseñada para marcas que buscan calidad, velocidad y acabados premium.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {printServices.map((service) => (
            <div 
              key={service.id} 
              className={`group bg-movie-black/80 backdrop-blur-sm border border-white/5 p-8 rounded-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:border-opacity-50 ${service.accent} hover:${service.glow}`}
            >
              <div className={`mb-6 ${service.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">{service.title}</h4>
              
              <ul className="space-y-2 mb-8 min-h-[120px]">
                {service.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-movie-silver flex items-start gap-2">
                    <span className={`w-1 h-1 mt-2 rounded-full ${service.iconColor.replace('text-', 'bg-')} opacity-70`}></span>
                    {item}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleWhatsApp(service.title)}
                className="w-full py-3 bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              >
                COTIZAR ESTE ACABADO <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* --- NEW: BRAND SIMULATOR --- */}
        <div className="mb-24 border-t border-white/10 pt-16">
           <div className="text-center mb-12">
              <h3 className="text-3xl font-heading font-bold text-white mb-4 flex items-center justify-center gap-3">
                 <Palette className="text-movie-red" /> SIMULADOR DE MARCA
              </h3>
              <p className="text-movie-silver">Sube tu logo, ajusta la posición y mira cómo cobra vida en productos reales.</p>
           </div>

           <div className="flex flex-col lg:flex-row gap-12 items-start justify-center max-w-6xl mx-auto">
              
              {/* Controls */}
              <div className="w-full lg:w-1/3 space-y-8 bg-movie-black/50 p-8 rounded-lg border border-white/5 h-full">
                  
                  {/* Upload */}
                  <div>
                     <label className="block text-xs font-bold uppercase text-white mb-3 flex items-center gap-2"><Upload size={14}/> 1. Sube tu Logo</label>
                     <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                     />
                     <div 
                        onClick={triggerFileInput}
                        className="border-2 border-dashed border-white/20 hover:border-movie-red hover:bg-movie-red/5 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
                     >
                        {logo ? (
                           <div className="relative w-full h-24 flex items-center justify-center">
                              <img src={logo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white font-bold">
                                 Cambiar Logo
                              </div>
                           </div>
                        ) : (
                           <>
                              <ImageIcon className="text-movie-silver mb-2 group-hover:text-movie-red" size={32} />
                              <span className="text-xs text-movie-silver font-bold uppercase">Click para subir</span>
                           </>
                        )}
                     </div>
                  </div>

                  {/* Color Picker */}
                  <div>
                     <label className="block text-xs font-bold uppercase text-white mb-3 flex items-center gap-2"><Palette size={14}/> 2. Color de Marca</label>
                     <div className="flex items-center gap-4">
                        <input 
                           type="color" 
                           value={brandColor} 
                           onChange={(e) => setBrandColor(e.target.value)}
                           className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-sm font-mono text-movie-silver">{brandColor}</span>
                     </div>
                  </div>

                  {/* Preview Selector */}
                  <div>
                     <label className="block text-xs font-bold uppercase text-white mb-3 flex items-center gap-2"><Maximize size={14}/> 3. Elige el Producto</label>
                     <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'card', label: 'Tarjeta' },
                            { id: 'rollup', label: 'Roll Up' },
                            { id: 'flyer', label: 'Flyer' },
                            { id: 'poster', label: 'Poster' },
                            { id: 'mug', label: 'Mug' },
                            { id: 'notebook', label: 'Libreta' },
                            { id: 'tshirt', label: 'Camiseta' },
                            { id: 'bag', label: 'Bolsa' }
                        ].map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setPreviewType(item.id as PreviewType)} 
                                className={`p-2 text-xs font-bold uppercase border rounded transition-all ${previewType === item.id ? 'bg-white text-black border-white' : 'border-white/10 text-movie-silver hover:text-white'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                     </div>
                  </div>

                  {/* Adjustments */}
                  {logo && (
                      <div className="bg-movie-dark/50 p-4 rounded border border-white/5">
                         <label className="block text-xs font-bold uppercase text-white mb-4 flex items-center gap-2"><Sliders size={14}/> 4. Ajustes</label>
                         
                         <div className="space-y-4">
                             <div>
                                <div className="flex justify-between text-[10px] text-movie-silver mb-1">
                                    <span>Tamaño</span>
                                    <span>{Math.round(logoScale * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.1" 
                                    max="3" 
                                    step="0.1" 
                                    value={logoScale}
                                    onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-movie-red"
                                />
                             </div>
                             
                             <div>
                                <div className="flex justify-between text-[10px] text-movie-silver mb-1">
                                    <span className="flex items-center gap-1"><Move size={10} /> Horizontal (X)</span>
                                    <span>{logoPos.x}px</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="-200" 
                                    max="200" 
                                    step="5" 
                                    value={logoPos.x}
                                    onChange={(e) => setLogoPos(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-movie-red"
                                />
                             </div>

                             <div>
                                <div className="flex justify-between text-[10px] text-movie-silver mb-1">
                                    <span className="flex items-center gap-1"><Move size={10} className="rotate-90" /> Vertical (Y)</span>
                                    <span>{logoPos.y}px</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="-200" 
                                    max="200" 
                                    step="5" 
                                    value={logoPos.y}
                                    onChange={(e) => setLogoPos(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-movie-red"
                                />
                             </div>
                         </div>
                      </div>
                  )}

                  <button onClick={resetPreview} className="w-full py-3 border border-white/10 text-movie-silver hover:text-white hover:bg-white/5 rounded text-xs font-bold uppercase flex items-center justify-center gap-2">
                     <Trash2 size={14} /> Reiniciar
                  </button>

              </div>

              {/* Visualization Stage */}
              <div className="w-full lg:w-2/3 bg-[#1a1a1a] rounded-xl p-8 min-h-[600px] flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border border-white/5 group">
                  
                  {/* Background Texture */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Render Item */}
                  <div className="relative transition-all duration-500 transform group-hover:scale-105">
                     
                     {/* --- BUSINESS CARD --- */}
                     {previewType === 'card' && (
                        <div className="relative w-[400px] h-[240px] rounded-lg shadow-2xl overflow-hidden flex flex-col" style={{ backgroundColor: brandColor }}>
                           {/* Pattern Overlay */}
                           <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-10 pointer-events-none"></div>
                           
                           <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                              {logo ? (
                                 <img src={logo} alt="Brand Logo" className="max-h-20 max-w-[80%] object-contain drop-shadow-lg" style={getLogoStyle()} />
                              ) : (
                                 <div className="text-white/50 font-bold text-xl tracking-widest uppercase border-2 border-white/30 p-4">Tu Logo Aquí</div>
                              )}
                           </div>
                           <div className="bg-black/20 backdrop-blur-sm p-5 flex justify-between items-center z-10">
                              <div className="space-y-2">
                                 <div className="w-32 h-2 bg-white/40 rounded"></div>
                                 <div className="w-20 h-1.5 bg-white/20 rounded"></div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-white/20"></div>
                           </div>
                        </div>
                     )}

                     {/* --- ROLL UP BANNER --- */}
                     {previewType === 'rollup' && (
                        <div className="relative w-[240px] h-[500px] bg-white rounded-t-sm shadow-2xl flex flex-col overflow-hidden border-x-4 border-t-4 border-gray-800">
                           {/* Header Area */}
                           <div className="h-1/3 w-full flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: brandColor }}>
                              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full pointer-events-none"></div>
                              {logo ? (
                                 <img src={logo} alt="Brand Logo" className="max-h-20 max-w-[80%] object-contain drop-shadow-lg relative z-10" style={getLogoStyle()} />
                              ) : (
                                 <div className="text-white/50 font-bold text-xs tracking-widest uppercase border border-white/30 p-2">Tu Logo</div>
                              )}
                           </div>
                           
                           {/* Body */}
                           <div className="flex-1 bg-white p-4 space-y-4 flex flex-col items-center justify-center text-center">
                               <h4 className="text-black font-bold uppercase tracking-wider text-xl" style={{ color: brandColor }}>Gran Evento</h4>
                               <div className="w-full h-32 bg-gray-100 rounded mb-2 overflow-hidden relative">
                                   <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                               </div>
                               <div className="space-y-1 w-full">
                                  <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                  <div className="h-2 bg-gray-200 rounded w-5/6 mx-auto"></div>
                                  <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
                               </div>
                           </div>

                           {/* Footer */}
                           <div className="h-12 bg-black flex items-center justify-center z-10">
                              <p className="text-[9px] text-white tracking-widest">WWW.TUMARCA.COM</p>
                           </div>

                           {/* Stand Feet (Visual only) */}
                           <div className="absolute -bottom-4 left-4 w-3 h-6 bg-gray-400 rounded-full"></div>
                           <div className="absolute -bottom-4 right-4 w-3 h-6 bg-gray-400 rounded-full"></div>
                        </div>
                     )}

                     {/* --- FLYER --- */}
                     {previewType === 'flyer' && (
                        <div className="relative w-[320px] h-[440px] bg-white shadow-2xl flex flex-col rotate-2 overflow-hidden border border-white/10">
                           {/* Header Image Placeholder */}
                           <div className="h-1/2 bg-gray-800 relative overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                  {logo ? (
                                     <img src={logo} alt="Brand Logo" className="max-h-32 max-w-[80%] object-contain drop-shadow-2xl" style={getLogoStyle()} />
                                  ) : (
                                     <div className="text-white font-bold text-lg tracking-widest uppercase border-2 border-white p-2">Tu Logo</div>
                                  )}
                              </div>
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1 p-8 relative bg-white">
                               {/* Accent Shape */}
                               <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: brandColor }}></div>
                               
                               <h3 className="text-4xl font-black uppercase mb-3 text-black leading-none mt-4">Gran <br/><span style={{ color: brandColor }}>Apertura</span></h3>
                               <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ven a conocer nuestra nueva colección.
                               </p>
                               <div className="mt-auto inline-block px-6 py-3 text-white font-bold text-sm uppercase tracking-widest shadow-lg" style={{ backgroundColor: brandColor }}>
                                  50% OFF
                               </div>
                           </div>
                        </div>
                     )}

                     {/* --- POSTER --- */}
                     {previewType === 'poster' && (
                         <div className="relative w-[300px] h-[420px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-black flex flex-col overflow-hidden">
                             <div className="flex-1 relative flex items-center justify-center p-8" style={{ backgroundColor: brandColor }}>
                                 <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none"></div>
                                 {logo ? (
                                     <img src={logo} alt="Brand Logo" className="max-h-48 max-w-full object-contain drop-shadow-2xl mix-blend-normal" style={getLogoStyle()} />
                                 ) : (
                                     <div className="text-white/50 font-black text-4xl tracking-tighter uppercase -rotate-12 border-4 border-white/30 p-4">POSTER</div>
                                 )}
                                 {/* Grunge Texture Overlay */}
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                             </div>
                             <div className="h-24 bg-white p-4 flex flex-col justify-center items-center text-black text-center z-10">
                                 <h4 className="font-black uppercase text-xl leading-none mb-1">Concierto / Evento</h4>
                                 <p className="text-[10px] text-gray-500 font-bold tracking-widest">ENTRADA LIBRE • 20:00 HRS</p>
                             </div>
                         </div>
                     )}

                     {/* --- MUG (Cylindrical Effect) --- */}
                     {previewType === 'mug' && (
                         <div className="relative flex items-center">
                             {/* Mug Body */}
                             <div className="relative w-48 h-56 bg-white rounded-lg overflow-hidden shadow-2xl z-10 border-b-8 border-gray-100">
                                 {/* Cylindrical Shader */}
                                 <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-20 pointer-events-none"></div>
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none mix-blend-overlay"></div>
                                 
                                 <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                    {logo ? (
                                        <img src={logo} alt="Brand Logo" className="max-w-[120px] object-contain mix-blend-multiply opacity-90" style={getLogoStyle()} />
                                    ) : (
                                        <div className="text-gray-300 font-bold text-4xl tracking-tighter uppercase opacity-50 rotate-90">MUG</div>
                                    )}
                                 </div>
                                 
                                 {/* Rim */}
                                 <div className="absolute top-0 w-full h-4 bg-gradient-to-b from-gray-100 to-white opacity-50"></div>
                             </div>
                             {/* Handle */}
                             <div className="w-20 h-32 border-[16px] border-white rounded-r-3xl -ml-4 z-0 shadow-xl relative">
                                 <div className="absolute inset-0 border-[16px] border-gray-100/20 rounded-r-3xl"></div>
                             </div>
                         </div>
                     )}

                     {/* --- NOTEBOOK --- */}
                     {previewType === 'notebook' && (
                         <div className="relative w-[300px] h-[400px] bg-gray-100 rounded-r-2xl shadow-2xl flex overflow-hidden border border-l-0 border-gray-300">
                             {/* Spiral Binding */}
                             <div className="w-12 bg-[#2a2a2a] flex flex-col items-center justify-evenly h-full z-20 relative shadow-xl">
                                 {[...Array(12)].map((_, i) => (
                                     <div key={i} className="w-full h-3 relative">
                                         <div className="absolute left-0 w-8 h-3 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-500 rounded-r-full shadow-sm"></div>
                                     </div>
                                 ))}
                             </div>
                             
                             {/* Cover */}
                             <div className="flex-1 relative overflow-hidden flex flex-col" style={{ backgroundColor: brandColor }}>
                                 {/* Texture */}
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                                 
                                 {/* Elastic Band */}
                                 <div className="absolute right-8 top-0 bottom-0 w-4 bg-black/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10"></div>

                                 <div className="flex-1 flex items-center justify-center overflow-hidden p-8">
                                     {logo ? (
                                         <img src={logo} alt="Brand Logo" className="max-w-full max-h-full object-contain drop-shadow-md" style={getLogoStyle()} />
                                     ) : (
                                         <div className="border-2 border-white/20 p-6 text-white/20 font-heading font-bold text-2xl uppercase tracking-widest">Notas</div>
                                     )}
                                 </div>
                                 
                                 <div className="h-16 flex items-center justify-center">
                                    <div className="text-[10px] text-white/50 font-mono tracking-[0.3em]">DESIGN COLLECTION 2024</div>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* --- T-SHIRT --- */}
                     {previewType === 'tshirt' && (
                        <div className="relative w-[350px] h-[350px] flex items-center justify-center">
                           {/* Simple CSS T-Shirt Shape */}
                           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                              <defs>
                                 <mask id="tshirt-mask">
                                    <path d="M30,10 Q35,20 40,10 L50,10 Q55,20 60,10 L70,10 Q80,12 85,25 L75,35 L75,90 L15,90 L15,35 L5,25 Q10,12 20,10 Z" fill="white" />
                                 </mask>
                              </defs>
                              <rect width="100" height="100" fill={brandColor} mask="url(#tshirt-mask)" />
                              {/* Shading */}
                              <path d="M30,10 Q35,20 40,10 L50,10 Q55,20 60,10 L70,10 Q80,12 85,25 L75,35 L75,90 L15,90 L15,35 L5,25 Q10,12 20,10 Z" fill="url(#shirt-shading)" opacity="0.2" style={{mixBlendMode: 'multiply'}} pointerEvents="none" />
                              <linearGradient id="shirt-shading" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="black" stopOpacity="0.1" />
                                 <stop offset="50%" stopColor="transparent" />
                                 <stop offset="100%" stopColor="black" stopOpacity="0.3" />
                              </linearGradient>
                           </svg>
                           
                           {/* Logo Overlay */}
                           <div className="absolute top-[25%] left-0 right-0 flex justify-center pointer-events-none">
                              <div className="w-[30%] h-[30%] overflow-hidden flex items-center justify-center">
                                  {logo ? (
                                     <img src={logo} alt="Brand Logo" className="w-full h-full object-contain mix-blend-multiply opacity-90" style={getLogoStyle()} />
                                  ) : (
                                     <div className="text-white/50 text-[8px] font-bold uppercase border border-white/30 p-1">Logo</div>
                                  )}
                              </div>
                           </div>
                        </div>
                     )}

                     {/* --- SHOPPING BAG --- */}
                     {previewType === 'bag' && (
                         <div className="relative w-[280px] h-[360px] shadow-2xl mt-8">
                            {/* Handles */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-[8px] border-gray-800 z-0 clip-path-half"></div>
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-[8px] border-gray-900 z-0 mt-1 clip-path-half opacity-50"></div>

                            {/* Bag Body */}
                            <div className="relative w-full h-full flex" style={{ backgroundColor: brandColor }}>
                               {/* Side Fold (Left) */}
                               <div className="w-4 h-full bg-black/20 skew-y-12 origin-top-right absolute -left-4 top-0 border-r border-white/10"></div>
                               
                               {/* Front Face */}
                               <div className="flex-1 relative flex items-center justify-center overflow-hidden p-8 z-10">
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none"></div>
                                  
                                  {logo ? (
                                     <img src={logo} alt="Brand Logo" className="max-w-full max-h-[150px] object-contain drop-shadow-sm" style={getLogoStyle()} />
                                  ) : (
                                     <div className="text-white/30 font-heading font-bold text-2xl border-4 border-white/20 p-4">BRAND</div>
                                  )}
                               </div>
                            </div>
                            
                            {/* Shadow */}
                            <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/50 blur-md rounded-[100%]"></div>
                         </div>
                     )}

                  </div>

                  <div className="absolute bottom-4 right-4 text-white/20 text-[10px] uppercase font-mono">
                     Vista Previa Generada por LA MOVIE
                  </div>

              </div>
           </div>
           
           <div className="text-center mt-12">
              <p className="text-movie-text text-sm mb-4">¿Te gusta cómo se ve? Envíanos tu diseño o deja que nosotros lo creemos.</p>
              <button 
                 onClick={() => handleWhatsApp('Diseño Personalizado')}
                 className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-movie-red hover:text-white transition-all font-bold uppercase tracking-widest rounded"
              >
                 <Download size={16} /> HACER REALIDAD MI DISEÑO
              </button>
           </div>

        </div>

        {/* Value Proposition Bar */}
        <div className="bg-gradient-to-r from-movie-black via-movie-dark to-movie-black border-y border-white/10 py-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                 <h5 className="font-bold text-white">Colores Reales</h5>
                 <p className="text-xs text-movie-silver">Calibración profesional</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>
                 <h5 className="font-bold text-white">Acabados Premium</h5>
                 <p className="text-xs text-movie-silver">Materiales de alta gama</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_#facc15]"></div>
                 <h5 className="font-bold text-white">Entrega Express</h5>
                 <p className="text-xs text-movie-silver">Tiempos optimizados</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]"></div>
                 <h5 className="font-bold text-white">Diseño + Print</h5>
                 <p className="text-xs text-movie-silver">Todo en un solo lugar</p>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default PrintStudio;