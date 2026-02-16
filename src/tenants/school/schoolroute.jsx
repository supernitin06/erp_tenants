import React from 'react';
import TeacherManagement from './pages/Teacher';
import Student from './pages/Student';
import Library from './pages/Library';


const schoolRoutes = [
    {
        path: 'student',
        element: <Student />,
    },
    {
        path: 'teacher',
        element: <TeacherManagement />,
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
    {
        path: 'library',
        element: <Library />,
    },
    {
        path: 'exam-datesheet',
        element: <div className="p-6 text-white"><h1>Exam Datesheet Module</h1></div>,
    },
    {
        path: 'exam-result',
        element: <div className="p-6 text-white"><h1>Exam Result Module</h1></div>,
    },
    {
        path: 'library-books-mangement',
        element: <div className="p-6 text-white"><h1>Library Books Management</h1></div>,
    },
    {
        path: 'class-management',
        element: <div className="p-6 text-white"><h1>Class Management</h1></div>,
    },
    {
        path: 'salary-manageement',
        element: <div className="p-6 text-white"><h1>Salary Management</h1></div>,
    },
    {
        path: 'fee-manageemnt',
        element: <div className="p-6 text-white"><h1>Fee Management</h1></div>,
    }
];

export default schoolRoutes;
