import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { AmortizationRow } from '../types/credit';
import { formatCOP } from '../utils/finance';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  creditName: string;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  schedule,
  creditName,
}) => {
  const [expanded, setExpanded] = useState(false);

  const visibleRows = expanded ? schedule : schedule.slice(0, 6);

  const exportCsv = () => {
    const header = 'Cuota,Pago Mensual,Abono Capital,Intereses,Saldo Restante\n';
    const rows = schedule
      .map(
        (r) =>
          `${r.month},${Math.round(r.payment)},${Math.round(r.principal)},${Math.round(
            r.interest
          )},${Math.round(r.remainingBalance)}`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `amortizacion-${creditName.toLowerCase().replace(/\s+/g, '-')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Tabla de Amortización (Sistema Francés)
          </h3>
          <p className="text-xs text-slate-500">
            Proyección detallada mes a mes de abono a capital e intereses ({schedule.length} cuotas)
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Mes</th>
              <th className="px-4 py-3">Cuota Fija</th>
              <th className="px-4 py-3">Abono Capital</th>
              <th className="px-4 py-3">Intereses</th>
              <th className="px-4 py-3 text-right">Saldo Restante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleRows.map((row) => (
              <tr key={row.month} className="hover:bg-slate-50/80">
                <td className="px-4 py-2.5 font-semibold text-slate-900">#{row.month}</td>
                <td className="px-4 py-2.5 font-medium text-slate-800">
                  {formatCOP(row.payment)}
                </td>
                <td className="px-4 py-2.5 font-medium text-emerald-700">
                  {formatCOP(row.principal)}
                </td>
                <td className="px-4 py-2.5 text-amber-700">{formatCOP(row.interest)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-900">
                  {formatCOP(row.remainingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedule.length > 6 && (
        <div className="border-t border-slate-100 px-5 py-3 text-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Mostrar resumen (primeros 6 meses)
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Ver las {schedule.length} cuotas completas
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
