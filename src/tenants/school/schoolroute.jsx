<<<<<<< HEAD
import React from 'react';
import TeacherManagement from './pages/Teacher';
=======

import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Library from './pages/Library';
import ExamDatesheet from './pages/ExamDatesheet';
import ExamResult from './pages/ExamResult';
import LibraryBooksManagement from './pages/LibraryBooksManagement';
import ClassManagement from './pages/ClassManagement';
import SalaryManagement from './pages/SalaryManagement';
import FeeManagement from './pages/FeeManagement';
>>>>>>> 24cd85471c9f4a4dbd759da1753886c18c073ad1

const schoolRoutes = [
    {
        path: 'student',
        element: <Student />,
    },
    {
        path: 'teacher',
<<<<<<< HEAD
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
=======
        element: <Teacher />,
>>>>>>> 24cd85471c9f4a4dbd759da1753886c18c073ad1
    },
    {
        path: 'library',
        element: <Library />,
    },
    {
        path: 'exam-datesheet',
        element: <ExamDatesheet />,
    },
    {
        path: 'exam-result',
        element: <ExamResult />,
    },
    {
        path: 'library-books-mangement',
        element: <LibraryBooksManagement />,
    },
    {
        path: 'class-management',
        element: <ClassManagement />,
    },
    {
        path: 'salary-manageement',
        element: <SalaryManagement />,
    },
    {
        path: 'fee-manageemnt',
        element: <FeeManagement />,
    }
];

export default schoolRoutes;
