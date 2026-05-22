import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, PenTool, LayoutTemplate, FileSignature, Receipt, 
  Briefcase, Download, Plus, Search, Filter, MoreVertical, 
  Edit3, Eye, FileDigit, Sparkles, FolderOpen, Files, History, CheckCircle2, Clock
} from 'lucide-react';
import { adminService } from '../lib/adminService';
import { useAuth } from '../lib/authService';

const MOCK_TEMPLATES = [
  { id: 1, name: 'Propuesta Cinemática', category: 'Propuestas', type: 'Design', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 2, name: 'Factura Premium', category: 'Finanzas', type: 'Invoice', icon: Receipt, color: 'text-green-400', bg: 'bg-green-500/10' },
  { id: 3, name: 'Cotización TV Commercial', category: 'Cotizaciones', type: 'Quote', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 4, name: 'Contrato Retainer', category: 'Legales', type: 'Contract', icon: FileSignature, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 5, name: 'Brief Creativo', category: 'Producción', type: 'Brief', icon: Edit3, color: 'text-movie-red', bg: 'bg-movie-red/10' }
];

export function DocsModule() {
  const { token } = useAuth();
  const [subTab, setSubTab] = useState<'overview' | 'editor' | 'templates' | 'files'>('overview');
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchDocs = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminService.getDocuments(token);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleGenerateDoc = async () => {
    if (!token) return;
    try {
      await adminService.createDocument({
        name: 'Auto-Renovación Retainer',
        type: 'Contrato',
        client: 'Nike Latam',
        status: 'pending_sign',
        author: 'IA Assistant'
      }, token);
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadSecureDoc = async (id: number) => {
    if (!token) return;
    setDownloadingId(id);
    try {
      const data = await adminService.getDocumentSignedUrl(id, token);
      if (data && data.signed_url) {
        const a = document.createElement('a');
        a.href = data.signed_url;
        a.download = data.name ? `${data.name.toLowerCase().replace(/\s+/g, '_')}.md` : `document_${id}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("🔒 SECURE-DOWNLOAD CLIENT FAIL:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-300/20 text-blue-300 rounded-2xl flex items-center justify-center border border-blue-300/30 backdrop-blur-xl shadow-[0_0_30px_rgba(147,197,253,0.2)]">
               <FileText size={24} />
             </div>
             LA MOVIE DOCS
           </h2>
           <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2 ml-16">Intelligence Document Creator 2026</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutTemplate },
            { id: 'templates', label: 'Plantillas', icon: Files },
            { id: 'editor', label: 'Editor Visual', icon: PenTool },
            { id: 'files', label: 'Mis Archivos', icon: FolderOpen },
          ].map(tab => (
            <button
             key={tab.id}
             onClick={() => setSubTab(tab.id as any)}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
               subTab === tab.id 
                 ? 'bg-blue-300 text-black shadow-[0_0_20px_rgba(147,197,253,0.3)]' 
                 : 'text-white/40 hover:text-white hover:bg-white/5'
             }`}
            >
             <tab.icon size={16} /> 
             <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      {subTab === 'overview' && (
        <div className="flex flex-col gap-8">
           {/* KPIs */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-all text-blue-300">
                 <FileDigit size={64} />
               </div>
               <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Total Documentos</h4>
               <p className="text-4xl font-black tracking-tighter">1,204</p>
               <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                 +14 generados hoy
               </div>
             </div>

             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-all text-yellow-400">
                 <FileSignature size={64} />
               </div>
               <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Firmas Pendientes</h4>
               <p className="text-4xl font-black tracking-tighter">12</p>
               <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-yellow-400 font-bold uppercase tracking-widest bg-yellow-400/10 px-2 py-1 rounded">
                 Requiere atención
               </div>
             </div>

             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-all text-green-400">
                 <Receipt size={64} />
               </div>
               <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Facturas Emitidas</h4>
               <p className="text-4xl font-black tracking-tighter">45</p>
               <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-white/50 font-bold uppercase tracking-widest">
                 Este mes
               </div>
             </div>

             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-all text-movie-red">
                 <Briefcase size={64} />
               </div>
               <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Cotizaciones Activas</h4>
               <p className="text-4xl font-black tracking-tighter">8</p>
               <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                 $42.5K en Pipeline
               </div>
             </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Document Activity */}
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                 <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                     <History size={20} className="text-blue-300" /> Actividad Reciente
                   </h3>
                   <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                     <input 
                       type="text" 
                       placeholder="Buscar doc..." 
                       className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-300" 
                     />
                   </div>
                 </div>

                 <div className="space-y-3">
                   {documents.map(doc => (
                     <div key={doc.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                              {doc.type === 'Cotización' && <Briefcase size={16} className="text-blue-400" />}
                              {doc.type === 'Contrato' && <FileSignature size={16} className="text-yellow-400" />}
                              {doc.type === 'Factura' && <Receipt size={16} className="text-green-400" />}
                              {doc.type === 'Brief' && <Edit3 size={16} className="text-movie-red" />}
                              {doc.type === 'Reporte' && <FileText size={16} className="text-purple-400" />}
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{doc.name}</h4>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-bold">
                                {doc.client} • Editado: {new Date(doc.date).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             doc.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                             doc.status === 'pending_sign' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                             doc.status === 'paid' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                             'bg-white/10 text-white/50 border-white/20'
                           }`}>
                             {doc.status.replace('_', ' ')}
                           </span>
                           {doc.type === 'Contrato' || doc.type === 'Cotización' || doc.type === 'Brief' ? (
                             <button
                               onClick={() => handleDownloadSecureDoc(doc.id)}
                               disabled={downloadingId === doc.id}
                               title="Descargar de Cloud Storage seguro (Markdown)"
                               className="mr-2 p-2 bg-blue-300/10 hover:bg-blue-300/30 text-blue-300 rounded-lg transition-all border border-blue-500/20 animate-pulse"
                             >
                               <Download size={14} className={downloadingId === doc.id ? "animate-spin" : ""} />
                             </button>
                           ) : null}
                           <button 
                             onClick={async () => {
                               if (token) {
                                 await adminService.deleteDocument(doc.id, token);
                                 fetchDocs();
                               }
                             }}
                             className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white/50 transition-all">
                             <MoreVertical size={16} />
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* AI Assistant */}
              <div className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-[32px] p-8 flex flex-col">
                 <div className="w-16 h-16 rounded-[20px] bg-blue-500/20 flex items-center justify-center border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-6">
                    <Sparkles size={28} className="text-blue-300" />
                 </div>
                 <h3 className="text-lg font-bold text-blue-300 uppercase tracking-widest mb-4">IA Document Assistant</h3>
                 <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium">
                   Tienes 2 contratos de Retainer próximos a vencer. ¿Deseas que genere los nuevos documentos de renovación con un ajuste de inflación del 5%?
                 </p>
                 <div className="mt-auto space-y-3">
                   <button 
                     onClick={handleGenerateDoc}
                     className="w-full bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
                     Generar Renovaciones
                   </button>
                   <button className="w-full bg-black/40 border border-white/10 text-white/60 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">
                     Ignorar
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* TEMPLATES */}
      {subTab === 'templates' && (
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl min-h-[60vh]">
           <div className="flex justify-between items-center mb-8">
             <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
               <Files size={24} className="text-blue-300" /> PLANTILLAS PREMIUM
             </h3>
             <button className="bg-blue-300 hover:bg-blue-400 text-black px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(147,197,253,0.3)]">
               <Plus size={16} /> Nueva Plantilla
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
             {MOCK_TEMPLATES.map(template => (
               <div key={template.id} className="bg-black/40 border border-white/5 rounded-3xl p-6 group hover:border-blue-300/30 transition-all cursor-pointer relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Plus size={20} className="text-blue-300" />
                 </div>
                 <div className={`w-16 h-16 rounded-2xl ${template.bg} ${template.color} flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                   <template.icon size={28} />
                 </div>
                 <span className="text-[9px] uppercase font-black tracking-widest text-white/40 mb-2 block">{template.category}</span>
                 <h4 className="text-sm font-bold text-white mb-4 line-clamp-2">{template.name}</h4>
                 <button className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-blue-300 transition-colors w-full text-left flex items-center justify-between">
                   Usar Plantilla <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* EDITOR PLACEHOLDER */}
      {subTab === 'editor' && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden flex flex-col min-h-[70vh]">
          {/* Topbar */}
          <div className="h-16 border-b border-white/10 bg-white/5 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
               <FileText size={20} className="text-blue-300" />
               <input type="text" defaultValue="Untitled Document" className="bg-transparent border-none text-sm font-bold text-white focus:outline-none focus:ring-0" />
               <span className="text-[10px] bg-white/10 text-white/40 px-2 py-1 rounded uppercase font-bold tracking-widest border border-white/5">Auto-Guardado</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-white/50 hover:text-white"><Eye size={18}/></button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Compartir</button>
              <button className="bg-blue-300 hover:bg-blue-400 text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                <Download size={14} /> Exportar PDF
              </button>
            </div>
          </div>

          {/* Workspace */}
          <div className="flex flex-grow relative">
             {/* Left Toolbar */}
             <div className="w-16 border-r border-white/10 bg-white/5 flex flex-col items-center py-6 gap-6">
               <button className="p-3 text-white/50 hover:text-blue-300 hover:bg-white/5 rounded-xl transition-all"><PenTool size={20}/></button>
               <button className="p-3 text-white/50 hover:text-blue-300 hover:bg-white/5 rounded-xl transition-all"><LayoutTemplate size={20}/></button>
               <button className="p-3 text-white/50 hover:text-blue-300 hover:bg-white/5 rounded-xl transition-all"><FileSignature size={20}/></button>
               <button className="p-3 text-white/50 hover:text-blue-300 hover:bg-white/5 rounded-xl transition-all"><Grid size={20}/></button>
               <button className="p-3 text-white/50 hover:text-blue-300 hover:bg-white/5 rounded-xl transition-all"><Type size={20}/></button>
               <button className="p-3 text-white/50 hover:text-blue-300 hover:bg-white/5 rounded-xl transition-all"><Image size={20}/></button>
             </div>

             {/* Canvas Area */}
             <div className="flex-grow bg-[#111] relative overflow-auto p-12 flex justify-center items-start pattern-dots">
                <div className="w-[800px] h-[1131px] bg-white text-black shadow-2xl relative flex flex-col p-16 animate-fade-in origin-top">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                          <PenTool size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Editor Visual Premium</h2>
                        <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">El motor de renderizado y diseño drag-and-drop se está cargando.</p>
                        <div className="inline-flex gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-300 border border-blue-500/30 bg-blue-500/10 px-4 py-2 rounded-lg">
                          Preparando Canva-like Engine...
                        </div>
                      </div>
                   </div>
                   
                   {/* Dummy Document Content */}
                   <div className="w-32 h-12 bg-gray-200 rounded mb-16"></div>
                   <div className="w-2/3 h-8 bg-gray-200 rounded mb-6"></div>
                   <div className="w-full h-4 bg-gray-100 rounded mb-2"></div>
                   <div className="w-full h-4 bg-gray-100 rounded mb-2"></div>
                   <div className="w-4/5 h-4 bg-gray-100 rounded mb-12"></div>
                   
                   <div className="w-full h-48 bg-gray-100 rounded mb-12"></div>
                   
                   <div className="grid grid-cols-2 gap-8 mb-12">
                     <div className="h-32 bg-gray-100 rounded"></div>
                     <div className="h-32 bg-gray-100 rounded"></div>
                   </div>
                </div>
             </div>

             {/* Right Context Panel */}
             <div className="w-64 border-l border-white/10 bg-white/5 p-6 hidden lg:block">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-6">Propiedades</h4>
               <div className="space-y-6">
                 <div>
                   <label className="text-xs text-white/70 mb-2 block">Documento</label>
                   <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none">
                     <option>Formato A4</option>
                     <option>Formato Carta</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-xs text-white/70 mb-2 block">Integraciones</label>
                   <div className="flex flex-wrap gap-2">
                     <span className="px-2 py-1 bg-white/10 text-[9px] rounded uppercase font-bold text-white/60">CRM</span>
                     <span className="px-2 py-1 bg-white/10 text-[9px] rounded uppercase font-bold text-white/60">Stripe</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* FILES PLACEHOLDER */}
      {subTab === 'files' && (
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-16 flex flex-col items-center justify-center text-center min-h-[60vh] relative overflow-hidden backdrop-blur-xl">
           <div className="absolute inset-0 bg-gradient-to-b from-blue-300/5 to-transparent mix-blend-overlay"></div>
           <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
              <FolderOpen size={48} className="text-blue-300" />
           </div>
           <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4 relative z-10">Gestión Documental</h3>
           <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed relative z-10 mb-8">
             El explorador de archivos está indexando los documentos firmados y sincronizando con AWS S3.
           </p>
        </div>
      )}

    </div>
  );
}

// Helper icons for the fake toolbar
const Grid = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
const Type = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
const Image = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
const ArrowUpRight = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
