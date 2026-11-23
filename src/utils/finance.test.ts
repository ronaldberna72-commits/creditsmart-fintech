import { describe, expect, it } from 'vitest';
import {
  annualToMonthlyRate,
  buildAmortizationSimulation,
  calculateMonthlyPayment,
  evaluateDebtToIncome,
  formatCOP,
} from './finance';

describe('Módulo financiero de CreditSmart', () => {
  it('convierte correctamente la Tasa Efectiva Anual (E.A.) a tasa mensual compuesta', () => {
    const monthly = annualToMonthlyRate(12);
    // (1.12)^(1/12) - 1 ≈ 0.00948879
    expect(monthly).toBeCloseTo(0.00948879, 6);
    expect(annualToMonthlyRate(0)).toBe(0);
  });

  it('calcula la cuota mensual francesa con precisión', () => {
    const payment = calculateMonthlyPayment(10_000_000, 18.5, 24);
    expect(payment).toBeGreaterThan(490_000);
    expect(payment).toBeLessThan(510_000);
  });

  it('maneja préstamos con tasa 0% dividiendo capital entre meses', () => {
    const payment = calculateMonthlyPayment(12_000_000, 0, 12);
    expect(payment).toBe(1_000_000);
  });

  it('genera una tabla de amortización que cierra exactamente en saldo $0', () => {
    const simulation = buildAmortizationSimulation(25_000_000, 15.9, 36);

    expect(simulation.schedule).toHaveLength(36);
    const firstRow = simulation.schedule[0];
    const lastRow = simulation.schedule[35];

    expect(firstRow.month).toBe(1);
    expect(firstRow.interest).toBeGreaterThan(0);
    expect(lastRow.month).toBe(36);
    expect(lastRow.remainingBalance).toBe(0);

    const sumPrincipal = simulation.schedule.reduce((acc, row) => acc + row.principal, 0);
    expect(sumPrincipal).toBeCloseTo(25_000_000, 2);
  });

  it('evalúa el indicador de capacidad de endeudamiento (DTI)', () => {
    expect(evaluateDebtToIncome(600_000, 3_000_000).level).toBe('optimo');
    expect(evaluateDebtToIncome(1_100_000, 3_000_000).level).toBe('moderado');
    expect(evaluateDebtToIncome(1_600_000, 3_000_000).level).toBe('alto');
  });

  it('formatea valores monetarios en pesos colombianos (COP)', () => {
    const formatted = formatCOP(1500000);
    expect(formatted).toContain('1.500.000');
  });
});
