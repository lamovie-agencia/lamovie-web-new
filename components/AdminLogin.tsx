import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, setStoredAdminToken } from '../lib/adminService';
import { Lock, User, LogIn } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await adminService.login(username, password);
      setStoredAdminToken(token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-movie-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-movie-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(176,35,46,0.3)]">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter">Admin Portal</h1>
          <p className="text-white/50 text-sm mt-2">Acceso exclusivo para administradores</p>
          <div className="mt-4 p-3 bg-[#B0232E]/10 border border-[#B0232E]/30 rounded-xl text-xs text-white/80">
            <strong>Acceso de Portal:</strong> Ingresa tus credenciales maestras asignadas para acceder de forma segura.
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-black">Usuario</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-movie-red focus:outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-black">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-movie-red focus:outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-movie-red text-xs font-bold text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-movie-red hover:bg-red-700 text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(176,35,46,0.2)] active:scale-95"
          >
            Entrar <LogIn size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
