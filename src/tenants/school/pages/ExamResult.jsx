import React from 'react';
import DummyTable from '../components/DummyTable';

const ExamResult = () => {
    const data = [
        { id: 1, student: 'John Doe', subject: 'Mathematics', score: '95/100', grade: 'A+' },
        { id: 2, student: 'Jane Smith', subject: 'Science', score: '88/100', grade: 'A' },
        { id: 3, student: 'Michael Brown', subject: 'English', score: '72/100', grade: 'B' },
        { id: 4, student: 'Emily Davis', subject: 'History', score: '65/100', grade: 'C' },
        { id: 5, student: 'Chris Wilson', subject: 'Computer Science', score: '92/100', grade: 'A' },
    ];

    const columns = [
        { key: 'student', header: 'Student Name' },
        { key: 'subject', header: 'Subject' },
        { key: 'score', header: 'Score' },
        { key: 'grade', header: 'Grade' },
    ];

    const handleEdit = (item) => {
        alert(`Edit result for ${item.student}`);
    };

    const handleDelete = (item) => {
        alert(`Delete result for ${item.student}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    Examination Results
                </h1>
                <p className="text-slate-400 mt-2">View and manage student performance.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-cyan-500 w-64"
                        />
                    </div>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
                        + Enter Results
                    </button>
                </div>
                <DummyTable
                    title="Recent Results"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default ExamResult;
