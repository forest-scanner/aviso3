import React from 'react';
import { SavedReport } from '../types';

interface Props {
  report: SavedReport;
  onReset: () => void;
  onViewHistory: () => void;
}

const SuccessScreen: React.FC<Props> = ({ report, onReset, onViewHistory }) => {
  return (
    <div className="flex-1 flex flex-col p-6 bg-white dark:bg-gray-900 overflow-y-auto no-scrollbar pb-10">
      {/* Icon & Status */}
      <div className="flex flex-col items-center text-center pt-8 mb-8">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 shadow-xl ${report?.synced ? 'bg-green-600' : 'bg-orange-500 animate-pulse'}`}>
          <span className="material-icons-round text-4xl">{report?.synced ? 'verified' : 'cloud_upload'}</span>
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
          {report?.synced ? 'Reporte Sincronizado' : 'Guardado Localmente'}
        </h2>
        <div className="mt-3 flex items-center gap-2">
           <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
             <span className="text-[10px] font-mono font-bold text-gray-500">{report?.id}</span>
           </div>
           <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest shadow-sm ${report?.status === 'VALIDADO' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
             {report?.status}
           </div>
        </div>
      </div>

      {/* IA TECHNICAL REPORT */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-2 mb-1 px-2">
          <span className="material-icons-round text-primary text-sm">auto_awesome</span>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Resultado del Análisis IA</h3>
        </div>

        {/* Diagnóstico */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-icons-round text-primary text-lg">psychology</span>
            <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Diagnóstico Técnico</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            {report?.aiResponse?.diagnostico_ia || "Evaluación técnica procesada correctamente."}
          </p>
        </div>

        {/* Solución */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-icons-round text-blue-500 text-lg">build_circle</span>
            <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Solución Propuesta</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            {report?.aiResponse?.solucion_propuesta || "Actuación inmediata según protocolo."}
          </p>
        </div>

        {/* Análisis de Daño */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-icons-round text-orange-500 text-lg">report_problem</span>
            <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Análisis de Riesgo</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            {report?.aiResponse?.analisis_daño_potencial || "Sin riesgos críticos detectados."}
          </p>
        </div>

        {/* Programa Técnico */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[1.5rem] p-5 border border-indigo-100 flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Código Programa</span>
            <span className="text-[11px] font-black text-indigo-900 dark:text-indigo-300">{report?.aiResponse?.codigo_programa}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Nivel Urgencia</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div 
                  key={level} 
                  className={`w-3 h-1.5 rounded-full ${level <= (report?.aiResponse?.nivel_urgencia || 0) ? 'bg-indigo-600 shadow-[0_0_5px_rgba(79,70,229,0.5)]' : 'bg-indigo-100'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
        <button 
          onClick={onReset}
          className="w-full bg-primary text-white font-black py-4 rounded-[1.2rem] shadow-lg shadow-green-100 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-icons-round text-sm">add</span>
          <span className="uppercase tracking-widest text-xs">Nueva Incidencia</span>
        </button>
        <button 
          onClick={onViewHistory}
          className="w-full bg-white border border-gray-100 text-gray-400 font-black py-3.5 rounded-[1.2rem] active:scale-95 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
        >
          <span className="material-icons-round text-sm text-gray-300">history</span>
          <span className="uppercase tracking-widest text-[10px]">Consultar Registros</span>
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;