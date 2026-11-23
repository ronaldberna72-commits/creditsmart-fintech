import React from 'react';
import { Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold text-slate-800">
            CreditSmart FinTech Solutions S.A.S
          </p>
          <p className="text-xs text-slate-500">
            Simulación financiera transparente bajo sistema de amortización francés.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-emerald-600" />
            Vigilado · Estándar FinTech
          </span>
          <span className="flex items-center gap-1">
            <Lock className="h-4 w-4 text-indigo-600" />
            Cifrado TLS & Reglas Firestore
          </span>
        </div>
      </div>
    </footer>
  );
};
