
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Library from './pages/Library';
import ExamDatesheet from './pages/ExamDatesheet';
import ExamResult from './pages/ExamResult';
import LibraryBooksManagement from './pages/LibraryBooksManagement';
import ClassManagement from './pages/ClassManagement';
import SalaryManagement from './pages/SalaryManagement';
import FeeManagement from './pages/FeeManagement';

const schoolRoutes = [
    {
        path: 'student',
        element: <Student />,
    },
    {
        path: 'teacher',
        element: <Teacher />,
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
