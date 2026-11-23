export type CreditCategory =
  | 'personal'
  | 'vehiculo'
  | 'vivienda'
  | 'educativo'
  | 'empresarial'
  | 'cartera';

export interface CreditProduct {
  id: string;
  name: string;
  category: CreditCategory;
  shortDescription: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  annualInterestRate: number; // Tasa Efectiva Anual (%)
  maxTermMonths: number;
  requirements: string[];
  benefits: string[];
  badge?: string;
}

export type ApplicationStatus =
  | 'Pendiente'
  | 'En estudio'
  | 'Aprobado'
  | 'Rechazado'
  | 'Cancelado';

export interface LoanApplication {
  id: string;
  userId: string;
  // Datos personales
  fullName: string;
  documentId: string;
  email: string;
  phone: string;
  // Datos del crédito
  creditId: string;
  creditName: string;
  amount: number;
  termMonths: number;
  annualInterestRate: number;
  estimatedMonthlyPayment: number;
  purpose: string;
  // Datos laborales
  companyName: string;
  jobTitle: string;
  monthlyIncome: number;
  // Metadatos de gestión
  status: ApplicationStatus;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateLoanApplicationDTO = Omit<
  LoanApplication,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface SimulationSummary {
  amount: number;
  termMonths: number;
  annualRate: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export type UserRole = 'client' | 'admin';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  isDemo?: boolean;
}
