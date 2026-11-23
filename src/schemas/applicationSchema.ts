import { z } from 'zod';

export const loanApplicationSchema = z.object({
  fullName: z
    .string()
    .min(5, 'Ingresa tu nombre completo (mínimo 5 caracteres)')
    .max(80, 'El nombre no puede superar 80 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo debe contener letras y espacios'),
  documentId: z
    .string()
    .min(6, 'La cédula debe tener entre 6 y 12 dígitos')
    .max(12, 'La cédula debe tener entre 6 y 12 dígitos')
    .regex(/^\d+$/, 'Ingresa solo números sin puntos ni guiones'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  phone: z
    .string()
    .min(10, 'Ingresa un número celular válido de 10 dígitos')
    .max(13, 'Número telefónico demasiado largo')
    .regex(/^\+?\d+$/, 'Solo se permiten números'),
  creditId: z.string().min(1, 'Selecciona un producto crediticio'),
  amount: z.coerce
    .number({ invalid_type_error: 'Ingresa un monto válido' })
    .min(500000, 'El monto mínimo es de $500.000 COP'),
  termMonths: z.coerce
    .number({ invalid_type_error: 'Selecciona un plazo' })
    .min(6, 'Plazo mínimo de 6 meses')
    .max(240, 'Plazo máximo de 240 meses'),
  purpose: z
    .string()
    .min(10, 'Describe brevemente el destino del crédito (mínimo 10 caracteres)')
    .max(300, 'Máximo 300 caracteres'),
  companyName: z
    .string()
    .min(2, 'Ingresa el nombre de tu empresa o actividad independiente')
    .max(80, 'Máximo 80 caracteres'),
  jobTitle: z
    .string()
    .min(2, 'Ingresa tu cargo u ocupación')
    .max(60, 'Máximo 60 caracteres'),
  monthlyIncome: z.coerce
    .number({ invalid_type_error: 'Ingresa tus ingresos mensuales' })
    .min(1000000, 'Los ingresos mínimos deben ser de $1.000.000 COP'),
});

export type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;
