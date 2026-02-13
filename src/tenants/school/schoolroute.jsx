import React from 'react';

const schoolRoutes = [
    {
        path: 'student',
        element: (
            <div className="animate-in fade-in duration-500">
                <h1 className="text-3xl font-bold text-white mb-4">Student Management</h1>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <p className="text-slate-400">Manage your students here.</p>
                </div>
            </div>
        ),
    },
    {
        path: 'teacher',
        element: (
            <div className="animate-in fade-in duration-500">
                <h1 className="text-3xl font-bold text-white mb-4">Teacher Management</h1>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <p className="text-slate-400">Manage your faculty here.</p>
                </div>
            </div>
        ),
    },
    {
        path: 'room',
        element: (
            <div className="animate-in fade-in duration-500">
                <h1 className="text-3xl font-bold text-white mb-4">Classroom Management</h1>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <p className="text-slate-400">Manage school rooms here.</p>
                </div>
            </div>
        ),
    },
];

export default schoolRoutes;
