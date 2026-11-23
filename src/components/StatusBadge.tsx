import React from 'react';
import { ApplicationStatus } from '../types/credit';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  'En estudio': 'bg-blue-50 text-blue-700 border-blue-200',
  Aprobado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rechazado: 'bg-rose-50 text-rose-700 border-rose-200',
  Cancelado: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
};
