import React from 'react';

const hospitalRoutes = [
    {
        path: 'patient',
        element: <div className="text-white p-6"><h1>Patient Management</h1></div>,
    },
    {
        path: 'doctor',
        element: <div className="text-white p-6"><h1>Doctor Management</h1></div>,
    },
    {
        path: 'lab',
        element: <div className="text-white p-6"><h1>Lab Management</h1></div>,
    },
];

export default hospitalRoutes;
