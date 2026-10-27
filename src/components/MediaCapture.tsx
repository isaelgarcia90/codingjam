import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Camera, Upload, Trash2, Play, Square, Sparkles, User, FileText, AlertCircle } from 'lucide-react';

interface MediaCaptureProps {
  onGenerate: (data: {
    audioBase64?: string;
    audioMimeType?: string;
    imageBase64?: string;
    imageMimeType?: string;
    notes: string;
    clientName: string;
  }) => void;
  isLoading: boolean;
  onSelectSample: (presetId: string) => void;
}

export const MediaCapture: React.FC<MediaCaptureProps> = ({
  onGenerate,
  isLoading,
  onSelectSample,
}) => {
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | undefined>();
  const [audioMimeType, setAudioMimeType] = useState<string | undefined>();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Photo state
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imageMimeType, setImageMimeType] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Notes & Client
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioMimeType(mimeType.split(';')[0]);
        setAudioUrl(URL.createObjectURL(blob));

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          setAudioBase64(base64String);
        };

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      alert('No se pudo acceder al micrófono. Por favor permite los permisos de audio en tu navegador.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioBase64(undefined);
    setAudioMimeType(undefined);
    setIsPlayingAudio(false);
  };

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlayingAudio(false);
    }
    if (audioPlayerRef.current) {
      if (isPlayingAudio) {
        audioPlayerRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlayingAudio(true);
      }
    }
  };

  // Handle Photo Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImageBase64(base64String);
    };
  };

  const removePhoto = () => {
    setImagePreview(null);
    setImageBase64(undefined);
    setImageMimeType(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBase64 && !notes.trim() && !imageBase64) {
      alert('Por favor graba una nota de voz, sube una foto de la obra o escribe los detalles del trabajo.');
      return;
    }

    onGenerate({
      audioBase64,
      audioMimeType,
      imageBase64,
      imageMimeType,
      notes,
      clientName: clientName.trim() || 'Cliente Particular',
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200/80 mb-6">
      {/* Quick Demo Preloads Banner */}
      <div className="mb-4 bg-orange-50 border border-orange-200 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-orange-950 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            ¿Quieres probar una demo rápida?
          </span>
          <span className="text-[10px] text-orange-600 font-semibold uppercase">1-Click</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectSample('preset-plomeria')}
            className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-orange-200 hover:border-orange-500 hover:bg-orange-100/50 transition text-xs font-semibold text-slate-800"
          >
            🚰 Fuga de lavabo (Plomería)
          </button>
          <button
            type="button"
            onClick={() => onSelectSample('preset-electricidad')}
            className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-orange-200 hover:border-orange-500 hover:bg-orange-100/50 transition text-xs font-semibold text-slate-800"
          >
            ⚡ Centro de carga (Electricidad)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Name Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-orange-600" />
            Nombre del Cliente (o Familia)
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ej: Familia González / Arq. Roberto"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          />
        </div>

        {/* 1. Voice Recording Section (Main Highlight) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-orange-600" />
              1. Grabar Nota de Voz del Trabajo
            </span>
            {isRecording && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Grabando {formatTimer(recordingSeconds)}
              </span>
            )}
          </label>

          {!audioBlob ? (
            <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-slate-50 to-orange-50/30 border-2 border-dashed border-orange-200 rounded-2xl text-center">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition shadow-lg ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse-ring'
                    : 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white hover:scale-105 active:scale-95'
                }`}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
              </button>
              <p className="mt-3 text-xs font-semibold text-slate-700">
                {isRecording ? 'Toca para detener la grabación' : 'Toca el micrófono y explica el trabajo'}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                "Hay que cambiar la tubería de cobre picada por CPVC y meter 2 llaves de paso..."
              </p>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={togglePlayAudio}
                  className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition"
                >
                  {isPlayingAudio ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-bold text-emerald-950">Nota de voz grabada</p>
                  <p className="text-[11px] text-emerald-800">Lista para ser analizada por Gemini</p>
                </div>
              </div>
              <button
                type="button"
                onClick={deleteRecording}
                className="p-2 text-slate-600 hover:text-red-600 transition rounded-lg hover:bg-white"
                title="Eliminar audio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Photo Upload / Camera Section */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-orange-600" />
            2. Foto de la Obra o Instalación
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {!imagePreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 px-4 bg-slate-50 border border-slate-200 hover:border-orange-400 hover:bg-orange-50/20 rounded-2xl flex items-center justify-center space-x-2 text-slate-700 font-semibold text-xs transition"
            >
              <Camera className="w-4 h-4 text-orange-600" />
              <span>Tomar foto con la cámara o subir archivo</span>
            </button>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
              <img
                src={imagePreview}
                alt="Vista previa de obra"
                className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-3">
                <span className="text-white text-xs font-medium flex items-center gap-1">
                  📸 Foto cargada para análisis visual
                </span>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600 transition"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Text Notes or Adjustments */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            3. Notas o Detalles Adicionales (Opcional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Puedes agregar notas como: 'El cliente quiere que quede terminado hoy mismo' o 'Incluir marcas de primera'..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          />
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white shadow-xl flex items-center justify-center space-x-2 transition ${
            isLoading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-orange-500/25 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Gemini calculando presupuesto y materiales...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generar Presupuesto con IA</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

