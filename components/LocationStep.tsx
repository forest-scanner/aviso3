
import React, { useEffect, useState } from 'react';
import { IncidentData } from '../types';
import { geocodeAddress } from '../services/geminiService';

interface Props {
  incident: IncidentData;
  onUpdate: (updates: Partial<IncidentData>) => void;
  onNext: () => void;
}

const LocationStep: React.FC<Props> = ({ incident, onUpdate, onNext }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [needsNewKey, setNeedsNewKey] = useState(false);

  useEffect(() => {
    const defaultLocation = {
      lat: 40.416775,
      lng: -3.703790,
      address: 'Madrid, Centro (Ubicación Manual)',
      district: 'Centro'
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onUpdate({
            location: {
              ...incident.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: 'Ubicación GPS Detectada',
              district: 'Madrid' 
            }
          });
          setLoading(false);
        },
        () => {
          onUpdate({
            location: { ...incident.location, ...defaultLocation }
          });
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      onUpdate({
        location: { ...incident.location, ...defaultLocation }
      });
      setLoading(false);
    }
  }, []);

  const handleOpenKeySelector = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setNeedsNewKey(false);
      setErrorMsg(null);
    } catch (e) {
      console.error("Error opening key selector", e);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMsg(null);
    setNeedsNewKey(false);
    
    try {
      const result = await geocodeAddress(searchQuery);
      if (result) {
        onUpdate({
          location: {
            address: searchQuery,
            lat: result.lat,
            lng: result.lng,
            district: result.district
          }
        });
        setSearchQuery('');
      } else {
        setErrorMsg("Dirección no encontrada.");
      }
    } catch (err: any) {
      if (err.message === "KEY_RESTRICTED") {
        setNeedsNewKey(true);
      } else {
        setErrorMsg("Fallo en servicio de mapas.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <header className="px-5 py-5 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-10">
        <h1 className="text-xl font-bold dark:text-white">Posicionamiento</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sincronización GPS Técnico</p>
      </header>

      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text" 
            placeholder="Buscar calle o zona..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border ${errorMsg ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'} rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none dark:text-white transition-all`}
          />
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white p-1.5 rounded-xl active:scale-90 transition-all disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="material-icons-round text-sm">map</span>
            )}
          </button>
        </form>
        
        {needsNewKey && (
          <button 
            onClick={handleOpenKeySelector}
            className="mt-3 w-full bg-indigo-50 text-indigo-700 py-2.5 rounded-xl text-xs font-bold border border-indigo-200 animate-pulse"
          >
            CONECTAR API KEY PARA MAPAS
          </button>
        )}
      </div>

      <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
        {!loading && incident.location.lat ? (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://maps.google.com/maps?q=${incident.location.lat},${incident.location.lng}&z=20&t=m&output=embed`}
            allowFullScreen
            title="Mapa de Ubicación Técnico"
          ></iframe>
        ) : (
          <div className="flex flex-col items-center p-8 bg-white/80 rounded-3xl backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Localizando señal...</p>
          </div>
        )}
        
        {!loading && incident.location.lat && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative">
                <div className="absolute -inset-4 bg-green-500/20 rounded-full animate-ping"></div>
                <div className="relative bg-white p-2 rounded-full shadow-2xl border-2 border-green-600">
                  <span className="material-icons-round text-green-600 text-3xl">location_on</span>
                </div>
              </div>
           </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 shadow-2xl rounded-t-[2rem] z-20 border-t dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
           <div className="flex-1 mr-4 overflow-hidden">
             <h3 className="text-sm font-bold dark:text-white">Punto de Actuación</h3>
             <p className="text-xs text-gray-400 truncate">{incident.location.address}</p>
             <p className="text-[10px] text-green-600 font-bold uppercase mt-1">Coordenadas: {incident.location.lat.toFixed(6)}, {incident.location.lng.toFixed(6)}</p>
           </div>
           <button onClick={() => window.location.reload()} className="p-2 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-400">
             <span className="material-icons-round text-sm">my_location</span>
           </button>
        </div>
        <button 
          onClick={onNext}
          disabled={loading && !incident.location.lat}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition-all"
        >
          <span>Confirmar Ubicación</span>
          <span className="material-icons-round">gps_fixed</span>
        </button>
      </div>
    </div>
  );
};

export default LocationStep;
