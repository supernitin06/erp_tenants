import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/* Small shared building blocks for the organisation administration pages. */

export const PageHeader = ({ title, subtitle, action }) => (
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{subtitle}</p>}
        </div>
        {action}
    </header>
);

export const Card = ({ className = '', children }) => (
    <div className={`bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none ${className}`}>
        {children}
    </div>
);

export const PrimaryButton = ({ children, className = '', ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

export const GhostButton = ({ children, className = '', ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

export const Badge = ({ tone = 'slate', children }) => {
    const tones = {
        slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
};

export const Field = ({ label, hint, children }) => (
    <label className="block">
        <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{label}</span>
        {children}
        {hint && <span className="block text-[11px] text-slate-400 mt-1">{hint}</span>}
    </label>
);

export const inputClass =
    'w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20';

export const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

export const EmptyRow = ({ colSpan, children }) => (
    <tr>
        <td colSpan={colSpan} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">{children}</td>
    </tr>
);

export const TableShell = ({ headers, children }) => (
    <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    {headers.map((h) => (
                        <th key={h} className={`px-5 py-3 font-semibold ${h === '' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>
        </table>
    </Card>
);
