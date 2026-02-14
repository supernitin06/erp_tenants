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
