
import React from 'react';
import { IncidentData } from '../types';

interface Props {
  incident: IncidentData;
  onUpdate: (updates: Partial<IncidentData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DetailStep: React.FC<Props> = ({ incident, onUpdate, onNext, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
       <header className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
          <span className="material-icons-round">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Nueva Incidencia</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10 transform -translate-y-1/2"></div>
          {[
            { icon: 'location_on', completed: true },
            { icon: 'camera_alt', completed: true },
            { icon: 'category', completed: true },
            { icon: 'edit', active: true },
            { icon: 'send', pending: true },
          ].map((s, idx) => (
            <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center ${s.completed ? 'bg-primary text-white' : s.active ? 'bg-secondary text-white ring-4 ring-blue-100 dark:ring-blue-900/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
              <span className="material-icons-round text-sm">{s.icon}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 px-6 pt-6 overflow-y-auto no-scrollbar">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Describe el aviso</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Por favor, describe detalladamente la incidencia. Cuanta más información proporciones, más fácil será para nosotros solucionarlo.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700">
          <textarea 
            value={incident.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full bg-transparent border-0 focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 p-4 text-base resize-none"
            placeholder="Ej: Hay un banco roto en el parque central, cerca de la fuente. Falta una de las tablas de madera..."
            rows={6}
          ></textarea>
          
          <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => onUpdate({ isUrgent: !incident.isUrgent })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${incident.isUrgent ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                Urgente
              </button>
              <button 
                onClick={() => onUpdate({ isDangerous: !incident.isDangerous })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${incident.isDangerous ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                Peligroso
              </button>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-secondary">
              <span className="material-icons-round">mic</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
          <span className="material-icons-outlined text-secondary shrink-0">info</span>
          <p className="text-xs text-blue-900 dark:text-blue-200">
            Recuerda que no debes incluir datos personales ni matrículas en la descripción.
          </p>
        </div>
      </main>

      <footer className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <button 
          disabled={incident.description.length < 10}
          onClick={onNext}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg transition-all ${incident.description.length >= 10 ? 'bg-primary text-white active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          <span>Siguiente Paso</span>
          <span className="material-icons-round">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

export default DetailStep;
