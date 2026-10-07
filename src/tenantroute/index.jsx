import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Layout from '../common/layout/Layout';
import ProtectedRoute, { RequirePermission } from '../common/components/ProtectedRoute';
import RolesPermissions from '../common/pages/admin/RolesPermissions';
import PeopleManager from '../common/pages/admin/PeopleManager';
import Login from '../common/auth/Login';
import Dashboard from '../common/pages/Dashboard';
import schoolRoutes from '../tenants/school/schoolroute';
import hospitalRoutes from '../tenants/hospital/hospitalroute';
import PlanHistory from '../common/pages/PlanHistory';
import Pricing from '../common/pages/Pricing';
import PaymentPage from '../common/pages/PaymentPage';
import RegisterPage from '../common/auth/Register';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/:tenantName/pricing',
                element: <Pricing />,
            },
            {
                path: '/:tenantName/checkout',
                element: <PaymentPage />,
            },
            {
                path: '/:tenantName',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },

                    {
                        path: 'plan-history',
                        element: <PlanHistory />,
                    },

                    // Organisation administration
                    {
                        path: 'admin/users',
                        element: <RequirePermission permission="USER_READ"><PeopleManager kind="user" /></RequirePermission>,
                    },
                    {
                        path: 'admin/staff',
                        element: <RequirePermission permission="VIEW_TENANT_STAFF"><PeopleManager kind="staff" /></RequirePermission>,
                    },
                    {
                        path: 'admin/roles',
                        element: <RequirePermission permission="VIEW_TENANT_ROLES"><RolesPermissions /></RequirePermission>,
                    },

                    {
                        path: ':domain',
                        element: <Outlet />,
                        children: [
                            ...schoolRoutes,
                            ...hospitalRoutes,
                        ]
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white text-2xl font-bold">404 - Page Not Found</div>,
    },
]);

export default router;
