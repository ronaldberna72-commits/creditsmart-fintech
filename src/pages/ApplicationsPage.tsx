import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CheckCircle,
  Clock,
  FilePlus2,
  RefreshCw,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../hooks/useApplications';
import { ApplicationStatus } from '../types/credit';
import { formatCOP } from '../utils/finance';

export const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const { applications, loading, error, refetch, changeStatus, removeApplication } =
    useApplications();

  const isAdmin = user?.role === 'admin';

  const kpis = useMemo(() => {
    const totalRequested = applications.reduce((acc, a) => acc + a.amount, 0);
    const approvedCount = applications.filter((a) => a.status === 'Aprobado').length;
    const pendingCount = applications.filter(
      (a) => a.status === 'Pendiente' || a.status === 'En estudio'
    ).length;

    return { totalRequested, approvedCount, pendingCount };
  }, [applications]);

  const handleStatusUpdate = async (id: string, nextStatus: ApplicationStatus) => {
    try {
      await changeStatus(id, nextStatus);
      toast.success(`Solicitud ${id} actualizada a "${nextStatus}".`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeApplication(id);
      toast.success(`Solicitud ${id} eliminada del sistema.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {isAdmin ? 'Panel de Gestión de Riesgo (Asesor)' : 'Mis Solicitudes de Crédito'}
            </h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                Vista Admin
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {isAdmin
              ? 'Evalúa, aprueba, rechaza o audita todas las solicitudes radicadas en la plataforma.'
              : 'Consulta el estado en tiempo real de tus solicitudes de crédito.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <Link
            to="/solicitar"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <FilePlus2 className="h-4 w-4" />
            Nueva Solicitud
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Monto Total Solicitado</span>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {formatCOP(kpis.totalRequested)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">En Proceso / Pendientes</span>
          <p className="mt-1 text-2xl font-extrabold text-amber-600">{kpis.pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Créditos Aprobados</span>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600">{kpis.approvedCount}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Listado */}
      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Clock className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-bold text-slate-900">
            Aún no hay solicitudes registradas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Simula un crédito y envía tu primera solicitud para verla reflejada aquí.
          </p>
          <Link
            to="/solicitar"
            className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Crear mi primera solicitud
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-indigo-600">{app.id}</span>
                  <h3 className="text-base font-bold text-slate-900">{app.creditName}</h3>
                  <StatusBadge status={app.status} />
                </div>

                <p className="text-xs text-slate-600">
                  Solicitante: <strong className="text-slate-800">{app.fullName}</strong> · CC{' '}
                  {app.documentId} · {app.companyName} ({app.jobTitle})
                </p>

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-500">
                  <span>
                    Monto: <strong className="text-slate-900">{formatCOP(app.amount)}</strong>
                  </span>
                  <span>
                    Plazo: <strong className="text-slate-900">{app.termMonths} meses</strong>
                  </span>
                  <span>
                    Cuota est.:{' '}
                    <strong className="text-indigo-700">
                      {formatCOP(app.estimatedMonthlyPayment)}
                    </strong>
                  </span>
                  <span>
                    Ingresos: <strong className="text-slate-900">{formatCOP(app.monthlyIncome)}</strong>
                  </span>
                </div>

                {app.reviewerNotes && (
                  <p className="mt-1 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                    <strong>Nota de análisis:</strong> {app.reviewerNotes}
                  </p>
                )}
              </div>

              {/* Acciones según Rol */}
              <div className="flex flex-wrap items-center gap-2">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'En estudio')}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      En estudio
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'Aprobado')}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'Rechazado')}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      title="Eliminar registro"
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  app.status === 'Pendiente' && (
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'Cancelado')}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar solicitud
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
