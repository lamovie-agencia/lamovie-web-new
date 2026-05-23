import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  KanbanSquare, LayoutDashboard, List, Calendar, FolderOpen, 
  Plus, Search, Filter, MoreVertical, Play, CheckCircle2, 
  Clock, AlertCircle, Users, BarChart as BarChartIcon, Sparkles, MonitorPlay
} from 'lucide-react';
import { adminService } from '../lib/adminService';
import { useAuth } from '../lib/authService';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ProjectsModule() {
  const { token } = useAuth();
  const [subTab, setSubTab] = useState<'overview' | 'list' | 'kanban' | 'timeline' | 'files'>('overview');
  const [projects, setProjects] = useState<any[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    try {
      const p = await adminService.getProjects(token);
      setProjects(p);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async () => {
    if (!token) return;
    try {
      await adminService.createProject({
        name: 'Nuevo Proyecto IA',
        client: 'Nuevo Cliente',
        type: 'Web App',
        status: 'planning',
        progress: 0,
        team: ['IA'],
        dueDate: new Date().toISOString(),
        assets: 0,
        color: 'from-blue-500 to-purple-500'
      }, token);
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyAi = async () => {
    if (!token) return;
    try {
      await adminService.createProject({
        name: 'AI Optimization',
        client: 'Internal',
        type: 'Refactor',
        status: 'in_progress',
        progress: 10,
        team: ['JS', 'AI'],
        dueDate: '2026-06-30',
        assets: 5,
        color: 'from-indigo-500 to-purple-500'
      }, token);
      fetchProjects();
    } catch(e) {}
  };

  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id.toString());
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropZone !== status) {
      setActiveDropZone(status);
    }
  }, [activeDropZone]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setActiveDropZone(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setActiveDropZone(null);
    const id = e.dataTransfer.getData('text/plain');
    setDraggingId(null);
    if (id && token) {
      const projectId = Number(id);
      const project = projects.find(p => p.id === projectId);
      if (project && project.status !== status) {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
        try {
          await adminService.updateProject(projectId, { status }, token);
        } catch (e) {
          fetchProjects(); // Revert on failure
        }
      }
    }
  }, [projects, token, fetchProjects]);

  const chartData = useMemo(() => projects.map(p => ({
    name: String(p.name || 'Proyecto').substring(0, 10),
    progress: Number(p.progress) || 0,
    assets: Number(p.assets) || 0
  })), [projects]);

  const kanbanColumns = useMemo(() => [
    { id: 'planning', label: 'Planeación', color: 'bg-gray-400', border: 'border-gray-500/30' },
    { id: 'in_progress', label: 'Pre-Producción', color: 'bg-blue-400', border: 'border-blue-500/30' },
    { id: 'production', label: 'Grabación / Prod', color: 'bg-red-500', border: 'border-red-500/30' },
    { id: 'review', label: 'Revisión Cliente', color: 'bg-yellow-400', border: 'border-yellow-500/30' },
    { id: 'done', label: 'Entregado', color: 'bg-green-400', border: 'border-green-500/30' },
  ], []);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Header & SubNav */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
             <div className="w-12 h-12 bg-movie-red/20 text-movie-red rounded-2xl flex items-center justify-center border border-movie-red/30 backdrop-blur-xl">
               <KanbanSquare size={24} />
             </div>
             LA MOVIE PROJECTS
           </h2>
           <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2 ml-16">Sistema Operativo de Producción Kreativa</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'list', label: 'Lista', icon: List },
            { id: 'kanban', label: 'Kanban', icon: KanbanSquare },
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'files', label: 'Assets', icon: FolderOpen },
          ].map(sub => (
            <button
             key={sub.id}
             onClick={() => setSubTab(sub.id as any)}
             className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
               subTab === sub.id 
                 ? 'bg-movie-red text-white shadow-[0_0_20px_rgba(176,35,46,0.3)]' 
                 : 'text-white/40 hover:text-white hover:bg-white/5'
             }`}
            >
             <sub.icon size={16} /> 
             <span className="hidden sm:inline">{sub.label}</span>
            </button>
          ))}
        </div>
      </div>

      {subTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 text-movie-red">
               <MonitorPlay size={80} />
             </div>
             <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Proyectos Activos</h4>
             <p className="text-5xl font-black tracking-tighter">{projects.length}</p>
             <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase tracking-widest">
               <CheckCircle2 size={12} /> Alta Productividad
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 text-yellow-500">
               <Clock size={80} />
             </div>
             <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Entregas Próximas</h4>
             <p className="text-5xl font-black tracking-tighter">
               {projects.filter(p => {
                 const due = new Date(p.dueDate || p.due_date || p.created_at || Date.now());
                 return due <= new Date(new Date().setDate(new Date().getDate() + 15));
               }).length}
             </p>
             <div className="mt-4 inline-flex items-center gap-1 text-[10px] text-yellow-400 font-bold uppercase tracking-widest">
               <AlertCircle size={12} /> 15 días
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 text-green-500">
               <BarChartIcon size={80} />
             </div>
             <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Progreso General</h4>
             <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
               {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / projects.length) : 0}%
             </p>
             <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
               Promedio
             </div>
           </div>

           <div className="md:col-span-2 bg-gradient-to-br from-black/80 to-[#111] border border-white/10 p-8 rounded-[32px] flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2">
                   <Play size={20} className="text-movie-red" /> Producción Reciente (Analytics)
                 </h3>
                 <button className="text-[10px] uppercase font-bold text-white/50 hover:text-white">Ver Dashboard Completo</button>
              </div>
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="progress" fill="#E50914" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-gradient-to-b from-blue-900/40 to-purple-900/20 border border-blue-500/20 p-8 rounded-[32px] flex flex-col justify-between">
              <div>
                 <div className="w-16 h-16 rounded-[20px] bg-blue-500/20 flex items-center justify-center border border-blue-500/50 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <Sparkles className="text-blue-400" size={28} />
                 </div>
                 <h4 className="text-xl font-bold text-blue-300 uppercase tracking-widest mb-4">IA Project Manager</h4>
                 <p className="text-white/70 text-sm leading-relaxed">
                   Basado en el historial de producción, <strong>Rediseño Identidad Spotify</strong> podría requerir 2 días extra de edición. Te sugiero asignar a <strong>JS</strong> para acelerar el render.
                 </p>
              </div>
              <button onClick={handleApplyAi} className="mt-8 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-xl transition-all">
                 Aplicar Sugerencias IA
              </button>
           </div>
        </div>
      )}

      {subTab === 'kanban' && (
        <div className="flex flex-col h-[70vh] bg-white/5 rounded-[40px] border border-white/10 p-8 overflow-hidden backdrop-blur-md">
           <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-4">
               <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2"><KanbanSquare size={20} className="text-movie-red"/> Workflow de Producción</h3>
               <div className="flex gap-2">
                 <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><Filter size={14}/></button>
                 <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><Search size={14}/></button>
               </div>
             </div>
             <button onClick={createProject} className="bg-movie-red hover:bg-red-700 text-white px-6 py-3 rounded-xl uppercase tracking-widest font-black text-[10px] shadow-[0_0_20px_rgba(176,35,46,0.3)]">
               + Nuevo Proyecto
             </button>
           </div>
           
           <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar h-full">
             {kanbanColumns.map(col => (
               <div 
                 key={col.id} 
                 className={`w-[320px] shrink-0 flex flex-col gap-4 rounded-2xl p-2 transition-colors ${
                    activeDropZone === col.id ? 'bg-white/10 border border-white/20' : 'border border-transparent'
                 }`}
                 onDragOver={(e) => handleDragOver(e, col.id)}
                 onDragLeave={handleDragLeave}
                 onDrop={(e) => handleDrop(e, col.id)}
               >
                 <div className={`flex items-center justify-between border-b ${col.border} pb-4`}>
                   <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${col.color}`}></div> {col.label}
                   </h4>
                   <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md">
                     {projects.filter(p => p.status === col.id).length}
                   </span>
                 </div>
                 <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-10 min-h-[50px]">
                   <AnimatePresence>
                     {projects.filter(p => p.status === col.id).map(project => (
                       <motion.div 
                         key={project.id}
                         layoutId={project.id.toString()}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0, scale: draggingId === project.id ? 1.05 : 1 }}
                         exit={{ opacity: 0, scale: 0.9 }}
                         transition={{ type: "spring", stiffness: 300, damping: 25 }}
                         draggable
                         onDragStart={(e) => handleDragStart(e as any, project.id)}
                         onDragEnd={() => setDraggingId(null)}
                         className={`cursor-grab active:cursor-grabbing ${draggingId === project.id ? 'opacity-50 ring-2 ring-movie-red shadow-2xl relative z-50' : 'hover:scale-[1.02] hover:shadow-xl'}`}
                       >
                         <ProjectCard project={project} />
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {(subTab === 'list' || subTab === 'timeline' || subTab === 'files') && (
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-16 flex flex-col items-center justify-center text-center min-h-[60vh] relative overflow-hidden backdrop-blur-xl">
           <div className="absolute inset-0 bg-gradient-to-b from-movie-red/5 to-transparent mix-blend-overlay"></div>
           <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
              {subTab === 'list' && <List size={48} className="text-movie-red" />}
              {subTab === 'timeline' && <Calendar size={48} className="text-blue-400" />}
              {subTab === 'files' && <FolderOpen size={48} className="text-yellow-400" />}
           </div>
           <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4 relative z-10">Vista en Progreso</h3>
           <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed relative z-10 mb-8">
             El módulo de <strong>{subTab}</strong> está siendo conectado con el sistema de archivos S3 y la base de datos de producción audiovisual.
           </p>
           <button onClick={() => setSubTab('kanban')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all relative z-10">
             Volver a Kanban
           </button>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: any; key?: string | number }) {
  const dueDate = project.dueDate || project.due_date || project.created_at || new Date().toISOString();
  const progress = Number(project.progress) || 0;
  const assets = Number(project.assets) || 0;
  const team = Array.isArray(project.team) ? project.team : [];

  return (
    <div className="bg-[#111] border border-white/10 p-5 rounded-3xl hover:border-movie-red/50 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${project.color}`}></div>
      
      <div className="flex justify-between items-start mb-3 mt-1">
        <span className="text-[9px] uppercase font-black tracking-widest px-2 py-1 rounded bg-white/10 text-white/70">
          {project.type}
        </span>
        <button className="text-white/30 hover:text-white transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>

      <h5 className="font-bold text-lg mb-1 leading-tight">{project.name}</h5>
      <p className="text-xs text-white/50 mb-4">{project.client}</p>

      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5 text-white/40">
           <span>Progreso</span>
           <span>{progress}%</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${project.color}`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <div className="flex -space-x-2">
           {team.slice(0, 3).map((initials: string, i: number) => (
             <div key={i} className="w-7 h-7 rounded-full bg-black border border-[#222] flex items-center justify-center text-[8px] font-black z-10">{initials}</div>
           ))}
        </div>
        
        <div className="flex gap-3 text-white/40">
           <div className="flex items-center gap-1 text-[10px] font-bold">
             <AlertCircle size={12} className={new Date(dueDate) < new Date(new Date().setDate(new Date().getDate() + 15)) ? 'text-movie-red' : ''} />
             {new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
           </div>
           <div className="flex items-center gap-1 text-[10px] font-bold">
             <FolderOpen size={12} />
             {assets}
           </div>
        </div>
      </div>
    </div>
  );
}
