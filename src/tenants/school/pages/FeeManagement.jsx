import React from 'react';
import DummyTable from '../components/DummyTable';

const FeeManagement = () => {
    const data = [
        { id: 1, student: 'Alice Williams', class: 'Class 5-A', type: 'Tuition Fee', amount: '$500', status: 'Paid', date: '2023-10-01' },
        { id: 2, student: 'Bob Miller', class: 'Class 4-B', type: 'Transport Fee', amount: '$150', status: 'Pending', date: '2023-10-05' },
        { id: 3, student: 'Charlie Davis', class: 'Class 6-A', type: 'Library Fine', amount: '$20', status: 'Unpaid', date: '2023-10-10' },
        { id: 4, student: 'Diana Evans', class: 'Class 5-A', type: 'Tuition Fee', amount: '$500', status: 'Paid', date: '2023-10-02' },
        { id: 5, student: 'Ethan Harris', class: 'Class 8-C', type: 'Exam Fee', amount: '$100', status: 'Paid', date: '2023-10-08' },
    ];

    const columns = [
        { key: 'student', header: 'Student Name' },
        { key: 'class', header: 'Class' },
        { key: 'type', header: 'Fee Type' },
        { key: 'amount', header: 'Amount' },
        { key: 'status', header: 'Status' },
        { key: 'date', header: 'Due/Paid Date' },
    ];

    const handleEdit = (item) => {
        alert(`Edit fee for ${item.student}`);
    };

    const handleDelete = (item) => {
        alert(`Delete fee record for ${item.student}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Fee Management
                </h1>
                <p className="text-slate-400 mt-2">Track student fees and payments.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-yellow-500 w-64"
                        />
                        <select className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-yellow-500">
                            <option>All Types</option>
                            <option>Tuition Fee</option>
                            <option>Transport Fee</option>
                            <option>Library Fine</option>
                        </select>
                    </div>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-yellow-500/20">
                        + Collect Fee
                    </button>
                </div>
                <DummyTable
                    title="Fee Records"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default FeeManagement;
