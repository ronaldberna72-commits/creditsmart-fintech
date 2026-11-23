import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CreditCard } from '../components/CreditCard';
import { CreditDetailModal } from '../components/CreditDetailModal';
import { SkeletonCard } from '../components/SkeletonCard';
import { useCredits } from '../hooks/useCredits';
import { CreditProduct } from '../types/credit';

export const HomePage: React.FC = () => {
  const { credits, loading, error, refetch } = useCredits();
  const [selectedCredit, setSelectedCredit] = useState<CreditProduct | null>(null);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4f46e5_0%,transparent_45%)] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              FinTech Solutions S.A.S · Crédito Digital Transparente
            </div>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Financia tus metas con{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                tasas claras y sin letra pequeña
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              Explora nuestro portafolio de líneas de crédito, proyecta tu tabla de amortización en
              tiempo real y radica tu solicitud en línea en menos de 3 minutos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                to="/simulador"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
              >
                <Calculator className="h-4 w-4" />
                Ir al Simulador de Crédito
              </Link>
              <Link
                to="/solicitar"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Solicitar ahora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Sin cobros ocultos ni estudios pagos
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                Tasa fija garantizada en pesos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo de Créditos */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Catálogo de Productos Crediticios
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Selecciona la línea de financiación que mejor se adapte a tu proyecto personal o
              empresarial.
            </p>
          </div>
          <Link
            to="/simulador"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Filtrar y comparar tasas →
          </Link>
        </div>

        {/* Estado de Error */}
        {error && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 sm:flex-row">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 shrink-0 text-rose-600" />
              <div>
                <p className="font-bold">Error de conexión</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </button>
          </div>
        )}

        {/* Skeletons o Grid de Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
            : credits.map((credit) => (
                <CreditCard
                  key={credit.id}
                  credit={credit}
                  onViewDetails={(c) => setSelectedCredit(c)}
                />
              ))}
        </div>
      </section>

      <CreditDetailModal credit={selectedCredit} onClose={() => setSelectedCredit(null)} />
    </div>
  );
};
