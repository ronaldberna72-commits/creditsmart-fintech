import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Building2, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginAsDemo, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDemo = (role: 'client' | 'admin') => {
    loginAsDemo(role);
    toast.success(
      role === 'admin'
        ? 'Sesión iniciada como Asesor de Riesgo (Admin).'
        : 'Sesión iniciada como Cliente Demo.'
    );
    navigate('/solicitudes');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isRegister) {
        await registerWithEmail(name, email, password);
        toast.success('Cuenta creada correctamente.');
      } else {
        await loginWithEmail(email, password);
        toast.success('Bienvenido de nuevo a CreditSmart.');
      }
      navigate('/solicitudes');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error de autenticación.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Acceso a CreditSmart</h1>
          <p className="mt-1 text-xs text-slate-500">
            Ingresa con acceso rápido Demo para explorar ambos roles o usa tus credenciales
          </p>
        </div>

        {/* Botones de Acceso Demo sin fricción */}
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => handleDemo('client')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <UserCheck className="h-4 w-4" />
            Entrar como Cliente Demo (1 clic)
          </button>
          <button
            type="button"
            onClick={() => handleDemo('admin')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
          >
            <ShieldCheck className="h-4 w-4" />
            Entrar como Asesor Admin Demo (1 clic)
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-medium uppercase text-slate-400">o con correo</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700">Nombre completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-700">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting
              ? 'Procesando...'
              : isRegister
              ? 'Crear cuenta'
              : 'Iniciar sesión con correo'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {isRegister ? 'Inicia sesión' : 'Regístrate gratis'}
          </button>
        </p>
      </div>
    </div>
  );
};
