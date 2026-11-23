import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Car,
  GraduationCap,
  Home,
  Info,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { CreditCategory, CreditProduct } from '../types/credit';
import { formatCOP } from '../utils/finance';

interface CreditCardProps {
  credit: CreditProduct;
  onViewDetails?: (credit: CreditProduct) => void;
}

const CATEGORY_ICONS: Record<CreditCategory, React.ReactNode> = {
  personal: <Wallet className="h-6 w-6" />,
  vehiculo: <Car className="h-6 w-6" />,
  vivienda: <Home className="h-6 w-6" />,
  educativo: <GraduationCap className="h-6 w-6" />,
  empresarial: <Briefcase className="h-6 w-6" />,
  cartera: <RefreshCw className="h-6 w-6" />,
};

export const CreditCard: React.FC<CreditCardProps> = ({ credit, onViewDetails }) => {
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
      <div>
        {/* Header con Icono y Tasa */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            {CATEGORY_ICONS[credit.category]}
          </div>
          <div className="text-right">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {credit.annualInterestRate}% E.A.
            </span>
            {credit.badge && (
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {credit.badge}
              </p>
            )}
          </div>
        </div>

        {/* Título y descripción */}
        <h3 className="mt-4 text-lg font-bold text-slate-900">{credit.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{credit.shortDescription}</p>

        {/* Métricas clave */}
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5 text-xs">
          <div>
            <span className="block text-slate-500">Monto disponible</span>
            <span className="mt-0.5 block font-bold text-slate-900">
              {formatCOP(credit.minAmount)}
            </span>
            <span className="text-[11px] text-slate-500">
              hasta {formatCOP(credit.maxAmount)}
            </span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="block text-slate-500">Plazo máximo</span>
            <span className="mt-0.5 block text-sm font-bold text-slate-900">
              {credit.maxTermMonths} meses
            </span>
            <span className="text-[11px] text-slate-500">Cuota fija</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-6 flex items-center gap-2.5">
        {onViewDetails && (
          <button
            type="button"
            onClick={() => onViewDetails(credit)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Info className="h-4 w-4" />
            Requisitos
          </button>
        )}
        <Link
          to={`/simulador?creditId=${credit.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-600"
        >
          Simular y Solicitar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};
