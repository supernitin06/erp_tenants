
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Library from './pages/Library';

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
    }
];

export default schoolRoutes;
