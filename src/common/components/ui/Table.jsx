import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Table = ({ data, columns, onEdit, onDelete, primaryKey = 'id', isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <p className="text-lg font-medium">No data found</p>
                <p className="text-sm opacity-70">Try adding a new entry.</p>
            </div>
        );
    }


    const primaryDisplayColumn = columns.find(c => c.isPrimary) || columns[0] || { key: primaryKey, header: 'ID' };
    const secondaryDisplayColumn = columns.find(c => c.isSecondary) || null;

    return (
        <div className="w-full">
            {/* --- Mobile Cards --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden px-4 pb-6">
                {data.map((item) => (
                    <div key={item[primaryKey]} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-3">
                            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{primaryDisplayColumn.header}</p>
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg truncate">{item[primaryDisplayColumn.key]}</h3>
                            {secondaryDisplayColumn && (
                                <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{item[secondaryDisplayColumn.key]}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-200 dark:border-slate-700 text-sm">
                            {columns.filter(c => !c.isPrimary && !c.isSecondary).slice(0, 4).map(col => (
                                <div key={col.key}>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{col.header}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{col.render ? col.render(item) : item[col.key]}</p>
                                </div>
                            ))}
                        </div>

                        {(onEdit || onDelete) && (
                            <div className="flex justify-end gap-2 mt-4">
                                {onEdit && (
                                    <button onClick={() => onEdit(item)} className="flex-1 flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-700/40 text-cyan-600 dark:text-cyan-400 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                        <PencilSquareIcon className="h-5 w-5" /> <span className="text-xs font-semibold">Edit</span>
                                    </button>
                                )}
                                {onDelete && (
                                    <button onClick={() => onDelete(item[primaryKey])} className="flex-1 flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-700/40 text-rose-600 dark:text-rose-400 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                        <TrashIcon className="h-5 w-5" /> <span className="text-xs font-semibold">Delete</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* --- Desktop Table --- */}
            <div className="hidden md:block">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    <table className="w-full table-auto border-collapse bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        {col.header}
                                    </th>
                                ))}
                                {(onEdit || onDelete) && (
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, idx) => (
                                <tr key={item[primaryKey]} className={`border-b border-slate-200 dark:border-slate-700 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'} hover:bg-slate-100 dark:hover:bg-slate-700/50 transition`}>
                                    {columns.map(col => (
                                        <td key={col.key} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 truncate">
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            {onEdit && <button onClick={() => onEdit(item)} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-400/10 transition-all active:scale-90"><PencilSquareIcon className="h-5 w-5" /></button>}
                                            {onDelete && <button onClick={() => onDelete(item[primaryKey])} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-400/10 transition-all active:scale-90"><TrashIcon className="h-5 w-5" /></button>}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar { height: 6px; width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>
        </div>
    );
};

export default Table;
