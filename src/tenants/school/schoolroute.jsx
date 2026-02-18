import React from 'react';
import TeacherManagement from './pages/Teacher';
import Student from './pages/Student';
import Library from './pages/Library';
import RoomManagement from './pages/RoomManagement';
import ExamDatesheet from './pages/ExamDatesheet';
import ExamResult from './pages/ExamResult';
import LibraryBooks from './pages/LibraryBooks';
import ClassManagement from './pages/ClassManagement';
import SalaryManagement from './pages/SalaryManagement';
import FeeManagement from './pages/FeeManagement';

import ExamManagement from './pages/ExamManagement.jsx';
import ExamSchedule from './pages/ExamShedule.jsx';
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
        element: <ExamDatesheet />,
    },
    {
        path: 'exam-management',
        element: <ExamManagement />,
    },
    {
        path: 'exam-schedule/:classId/:examId',
        element: <ExamSchedule />,
    },
    {
        path: 'exam-result',
        element: <ExamResult />,
    },
    {
        path: 'exam-management',
        element: <ExamManagement />,
    },
    {
        path: 'library-books-mangement',
        element: <LibraryBooks />,
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
    },

    // {
    //     path: 'doctor-appointment',
    //     element: <DoctorAppointment />,
    // },
    // {
    //     path: 'doctor-management',
    //     element: <DoctorManagement />,
    // },
    // {
    //     path: 'lab-management',
    //     element: <LabManagement />,
    // },
    // {
    //     path: 'teacher-attendance',
    //     element: <TeacherAttendance />,
    // },
    // {
    //     path: 'student-attendance',
    //     element: <StudentAttendance />,
    // }

];

export default schoolRoutes;
