import { AmortizationRow, SimulationSummary } from '../types/credit';

/**
 * Formatea un valor numérico a moneda colombiana (COP) sin decimales.
 */
export function formatCOP(amount: number): string {
  if (!Number.isFinite(amount)) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Convierte una Tasa Efectiva Anual (E.A. %) a Tasa Nominal Mes Vencido (N.M.V. decimal).
 * Fórmula financiera estándar: i_m = (1 + EA)^(1/12) - 1
 */
export function annualToMonthlyRate(annualRatePercent: number): number {
  if (annualRatePercent <= 0) return 0;
  const effectiveAnnual = annualRatePercent / 100;
  return Math.pow(1 + effectiveAnnual, 1 / 12) - 1;
}

/**
 * Calcula la cuota mensual fija bajo el sistema de amortización francés.
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const monthlyRate = annualToMonthlyRate(annualRatePercent);

  if (monthlyRate === 0) {
    return principal / termMonths;
  }

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

/**
 * Genera el resumen completo de simulación y la tabla de amortización mes a mes.
 */
export function buildAmortizationSimulation(
  amount: number,
  annualRatePercent: number,
  termMonths: number
): SimulationSummary {
  const safeAmount = Math.max(0, amount);
  const safeMonths = Math.max(1, Math.floor(termMonths));
  const monthlyRate = annualToMonthlyRate(annualRatePercent);
  const monthlyPayment = calculateMonthlyPayment(safeAmount, annualRatePercent, safeMonths);

  const schedule: AmortizationRow[] = [];
  let remainingBalance = safeAmount;
  let totalInterest = 0;

  for (let month = 1; month <= safeMonths; month++) {
    const interest = remainingBalance * monthlyRate;
    let principal = monthlyPayment - interest;

    // Ajuste en la última cuota para evitar residuos por redondeo flotante
    if (month === safeMonths || principal > remainingBalance) {
      principal = remainingBalance;
    }

    const actualPayment = principal + interest;
    remainingBalance = Math.max(0, remainingBalance - principal);
    totalInterest += interest;

    schedule.push({
      month,
      payment: actualPayment,
      principal,
      interest,
      remainingBalance,
    });
  }

  return {
    amount: safeAmount,
    termMonths: safeMonths,
    annualRate: annualRatePercent,
    monthlyRate: monthlyRate * 100,
    monthlyPayment,
    totalPayment: safeAmount + totalInterest,
    totalInterest,
    schedule,
  };
}

/**
 * Evalúa la relación cuota/ingreso (capacidad de endeudamiento recomendada <= 35%).
 */
export function evaluateDebtToIncome(monthlyPayment: number, monthlyIncome: number): {
  ratioPercent: number;
  level: 'optimo' | 'moderado' | 'alto';
  label: string;
} {
  if (monthlyIncome <= 0) {
    return { ratioPercent: 0, level: 'moderado', label: 'Ingresa tus ingresos para evaluar' };
  }
  const ratio = (monthlyPayment / monthlyIncome) * 100;
  if (ratio <= 30) {
    return {
      ratioPercent: Number(ratio.toFixed(1)),
      level: 'optimo',
      label: 'Capacidad de pago óptima',
    };
  }
  if (ratio <= 42) {
    return {
      ratioPercent: Number(ratio.toFixed(1)),
      level: 'moderado',
      label: 'Endeudamiento moderado',
    };
  }
  return {
    ratioPercent: Number(ratio.toFixed(1)),
    level: 'alto',
    label: 'Cuota alta respecto a ingresos',
  };
}
