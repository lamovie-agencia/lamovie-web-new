import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, Mail, Search, Filter, Phone, CheckCircle, 
  XCircle, Clock, ExternalLink, Globe, LayoutDashboard, Database,
  Trash, Smartphone, Laptop, MapPin
} from 'lucide-react';
import { adminService } from '../lib/adminService';
import { useAuth } from '../lib/authService';
import { useToast } from './ToastProvider';

export function LeadsModule() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('all');

  const normalizePhone = (phone: string) => String(phone || '').replace(/[^\d]/g, '');
  const statusOptions = [
    { id: 'new', label: 'Nuevo' },
    { id: 'contacted', label: 'En Contacto' },
    { id: 'closed', label: 'Cerrado' },
    { id: 'discarded', label: 'Descartado' }
  ];

  const showFeedback = (type: 'success' | 'error' | 'info', text: string) => {
    showToast(type, text);
  };

  const escapeCsvValue = (value: any) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const exportLeadsCsv = () => {
    const headers = ['id', 'name', 'email', 'phone', 'service', 'status', 'origin', 'date', 'value', 'tag', 'device', 'location', 'ip', 'browser', 'notes'];
    const rows = filteredLeads.map((lead) => headers.map((header) => {
      const value = header === 'date' ? lead.date || lead.created_at || '' : lead[header];
      return escapeCsvValue(value ?? '');
    }).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leads-export.csv';
    link.click();
    URL.revokeObjectURL(url);
    showFeedback('success', 'CSV exportado correctamente.');
  };

  const updateLeadStatus = async (lead: any, status: string) => {
    if (!token) return;
    try {
      await adminService.updateCrmClient(lead.id, { ...lead, status }, token);
      showFeedback('success', `Estado actualizado para ${lead.name}.`);
      fetchLeads();
    } catch (error) {
      showFeedback('error', 'No se pudo actualizar el estado del lead.');
    }
  };

  const convertLead = async (lead: any) => {
    if (!token) return;
    if (['active', 'closed', 'converted'].includes(lead.status)) return;

    try {
      await adminService.convertClient(lead.id, token);
      showFeedback('success', `${lead.name} fue convertido correctamente.`);
      await fetchLeads();
    } catch (error) {
      console.error('Failed lead conversion:', error);
      showFeedback('error', 'No se pudo convertir el lead ahora mismo.');
    }
  };

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminService.getCrmClients(token);
      setLeads(Array.isArray(data) ? data : []);
    } catch(e) {
      setLeads([]);
    }
  }, [token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    const list = Array.isArray(leads) ? leads : [];
    return list.filter(lead => 
      (lead && (lead.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
       lead.email?.toLowerCase()?.includes(searchTerm.toLowerCase()))) &&
      (filterOrigin === 'all' || lead.origin === filterOrigin)
    );
  }, [leads, searchTerm, filterOrigin]);

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
             <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center border border-green-500/30 backdrop-blur-xl">
               <Database size={24} />
             </div>
             LEADS & FORMULARIOS
           </h2>
           <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2 ml-16">Recepción Orgánica y Adquisición Web</p>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
          <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Total Leads (Mes)</h4>
          <p className="text-4xl font-black">{leads?.length ?? 0}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
          <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Nuevos Sin Contactar</h4>
          <p className="text-4xl font-black text-yellow-400">
            {(Array.isArray(leads) ? leads : []).filter(l => l?.status === 'new').length}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
          <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Origen Principal</h4>
          <p className="text-2xl font-black text-blue-400 mt-2 truncate">Formulario Web</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
          <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Tasa de Conversión</h4>
          <p className="text-4xl font-black text-green-400">
            {leads?.length ? Math.round(((Array.isArray(leads) ? leads : []).filter(l => l?.status === 'closed' || l?.status === 'converted').length / leads.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex-grow backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="Buscar prospectos..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-green-400 focus:outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-4 py-4">
              <Filter size={16} className="text-white/30" />
              <select 
                className="bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 [&>option]:bg-gray-900"
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value)}
              >
                <option value="all">Todos los orígenes</option>
                <option value="Formulario Web">Formulario Web</option>
                <option value="Orgánico (SEO)">Orgánico (SEO)</option>
                <option value="WhatsApp Directo">WhatsApp Directo</option>
                <option value="Meta Ads (Instagram)">Meta Ads</option>
              </select>
            </div>
            <button
              type="button"
              onClick={exportLeadsCsv}
              className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest text-[10px] font-black">
                <th className="py-4 px-4 font-black">Prospecto</th>
                <th className="py-4 px-4 font-black">Contacto</th>
                <th className="py-4 px-4 font-black">Origen</th>
                <th className="py-4 px-4 font-black">Fecha</th>
                <th className="py-4 px-4 font-black text-center">Estado</th>
                <th className="py-4 px-4 font-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff3300] to-[#b0232e] flex items-center justify-center text-xs font-black shadow-lg text-white">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white">{lead.name}</span>
                        {/* Telemetría y Geolocalización */}
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40">
                          {String(lead.device || '').toLowerCase().includes('móvil') || String(lead.device || '').toLowerCase().includes('mobile') || String(lead.device || '').toLowerCase().includes('ios') || String(lead.device || '').toLowerCase().includes('android') ? (
                            <span className="inline-flex items-center gap-0.5" title={lead.device ?? 'Sujeto Móvil'}>
                              <Smartphone size={10} className="text-green-400" /> Móvil
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5" title={lead.device ?? 'Sujeto de Escritorio'}>
                              <Laptop size={10} className="text-blue-400" /> Laptop
                            </span>
                          )}
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5 text-white/50">
                            <MapPin size={10} className="text-red-400" /> {lead.location ?? 'Ubicación Desconocida'} ({lead.ip ?? 'IP Desconocida'})
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1 text-[10px] font-medium text-white/60">
                      <span className="flex items-center gap-1 group-hover:text-white transition-colors"><Mail size={10}/> {lead.email}</span>
                      <span className="flex items-center gap-1 group-hover:text-white transition-colors"><Phone size={10}/> {lead.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-[6px] text-[9px] uppercase tracking-widest font-bold border border-white/10 text-white/70">
                      {lead.origin === 'Formulario Web' && <Globe size={10} className="text-blue-400"/>}
                      {lead.origin}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                      {new Date(lead.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      lead.status === 'new' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      lead.status === 'contacted' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      lead.status === 'discarded' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}>
                      {lead.status === 'new' && <Clock size={10} />}
                      {lead.status === 'contacted' && <Search size={10} />}
                      {(lead.status === 'closed' || lead.status === 'converted') && <CheckCircle size={10} />}
                      {lead.status === 'discarded' && <XCircle size={10} />}
                      {lead.status === 'new' ? 'Nuevo' : lead.status === 'contacted' ? 'En Contacto' : lead.status === 'discarded' ? 'Descartado' : 'Cerrado'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => convertLead(lead)}
                      disabled={['active', 'closed', 'converted'].includes(lead.status)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${['active', 'closed', 'converted'].includes(lead.status) ? 'bg-emerald-500/20 text-emerald-300 cursor-not-allowed' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                    >
                      {['active', 'closed', 'converted'].includes(lead.status) ? 'Convertido' : 'Convertir'}
                    </button>
                    <select
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-[10px] text-white focus:outline-none [&>option]:bg-gray-900"
                      value={lead.status || 'new'}
                      onChange={(e) => updateLeadStatus(lead, e.target.value)}
                    >
                      {statusOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                    </select>
                    {normalizePhone(lead.phone) && (
                      <a
                        href={`https://wa.me/${normalizePhone(lead.phone)}?text=Hola%20${encodeURIComponent(lead.name || '')},%20soy%20de%20LA%20MOVIE.%20Recibimos%20tu%20solicitud%20sobre%20${encodeURIComponent(lead.service || 'nuestros servicios')}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all"
                        title="Contactar por WhatsApp"
                      >
                        <Phone size={14} />
                      </a>
                    )}
                    <button 
                      onClick={async () => {
                        if(token) {
                           await adminService.deleteCrmClient(lead.id, token);
                           showFeedback('success', `Lead ${lead.name} eliminado.`);
                           fetchLeads();
                        }
                      }}
                      className="p-2 bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 rounded-lg transition-all">
                      <Trash size={14} />
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all">
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/30 text-xs font-bold uppercase tracking-widest">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
