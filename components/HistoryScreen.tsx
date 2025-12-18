
import React from 'react';
import { SavedReport } from '../types';

interface Props {
  reports: SavedReport[];
  onBack: () => void;
  onRetrySync: (id: string) => void;
}

const HistoryScreen: React.FC<Props> = ({ reports, onBack, onRetrySync }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <header className="px-6 py-6 bg-white dark:bg-gray-800 border-b shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold dark:text-white">Registros SQL</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Persistencia en PostgreSQL</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
          <span className="material-icons-round text-indigo-600">dns</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="material-icons-round text-6xl mb-4 opacity-20">inventory_2</span>
            <p className="text-sm font-bold uppercase tracking-widest">Base de datos vacía</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600">{report.id}</span>
                  <span className="text-[10px] text-gray-500 font-bold truncate max-w-[80px]">@{report.technician}</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${report.synced ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {report.synced ? 'En DB' : 'En Local'}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-3">
                  {(report.fotoUrl || report.photo) && (
                    <img 
                      src={report.fotoUrl || report.photo || ''} 
                      className="w-16 h-16 object-cover rounded-lg border dark:border-gray-700 bg-gray-100" 
                      alt="Evidencia" 
                      onError={(e) => {
                        // Si falla la URL de la nube, intentar volver al base64 local si existe
                        if (report.fotoUrl && report.photo) {
                          (e.target as HTMLImageElement).src = report.photo;
                        }
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase block">Diagnóstico</span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">"{report.aiResponse.diagnostico_ia}"</p>
                  </div>
                </div>
                
                {!report.synced && (
                  <button 
                    onClick={() => onRetrySync(report.id)}
                    className="w-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-800"
                  >
                    <span className="material-icons-round text-xs">sync</span>
                    REINTENTAR INSERCIÓN SQL
                  </button>
                )}

                {report.synced && report.fotoUrl && (
                  <a 
                    href={report.fotoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-500 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 border border-gray-100 dark:border-gray-800"
                  >
                    <span className="material-icons-round text-xs">open_in_new</span>
                    VER URL PÚBLICA
                  </a>
                )}
                
                <div className="flex justify-between items-center pt-1 border-t dark:border-gray-700 mt-2 pt-2">
                  <span className="text-[9px] text-gray-400 font-medium">{report.timestamp}</span>
                  <div className="flex items-center gap-1">
                    <span className="material-icons-round text-[10px] text-gray-400">gps_fixed</span>
                    <span className="text-[9px] font-mono text-gray-400">{report.coordinates}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default HistoryScreen;
