import React from 'react';
import DummyTable from '../components/DummyTable';

const ExamDatesheet = () => {
    const data = [
        { id: 1, subject: 'Mathematics', date: '2025-03-10', time: '10:00 AM - 01:00 PM', invigilator: 'John Doe' },
        { id: 2, subject: 'Science', date: '2025-03-12', time: '10:00 AM - 01:00 PM', invigilator: 'Jane Smith' },
        { id: 3, subject: 'English', date: '2025-03-14', time: '10:00 AM - 01:00 PM', invigilator: 'Michael Brown' },
        { id: 4, subject: 'History', date: '2025-03-16', time: '10:00 AM - 01:00 PM', invigilator: 'Emily Davis' },
        { id: 5, subject: 'Computer Science', date: '2025-03-18', time: '10:00 AM - 01:00 PM', invigilator: 'Chris Wilson' },
    ];

    const columns = [
        { key: 'subject', header: 'Subject' },
        { key: 'date', header: 'Date' },
        { key: 'time', header: 'Time' },
        { key: 'invigilator', header: 'Invigilator' },
    ];

    const handleEdit = (item) => {
        console.log('Edit', item);
        alert(`Edit ${item.subject}`);
    };

    const handleDelete = (item) => {
        console.log('Delete', item);
        alert(`Delete ${item.subject}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Examination Datesheet
                </h1>
                <p className="text-slate-400 mt-2">Manage upcoming examination schedules.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-end mb-4">
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
                        + Add Schedule
                    </button>
                </div>
                <DummyTable
                    title="Upcoming Exams"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default ExamDatesheet;
