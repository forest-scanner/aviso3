import React, { useState, useEffect, useCallback } from 'react';
import { Step, IncidentData, SavedReport } from './types';
import LoginScreen from './components/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen';
import LocationStep from './components/LocationStep';
import PhotoStep from './components/PhotoStep';
import TypeStep from './components/TypeStep';
import DetailStep from './components/DetailStep';
import ReviewStep from './components/ReviewStep';
import SuccessScreen from './components/SuccessScreen';
import HistoryScreen from './components/HistoryScreen';
import { analyzeIncident } from './services/geminiService';

const SUPABASE_URL = 'catfuitoyibnmtjdaeia.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdGZ1aXRveWlibm10amRhZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTg2OTMsImV4cCI6MjA4MTYzNDY5M30.GUv9kwU7MKduUy6ZMKZq0aRn_HSqwVLI_BQqzcyI2Rc';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.LOGIN);
  const [loggedUser, setLoggedUser] = useState<string>('');
  const [validationAttempts, setValidationAttempts] = useState(0);
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [incident, setIncident] = useState<IncidentData>({
    location: { address: 'Localizando...', lat: 40.4168, lng: -3.7038, district: 'Madrid' },
    photo: null,
    type: '',
    description: '',
    isUrgent: false,
    isDangerous: false,
    technician: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('avisos_ia_v2');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading reports", e);
      }
    }
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.toLowerCase().trim();
    
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError("ID no reconocido.");
      return;
    }

    try {
      const response = await fetch(`https://${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: pass
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || "Credenciales inválidas.");
      }

      setLoggedUser(data.user.email);
      setIncident(prev => ({ ...prev, technician: data.user.email }));
      setCurrentStep(Step.WELCOME);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const syncToCloud = useCallback(async (report: SavedReport): Promise<{ success: boolean }> => {
    const cleanBase64 = report.photo && report.photo.includes(',') 
      ? report.photo.split(',')[1] 
      : report.photo;

    const payload = {
      external_id: report.id,
      tipo_incidencia: report.type,
      distrito: report.address.split(',')[1]?.trim() || 'Madrid',
      direccion: report.address,
      coordenadas: report.coordinates,
      descripcion: report.description,
      diagnostico_ia: report.aiResponse.diagnostico_ia,
      solucion_propuesta: report.aiResponse.solucion_propuesta,
      codigo_programa: report.aiResponse.codigo_programa,
      nivel_urgencia: report.aiResponse.nivel_urgencia,
      analisis_daño: report.aiResponse.analisis_daño_potencial,
      foto_base64: cleanBase64,
      estado_validacion: report.status,
      usuario: report.technician
    };
    
    try {
      const response = await fetch(`https://${SUPABASE_URL}/rest/v1/incidencias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
      
      return { success: response.ok };
    } catch (err) {
      return { success: false };
    }
  }, []);

  const saveReport = async (data: IncidentData, status: 'VALIDADO' | 'MANUAL') => {
    setSyncStatus('sending');
    const newReport: SavedReport = {
      id: `AV-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('es-ES'),
      type: data.type,
      address: data.location.address,
      coordinates: `${data.location.lat.toFixed(6)}, ${data.location.lng.toFixed(6)}`,
      description: data.description,
      photo: data.photo, 
      technician: data.technician,
      aiResponse: data.aiValidation || {
        validacion: 'FALLIDA',
        mensaje_usuario: 'Reporte manual',
        diagnostico_ia: 'No verificado por IA',
        solucion_propuesta: 'Inspección técnica manual',
        codigo_programa: 'MANUAL',
        requiere_seguimiento: 'SI',
        nivel_urgencia: 3,
        analisis_daño_potencial: 'Evaluación pendiente'
      },
      status: status,
      synced: false
    };

    const result = await syncToCloud(newReport);
    newReport.synced = result.success;

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('avisos_ia_v2', JSON.stringify(updatedReports));
    setSyncStatus(result.success ? 'success' : 'error');
  };

  const handleRetrySync = async (id: string) => {
    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex === -1) return;
    setSyncStatus('sending');
    const result = await syncToCloud(reports[reportIndex]);
    if (result.success) {
      const updated = [...reports];
      updated[reportIndex] = { ...updated[reportIndex], synced: true };
      setReports(updated);
      localStorage.setItem('avisos_ia_v2', JSON.stringify(updated));
      setSyncStatus('success');
    } else {
      setSyncStatus('error');
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeIncident(incident);
      const updatedIncident = { ...incident, aiValidation: result };
      setIncident(updatedIncident);
      if (result.validacion === 'EXITO') {
        await saveReport(updatedIncident, 'VALIDADO');
        setCurrentStep(Step.SUCCESS);
      } else {
        const newAttemptCount = validationAttempts + 1;
        setValidationAttempts(newAttemptCount);
        if (newAttemptCount >= 2) {
          await saveReport(updatedIncident, 'MANUAL');
          setCurrentStep(Step.SUCCESS);
        }
      }
    } catch (e) {
      await saveReport(incident, 'MANUAL');
      setCurrentStep(Step.SUCCESS);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case Step.LOGIN: return <LoginScreen onLogin={handleLogin} error={authError} />;
      case Step.WELCOME: return <WelcomeScreen onStart={() => setCurrentStep(Step.LOCATION)} onViewHistory={() => setCurrentStep(Step.HISTORY)} user={loggedUser} />;
      case Step.LOCATION: return <LocationStep incident={incident} onUpdate={(u) => setIncident((prev) => ({...prev, ...u}))} onNext={() => setCurrentStep(Step.PHOTO)} />;
      case Step.PHOTO: return <PhotoStep incident={incident} onUpdate={(u) => setIncident((prev) => ({...prev, ...u}))} onNext={() => setCurrentStep(Step.TYPE)} onBack={() => setCurrentStep(Step.LOCATION)} />;
      case Step.TYPE: return <TypeStep incident={incident} onUpdate={(u) => setIncident((prev) => ({...prev, ...u}))} onNext={() => setCurrentStep(Step.DETAILS)} onBack={() => setCurrentStep(Step.PHOTO)} />;
      case Step.DETAILS: return <DetailStep incident={incident} onUpdate={(u) => setIncident((prev) => ({...prev, ...u}))} onNext={() => setCurrentStep(Step.REVIEW)} onBack={() => setCurrentStep(Step.TYPE)} />;
      case Step.REVIEW: return <ReviewStep incident={incident} onBack={() => setCurrentStep(Step.DETAILS)} onSubmit={handleAnalyze} isSubmitting={isAnalyzing} onEditPhoto={() => setCurrentStep(Step.PHOTO)} validationAttempts={validationAttempts} />;
      case Step.SUCCESS: return <SuccessScreen report={reports[0]} onReset={() => setCurrentStep(Step.WELCOME)} onViewHistory={() => setCurrentStep(Step.HISTORY)} />;
      case Step.HISTORY: return <HistoryScreen reports={reports} onBack={() => setCurrentStep(Step.WELCOME)} onRetrySync={handleRetrySync} />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen sm:h-[850px] bg-white sm:rounded-[3rem] shadow-premium relative flex flex-col overflow-hidden sm:border-8 border-white">
        {syncStatus === 'sending' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 z-[100] overflow-hidden">
            <div className="h-full bg-primary animate-[pulse_1.5s_infinite] w-full"></div>
          </div>
        )}
        {syncStatus === 'error' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-red-400 z-[100]"></div>
        )}
        {syncStatus === 'success' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-primary z-[100]"></div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default App;