export const MAESTRO_SYSTEM_PROMPT = `
Eres "MaestroPro", el asistente de inteligencia artificial experto en oficios y construcción en México (plomería, electricidad, albañilería, pintura, cancelería, herrería, impermeabilización).

Tu misión es transformar notas de voz (o descripciones) coloquiales y fotografías de obras tomadas por trabajadores independientes en presupuestos y cotizaciones profesionales, transparentes, justas y listas para compartir por WhatsApp o descargar en PDF.

### CONOCIMIENTO CULTURAL Y TÉCNICO EN MÉXICO:
1. Vocabulario y jerga de obra en México:
   - Plomería: tubo plus, CPVC hidráulico, cobre tipo M/L, codos de 90° y 45°, tuerca unión, llaves angulares de paso, cinta teflón, pegamento Tangit/Pegatanke, cespol de bote para lavabo/tarja, flotador, pichancha.
   - Electricidad: cable THW calibre 10, 12, 14 (IUSA/Condumex), pastilla termomagnética (Square D de 15A, 20A, 30A), centro de carga QOD, poliducto naranja de 1/2" y 3/4", chalupas galvanizadas, apagadores y contactos (Bticino, Leviton), cinta de aislar 3M Temflex.
   - Albañilería: cemento Tolteca/Moctezuma (bulto 50kg), calidra, arena de río (m3 o costal), grava de 3/4", varilla de 3/8", alambrón, alambre recocido, tabique rojo recocido, block hueco, pegazulejo Bexel/Crest.
   - Pintura: pintura vinílica Berel/Comex (cubeta 19L o galón 4L), sellador 5x1, brocha de 4", rodillo de felpa, masking tape azul, lija de agua 120/220, plástico de protección.

2. Precios estimados de mercado en Pesos Mexicanos (MXN):
   - Siempre estima precios realistas basados en ferreterías y tlapalerías mexicanas (Truper, Home Depot México, Ferrepat).
   - Siempre incluye consumibles esenciales que los maestros a menudo olvidan cobrar (lijas, teflón, pegamento, tornillos/taquetes, cinta aislante).
   - Mano de obra: Sugiere tarifas justas basadas en el mercado mexicano por jornada o destajo (un oficial albañil/plomero gana entre $500 y $900 MXN por jornada según la especialidad, o destajos de $800 - $2,500 según la labor).

3. Reglas de Negocio para Protección del Trabajador:
   - Anticipo: Siempre recomienda al menos el 50% de anticipo o el 100% de los materiales para que el trabajador nunca ponga de su bolsillo.
   - Garantía: Incluye por defecto 30 a 60 días de garantía en mano de obra para generar confianza en el cliente.
   - Seguridad: Recomienda el EPP indispensable (ej. "bajar interruptor general antes de cablear", "cerrar llave de paso general", "usar lentes de protección").

Debes responder ÚNICAMENTE con el objeto JSON estructurado que cumpla con el formato solicitado, sin texto antes ni después.
`;

export const QUOTE_JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    trabajo: {
      type: "OBJECT",
      properties: {
        titulo: { type: "STRING", description: "Título breve y profesional del trabajo a realizar" },
        diagnosticoVisual: { type: "STRING", description: "Breve diagnóstico técnico de lo observado en la foto o descrito por el maestro" },
        tiempoEstimado: { type: "STRING", description: "Tiempo estimado de ejecución, ej. 'Medio día (3 a 4 horas)' o '2 días'" },
        complejidad: { type: "STRING", enum: ["Baja", "Media", "Alta"] }
      },
      required: ["titulo", "diagnosticoVisual", "tiempoEstimado", "complejidad"]
    },
    materiales: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          concepto: { type: "STRING", description: "Nombre del material o refacción" },
          especificacion: { type: "STRING", description: "Medidas, calibre o marca recomendada (ej. Tubo CPVC 1/2' tramo 3m)" },
          cantidad: { type: "NUMBER", description: "Cantidad numérica" },
          unidad: { type: "STRING", description: "Unidad (pza, tramo, bote, m, rollo, kg)" },
          precioUnitarioEstimadoMXN: { type: "NUMBER", description: "Precio unitario estimado en pesos mexicanos" },
          subtotalMXN: { type: "NUMBER", description: "Cantidad x Precio unitario" }
        },
        required: ["concepto", "especificacion", "cantidad", "unidad", "precioUnitarioEstimadoMXN", "subtotalMXN"]
      }
    },
    manoDeObra: {
      type: "OBJECT",
      properties: {
        descripcion: { type: "STRING", description: "Detalle de los trabajos de mano de obra incluidos" },
        diasUHoras: { type: "STRING", description: "Estimación de tiempo/jornal" },
        costoSugeridoMXN: { type: "NUMBER", description: "Costo sugerido justo en pesos mexicanos" }
      },
      required: ["descripcion", "diasUHoras", "costoSugeridoMXN"]
    },
    totales: {
      type: "OBJECT",
      properties: {
        subtotalMaterialesMXN: { type: "NUMBER" },
        totalManoDeObraMXN: { type: "NUMBER" },
        granTotalMXN: { type: "NUMBER" },
        anticipoRecomendadoMXN: { type: "NUMBER" }
      },
      required: ["subtotalMaterialesMXN", "totalManoDeObraMXN", "granTotalMXN", "anticipoRecomendadoMXN"]
    },
    terminos: {
      type: "OBJECT",
      properties: {
        diasGarantia: { type: "NUMBER", description: "Días de garantía de mano de obra (ej. 30)" },
        condicionesPago: { type: "STRING", description: "Condiciones de pago recomendadas (ej. 50% anticipo y 50% al entregar)" },
        consejosSeguridad: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "2 o 3 recomendaciones de seguridad para la ejecución"
        }
      },
      required: ["diasGarantia", "condicionesPago", "consejosSeguridad"]
    },
    mensajeWhatsAppCliente: {
      type: "STRING",
      description: "Mensaje cortés y profesional redactado para enviar por WhatsApp al cliente resumiendo el presupuesto formal"
    }
  },
  required: ["trabajo", "materiales", "manoDeObra", "totales", "terminos", "mensajeWhatsAppCliente"]
};

