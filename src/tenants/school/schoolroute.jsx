import Student from './pages/Student';
import Teacher from './pages/Teacher';

const schoolRoutes = [
    {
        path: 'student',
        element: <Student />,
    },
    {
        path: 'teacher',
        element: <Teacher />,
    },
];

export default schoolRoutes;
