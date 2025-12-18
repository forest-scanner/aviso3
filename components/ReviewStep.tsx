
import React from 'react';
import { IncidentData } from '../types';
import { INCIDENT_TYPES } from '../constants';

interface Props {
  incident: IncidentData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onEditPhoto: () => void;
  validationAttempts: number;
}

const ReviewStep: React.FC<Props> = ({ incident, onBack, onSubmit, isSubmitting, onEditPhoto, validationAttempts }) => {
  const incidentType = INCIDENT_TYPES.find(t => t.id === incident.type);
  const aiFeedback = incident.aiValidation;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-10 border-b border-gray-100 dark:border-gray-700 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-lg font-semibold dark:text-white">Revisar Reporte</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-4 shrink-0">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10 transform -translate-y-1/2"></div>
          {['check', 'check', 'check', '4'].map((val, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md ${idx === 3 ? 'bg-primary ring-4 ring-primary/20' : 'bg-primary'}`}>
                {idx === 3 ? <span className="text-sm font-bold">4</span> : <span className="material-icons-round text-sm">{val}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 pb-32 space-y-6 no-scrollbar">
        {/* AI Validation Feedback Section */}
        {aiFeedback && aiFeedback.validacion === 'FALLIDA' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
              <span className="material-icons-round">warning</span>
              <h3 className="font-bold text-sm">Error de Validación IA</h3>
            </div>
            <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-3">
              {aiFeedback.mensaje_usuario}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={onEditPhoto}
                className="bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1"
              >
                <span className="material-icons-round text-xs">camera_alt</span>
                Repetir Foto
              </button>
              {validationAttempts === 1 && (
                <div className="text-[10px] text-red-500 dark:text-red-400 self-center">
                  Intento 1 de 2. El siguiente envío será manual.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Resumen de Incidencia</h2>
          <p className="text-sm text-gray-500">Por favor verifica que la información sea correcta antes de enviar.</p>
        </div>

        {/* Photo Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-icons-round">photo_camera</span>
              <h3 className="font-bold dark:text-white">Evidencia</h3>
            </div>
            <button onClick={onEditPhoto} className="text-xs font-bold text-primary">Editar</button>
          </div>
          {incident.photo && (
            <div className="relative group">
              <img src={incident.photo} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-gray-100 dark:border-gray-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                 <button onClick={onEditPhoto} className="bg-white text-gray-900 rounded-full p-2">
                   <span className="material-icons-round">edit</span>
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Location Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-icons-round">location_on</span>
              <h3 className="font-bold dark:text-white">Ubicación</h3>
            </div>
            <button className="text-xs font-bold text-primary">Editar</button>
          </div>
          <p className="text-sm font-medium dark:text-white">{incident.location.address}</p>
        </div>

        {/* Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-icons-round">assignment</span>
              <h3 className="font-bold dark:text-white">Detalles</h3>
            </div>
            <button className="text-xs font-bold text-primary">Editar</button>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Tipo</span>
              <div className="flex items-center gap-2">
                <span className={`material-icons-round ${incidentType?.color.split(' ')[1]}`}>{incidentType?.icon}</span>
                <span className="text-sm font-medium dark:text-white">{incidentType?.title}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-50 dark:border-gray-700">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Descripción</span>
              <p className="text-sm dark:text-gray-200 leading-relaxed italic">"{incident.description}"</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2">
          <input type="checkbox" defaultChecked className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
          <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <span className="font-bold text-gray-700 dark:text-gray-200 block">Acepto la política de privacidad</span>
            Sus datos serán tratados por el Ayuntamiento para la gestión de incidencias.
          </div>
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 shrink-0">
        <button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed ${validationAttempts > 0 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-primary hover:bg-secondary'}`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Analizando con IA...</span>
            </>
          ) : (
            <>
              <span>{validationAttempts > 0 ? 'Enviar Manualmente' : 'Enviar Reporte'}</span>
              <span className="material-icons-round group-hover:translate-x-1 transition-transform">{validationAttempts > 0 ? 'send' : 'auto_fix_high'}</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default ReviewStep;
