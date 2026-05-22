import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Send, MessageCircle, Zap, Globe, Clock, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { leadsService } from '../lib/leadsService';

interface ContactProps {
  email?: string;
  whatsapp?: string;
}

const Contact: React.FC<ContactProps> = ({ email = 'hola@lamovie.agency', whatsapp = '573017355046' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Social Growth',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Submit payload asynchronously to CRM
    await leadsService.submitLead({
      name: formData.name,
      email: formData.email,
      service: formData.service,
      message: formData.message
    });

    const whatsappMessage = `Hola LA MOVIE! Mi nombre es ${formData.name}. Mi correo es ${formData.email}. Me interesa el servicio de de: ${formData.service}. Mensaje: ${formData.message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    setTimeout(() => {
      setIsSubmitting(false);
      window.open(`https://wa.me/${whatsapp}?text=${encodedMessage}`, '_blank');
    }, 1200);
  };

  return (
    <section id="contact" className="py-32 bg-[#0d0d0d] relative overflow-hidden min-h-screen flex items-center border-t border-white/5">
      {/* Subtle Background Video */}
      <div className="absolute inset-0 opacity-10 z-[1] mix-blend-screen pointer-events-none">
         <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4" type="video/mp4" />
         </video>
      </div>

      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#B0232E]/5 blur-[200px] rounded-full pointer-events-none z-[1]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[200px] rounded-full pointer-events-none z-[1]"></div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d] z-[2]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Editorial Authority Pitch */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B0232E]/30 bg-[#B0232E]/10 text-[#B0232E] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
               <Zap size={14} className="fill-[#B0232E]" /> Contacto Concesionario VIP
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 tracking-tighter uppercase leading-none">
              INICIA LA REVOLUCIÓN DE TU MARCA
            </h2>
            <p className="text-white/60 text-lg font-light mb-12 max-w-xl leading-relaxed border-l-2 border-[#B0232E] pl-6">
              No dejes tu contenido en manos de amateurs. Diseñamos, producimos y escalamos campañas memorables con rigor cinematográfico y analítica predictiva.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#B0232E] group-hover:bg-[#B0232E] group-hover:text-white transition-all duration-500">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Email Corporativo</p>
                  <p className="text-white text-md font-bold">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#B0232E] group-hover:bg-[#B0232E] group-hover:text-white transition-all duration-500">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">WhatsApp Directo</p>
                  <p className="text-white text-md font-bold">+{whatsapp}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#B0232E] group-hover:bg-[#B0232E] group-hover:text-white transition-all duration-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Ubicación Central</p>
                  <p className="text-white text-md font-bold">Cartagena, Colombia & Global Delivery</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {[Instagram, Facebook, Linkedin, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-[#B0232E] hover:border-[#B0232E] transition-all duration-300">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Side: High-Conversion Form Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-[#121212] border border-white/5 p-10 md:p-14 rounded-[32px] overflow-hidden relative group shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#B0232E]/10 blur-[120px] -mr-32 -mt-32 pointer-events-none rounded-full"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-heading font-black text-white mb-8 uppercase tracking-tight">SOLICITUD DE ADMISIÓN</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2 font-bold font-mono">Nombre Completo</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Juan Pérez"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:border-[#B0232E] focus:outline-none transition-all placeholder:text-white/20 focus:shadow-[0_0_15px_rgba(176,35,46,0.3)]"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2 font-bold font-mono">Correo Electrónico</label>
                      <input 
                        required
                        type="email" 
                        placeholder="ejemplo@corporativo.com"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:border-[#B0232E] focus:outline-none transition-all placeholder:text-white/20 focus:shadow-[0_0_15px_rgba(176,35,46,0.3)]"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2 font-bold font-mono">Servicio Requerido</label>
                    <select 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white/70 focus:border-[#B0232E] focus:outline-none transition-all appearance-none cursor-pointer"
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                    >
                      <option value="Social Growth" className="bg-black">Social Growth Híbrido</option>
                      <option value="Cine Publicitario" className="bg-black">Cine Publicitario</option>
                      <option value="Ecosistemas Web" className="bg-black">Ecosistemas Web</option>
                      <option value="Identidad & Print" className="bg-black">Identidad & Print</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/40 mb-2 font-bold font-mono">Breve Contexto del Negocio</label>
                    <textarea 
                      rows={3}
                      placeholder="Cuéntanos brevemente sobre las metas de tu marca..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:border-[#B0232E] focus:outline-none transition-all resize-none placeholder:text-white/20 focus:shadow-[0_0_15px_rgba(176,35,46,0.3)]"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  {/* Micro-trust copywriting at borders */}
                  <div className="p-4 rounded-xl border border-white/5 bg-black/40 text-[10px] text-white/40 space-y-1.5 font-mono">
                    <p className="flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-green-500 shrink-0" />
                      <span>Garantía de privacidad 100% libre de spam.</span>
                    </p>
                    <p className="flex items-center gap-1.5 leading-relaxed">
                      <Heart size={12} className="text-[#B0232E] shrink-0 fill-[#B0232E]" />
                      <span>Recibe respuesta VIP directamente de nuestro equipo directivo en menos de 2 horas.</span>
                    </p>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#B0232E] to-red-600 hover:from-red-600 hover:to-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-xs transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(176,35,46,0.4)] active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    Enviar mi Solicitud Segura 🔒
                  </button>
                </form>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
