import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Edit, Trash2, Save, X, AlertCircle, Check, Sparkles,
  Film, Crown, Star, Monitor, Globe, ShoppingBag, LayoutTemplate, Eye, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminService } from '../lib/adminService';
import { useAuth } from '../lib/authService';
import { DEFAULT_PRICING_PACKAGES } from '../lib/defaultPackages';

interface Package {
  id: number;
  name: string;
  category: 'social' | 'estrategia' | 'web';
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended: boolean;
  icon: string;
  color: string;
  page: string;
  created_at?: string;
}

const ICON_OPTIONS: { value: string; icon: React.ReactNode; label: string }[] = [
  { value: 'Film', icon: <Film size={18} />, label: 'Film' },
  { value: 'Crown', icon: <Crown size={18} />, label: 'Corona' },
  { value: 'Star', icon: <Star size={18} />, label: 'Estrella' },
  { value: 'Sparkles', icon: <Sparkles size={18} />, label: 'Chispa' },
  { value: 'Zap', icon: <Zap size={18} />, label: 'Rayo' },
  { value: 'Monitor', icon: <Monitor size={18} />, label: 'Monitor' },
  { value: 'Globe', icon: <Globe size={18} />, label: 'Globo' },
  { value: 'ShoppingBag', icon: <ShoppingBag size={18} />, label: 'Bolsa' },
  { value: 'LayoutTemplate', icon: <LayoutTemplate size={18} />, label: 'Template' }
];

const CATEGORIES = [
  { value: 'social', label: 'SOCIAL MEDIA', color: 'text-blue-400' },
  { value: 'estrategia', label: 'TRÁFICO & PERFORMANCE', color: 'text-purple-400' },
  { value: 'web', label: 'DESARROLLO WEB', color: 'text-green-400' }
];

