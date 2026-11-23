import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-xl bg-slate-200" />
        <div className="h-6 w-24 rounded-full bg-slate-200" />
      </div>
      <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-full rounded bg-slate-100" />
      <div className="mt-1 h-4 w-5/6 rounded bg-slate-100" />
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <div className="h-10 rounded bg-slate-100" />
        <div className="h-10 rounded bg-slate-100" />
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-10 flex-1 rounded-xl bg-slate-200" />
        <div className="h-10 flex-1 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
};
