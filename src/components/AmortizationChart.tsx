import React from 'react';
import { formatCOP } from '../utils/finance';

interface AmortizationChartProps {
  principal: number;
  totalInterest: number;
}

export const AmortizationChart: React.FC<AmortizationChartProps> = ({
  principal,
  totalInterest,
}) => {
  const total = principal + totalInterest;
  const principalPercent = total > 0 ? Math.round((principal / total) * 100) : 100;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>Composición total del pago</span>
        <span>{formatCOP(total)}</span>
      </div>

      {/* Barra apilada proporcional */}
      <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          style={{ width: `${principalPercent}%` }}
          className="bg-indigo-600 transition-all duration-300"
          title={`Capital: ${principalPercent}%`}
        />
        <div
          style={{ width: `${interestPercent}%` }}
          className="bg-amber-500 transition-all duration-300"
          title={`Intereses: ${interestPercent}%`}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-indigo-600" />
          <div>
            <p className="text-slate-500">Capital ({principalPercent}%)</p>
            <p className="font-bold text-slate-900">{formatCOP(principal)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-amber-500" />
          <div>
            <p className="text-slate-500">Intereses ({interestPercent}%)</p>
            <p className="font-bold text-slate-900">{formatCOP(totalInterest)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
