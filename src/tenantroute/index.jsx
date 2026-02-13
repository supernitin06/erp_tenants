import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../common/layout/Layout';
import ProtectedRoute from '../common/components/ProtectedRoute';
import Login from '../common/auth/Login';
import Dashboard from '../common/pages/Dashboard';
import schoolRoutes from '../tenants/school/schoolroute';
import hospitalRoutes from '../tenants/hospital/hospitalroute';
import PlanHistory from '../common/pages/PlanHistory';
import Pricing from '../common/pages/Pricing';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

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
        element: <ProtectedRoute />,
        children: [
            {
                path: '/:tenantName',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    ...schoolRoutes,
                    ...hospitalRoutes,
                    {
                        path: 'plan-history',
                        element: <PlanHistory />,
                    },
                    {
                        path: 'pricing',
                        element: <Pricing />,
                    },
                    // ADD THIS: Catch-all route for undefined modules
                    {
                        path: '*',
                        element: (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
                                <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                                    <WrenchScrewdriverIcon className="w-10 h-10 text-slate-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Page Under Construction</h2>
                                <p className="text-slate-400 max-w-md">
                                    This module is active in your plan, but the page route hasn't been configured yet.
                                </p>
                            </div>
                        ),
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
