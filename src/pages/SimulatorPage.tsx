import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  FilterX,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { AmortizationChart } from '../components/AmortizationChart';
import { AmortizationTable } from '../components/AmortizationTable';
import { CreditCard } from '../components/CreditCard';
import { CreditDetailModal } from '../components/CreditDetailModal';
import { useCredits } from '../hooks/useCredits';
import { CreditProduct } from '../types/credit';
import { buildAmortizationSimulation, formatCOP } from '../utils/finance';

type AmountRangeFilter = 'all' | 'under-10m' | '10m-50m' | 'over-50m';
type SortOrder = 'rate-asc' | 'rate-desc' | 'amount-desc';

export const SimulatorPage: React.FC = () => {
  const { credits, loading } = useCredits();
  const [searchParams] = useSearchParams();

  // Filtros del catálogo
  const [searchTerm, setSearchTerm] = useState('');
  const [amountRange, setAmountRange] = useState<AmountRangeFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('rate-asc');
  const [modalCredit, setModalCredit] = useState<CreditProduct | null>(null);

  // Estado del simulador interactivo
  const [selectedCreditId, setSelectedCreditId] = useState<string>('cred-libre-inversion');
  const [simAmount, setSimAmount] = useState<number>(15000000);
  const [simMonths, setSimMonths] = useState<number>(36);

  useEffect(() => {
    const paramCreditId = searchParams.get('creditId');
    if (paramCreditId && credits.some((c) => c.id === paramCreditId)) {
      setSelectedCreditId(paramCreditId);
      const found = credits.find((c) => c.id === paramCreditId);
      if (found) {
        setSimAmount(Math.min(Math.max(found.minAmount, 15000000), found.maxAmount));
        setSimMonths(Math.min(36, found.maxTermMonths));
      }
    }
  }, [searchParams, credits]);

  const activeCredit = useMemo(
    () => credits.find((c) => c.id === selectedCreditId) ?? credits[0],
    [credits, selectedCreditId]
  );

  // Ajustar monto y plazo si cambia el producto seleccionado
  const handleSelectProductForSim = (product: CreditProduct) => {
    setSelectedCreditId(product.id);
    setSimAmount((prev) => Math.min(Math.max(prev, product.minAmount), product.maxAmount));
    setSimMonths((prev) => Math.min(prev, product.maxTermMonths));
  };

  // Filtrado y ordenamiento en tiempo real
  const filteredCredits = useMemo(() => {
    return credits
      .filter((item) => {
        const matchesText =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesText) return false;

        if (amountRange === 'under-10m') return item.minAmount <= 10000000;
        if (amountRange === '10m-50m')
          return item.maxAmount >= 10000000 && item.minAmount <= 50000000;
        if (amountRange === 'over-50m') return item.maxAmount > 50000000;
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'rate-asc') return a.annualInterestRate - b.annualInterestRate;
        if (sortOrder === 'rate-desc') return b.annualInterestRate - a.annualInterestRate;
        return b.maxAmount - a.maxAmount;
      });
  }, [credits, searchTerm, amountRange, sortOrder]);

  const simulation = useMemo(() => {
    const rate = activeCredit?.annualInterestRate ?? 15;
    return buildAmortizationSimulation(simAmount, rate, simMonths);
  }, [simAmount, simMonths, activeCredit]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <Calculator className="h-3.5 w-3.5" />
          Simulador Financiero Interactivo
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
          Calcula tu cuota mensual y tabla de amortización
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Ajusta el monto y el plazo para conocer el valor exacto de tu cuota fija, los intereses
          totales y el calendario de pagos.
        </p>
      </div>

      {/* Panel Principal del Simulador */}
      {activeCredit && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
            <h2 className="text-base font-bold text-slate-900">Configura tu préstamo</h2>

            <div className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Línea de crédito
                </label>
                <select
                  value={activeCredit.id}
                  onChange={(e) => {
                    const found = credits.find((c) => c.id === e.target.value);
                    if (found) handleSelectProductForSim(found);
                  }}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                >
                  {credits.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.annualInterestRate}% E.A.)
                    </option>
                  ))}
                </select>
              </div>

              {/* Monto Slider */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Monto a solicitar
                  </label>
                  <span className="text-base font-extrabold text-indigo-600">
                    {formatCOP(simAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={activeCredit.minAmount}
                  max={activeCredit.maxAmount}
                  step={500000}
                  value={simAmount}
                  onChange={(e) => setSimAmount(Number(e.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>{formatCOP(activeCredit.minAmount)}</span>
                  <span>{formatCOP(activeCredit.maxAmount)}</span>
                </div>
              </div>

              {/* Plazo en meses */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Plazo en meses
                  </label>
                  <span className="text-sm font-bold text-slate-900">{simMonths} meses</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[12, 24, 36, 48, 60, 72, 120, 180]
                    .filter((m) => m <= activeCredit.maxTermMonths)
                    .slice(0, 8)
                    .map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setSimMonths(months)}
                        className={`rounded-lg border py-2 text-xs font-semibold transition ${
                          simMonths === months
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {months} m
                      </button>
                    ))}
                </div>
              </div>

              <AmortizationChart
                principal={simulation.amount}
                totalInterest={simulation.totalInterest}
              />
            </div>
          </div>

          {/* Resultados y Tabla */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                    Cuota mensual fija estimada
                  </span>
                  <p className="mt-1 text-3xl font-extrabold sm:text-4xl">
                    {formatCOP(simulation.monthlyPayment)}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Tasa: {simulation.annualRate}% E.A. ({simulation.monthlyRate.toFixed(2)}% N.M.V.)
                  </p>
                </div>

                <Link
                  to={`/solicitar?creditId=${activeCredit.id}&amount=${simAmount}&term=${simMonths}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-md transition hover:bg-emerald-400"
                >
                  Solicitar con estas condiciones
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <AmortizationTable schedule={simulation.schedule} creditName={activeCredit.name} />
          </div>
        </div>
      )}

      {/* Buscador y Filtros Dinámicos del Catálogo */}
      <section className="mt-16 border-t border-slate-200 pt-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Búsqueda y Comparador de Líneas de Crédito
            </h2>
            <p className="text-xs text-slate-500">
              Filtra por nombre, rango de monto o menor tasa de interés
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Mostrando {filteredCredits.length} de {credits.length} productos
          </span>
        </div>

        {/* Barra de controles */}
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre (ej. Vivienda, Vehículo)..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={amountRange}
              onChange={(e) => setAmountRange(e.target.value as AmountRangeFilter)}
              aria-label="Filtrar por rango de monto"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-indigo-600 focus:outline-none"
            >
              <option value="all">Todos los rangos de monto</option>
              <option value="under-10m">Desde $1M hasta $10M</option>
              <option value="10m-50m">Entre $10M y $50M</option>
              <option value="over-50m">Más de $50M</option>
            </select>
          </div>

          <div className="flex items-center gap-2 md:col-span-3">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              aria-label="Ordenar resultados"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-600 focus:outline-none"
            >
              <option value="rate-asc">Tasa: Menor a Mayor</option>
              <option value="rate-desc">Tasa: Mayor a Menor</option>
              <option value="amount-desc">Mayor Cupo Disponible</option>
            </select>
          </div>
        </div>

        {/* Resultados */}
        {!loading && filteredCredits.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <FilterX className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-base font-bold text-slate-900">No hay créditos disponibles</h3>
            <p className="mt-1 text-sm text-slate-500">
              Ningún producto coincide con los filtros actuales. Prueba ampliando el rango de
              monto.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setAmountRange('all');
                setSortOrder('rate-asc');
              }}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCredits.map((credit) => (
              <CreditCard
                key={credit.id}
                credit={credit}
                onViewDetails={(c) => setModalCredit(c)}
              />
            ))}
          </div>
        )}
      </section>

      <CreditDetailModal credit={modalCredit} onClose={() => setModalCredit(null)} />
    </div>
  );
};
