
import React from 'react';
import { IncidentData } from '../types';
import { INCIDENT_TYPES } from '../constants';

interface Props {
  incident: IncidentData;
  onUpdate: (updates: Partial<IncidentData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TypeStep: React.FC<Props> = ({ incident, onUpdate, onNext, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <header className="pt-8 pb-4 px-6 border-b border-gray-100 dark:border-gray-800 z-10 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paso 3 de 4</div>
          <button className="p-2 -mr-2 text-gray-400">
            <span className="material-icons-round">help_outline</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          Selecciona el<br />tipo de aviso
        </h1>
        <div className="flex items-center space-x-2 mt-4">
          <div className="h-1.5 w-full bg-primary rounded-full"></div>
          <div className="h-1.5 w-full bg-primary rounded-full"></div>
          <div className="h-1.5 w-full bg-primary rounded-full"></div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
        {INCIDENT_TYPES.map((type) => (
          <label 
            key={type.id}
            className={`group relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${incident.type === type.id ? 'border-primary bg-green-50/30 dark:bg-green-900/10' : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:border-primary/50'}`}
          >
            <input 
              type="radio" 
              name="incident_type" 
              className="sr-only" 
              checked={incident.type === type.id}
              onChange={() => onUpdate({ type: type.id })}
            />
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${type.color}`}>
              <span className="material-icons-round text-2xl">{type.icon}</span>
            </div>
            <div className="ml-4 flex-1">
              <span className="block text-base font-semibold text-gray-900 dark:text-white">{type.title}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{type.subtitle}</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${incident.type === type.id ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'}`}>
              <span className="material-icons-round text-white text-sm">check</span>
            </div>
          </label>
        ))}
      </main>

      <footer className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <button 
          disabled={!incident.type}
          onClick={onNext}
          className={`w-full font-semibold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${incident.type ? 'bg-primary text-white active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          <span>Continuar</span>
          <span className="material-icons-round text-xl">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

export default TypeStep;
