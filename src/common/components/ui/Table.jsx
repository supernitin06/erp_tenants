import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Table = ({ data, columns, onEdit, onDelete, primaryKey = 'id' }) => {
    if (!data?.length) {
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
            {/* --- Mobile View: Cards (Visible only on small screens) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden px-4 pb-6">
                {data.map((item) => (
                    <div key={item[primaryKey]} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{primaryDisplayColumn.header}</p>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg">{item[primaryDisplayColumn.key]}</h3>
                                {secondaryDisplayColumn && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{item[secondaryDisplayColumn.key]}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-200 dark:border-slate-700/50 text-sm">
                            {columns.filter(c => !c.isPrimary && !c.isSecondary).slice(0, 4).map(col => (
                                <div key={col.key}>
                                    <p className="text-slate-500 dark:text-slate-500 text-xs uppercase font-semibold">{col.header}</p>
                                    <p className="text-slate-700 dark:text-slate-300 truncate">{col.render ? col.render(item) : item[col.key]}</p>
                                </div>
                            ))}
                        </div>

                        {(onEdit || onDelete) && (
                            <div className="flex justify-end gap-2 mt-4">
                                {onEdit && (
                                    <button onClick={() => onEdit(item)} className="flex-1 flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-700/50 text-cyan-600 dark:text-cyan-400 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                        <PencilSquareIcon className="h-5 w-5" /> <span className="text-xs font-bold">Edit</span>
                                    </button>
                                )}
                                {onDelete && (
                                    <button onClick={() => onDelete(item[primaryKey])} className="flex-1 flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-700/50 text-rose-600 dark:text-rose-400 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                        <TrashIcon className="h-5 w-5" /> <span className="text-xs font-bold">Delete</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* --- Desktop View: Table (Hidden on mobile) --- */}
            <div className="hidden md:block">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    <table className="w-full divide-y divide-slate-200 dark:divide-slate-700 border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} className="table-head">
                                        {col.header}
                                    </th>
                                ))}
                                {(onEdit || onDelete) && (
                                    <th className="table-head text-right">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {data.map((item) => (
                                <tr key={item[primaryKey]} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-200">
                                    {columns.map(col => (
                                        <td key={col.key} className={`table-cell ${col.className || 'text-slate-600 dark:text-slate-300'}`}>
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="table-cell text-right whitespace-nowrap">
                                            <div className="flex justify-end space-x-1">
                                                {onEdit && (
                                                    <button onClick={() => onEdit(item)} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-400/10 transition-all active:scale-90"><PencilSquareIcon className="h-5 w-5" /></button>
                                                )}
                                                {onDelete && (
                                                    <button onClick={() => onDelete(item[primaryKey])} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-400/10 transition-all active:scale-90"><TrashIcon className="h-5 w-5" /></button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .table-head { padding: 16px 20px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
                .dark .table-head { color: #94a3b8; }
                .table-cell { padding: 14px 20px; font-size: 14px; }
                .scrollbar-thin::-webkit-scrollbar { height: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>
        </div>
    );
};

export default Table;