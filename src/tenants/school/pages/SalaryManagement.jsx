import React from 'react';
import DummyTable from '../components/DummyTable';

const SalaryManagement = () => {
    const data = [
        { id: 1, employee: 'John Doe', role: 'Teacher', month: 'October 2023', amount: '$3,500', status: 'Paid' },
        { id: 2, employee: 'Jane Smith', role: 'Administrator', month: 'October 2023', amount: '$4,200', status: 'Processing' },
        { id: 3, employee: 'Michael Brown', role: 'Teacher', month: 'October 2023', amount: '$3,600', status: 'Paid' },
        { id: 4, employee: 'Emily Davis', role: 'Staff', month: 'October 2023', amount: '$2,500', status: 'Pending' },
        { id: 5, employee: 'Chris Wilson', role: 'Teacher', month: 'October 2023', amount: '$3,550', status: 'Paid' },
    ];

    const columns = [
        { key: 'employee', header: 'Employee Name' },
        { key: 'role', header: 'Role' },
        { key: 'month', header: 'Month' },
        { key: 'amount', header: 'Salary Amount' },
        { key: 'status', header: 'Status' },
    ];

    const handleEdit = (item) => {
        alert(`Edit salary for ${item.employee}`);
    };

    const handleDelete = (item) => {
        alert(`Delete salary record for ${item.employee}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Salary Management
                </h1>
                <p className="text-slate-400 mt-2">Manage employee salaries and payroll.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-green-500 w-64"
                        />
                        <select className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-green-500">
                            <option>All Statuses</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Processing</option>
                        </select>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-green-500/20">
                        + Process Payroll
                    </button>
                </div>
                <DummyTable
                    title="Payroll Records"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default SalaryManagement;
