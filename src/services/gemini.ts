import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuoteData, WorkerProfile } from '../types/quote';
import { MAESTRO_SYSTEM_PROMPT } from '../prompts/systemPrompt';

export interface GenerateQuoteParams {
  audioBase64?: string;
  audioMimeType?: string;
  imageBase64?: string;
  imageMimeType?: string;
  notes?: string;
  clientName?: string;
  clientPhone?: string;
  profile: WorkerProfile;
  apiKey?: string;
}

export const generateQuoteWithGemini = async (
  params: GenerateQuoteParams
): Promise<QuoteData> => {
  const apiKey =
    params.apiKey ||
    params.profile.geminiApiKey ||
    ((import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined);

  if (!apiKey || apiKey.trim() === '' || apiKey === 'TU_API_KEY_AQUI') {
    throw new Error(
      'Falta la Gemini API Key. Por favor agrégala en Configuración (icono de engrane) o en el archivo .env.'
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());

  const promptParts: any[] = [];

  // Add contextual information
  promptParts.push({
    text: `Genera una cotización completa para el cliente "${params.clientName || 'Cliente Particular'}".
Información del Maestro:
- Nombre: ${params.profile.name}
- Especialidad: ${params.profile.trade}
- Teléfono: ${params.profile.phone}
- Ciudad: ${params.profile.city}

Instrucciones adicionales / Notas de voz transcritas:
"${params.notes || 'Revisar la fotografía y audio adjuntos para cotizar el trabajo necesario'}"`
  });

  // Attach Image if available
  if (params.imageBase64 && params.imageMimeType) {
    promptParts.push({
      inlineData: {
        data: params.imageBase64,
        mimeType: params.imageMimeType,
      },
    });
  }

  // Attach Audio if available
  if (params.audioBase64 && params.audioMimeType) {
    promptParts.push({
      inlineData: {
        data: params.audioBase64,
        mimeType: params.audioMimeType,
      },
    });
  }

  const candidateModels = ['gemini-3.8-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  let text = '';
  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
        systemInstruction: MAESTRO_SYSTEM_PROMPT,
      });

      const result = await model.generateContent(promptParts);
      text = result.response.text();
      if (text) break;
    } catch (err: any) {
      console.warn(`Fallo con el modelo ${modelName}, intentando siguiente modelo...`, err);
      lastError = err;
    }
  }

  if (!text) {
    throw new Error(
      `Error al procesar con Gemini: ${lastError?.message || 'No se pudo generar respuesta con los modelos disponibles.'}`
    );
  }

  try {
    const parsed = JSON.parse(text);

    // Build unique quote object
    const finalQuote: QuoteData = {
      id: `quote-${Date.now()}`,
      fecha: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      perfilMaestro: {
        nombre: params.profile.name,
        oficio: params.profile.trade,
        telefono: params.profile.phone,
        ciudad: params.profile.city,
      },
      cliente: {
        nombre: params.clientName || 'Cliente Particular',
        telefono: params.clientPhone || '',
      },
      trabajo: {
        titulo: parsed.trabajo?.titulo || 'Servicio Técnico Profesional',
        diagnosticoVisual: parsed.trabajo?.diagnosticoVisual || 'Inspección de obra realizada.',
        tiempoEstimado: parsed.trabajo?.tiempoEstimado || '1 día',
        complejidad: parsed.trabajo?.complejidad || 'Media',
      },
      materiales: (parsed.materiales || []).map((m: any, idx: number) => ({
        id: `mat-${idx + 1}`,
        concepto: m.concepto || 'Material',
        especificacion: m.especificacion || 'Estándar',
        cantidad: Number(m.cantidad) || 1,
        unidad: m.unidad || 'pza',
        precioUnitarioEstimadoMXN: Number(m.precioUnitarioEstimadoMXN) || 0,
        subtotalMXN: Number(m.subtotalMXN) || (Number(m.cantidad) * Number(m.precioUnitarioEstimadoMXN)),
      })),
      manoDeObra: {
        descripcion: parsed.manoDeObra?.descripcion || 'Trabajos de mano de obra especializada.',
        diasUHoras: parsed.manoDeObra?.diasUHoras || 'Jornada estimada',
        costoSugeridoMXN: Number(parsed.manoDeObra?.costoSugeridoMXN) || 0,
      },
      totales: {
        subtotalMaterialesMXN: Number(parsed.totales?.subtotalMaterialesMXN) || 0,
        totalManoDeObraMXN: Number(parsed.totales?.totalManoDeObraMXN) || 0,
        granTotalMXN: Number(parsed.totales?.granTotalMXN) || 0,
        anticipoRecomendadoMXN: Number(parsed.totales?.anticipoRecomendadoMXN) || 0,
      },
      terminos: {
        diasGarantia: Number(parsed.terminos?.diasGarantia) || 30,
        condicionesPago: parsed.terminos?.condicionesPago || '50% anticipo al iniciar, 50% al entregar',
        consejosSeguridad: parsed.terminos?.consejosSeguridad || ['Utilizar equipo de protección personal'],
      },
      mensajeWhatsAppCliente: parsed.mensajeWhatsAppCliente || '',
    };

    return finalQuote;
  } catch (error: any) {
    console.error('Error generando cotización con Gemini:', error);
    // If model 'gemini-2.5-flash' has an issue or quota, let's bubble up a helpful message
    throw new Error(
      `Error al procesar con Gemini: ${error?.message || 'Error desconocido'}`
    );
  }
};
