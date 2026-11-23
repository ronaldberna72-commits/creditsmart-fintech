import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Briefcase,
  CheckCircle2,
  CreditCard as CreditIcon,
  RotateCcw,
  Send,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../hooks/useApplications';
import { useCredits } from '../hooks/useCredits';
import {
  LoanApplicationFormValues,
  loanApplicationSchema,
} from '../schemas/applicationSchema';
import {
  calculateMonthlyPayment,
  evaluateDebtToIncome,
  formatCOP,
} from '../utils/finance';

export const ApplyPage: React.FC = () => {
  const { credits } = useCredits();
  const { submitApplication } = useApplications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialCreditId = searchParams.get('creditId') || 'cred-libre-inversion';
  const initialAmount = Number(searchParams.get('amount')) || 10000000;
  const initialTerm = Number(searchParams.get('term')) || 36;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: user?.isDemo ? 'Ronald Martínez' : '',
      documentId: '',
      email: user?.email || '',
      phone: '',
      creditId: initialCreditId,
      amount: initialAmount,
      termMonths: initialTerm,
      purpose: '',
      companyName: '',
      jobTitle: '',
      monthlyIncome: 3500000,
    },
  });

  useEffect(() => {
    if (searchParams.get('creditId')) setValue('creditId', searchParams.get('creditId')!);
    if (searchParams.get('amount')) setValue('amount', Number(searchParams.get('amount')));
    if (searchParams.get('term')) setValue('termMonths', Number(searchParams.get('term')));
  }, [searchParams, setValue]);

  const watchedCreditId = watch('creditId');
  const watchedAmount = Number(watch('amount')) || 0;
  const watchedTerm = Number(watch('termMonths')) || 12;
  const watchedIncome = Number(watch('monthlyIncome')) || 0;

  const selectedProduct = useMemo(
    () => credits.find((c) => c.id === watchedCreditId) ?? credits[0],
    [credits, watchedCreditId]
  );

  const estimatedMonthlyPayment = useMemo(() => {
    const rate = selectedProduct?.annualInterestRate ?? 16;
    return calculateMonthlyPayment(watchedAmount, rate, watchedTerm);
  }, [watchedAmount, watchedTerm, selectedProduct]);

  const dtiAssessment = useMemo(
    () => evaluateDebtToIncome(estimatedMonthlyPayment, watchedIncome),
    [estimatedMonthlyPayment, watchedIncome]
  );

  const onSubmit = async (values: LoanApplicationFormValues) => {
    if (!selectedProduct) return;

    if (values.amount < selectedProduct.minAmount || values.amount > selectedProduct.maxAmount) {
      toast.error(
        `Para ${selectedProduct.name}, el monto debe estar entre ${formatCOP(
          selectedProduct.minAmount
        )} y ${formatCOP(selectedProduct.maxAmount)}.`
      );
      return;
    }

    try {
      const created = await submitApplication({
        userId: user?.uid ?? 'guest-user',
        fullName: values.fullName.trim(),
        documentId: values.documentId.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        creditId: selectedProduct.id,
        creditName: selectedProduct.name,
        amount: values.amount,
        termMonths: values.termMonths,
        annualInterestRate: selectedProduct.annualInterestRate,
        estimatedMonthlyPayment,
        purpose: values.purpose.trim(),
        companyName: values.companyName.trim(),
        jobTitle: values.jobTitle.trim(),
        monthlyIncome: values.monthlyIncome,
      });

      toast.success(`Solicitud ${created.id} radicada con éxito.`);
      reset();
      navigate('/solicitudes');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al enviar la solicitud.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-slate-900">Solicitud de Crédito Digital</h1>
        <p className="mt-2 text-sm text-slate-600">
          Completa tus datos personales, financieros y laborales. Validamos tu capacidad de pago en
          tiempo real antes de radicar.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Formulario */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8"
        >
          {/* Sección 1: Datos Personales */}
          <div>
            <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-bold text-slate-900">
              <User className="h-4 w-4 text-indigo-600" />
              1. Datos Personales
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder="Ej. Ronald Martínez"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Cédula de Ciudadanía *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  {...register('documentId')}
                  placeholder="Ej. 1045678912"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {errors.documentId && (
                  <p className="mt-1 text-xs text-rose-600">{errors.documentId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="usuario@correo.com"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Teléfono celular *
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="3104567890"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 2: Datos del Crédito */}
          <div>
            <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-bold text-slate-900">
              <CreditIcon className="h-4 w-4 text-indigo-600" />
              2. Condiciones del Crédito
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Tipo de crédito *
                </label>
                <select
                  {...register('creditId')}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                >
                  {credits.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Monto solicitado (COP) *
                </label>
                <input
                  type="number"
                  step={100000}
                  {...register('amount')}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {selectedProduct && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Rango: {formatCOP(selectedProduct.minAmount)} -{' '}
                    {formatCOP(selectedProduct.maxAmount)}
                  </p>
                )}
                {errors.amount && (
                  <p className="mt-1 text-xs text-rose-600">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Plazo en meses *
                </label>
                <select
                  {...register('termMonths')}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                >
                  {[12, 24, 36, 48, 60, 72, 120].map((m) => (
                    <option key={m} value={m}>
                      {m} meses
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Destino del crédito *
                </label>
                <textarea
                  rows={3}
                  {...register('purpose')}
                  placeholder="Cuéntanos brevemente en qué invertirás este crédito..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {errors.purpose && (
                  <p className="mt-1 text-xs text-rose-600">{errors.purpose.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 3: Datos Laborales */}
          <div>
            <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-bold text-slate-900">
              <Briefcase className="h-4 w-4 text-indigo-600" />
              3. Información Laboral y Financiera
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Empresa / Actividad *
                </label>
                <input
                  type="text"
                  {...register('companyName')}
                  placeholder="Ej. TechNova S.A.S"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-rose-600">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Cargo u ocupación *
                </label>
                <input
                  type="text"
                  {...register('jobTitle')}
                  placeholder="Ej. Ingeniero de Software"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {errors.jobTitle && (
                  <p className="mt-1 text-xs text-rose-600">{errors.jobTitle.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Ingresos mensuales (COP) *
                </label>
                <input
                  type="number"
                  step={100000}
                  {...register('monthlyIncome')}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
                />
                {errors.monthlyIncome && (
                  <p className="mt-1 text-xs text-rose-600">{errors.monthlyIncome.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar formulario
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Radicando solicitud...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>

        {/* Resumen en Tiempo Real */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Resumen previo al envío
            </span>
            <h3 className="mt-1 text-lg font-extrabold text-slate-900">
              {selectedProduct?.name ?? 'Selecciona un producto'}
            </h3>

            <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white">
              <span className="text-xs text-slate-400">Cuota mensual estimada</span>
              <p className="mt-0.5 text-2xl font-extrabold text-emerald-400">
                {formatCOP(estimatedMonthlyPayment)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Tasa: {selectedProduct?.annualInterestRate ?? 0}% E.A. · Plazo: {watchedTerm} meses
              </p>
            </div>

            <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-xs">
              <div className="flex justify-between">
                <dt className="text-slate-500">Monto solicitado</dt>
                <dd className="font-bold text-slate-900">{formatCOP(watchedAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Ingresos declarados</dt>
                <dd className="font-bold text-slate-900">{formatCOP(watchedIncome)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Relación Cuota / Ingreso</dt>
                <dd className="font-bold text-slate-900">{dtiAssessment.ratioPercent}%</dd>
              </div>
            </dl>

            {/* Indicador de Capacidad de Endeudamiento */}
            <div
              className={`mt-4 rounded-xl border p-3 text-xs ${
                dtiAssessment.level === 'optimo'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : dtiAssessment.level === 'moderado'
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              <p className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {dtiAssessment.label}
              </p>
              <p className="mt-1 text-[11px] opacity-90">
                Se recomienda que la cuota mensual no supere el 35% de tus ingresos netos.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
