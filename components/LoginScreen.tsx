import React, { useState } from 'react';

interface Props {
  onLogin: (email: string, pass: string) => void;
  error: string | null;
}

const LoginScreen: React.FC<Props> = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(email, password);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Background - Madrid Park B&N (Opacidad al 85% para máxima nitidez) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1200&auto=format&fit=crop" 
          alt="Madrid B&N" 
          className="w-full h-full object-cover grayscale opacity-[0.85] mix-blend-multiply" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-8 pt-12">
        {/* Modern Clean Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-[2.2rem] mb-6 shadow-premium border border-white animate-float">
            <span className="material-icons-round text-primary text-5xl">spa</span>
          </div>
          <h1 className="text-gray-900 text-4xl font-extrabold tracking-tighter mb-1 drop-shadow-sm">Avisos IA</h1>
          <p className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-4 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm">Gestión Zonas Verdes</p>
        </div>

        {/* Login Card - Clean Light Glass */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[3rem] border border-gray-100 shadow-card mt-auto mb-12">
          <h2 className="text-gray-800 text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-icons-round text-primary">verified_user</span>
            Acceso al Terminal
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">ID de Usuario</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg">alternate_email</span>
                <input 
                  type="email" 
                  value={email} 
                  placeholder="ejemplo@correo.com"
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-14 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-300 font-medium" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg">lock_outline</span>
                <input 
                  type="password" 
                  value={password} 
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-14 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-300" 
                  required 
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col gap-1">
                <p className="text-[10px] text-red-600 font-bold leading-tight flex items-center gap-1">
                  <span className="material-icons-round text-xs">error_outline</span>
                  {error}
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white font-black py-4 shadow-lg active:scale-[0.98] transition-all uppercase tracking-widest text-xs mt-4 rounded-2xl flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sincronizar Acceso</span>
                  <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">bolt</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center pb-6">
          <p className="text-gray-600 text-[9px] font-black leading-relaxed tracking-[0.4em] uppercase">
            Sistema Técnico Avanzado v2.5<br/>
            Inteligencia Ambiental
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;