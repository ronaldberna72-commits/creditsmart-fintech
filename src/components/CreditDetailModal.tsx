import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileCheck, X } from 'lucide-react';
import { CreditProduct } from '../types/credit';
import { formatCOP } from '../utils/finance';

interface CreditDetailModalProps {
  credit: CreditProduct | null;
  onClose: () => void;
}

export const CreditDetailModal: React.FC<CreditDetailModalProps> = ({ credit, onClose }) => {
  if (!credit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Tasa {credit.annualInterestRate}% Efectiva Anual
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{credit.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600">{credit.description}</p>

        <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
          <div>
            <span className="text-xs text-slate-500">Monto Mínimo</span>
            <p className="text-sm font-bold text-slate-900">{formatCOP(credit.minAmount)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Monto Máximo</span>
            <p className="text-sm font-bold text-slate-900">{formatCOP(credit.maxAmount)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Plazo Máximo</span>
            <p className="text-sm font-bold text-slate-900">{credit.maxTermMonths} meses</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FileCheck className="h-4 w-4 text-indigo-600" />
              Requisitos mínimos
            </h4>
            <ul className="mt-3 space-y-2">
              {credit.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Beneficios incluidos
            </h4>
            <ul className="mt-3 space-y-2">
              {credit.benefits.map((ben, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  {ben}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
          <Link
            to={`/solicitar?creditId=${credit.id}`}
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Solicitar este crédito
          </Link>
        </div>
      </div>
    </div>
  );
};
