
import React, { useState } from 'react';

interface Props {
  onLogin: (user: string) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [user, setUser] = useState('tecnico_madrid_01');
  const [password, setPassword] = useState('********');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 h-1/2 relative grayscale contrast-125 brightness-75 shrink-0">
        <img src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1000&auto=format&fit=crop" alt="Madrid" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-900/20"></div>
        <div className="absolute bottom-6 left-8 right-8 text-white">
          <h2 className="text-xl font-bold leading-tight">Infraestructura Verde<br/>Gestión Inteligente</h2>
        </div>
      </div>
      <div className="flex-1 h-1/2 bg-[#1B5E20] p-8 flex flex-col items-center">
        <div className="w-full flex justify-center mb-6 text-white text-center">
          <div className="flex flex-col items-center">
             <div className="bg-white/10 p-3 rounded-2xl mb-2"><span className="material-icons-round text-4xl">psychology</span></div>
             <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">Acceso Técnico</span>
             <span className="text-xl font-bold tracking-wider uppercase">Madrid IA</span>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(user); }} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-white/70 text-[10px] font-bold uppercase tracking-wider ml-1">ID de Usuario</label>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} className="w-full bg-white rounded-lg h-11 px-4 text-gray-800 focus:ring-2 focus:ring-white/50 text-sm font-medium" required />
          </div>
          <div className="space-y-1">
            <label className="text-white/70 text-[10px] font-bold uppercase tracking-wider ml-1">Clave de Seguridad</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white rounded-lg h-11 px-4 text-gray-800 focus:ring-2 focus:ring-white/50 text-sm" required />
          </div>
          <button type="submit" className="w-full bg-white text-green-900 font-bold py-3.5 shadow-2xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm mt-4 rounded-lg">
            Iniciar Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
