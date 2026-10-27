import { QuickPreset } from '../types/quote';

export const SAMPLE_PRESETS: QuickPreset[] = [
  {
    id: 'preset-plomeria',
    trade: 'plomeria',
    title: 'Reparación de Fuga y Cambio de Mezcladora',
    description: 'Tubería de cobre picada bajo lavabo, cambio por CPVC y llaves angulares nuevas.',
    transcription: 'Hay una fuga fuerte en la alimentación del lavabo del baño principal. La tubería de cobre ya está picada por el sarro. Hay que cortar y cambiar a CPVC hidráulico de media pulgada, poner 2 llaves de paso angulares Urrea, mangueras coflex trenzadas nuevas y cambiar el cespol que ya gotea. Me toma unas 4 horas de chamba.',
    imageSample: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    quoteSample: {
      id: 'demo-plomeria-01',
      fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
      perfilMaestro: {
        nombre: 'Maestro Don Lupe',
        oficio: 'Plomería y Fontanería',
        telefono: '55 1234 5678',
        ciudad: 'Ciudad de México'
      },
      cliente: {
        nombre: 'Familia Ramírez',
        telefono: '55 9876 5432',
        direccion: 'Col. Narvarte Poniente'
      },
      trabajo: {
        titulo: 'Sustitución de Línea Hidráulica y Conexiones de Lavabo',
        diagnosticoVisual: 'Fuga activa por corrosión galvánica en tubería de cobre y cespol sulfatado con fisuras.',
        tiempoEstimado: 'Medio día (4 a 5 horas)',
        complejidad: 'Media'
      },
      materiales: [
        {
          id: 'mat-1',
          concepto: 'Tubo CPVC Hidráulico 1/2 pulgada',
          especificacion: 'Tramo de 3 metros grado industrial',
          cantidad: 1,
          unidad: 'tramo',
          precioUnitarioEstimadoMXN: 115,
          subtotalMXN: 115
        },
        {
          id: 'mat-2',
          concepto: 'Llave de paso angular 1/2" a 1/2"',
          especificacion: 'Llave angular cromada Urrea / Dica',
          cantidad: 2,
          unidad: 'pza',
          precioUnitarioEstimadoMXN: 135,
          subtotalMXN: 270
        },
        {
          id: 'mat-3',
          concepto: 'Mangueras Coflex trenzadas para lavabo',
          especificacion: 'Acero inoxidable 1/2" x 1/2" longitud 40cm',
          cantidad: 2,
          unidad: 'pza',
          precioUnitarioEstimadoMXN: 95,
          subtotalMXN: 190
        },
        {
          id: 'mat-4',
          concepto: 'Cespol flexible para lavabo con contracanasta',
          especificacion: 'Polipropileno blanco alta durabilidad',
          cantidad: 1,
          unidad: 'pza',
          precioUnitarioEstimadoMXN: 145,
          subtotalMXN: 145
        },
        {
          id: 'mat-5',
          concepto: 'Cinta teflón industrial y pegamento CPVC',
          especificacion: 'Cinta teflón 3/4" + bote pegamento Tangit 50ml',
          cantidad: 1,
          unidad: 'juego',
          precioUnitarioEstimadoMXN: 85,
          subtotalMXN: 85
        }
      ],
      manoDeObra: {
        descripcion: 'Corte de tubería dañada, termofusión/cementado de línea nueva CPVC, instalación y calafateo de llaves de paso, cespol y pruebas de estanqueidad a presión.',
        diasUHoras: 'Medio día de labor técnica',
        costoSugeridoMXN: 950
      },
      totales: {
        subtotalMaterialesMXN: 805,
        totalManoDeObraMXN: 950,
        granTotalMXN: 1755,
        anticipoRecomendadoMXN: 900
      },
      terminos: {
        diasGarantia: 30,
        condicionesPago: '50% de anticipo ($900 MXN) para surtido de materiales en ferretería; 50% restante al probar ausencia de fugas y entrega de trabajo.',
        consejosSeguridad: [
          'Cierre de la llave de paso del tinaco antes de comenzar',
          'Uso de guantes de nitrilo y gafas de protección durante el corte'
        ]
      },
      mensajeWhatsAppCliente: 'Estimada Familia Ramírez, le comparto la cotización formal de MaestroPro para el trabajo de plomería en su lavabo. El presupuesto total es de $1,755 MXN (incluye refacciones completas y mano de obra con 30 días de garantía por escrito). Quedo a sus órdenes para comenzar.',
      fotoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'preset-electricidad',
    trade: 'electricidad',
    title: 'Actualización de Centro de Carga y Balanceo',
    description: 'Reemplazo de caja de fusibles obsoleta por centro de carga termomagnético.',
    transcription: 'La casa tiene todavía caja de fusibles de cartucho de los viejos y se bajan a cada rato cuando prenden el microondas y el refri. Hay que quitar esa caja vieja y poner un centro de carga de 2 pastillas termomagnéticas Square D de 20 amperes, meter cable calibre 12 Condumex para independizar la cocina y poner tierra física básica.',
    imageSample: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    quoteSample: {
      id: 'demo-electricidad-02',
      fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
      perfilMaestro: {
        nombre: 'Ing. Memo Electricista',
        oficio: 'Electricidad e Instalaciones',
        telefono: '55 4321 8765',
        ciudad: 'Monterrey, N.L.'
      },
      cliente: {
        nombre: 'Sra. Patricia Mendoza',
        telefono: '81 1234 5678',
        direccion: 'Col. San Jerónimo'
      },
      trabajo: {
        titulo: 'Sustitución de Tablero de Fusibles por Centro de Carga QOD-2',
        diagnosticoVisual: 'Interruptor de cuchillas con riesgo de sobrecalentamiento y falso contacto por desgaste.',
        tiempoEstimado: '1 día completo (6 a 7 horas)',
        complejidad: 'Alta'
      },
      materiales: [
        {
          id: 'mat-e1',
          concepto: 'Centro de Carga QOD 2 polos para sobreponer',
          especificacion: 'Gabinete Square D Schneider Electric',
          cantidad: 1,
          unidad: 'pza',
          precioUnitarioEstimadoMXN: 340,
          subtotalMXN: 340
        },
        {
          id: 'mat-e2',
          concepto: 'Interruptor termomagnético 1 polo 20A QO120',
          especificacion: 'Pastilla Square D original 10kA',
          cantidad: 2,
          unidad: 'pza',
          precioUnitarioEstimadoMXN: 185,
          subtotalMXN: 370
        },
        {
          id: 'mat-e3',
          concepto: 'Cable eléctrico THW calibre 12 AWG (Negro y Blanco)',
          especificacion: '100% Cobre libre de halógenos IUSA / Condumex (15m)',
          cantidad: 15,
          unidad: 'm',
          precioUnitarioEstimadoMXN: 18,
          subtotalMXN: 270
        },
        {
          id: 'mat-e4',
          concepto: 'Cinta de aislar vinílica Super 33+ y terminales',
          especificacion: 'Cinta profesional 3M + capuchones de resorte',
          cantidad: 1,
          unidad: 'juego',
          precioUnitarioEstimadoMXN: 95,
          subtotalMXN: 95
        }
      ],
      manoDeObra: {
        descripcion: 'Desmontaje de cuchillas antiguas, fijación y nivelación de centro de carga, peinado de cables, balanceo de cargas en 2 circuitos y pruebas de caída de tensión.',
        diasUHoras: '1 Jornada especializada',
        costoSugeridoMXN: 1400
      },
      totales: {
        subtotalMaterialesMXN: 1075,
        totalManoDeObraMXN: 1400,
        granTotalMXN: 2475,
        anticipoRecomendadoMXN: 1200
      },
      terminos: {
        diasGarantia: 60,
        condicionesPago: '50% de anticipo para compra de breakers y cableado, 50% al comprobar suministro y voltaje estable.',
        consejosSeguridad: [
          'Desconexión desde el medidor de CFE antes de maniobras',
          'Calzado con suela dieléctrica y desarmadores aislados a 1000V'
        ]
      },
      mensajeWhatsAppCliente: 'Buenas tardes Sra. Patricia, le anexo el presupuesto formal de MaestroPro para modernizar el centro de carga de su hogar a pastillas termomagnéticas. Incluye componentes certificados Square D y garantía de 60 días. Con gusto quedo a sus órdenes.',
      fotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
    }
  }
];

