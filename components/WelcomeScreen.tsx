import React from 'react';

interface Props {
  onStart: () => void;
  onViewHistory: () => void;
  user: string;
}

const WelcomeScreen: React.FC<Props> = ({ onStart, onViewHistory, user }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="relative h-[35%] flex flex-col items-center justify-center text-gray-900 overflow-hidden shrink-0 border-b border-gray-50">
        {/* Opacidad al 70% para que sea nítida */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549413289-5324c489d977?q=80&w=1200')] bg-cover bg-center grayscale opacity-[0.7]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/20 to-white"></div>
        
        <div className="bg-white p-5 rounded-[2.2rem] shadow-premium border border-gray-50 mb-4 z-10 animate-float">
          <span className="material-icons-round text-primary text-5xl">spa</span>
        </div>
        
        <div className="z-10 text-center">
          <h1 className="text-3xl font-extrabold px-6 leading-tight tracking-tighter uppercase text-gray-900 drop-shadow-sm">
            AVISOS IA
          </h1>
          <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Técnico: {user.split('@')[0]}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-8 py-8 items-center text-center bg-white rounded-t-[3.5rem] z-10 -mt-6 shadow-[-20px_0_40px_rgba(0,0,0,0.03)]">
        <div className="mb-8 mt-4">
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">Panel Principal</h2>
          <p className="text-gray-500 text-[11px] leading-relaxed px-6 font-bold uppercase tracking-tight">
            Protocolo de mantenimiento predictivo y validación de activos vegetales.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mb-10">
          {[
            { icon: 'sensors', label: 'Scanner ON', color: 'text-primary' },
            { icon: 'cloud_done', label: 'Cloud DB', color: 'text-blue-500' },
            { icon: 'auto_awesome', label: 'IA Ready', color: 'text-amber-500' },
            { icon: 'query_stats', label: 'Metric ID', color: 'text-indigo-500' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50/50 p-5 rounded-[2rem] flex flex-col items-center border border-gray-100 transition-all hover:bg-white hover:shadow-premium">
              <span className={`material-icons-round ${item.color} mb-2 text-2xl`}>{item.icon}</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="w-full space-y-3 mt-auto mb-4">
          <button 
            onClick={onStart}
            className="w-full bg-primary text-white font-black py-5 px-6 rounded-[1.5rem] shadow-lg shadow-green-100 active:scale-[0.98] transition-all flex items-center justify-center group"
          >
            <span className="uppercase tracking-widest text-xs font-black">Generar Reporte IA</span>
            <span className="material-icons-round ml-3 group-hover:translate-x-1 transition-transform">add_circle</span>
          </button>
          <button 
            onClick={onViewHistory}
            className="w-full bg-white border border-gray-200 text-gray-500 font-black py-4 px-6 rounded-[1.5rem] active:scale-[0.98] flex items-center justify-center gap-2 group hover:bg-gray-50 transition-all shadow-sm"
          >
            <span className="material-icons-round text-sm text-gray-300">history</span>
            <span className="uppercase tracking-widest text-[10px]">Ver Historial</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;