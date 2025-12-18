
import React from 'react';
import { SavedReport } from '../types';

interface Props {
  report: SavedReport;
  onReset: () => void;
  onViewHistory: () => void;
}

const SuccessScreen: React.FC<Props> = ({ report, onReset, onViewHistory }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 text-center overflow-y-auto no-scrollbar">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white mb-6 animate-bounce shadow-2xl ${report?.synced ? 'bg-green-600 shadow-green-500/20' : 'bg-orange-500 shadow-orange-500/20'}`}>
        <span className="material-icons-round text-5xl">{report?.synced ? 'cloud_done' : 'cloud_off'}</span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {report?.synced ? 'Sincronizado con Éxito' : 'Guardado en Local'}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm px-6 leading-relaxed">
        {report?.synced 
          ? 'Los datos ya están disponibles en tu panel de control de Supabase.' 
          : 'No se pudo conectar con la nube. El reporte se sincronizará cuando recuperes conexión.'}
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 w-full rounded-3xl p-6 border border-gray-100 dark:border-gray-700 mb-8 space-y-5 shadow-sm text-left">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID de Registro</span>
          <span className="font-mono text-green-600 font-bold">{report?.id || 'VAL-SYNC'}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <span className="text-[9px] font-bold text-green-600 uppercase block mb-1">Servicio</span>
            <p className="text-[10px] font-bold text-gray-900 dark:text-white">Supabase Cloud</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <span className="text-[9px] font-bold text-blue-600 uppercase block mb-1">Estado Sync</span>
            <div className="flex items-center gap-1">
              <span className={`material-icons-round text-[12px] ${report?.synced ? 'text-green-500' : 'text-orange-500'}`}>
                {report?.synced ? 'check_circle' : 'pending'}
              </span>
              <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">
                {report?.synced ? 'ONLINE' : 'PENDING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-3">
        <button 
          onClick={onViewHistory}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-icons-round">list_alt</span>
          Ver Historial Cloud
        </button>
        <button 
          onClick={onReset}
          className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white font-bold py-3.5 rounded-2xl active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-icons-round text-sm">add</span>
          Nuevo Aviso
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
