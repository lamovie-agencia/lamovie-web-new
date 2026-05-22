import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, AlertTriangle, Copy, Check, ArrowLeft } from 'lucide-react';

interface PoliciesProps {
    onBack: () => void;
}

const bankAccounts = [
  { bank: "Davivienda", type: "Ahorros", number: "057100131911" },
  { bank: "Daviplata", type: "Móvil", number: "3017355046" },
  { bank: "Nequi", type: "Móvil", number: "3017355046" },
  { bank: "Bancolombia", type: "Ahorros", number: "678-000757-82" },
];

const Policies: React.FC<PoliciesProps> = ({ onBack }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'payments' | 'terms' | 'privacy' | 'security'>('payments');

  // Scroll to top on mount
  useEffect(() => {
      window.scrollTo(0, 0);
  }, [activeTab]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-movie-black animate-fade-in absolute inset-0 z-[60] overflow-y-auto">
      {/* Navbar for Policies Page */}
      <nav className="sticky top-0 z-50 bg-movie-black/95 backdrop-blur border-b border-white/10 py-4">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <button 
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-white hover:text-movie-red transition-colors font-bold uppercase text-xs tracking-wider"
              >
                  <ArrowLeft size={16} /> Volver
              </button>
              
              <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                {[
                  { id: 'payments', label: 'Pagos' },
                  { id: 'terms', label: 'Términos' },
                  { id: 'privacy', label: 'Privacidad' },
                  { id: 'security', label: 'Seguridad' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-movie-red text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="text-lg font-heading font-bold text-white tracking-widest hidden md:block">
                  LA MOVIE <span className="text-movie-red">/ LEGAL</span>
              </div>
          </div>
      </nav>

      <section className="py-20">
        <div className="container mx-auto px-6">
            {activeTab === 'payments' && (
              <>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-6 border border-white/10">
                      <ShieldCheck size={16} className="text-green-500" />
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Zona Segura</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">POLÍTICAS DE PAGO & CUENTAS</h2>
                  <p className="text-movie-silver max-w-2xl mx-auto text-lg">
                      Transparencia y seguridad para tu inversión. Estas son las únicas cuentas autorizadas para operar con Yosimar Zuñiga / LA MOVIE.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                
                {/* Bank Accounts Card */}
                <div className="bg-movie-dark p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden h-fit">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <CreditCard size={120} className="text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="w-2 h-8 bg-movie-red rounded-full"></span> Cuentas Autorizadas
                    </h3>

                    <div className="space-y-4">
                        {bankAccounts.map((acc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 transition-colors group">
                            <div>
                                <p className="text-white font-bold text-lg">{acc.bank}</p>
                                <p className="text-sm text-movie-silver">{acc.type}: <span className="font-mono text-white text-lg ml-2">{acc.number}</span></p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => copyToClipboard(acc.number, idx)}
                                className="p-3 bg-white/5 rounded-lg hover:bg-white/20 transition-colors text-movie-silver hover:text-white relative"
                                title="Copiar número"
                            >
                                {copiedIndex === idx ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                            </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-200 flex gap-3 items-start">
                        <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                        <p>
                            <strong>Importante:</strong> Ninguna otra cuenta, tercero o intermediario está autorizado. Confirma siempre al <strong>301 735 5046</strong> antes de transferir.
                        </p>
                    </div>
                </div>

                {/* Rules & Policies */}
                <div className="space-y-6">
                    <div className="bg-movie-dark/50 p-8 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider text-movie-red flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-movie-red text-white flex items-center justify-center text-xs">1</span>
                            Confirmación de Pago
                        </h4>
                        <p className="text-movie-text leading-relaxed">
                            Para validar cualquier pago, es obligatorio enviar el comprobante (Imagen/PDF) al WhatsApp oficial <strong>301 735 5046</strong> indicando nombre del cliente y servicio contratado. Sin soporte no se registra el abono.
                        </p>
                    </div>

                    <div className="bg-movie-dark/50 p-8 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider text-movie-red flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-movie-red text-white flex items-center justify-center text-xs">2</span>
                            Reserva de Fechas
                        </h4>
                        <p className="text-movie-text leading-relaxed">
                            Para reservar cualquier servicio de producción o fotografía se requiere un <strong>mínimo del 50%</strong> de anticipo. El saldo restante se cancela antes o el mismo día del evento/entrega.
                        </p>
                    </div>

                    <div className="bg-movie-dark/50 p-8 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider text-movie-red flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-movie-red text-white flex items-center justify-center text-xs">3</span>
                            Facturación
                        </h4>
                        <p className="text-movie-text leading-relaxed">
                            Se emite cuenta de cobro a nombre de <strong>Yosimar Zuñiga Sarmiento</strong> (Persona natural no responsable de IVA). Se adjunta RUT y seguridad social para pagos corporativos si es requerido.
                        </p>
                    </div>

                    <div className="bg-movie-dark/50 p-8 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider text-movie-red flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-movie-red text-white flex items-center justify-center text-xs">4</span>
                            Cambios & Devoluciones
                        </h4>
                        <p className="text-movie-text leading-relaxed">
                            Los abonos <strong>NO son reembolsables</strong>. Se permite reprogramación dentro de 6 meses avisando con 72 horas de anticipación (Sujeto a disponibilidad).
                        </p>
                    </div>
                </div>
                </div>
              </>
            )}

            {activeTab === 'terms' && (
              <div className="max-w-4xl mx-auto bg-movie-dark p-12 rounded-3xl border border-white/10">
                <h2 className="text-3xl font-heading font-black mb-8 uppercase italic text-movie-red">Términos y Condiciones</h2>
                <div className="space-y-8 text-movie-silver leading-relaxed">
                  <section>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">1. Aceptación de Términos</h3>
                    <p>Al contratar los servicios de Agency La Movie, el cliente acepta los presentes términos y condiciones. Cualquier modificación deberá ser acordada por escrito.</p>
                  </section>
                  <section>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">2. Propiedad Intelectual</h3>
                    <p>Todo el material producido (videos, fotos, diseños) es propiedad intelectual de Agency La Movie hasta que se complete el pago total del servicio. Una vez pagado, el cliente adquiere los derechos de uso comercial, pero la agencia conserva el derecho de exhibir el trabajo en su portafolio.</p>
                  </section>
                  <section>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">3. Plazos de Entrega</h3>
                    <p>Los plazos de entrega se definen por proyecto. Retrasos causados por falta de información o material por parte del cliente extenderán proporcionalmente la fecha de entrega final.</p>
                  </section>
                  <section>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">4. Revisiones</h3>
                    <p>Cada paquete incluye un número específico de rondas de revisión. Revisiones adicionales o cambios estructurales después de la aprobación de la estrategia tendrán un costo adicional.</p>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="max-w-4xl mx-auto bg-movie-dark p-12 rounded-3xl border border-white/10">
                <h2 className="text-3xl font-heading font-black mb-8 uppercase italic text-movie-red">Política de Privacidad</h2>
                <div className="space-y-8 text-movie-silver leading-relaxed">
                  <section>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Tratamiento de Datos</h3>
                    <p>Agency La Movie cumple con la Ley 1581 de 2012 de Protección de Datos Personales en Colombia. Los datos recolectados a través de nuestros formularios se utilizan exclusivamente para la prestación de servicios, comunicación comercial y facturación.</p>
                  </section>
                  <section>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Confidencialidad</h3>
                    <p>Nos comprometemos a mantener la confidencialidad de la información estratégica, bases de datos o secretos comerciales que el cliente comparta con nosotros para la ejecución de las campañas.</p>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-4xl mx-auto bg-movie-dark p-12 rounded-3xl border border-white/10">
                <h2 className="text-3xl font-heading font-black mb-8 uppercase italic text-movie-red">Seguridad y Garantía</h2>
                <div className="space-y-8 text-movie-silver leading-relaxed">
                  <section>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Seguridad en Pagos</h3>
                    <p>Solo operamos a través de las cuentas bancarias oficiales listadas en la sección de Pagos. Nunca solicitaremos claves, códigos de seguridad o acceso remoto a sus dispositivos.</p>
                  </section>
                  <section>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Garantía de Servicio</h3>
                    <p>Garantizamos la ejecución profesional de todas las piezas audiovisuales y estrategias digitales contratadas, cumpliendo con los estándares de calidad cinematográfica que nos caracterizan.</p>
                  </section>
                </div>
              </div>
            )}
        </div>
      </section>

      <footer className="py-8 text-center text-white/20 text-xs border-t border-white/5 mt-12">
          <p>LA MOVIE Agency • Departamento Legal & Financiero</p>
      </footer>
    </div>
  );
};

export default Policies;