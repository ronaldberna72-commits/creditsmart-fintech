import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  Calculator,
  ClipboardList,
  FilePlus2,
  LogOut,
  Menu,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../config/firebase';

export const Navbar: React.FC = () => {
  const { user, loginAsDemo, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const handleRoleSwitch = () => {
    if (!user) return;
    const nextRole = user.role === 'client' ? 'admin' : 'client';
    loginAsDemo(nextRole);
    navigate('/solicitudes');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Credit<span className="text-indigo-600">Smart</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="text-[11px] font-medium text-slate-500">
                {isFirebaseConfigured ? 'Firebase Cloud' : 'Modo Demo Local'}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Catálogo
          </NavLink>
          <NavLink to="/simulador" className={navLinkClass}>
            <Calculator className="h-4 w-4" />
            Simulador
          </NavLink>
          <NavLink to="/solicitar" className={navLinkClass}>
            <FilePlus2 className="h-4 w-4" />
            Solicitar Crédito
          </NavLink>
          <NavLink to="/solicitudes" className={navLinkClass}>
            <ClipboardList className="h-4 w-4" />
            {user?.role === 'admin' ? 'Panel Asesor' : 'Mis Solicitudes'}
          </NavLink>
        </nav>

        {/* User & Role Switcher */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <button
                onClick={handleRoleSwitch}
                title="Alternar vista entre Cliente y Asesor Financiero"
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  user.role === 'admin'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {user.role === 'admin' ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Rol: Asesor Admin
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    Rol: Cliente
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-1.5">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Catálogo de Créditos
            </NavLink>
            <NavLink to="/simulador" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <Calculator className="h-4 w-4" />
              Simulador Financiero
            </NavLink>
            <NavLink to="/solicitar" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <FilePlus2 className="h-4 w-4" />
              Solicitar Crédito
            </NavLink>
            <NavLink
              to="/solicitudes"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <ClipboardList className="h-4 w-4" />
              {user?.role === 'admin' ? 'Panel Asesor' : 'Mis Solicitudes'}
            </NavLink>
          </div>
          {user && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  handleRoleSwitch();
                  setMobileOpen(false);
                }}
                className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
              >
                Cambiar a {user.role === 'client' ? 'Asesor Admin' : 'Cliente'}
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  navigate('/login');
                }}
                className="text-xs font-medium text-rose-600"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
