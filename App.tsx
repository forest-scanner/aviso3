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
    const saved = localStorage.getItem('valoriza_supabase_v2');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading reports", e);
      }
    }
  }, []);

  // Limpiar el estado de sync después de 5 segundos
  useEffect(() => {
    if (syncStatus === 'success' || syncStatus === 'error') {
      const timer = setTimeout(() => setSyncStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus]);

  // Fix: Implemented missing handleLogin function to transition from LOGIN to WELCOME step
  const handleLogin = (user: string) => {
    setLoggedUser(user);
    setIncident(prev => ({ ...prev, technician: user }));
    setCurrentStep(Step.WELCOME);
  };

  const syncToCloud = useCallback(async (report: SavedReport): Promise<{ success: boolean; error?: string }> => {
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
      analisis_daño: report.aiResponse.analisis_daño_potencial, // Asegúrate que la columna se llame así en Supabase
      foto_url: report.fotoUrl || null,
      foto_base64: cleanBase64,
      estado_validacion: report.status,
      usuario: report.technician
    };
    
    console.log("[CLOUD SYNC] Enviando a Supabase:", payload.external_id);
    
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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[CLOUD SYNC] Error de servidor:", response.status, errorText);
        return { success: false, error: errorText };
      }

      console.log("[CLOUD SYNC] Éxito para ID:", payload.external_id);
      return { success: true };
    } catch (err: any) {
      console.error("[CLOUD SYNC] Error crítico de red:", err);
      return { success: false, error: err.message };
    }
  }, []);

  const saveReport = async (data: IncidentData, status: 'VALIDADO' | 'MANUAL') => {
    setSyncStatus('sending');
    const newReport: SavedReport = {
      id: `VAL-${Math.floor(1000 + Math.random() * 9000)}`,
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
        codigo_programa: 'MANUAL_Z3',
        requiere_seguimiento: 'SI',
        nivel_urgencia: 3,
        analisis_daño_potencial: 'Evaluación técnica pendiente'
      },
      status: status,
      synced: false
    };

    const result = await syncToCloud(newReport);
    newReport.synced = result.success;

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    
    try {
      localStorage.setItem('valoriza_supabase_v2', JSON.stringify(updatedReports));
    } catch (e) {
      // Si el localStorage falla por tamaño (base64 grande), intentamos guardar sin la foto
      const lighterReports = updatedReports.map((r, i) => i === 0 ? r : { ...r, photo: null });
      localStorage.setItem('valoriza_supabase_v2', JSON.stringify(lighterReports));
    }
    
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
      localStorage.setItem('valoriza_supabase_v2', JSON.stringify(updated));
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
      console.error("AI Analysis failed, falling back to manual", e);
      await saveReport(incident, 'MANUAL');
      setCurrentStep(Step.SUCCESS);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case Step.LOGIN: return <LoginScreen onLogin={handleLogin} />;
      case Step.WELCOME: return <WelcomeScreen onStart={() => setCurrentStep(Step.LOCATION)} onViewHistory={() => setCurrentStep(Step.HISTORY)} user={loggedUser} />;
      case Step.LOCATION: return <LocationStep incident={incident} onUpdate={(u: Partial<IncidentData>) => setIncident((prev: IncidentData) => ({...prev, ...u}))} onNext={() => setCurrentStep(Step.PHOTO)} />;
      case Step.PHOTO: return <PhotoStep incident={incident} onUpdate={(u: Partial<IncidentData>) => setIncident((prev: IncidentData) => ({...prev, ...u}))} onNext={() => setCurrentStep(Step.TYPE)} onBack={() => setCurrentStep(Step.LOCATION)} />;
      case Step.TYPE: return <TypeStep incident={incident} onUpdate={(u: Partial<IncidentData>) => setIncident((prev: IncidentData) => ({...prev, ...u}))} onNext={() => setCurrentStep(Step.DETAILS)} onBack={() => setCurrentStep(Step.PHOTO)} />;
      case Step.DETAILS: return <DetailStep incident={incident} onUpdate={(