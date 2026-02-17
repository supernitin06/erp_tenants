import React, { useState } from 'react';
import {
    FiCalendar,
    FiSearch,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiUser,
    FiFilter,
    FiDownload,
    FiMoreVertical
} from 'react-icons/fi';

const StudentAttendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Dummy Data
    const [attendanceData, setAttendanceData] = useState([
        { id: 1, name: 'Alice Johnson', class: '10-A', status: 'Present', checkIn: '08:00 AM', checkOut: '02:00 PM' },
        { id: 2, name: 'Bob Smith', class: '10-A', status: 'Absent', checkIn: '--:--', checkOut: '--:--' },
        { id: 3, name: 'Charlie Brown', class: '10-B', status: 'Late', checkIn: '08:45 AM', checkOut: '02:10 PM' },
        { id: 4, name: 'Diana Prince', class: '10-A', status: 'Present', checkIn: '07:55 AM', checkOut: '02:05 PM' },
        { id: 5, name: 'Evan Wright', class: '10-C', status: 'On Leave', checkIn: '--:--', checkOut: '--:--' },
        { id: 6, name: 'Fiona Gallagher', class: '10-B', status: 'Present', checkIn: '08:05 AM', checkOut: '02:00 PM' },
        { id: 7, name: 'George Miller', class: '10-C', status: 'Half Day', checkIn: '08:00 AM', checkOut: '11:30 AM' },
    ]);

    const stats = {
        present: attendanceData.filter(d => d.status === 'Present').length,
        absent: attendanceData.filter(d => d.status === 'Absent').length,
        late: attendanceData.filter(d => d.status === 'Late').length,
        onLeave: attendanceData.filter(d => d.status === 'On Leave').length,
    };

    const filteredData = attendanceData.filter(record => {
        const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              record.class.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || record.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Present': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Absent': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'Late': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Half Day': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'On Leave': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Student Attendance</h1>
                    <p className="text-slate-400 mt-1">Manage and view daily attendance records for students.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">
                        <FiCalendar className="text-slate-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-white focus:ring-0 outline-none text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium">
                        <FiDownload className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Present"
                    value={stats.present}
                    icon={<FiCheckCircle className="w-5 h-5" />}
                    color="emerald"
                    total={attendanceData.length}
                />
                <StatCard
                    title="Absent"
                    value={stats.absent}
                    icon={<FiXCircle className="w-5 h-5" />}
                    color="rose"
                    total={attendanceData.length}
                />
                <StatCard
                    title="Late Arrival"
                    value={stats.late}
                    icon={<FiClock className="w-5 h-5" />}
                    color="amber"
                    total={attendanceData.length}
                />
                <StatCard
                    title="On Leave"
                    value={stats.onLeave}
                    icon={<FiUser className="w-5 h-5" />}
                    color="purple"
                    total={attendanceData.length}
                />
            </div>

            {/* Filters and Search */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or class..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl">
                            <FiFilter className="text-slate-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent border-none text-white focus:ring-0 outline-none text-sm"
                            >
                                <option value="All">All Status</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                                <option value="Half Day">Half Day</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Student</th>
                                <th className="p-4 font-semibold">Class</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Check In</th>
                                <th className="p-4 font-semibold">Check Out</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredData.length > 0 ? (
                                filteredData.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-700/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-sm border border-slate-600">
                                                    {record.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium text-sm">{record.name}</p>
                                                    <p className="text-slate-500 text-xs">ID: #{2000 + record.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300 text-sm">{record.class}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300 font-mono text-sm">{record.checkIn}</td>
                                        <td className="p-4 text-slate-300 font-mono text-sm">{record.checkOut}</td>
                                        <td className="p-4 text-right">
                                            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                <FiMoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <FiSearch className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="text-lg font-medium">No records found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static for now) */}
                <div className="p-4 border-t border-slate-700 flex items-center justify-between text-sm text-slate-400">
                    <span>Showing {filteredData.length} of {attendanceData.length} records</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, total }) => {
    const colors = {
        emerald: 'text-emerald-400 bg-emerald-500/10',
        rose: 'text-rose-400 bg-rose-500/10',
        amber: 'text-amber-400 bg-amber-500/10',
        purple: 'text-purple-400 bg-purple-500/10',
        blue: 'text-blue-400 bg-blue-500/10',
    };

    const percentage = Math.round((value / total) * 100) || 0;

    return (
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                </div>
                <div className={`p-2.5 rounded-xl ${colors[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'rose' ? 'bg-rose-500' : color === 'amber' ? 'bg-amber-500' : 'bg-purple-500'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">{percentage}% of total</p>
        </div>
    );
};

export default StudentAttendance;