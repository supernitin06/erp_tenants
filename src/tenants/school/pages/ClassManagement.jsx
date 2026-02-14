import React from 'react';
import DummyTable from '../components/DummyTable';

const ClassManagement = () => {
    const data = [
        { id: 1, className: 'Class 1-A', grade: '1st Grade', section: 'A', classTeacher: 'Sarah Johnson', students: 25 },
        { id: 2, className: 'Class 1-B', grade: '1st Grade', section: 'B', classTeacher: 'Mike Smith', students: 24 },
        { id: 3, className: 'Class 2-A', grade: '2nd Grade', section: 'A', classTeacher: 'Emily Davis', students: 28 },
        { id: 4, className: 'Class 3-A', grade: '3rd Grade', section: 'A', classTeacher: 'James Wilson', students: 30 },
        { id: 5, className: 'Class 10-A', grade: '10th Grade', section: 'A', classTeacher: 'Robert Brown', students: 35 },
    ];

    const columns = [
        { key: 'className', header: 'Class Name' },
        { key: 'grade', header: 'Grade' },
        { key: 'section', header: 'Section' },
        { key: 'classTeacher', header: 'Class Teacher' },
        { key: 'students', header: 'Total Students' },
    ];

    const handleEdit = (item) => {
        alert(`Edit ${item.className}`);
    };

    const handleDelete = (item) => {
        alert(`Delete ${item.className}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Class Management
                </h1>
                <p className="text-slate-400 mt-2">Organize classes, sections, and class teachers.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search classes..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-purple-500 w-64"
                        />
                    </div>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-purple-500/20">
                        + Add Class
                    </button>
                </div>
                <DummyTable
                    title="Active Classes"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default ClassManagement;
