
import React from 'react';

interface Props {
  onStart: () => void;
  onViewHistory: () => void;
  user: string;
}

const WelcomeScreen: React.FC<Props> = ({ onStart, onViewHistory, user }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="relative h-[40%] bg-green-700 flex flex-col items-center justify-center text-white overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb75bb44?q=80&w=1000')] bg-cover bg-center opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-green-900/50"></div>
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/30 shadow-2xl mb-4 z-10 animate-bounce-slow">
          <span className="material-icons-round text-white text-5xl">park</span>
        </div>
        <div className="z-10 text-center">
          <h1 className="text-3xl font-display font-bold px-6 leading-tight">
            Madrid Verde
          </h1>
          <p className="text-sm font-bold bg-white/20 px-4 py-1 rounded-full inline-block mt-2">
            Hola, {user.split('_')[0]}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-8 py-8 items-center text-center -mt-6 bg-white dark:bg-gray-900 rounded-t-3xl z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.1)]">
        <div className="mb-6 mt-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Panel de Control Técnico</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
            Gestión inteligente de infraestructuras para zonas Z2/Z3.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          {[
            { icon: 'gps_fixed', label: 'Geo-Posición' },
            { icon: 'person', label: user.split('_')[0] },
            { icon: 'warning', label: 'Urgencia' },
            { icon: 'cloud_done', label: 'Supabase' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl flex flex-col items-center border border-gray-100 dark:border-gray-700">
              <span className="material-icons-round text-green-600 mb-1 text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight truncate w-full text-center">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="w-full space-y-3 mt-auto">
          <button 
            onClick={onStart}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transform transition active:scale-95 flex items-center justify-center group"
          >
            <span>Iniciar Nuevo Reporte</span>
            <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">add_circle</span>
          </button>
          <button 
            onClick={onViewHistory}
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-white font-bold py-3.5 px-6 rounded-2xl active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-icons-round text-sm">table_view</span>
            <span>Ver Historial Cloud</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
