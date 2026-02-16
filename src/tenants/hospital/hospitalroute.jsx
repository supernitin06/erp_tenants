import React from 'react';

import DoctorManagement from './pages/DoctorManagement';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientManagement from './pages/PatientManagement';
import LabManagement from './pages/LabManagement';
import RoomManagement from './pages/RoomManagement';

const hospitalRoutes = [
    {
        path: 'DOCTORS/doctor-management',
        element: <DoctorManagement />,
    },
    {
        path: 'DOCTORS/doctor-appointment',
        element: <DoctorAppointments />,
    },
    {
        path: 'PATIENTS/patient-management',
        element: <PatientManagement />,
    },
    {
        path: 'HOSPITAL LABS/lab-management',
        element: <LabManagement />,
    },
    {
        path: 'HOSPITAL ROOMS/room-management',
        element: <RoomManagement />,
    },
];

export default hospitalRoutes;
