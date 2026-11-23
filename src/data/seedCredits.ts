import { CreditProduct } from '../types/credit';

export const SEED_CREDIT_PRODUCTS: CreditProduct[] = [
  {
    id: 'cred-libre-inversion',
    name: 'Crédito Libre Inversión',
    category: 'personal',
    shortDescription: 'Liquidez inmediata sin codeudor para cumplir tus proyectos personales.',
    description:
      'Obtén financiamiento flexible con desembolso digital directo a tu cuenta bancaria en menos de 24 horas y sin necesidad de justificar el destino del dinero.',
    minAmount: 1000000,
    maxAmount: 60000000,
    annualInterestRate: 18.5,
    maxTermMonths: 60,
    badge: 'Más solicitado',
    requirements: [
      'Ser mayor de 21 años y residente en Colombia',
      'Ingresos mínimos demostrables de 1.5 SMMLV',
      'Cédula de ciudadanía digital o física vigente',
      'Certificado laboral o extractos bancarios de los últimos 3 meses',
    ],
    benefits: [
      'Aprobación 100% digital en minutos',
      'Tasa fija durante toda la vigencia del crédito',
      'Sin penalidad por abonos extraordinarios a capital',
    ],
  },
  {
    id: 'cred-vehiculo',
    name: 'Crédito Vehículo Eco & Urbano',
    category: 'vehiculo',
    shortDescription: 'Financia hasta el 90% de tu auto nuevo, usado o híbrido con tasa preferencial.',
    description:
      'Estrena carro o moto de alto cilindraje con plazos amplios, seguro todo riesgo integrado y descuento especial en tasa para vehículos híbridos y eléctricos.',
    minAmount: 10000000,
    maxAmount: 180000000,
    annualInterestRate: 14.2,
    maxTermMonths: 72,
    badge: 'Tasa verde',
    requirements: [
      'Edad entre 22 y 70 años',
      'Ingresos mensuales superiores a $2.500.000 COP',
      'Cotización del concesionario o carta de intención de compra',
      'Historial crediticio favorable sin reportes negativos vigentes',
    ],
    benefits: [
      'Hasta 72 meses de plazo con cuota fija',
      'Bono de -1.5% E.A. para vehículos eléctricos o híbridos',
      'Preaprobación válida por 45 días en cualquier concesionario',
    ],
  },
  {
    id: 'cred-vivienda',
    name: 'Crédito Hipotecario Vivienda',
    category: 'vivienda',
    shortDescription: 'Compra vivienda nueva o usada con la tasa más competitiva del mercado.',
    description:
      'Construye patrimonio propio con financiación en pesos a tasa fija. Compatible con subsidios de vivienda Mi Casa Ya y cajas de compensación.',
    minAmount: 30000000,
    maxAmount: 500000000,
    annualInterestRate: 11.4,
    maxTermMonths: 180,
    badge: 'Tasa baja',
    requirements: [
      'Ingresos familiares desde 2 SMMLV',
      'Ahorro previo equivalente al 20% o 30% de cuota inicial',
      'Certificado de tradición y libertad del inmueble',
      'Avalúo comercial certificado',
    ],
    benefits: [
      'Deducción de intereses en declaración de renta',
      'Posibilidad de consolidar ingresos con tu grupo familiar',
      'Estudio de títulos y avalúo acompañados por expertos',
    ],
  },
  {
    id: 'cred-educativo',
    name: 'Crédito Educativo Futuro',
    category: 'educativo',
    shortDescription: 'Impulsa tu pregrado, posgrado, maestría o bootcamp tecnológico.',
    description:
      'Invierte en tu crecimiento profesional con desembolsos semestrales directos a la institución educativa en Colombia o en el exterior.',
    minAmount: 1500000,
    maxAmount: 80000000,
    annualInterestRate: 12.8,
    maxTermMonths: 48,
    requirements: [
      'Orden de matrícula o carta de admisión de la institución',
      'Documento de identidad del estudiante y/o responsable financiero',
      'Comprobante de ingresos del solicitante o respaldo familiar',
    ],
    benefits: [
      'Giro directo a la universidad o academia',
      'Renovación automática cada semestre en 2 clics',
      'Tasa preferencial para carreras STEM y posgrados',
    ],
  },
  {
    id: 'cred-empresarial',
    name: 'Crédito Impulso PyME',
    category: 'empresarial',
    shortDescription: 'Capital de trabajo, inventario o expansión tecnológica para tu empresa.',
    description:
      'Diseñado para emprendedores, freelancers y pequeñas empresas que necesitan liquidez operativa con respaldo institucional.',
    minAmount: 5000000,
    maxAmount: 250000000,
    annualInterestRate: 15.9,
    maxTermMonths: 60,
    badge: 'Para negocios',
    requirements: [
      'Cámara de Comercio con mínimo 12 meses de constitución',
      'RUT actualizado y estados financieros del último año',
      'Extractos bancarios empresariales de los últimos 6 meses',
    ],
    benefits: [
      'Periodo de gracia inicial de hasta 3 meses',
      'Asesoría financiera personalizada incluida',
      'Respaldo opcional con Fondo Nacional de Garantías (FNG)',
    ],
  },
  {
    id: 'cred-compra-cartera',
    name: 'Compra de Cartera Smart',
    category: 'cartera',
    shortDescription: 'Unifica tus deudas de otros bancos en una sola cuota mensual más baja.',
    description:
      'Trae los saldos de tus tarjetas de crédito y préstamos de otras entidades financieras, reduce tu tasa de interés y recupera flujo de caja.',
    minAmount: 2000000,
    maxAmount: 100000000,
    annualInterestRate: 13.5,
    maxTermMonths: 60,
    requirements: [
      'Certificación de deuda vigente de las entidades a unificar',
      'Ingresos demostrables mínimos de 2 SMMLV',
      'Buen comportamiento de pago en los últimos 6 meses',
    ],
    benefits: [
      'Unifica hasta 5 obligaciones financieras en una sola cuota',
      'Ahorro promedio del 28% en intereses mensuales',
      'Transferencia directa a tus otras entidades sin trámites físicos',
    ],
  },
];