export const PackagesModule: React.FC = () => {
  const { token } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'social' | 'estrategia' | 'web'>('social');

  const [formState, setFormState] = useState<Omit<Package, 'id' | 'created_at'>>({
    name: '',
    category: 'social',
    price: '',
    period: '/ mes',
    description: '',
    features: [],
    recommended: false,
    icon: 'Film',
    color: 'border-white/20',
    page: 'pricing'
  });

  const [featureInput, setFeatureInput] = useState('');

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getPricing();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatusMsg({ text: 'No autenticado', error: true });
      return;
    }

    if (!formState.name.trim()) {
      setStatusMsg({ text: 'El nombre es obligatorio', error: true });
      return;
    }

    if (!formState.price.trim()) {
      setStatusMsg({ text: 'El precio es obligatorio', error: true });
      return;
    }

    setIsSyncing(true);
    try {
      if (editingId) {
        await adminService.updatePricing(editingId, formState, token);
        setStatusMsg({ text: 'Paquete actualizado correctamente', error: false });
      } else {
        await adminService.createPricing(formState, token);
        setStatusMsg({ text: 'Paquete creado correctamente', error: false });
      }

      setFormState({
        name: '',
        category: 'social',
        price: '',
        period: '/ mes',
        description: '',
        features: [],
        recommended: false,
        icon: 'Film',
        color: 'border-white/20',
        page: 'pricing'
      });
      setFeatureInput('');
      setEditingId(null);
      setTimeout(() => fetchPackages(), 500);
    } catch (err) {
      setStatusMsg({ text: 'Error al guardar paquete', error: true });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEdit = (pkg: Package) => {
    setFormState({
      name: pkg.name,
      category: pkg.category,
      price: pkg.price,
      period: pkg.period,
      description: pkg.description,
      features: pkg.features || [],
      recommended: pkg.recommended,
      icon: pkg.icon,
      color: pkg.color,
      page: pkg.page
    });
    setEditingId(pkg.id);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('¿Eliminar este paquete?')) return;
    try {
      await adminService.deletePricing(id, token);
      setStatusMsg({ text: 'Paquete eliminado', error: false });
      fetchPackages();
    } catch (err) {
      setStatusMsg({ text: 'Error al eliminar', error: true });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormState({
      name: '',
      category: 'social',
      price: '',
      period: '/ mes',
      description: '',
      features: [],
      recommended: false,
      icon: 'Film',
      color: 'border-white/20',
      page: 'pricing'
    });
    setFeatureInput('');
  };

  const handleCreateDefaultPackages = async () => {
    if (!token) {
      setStatusMsg({ text: 'No autenticado', error: true });
      return;
    }

    setIsSyncing(true);
    try {
      const existingNames = new Set(packages.map((pkg) => pkg.name.trim().toLowerCase()));
      const missingPackages = DEFAULT_PRICING_PACKAGES.filter((pkg) => !existingNames.has(pkg.name.trim().toLowerCase()));

      if (missingPackages.length === 0) {
        setStatusMsg({ text: 'Los paquetes base ya existen y puedes editarlos.', error: false });
        return;
      }

      await Promise.all(missingPackages.map((pkg) => adminService.createPricing(pkg, token)));
      setStatusMsg({ text: `${missingPackages.length} paquetes base creados para editar.`, error: false });
      fetchPackages();
    } catch (err) {
      setStatusMsg({ text: 'Error al crear paquetes base', error: true });
    } finally {
      setIsSyncing(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormState(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormState(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const filteredPackages = useMemo(
    () => packages.filter(pkg => pkg.category === selectedCategory),
    [packages, selectedCategory]
  );

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value as any)}
            className={`px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest transition-all whitespace-nowrap ${
              selectedCategory === cat.value
                ? 'bg-movie-red text-white shadow-lg shadow-movie-red/50'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-movie-red">Plantillas editables</p>
          <p className="mt-2 text-sm text-white/60">Crea paquetes base para Social Media, Trafico & Performance y Desarrollo Web; luego ajusta precios, textos y beneficios aqui mismo.</p>
        </div>
        <button
          type="button"
          onClick={handleCreateDefaultPackages}
          disabled={isSyncing}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-movie-red/40 bg-movie-red/15 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-movie-red disabled:opacity-50"
        >
          <Sparkles size={16} /> Crear paquetes base
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Form Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] sticky top-12 backdrop-blur-xl">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase italic">
              {editingId ? <Edit size={24} className="text-movie-red" /> : <Plus size={24} className="text-movie-red" />}
              {editingId ? 'Editar Paquete' : 'Nuevo Paquete'}
            </h3>

            {statusMsg && (
              <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border text-xs font-bold uppercase tracking-wider ${
                statusMsg.error
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}>
                {statusMsg.error ? <AlertCircle size={16} /> : <Check size={16} />}
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Nombre</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: BLOCKBUSTER"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Precio</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej: 1.390.000"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Período</label>
                  <input
                    type="text"
                    placeholder="/ mes"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none"
                    value={formState.period}
                    onChange={(e) => setFormState({ ...formState, period: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Icono</label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormState({ ...formState, icon: opt.value })}
                      className={`p-3 rounded-lg border transition-all ${
                        formState.icon === opt.value
                          ? 'bg-movie-red border-movie-red text-white'
                          : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                      }`}
                      title={opt.label}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Descripción breve del paquete"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-movie-red focus:outline-none resize-none"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-black">Características</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Agregar característica"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-movie-red focus:outline-none"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-movie-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-2">
                  {(formState.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                      <span className="text-xs text-white">{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-white/40 hover:text-movie-red transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-movie-red"
                  checked={formState.recommended}
                  onChange={(e) => setFormState({ ...formState, recommended: e.target.checked })}
                />
                <span className="text-xs font-bold uppercase tracking-widest">Destacado (Recomendado)</span>
              </label>

              <div className="flex gap-4 pt-4">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="flex-[2] bg-movie-red hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                >
                  <Save size={18} />
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="lg:col-span-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-movie-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <p className="text-sm">No hay paquetes en esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative bg-white/5 border rounded-[32px] p-8 group hover:bg-white/10 transition-all ${
                    pkg.recommended
                      ? 'border-movie-red bg-movie-red/5 ring-2 ring-movie-red/20'
                      : 'border-white/10'
                  }`}
                >
                  {pkg.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-movie-red text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Star size={12} /> Destacado
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-black text-lg uppercase mb-1">{pkg.name}</h4>
                      <p className="text-white/40 text-xs">{pkg.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-3 text-white/30 hover:text-movie-red hover:bg-movie-red/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-black text-movie-red">${pkg.price}</span>
                      <span className="text-white/40 text-xs">{pkg.period}</span>
                    </div>
                  </div>

                  {(pkg.features || []).length > 0 && (
                    <div className="space-y-2 pt-6 border-t border-white/10">
                      {pkg.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                          <Check size={14} className="text-movie-red" />
                          {feat}
                        </div>
                      ))}
                      {pkg.features.length > 4 && (
                        <p className="text-xs text-white/40 pt-2">
                          + {pkg.features.length - 4} características más
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
