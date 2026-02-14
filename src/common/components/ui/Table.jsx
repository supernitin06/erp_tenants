import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Table = ({ students, onEdit, onDelete }) => {
    if (!students?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <p className="text-lg font-medium">No students found</p>
                <p className="text-sm opacity-70">Click "Add New Student" to create one.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* --- Mobile View: Cards (Visible only on small screens) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden px-4 pb-6">
                {students.map((student) => (
                    <div key={student.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">#{student.studentId}</span>
                                <h3 className="text-white font-bold text-lg">{student.firstName} {student.lastName}</h3>
                                <p className="text-slate-400 text-sm">{student.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-md ${student.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                {student.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-700/50 text-sm">
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold">Phone</p>
                                <p className="text-slate-300">{student.phone}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold">Gender</p>
                                <p className="text-slate-300">{student.gender}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => onEdit(student)} className="flex-1 flex justify-center items-center gap-2 bg-slate-700/50 text-cyan-400 p-2 rounded-lg hover:bg-slate-700 transition">
                                <PencilSquareIcon className="h-5 w-5" /> <span className="text-xs font-bold">Edit</span>
                            </button>
                            <button onClick={() => onDelete(student.id)} className="flex-1 flex justify-center items-center gap-2 bg-slate-700/50 text-rose-400 p-2 rounded-lg hover:bg-slate-700 transition">
                                <TrashIcon className="h-5 w-5" /> <span className="text-xs font-bold">Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Desktop View: Table (Hidden on mobile) --- */}
            <div className="hidden md:block bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
                    <table className="w-full divide-y divide-slate-700 border-collapse">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="table-head">Student ID</th>
                                <th className="table-head">Full Name</th>
                                <th className="table-head">Email</th>
                                <th className="table-head">Phone</th>
                                <th className="table-head">Gender</th>
                                <th className="table-head text-center">Status</th>
                                <th className="table-head text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-800/40 transition-colors duration-200">
                                    <td className="table-cell font-bold text-cyan-400 whitespace-nowrap">#{student.studentId}</td>
                                    <td className="table-cell text-white font-medium whitespace-nowrap">{student.firstName} {student.lastName}</td>
                                    <td className="table-cell text-slate-300">{student.email}</td>
                                    <td className="table-cell text-slate-400 whitespace-nowrap">{student.phone}</td>
                                    <td className="table-cell text-slate-400">{student.gender}</td>
                                    <td className="table-cell text-center">
                                        <span className={`inline-flex px-3 py-1 text-[11px] uppercase tracking-wider rounded-full font-bold ${student.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                            {student.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="table-cell text-right whitespace-nowrap">
                                        <div className="flex justify-end space-x-1">
                                            <button onClick={() => onEdit(student)} className="text-cyan-400 hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-400/10 transition-all active:scale-90"><PencilSquareIcon className="h-5 w-5" /></button>
                                            <button onClick={() => onDelete(student.id)} className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-400/10 transition-all active:scale-90"><TrashIcon className="h-5 w-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .table-head { padding: 16px 20px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
                .table-cell { padding: 14px 20px; font-size: 14px; }
                .scrollbar-thin::-webkit-scrollbar { height: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: #0f172a; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Table;