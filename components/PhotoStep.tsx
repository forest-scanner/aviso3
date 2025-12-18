
import React, { useRef } from 'react';
import { IncidentData } from '../types';

interface Props {
  incident: IncidentData;
  onUpdate: (updates: Partial<IncidentData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PhotoStep: React.FC<Props> = ({ incident, onUpdate, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Resolución técnica suficiente
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Compresión al 60% para reducir drásticamente el tamaño del string
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = base64Str;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        onUpdate({ photo: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm z-10 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold dark:text-white">Nueva Incidencia</h1>
          <div className="w-10 h-10"></div>
        </div>
        <div className="flex justify-between items-center px-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="material-icons-round text-xs">check</span>
          </div>
          <div className="h-1 flex-1 bg-primary mx-2 rounded"></div>
          <div className="flex flex-col items-center relative">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-lg scale-110">
              <span className="material-icons-round text-lg">photo_camera</span>
            </div>
            <span className="absolute top-12 text-[10px] font-bold text-secondary uppercase">Fotografía</span>
          </div>
          <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 mx-2 rounded"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 flex items-center justify-center">
            <span className="material-icons-round text-xs">category</span>
          </div>
          <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 mx-2 rounded"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 flex items-center justify-center">
            <span className="material-icons-round text-xs">send</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 overflow-y-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold dark:text-white">Adjuntar Evidencia</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Tome una foto clara. Se comprimirá automáticamente para el servidor.</p>
        </div>

        <div 
          onClick={handleCapture}
          className="w-full aspect-square max-w-[300px] bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center relative shadow-sm group hover:border-secondary transition-all cursor-pointer overflow-hidden"
        >
          {incident.photo ? (
            <img src={incident.photo} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-gray-400 group-hover:text-secondary transition-colors">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons-round text-4xl text-secondary">add_a_photo</span>
              </div>
              <span className="font-medium text-sm">Tocar para añadir foto</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 px-6 py-5 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-gray-500 font-medium px-4 py-2">Cancelar</button>
          <button 
            disabled={!incident.photo}
            onClick={onNext}
            className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${incident.photo ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <span>Siguiente</span>
            <span className="material-icons-round text-lg">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PhotoStep;
