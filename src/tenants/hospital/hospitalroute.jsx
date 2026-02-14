import React from 'react';

import DoctorManagement from './pages/DoctorManagement';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientManagement from './pages/PatientManagement';
import LabManagement from './pages/LabManagement';
import RoomManagement from './pages/RoomManagement';

const hospitalRoutes = [
    {
        path: 'doctor-manegement',
        element: <DoctorManagement />,
    },
    {
        path: 'doctor-appoitments',
        element: <DoctorAppointments />,
    },
    {
        path: 'patient-manaegemnt',
        element: <PatientManagement />,
    },
    {
        path: 'lab-manageemnt',
        element: <LabManagement />,
    },
    {
        path: 'room',
        element: <RoomManagement />,
    },
];

export default hospitalRoutes;
