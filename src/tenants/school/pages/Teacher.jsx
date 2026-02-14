import React from 'react';
import DummyTable from '../components/DummyTable';

const Teacher = () => {
    const data = [
        { id: 1, name: 'John Doe', subject: 'Mathematics', qualification: 'M.Sc. Math', experience: '5 Years' },
        { id: 2, name: 'Jane Smith', subject: 'Science', qualification: 'M.Sc. Physics', experience: '8 Years' },
        { id: 3, name: 'Michael Brown', subject: 'English', qualification: 'MA English', experience: '3 Years' },
        { id: 4, name: 'Emily Davis', subject: 'History', qualification: 'MA History', experience: '6 Years' },
        { id: 5, name: 'Chris Wilson', subject: 'Computer Science', qualification: 'MCA', experience: '4 Years' },
    ];

    const columns = [
        { key: 'name', header: 'Teacher Name' },
        { key: 'subject', header: 'Subject' },
        { key: 'qualification', header: 'Qualification' },
        { key: 'experience', header: 'Experience' },
    ];

    const handleEdit = (item) => {
        alert(`Edit ${item.name}`);
    };

    const handleDelete = (item) => {
        alert(`Delete ${item.name}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Teacher Management
                </h1>
                <p className="text-slate-400 mt-2">Manage faculty and staff details.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                        + Add Teacher
                    </button>
                </div>
                <DummyTable
                    title="Faculty List"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default Teacher;
