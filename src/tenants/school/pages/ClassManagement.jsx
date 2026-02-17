import React, { useState, useMemo } from 'react';
import Form from '../../../common/components/ui/Form';
import Table from '../../../common/components/ui/Table';
import { 
    PlusIcon, 
    AcademicCapIcon,
    BookOpenIcon,
    UsersIcon,
    ClockIcon,
    BuildingLibraryIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    SparklesIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const ClassManagement = () => {
    const [selectedTab, setSelectedTab] = useState('classes');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    // Mock data - replace with actual API data
    const [classes, setClasses] = useState([
        { id: 1, name: 'Class 10', section: 'A', students: 45, teacher: 'Mr. Sharma', room: '101', time: '8:00 AM - 9:30 AM', color: 'blue' },
        { id: 2, name: 'Class 10', section: 'B', students: 42, teacher: 'Ms. Patel', room: '102', time: '9:30 AM - 11:00 AM', color: 'purple' },
        { id: 3, name: 'Class 9', section: 'A', students: 38, teacher: 'Mr. Kumar', room: '103', time: '8:00 AM - 9:30 AM', color: 'emerald' },
        { id: 4, name: 'Class 9', section: 'B', students: 40, teacher: 'Ms. Singh', room: '104', time: '9:30 AM - 11:00 AM', color: 'amber' },
        { id: 5, name: 'Class 8', section: 'A', students: 35, teacher: 'Mr. Verma', room: '105', time: '8:00 AM - 9:30 AM', color: 'rose' },
        { id: 6, name: 'Class 8', section: 'B', students: 37, teacher: 'Ms. Gupta', room: '106', time: '9:30 AM - 11:00 AM', color: 'cyan' },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        section: '',
        students: '',
        teacher: '',
        room: '',
        time: '',
    });

    // Derived state for Form initialData to ensure we only pass editable fields
    // and avoid passing 'id', 'color' etc. which would generate unwanted form fields
    const formInitialData = useMemo(() => {
        if (!selectedClass) return null;
        return {
            name: selectedClass.name,
            section: selectedClass.section,
            students: selectedClass.students,
            teacher: selectedClass.teacher,
            room: selectedClass.room,
            time: selectedClass.time,
        };
    }, [selectedClass]);

    const handleCreate = () => {
        setSelectedClass(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cls) => {
        setSelectedClass(cls);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            setClasses(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleSubmit = (data) => {
        const classData = {
            ...data,
            students: parseInt(data.students, 10) || 0,
        };

        if (selectedClass) {
            setClasses(prev => prev.map(c => c.id === selectedClass.id ? { ...c, ...classData } : c));
        } else {
            setClasses(prev => [...prev, { ...classData, id: Date.now(), color: 'cyan' }]);
        }
        setIsModalOpen(false);
    };

    const filteredClasses = useMemo(() => {
        return classes.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, classes]);

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
            amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
            rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-800',
            cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
        };
        return colors[color] || colors.blue;
    };

    const classColumns = useMemo(() => [
        { key: 'name', header: 'Class', isPrimary: true },
        { key: 'section', header: 'Section', isSecondary: true, render: item => (
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${getColorClasses(item.color)}`}>
                {item.section}
            </span>
        )},
        { key: 'students', header: 'Students' },
        { key: 'teacher', header: 'Teacher' },
        { key: 'room', header: 'Room' },
        { key: 'time', header: 'Time' },
    ], []);

    const stats = [
        { 
            id: 1, 
            label: 'Total Classes', 
            value: '24', 
            change: '+3', 
            icon: AcademicCapIcon, 
            color: 'blue',
            gradient: 'from-blue-600 to-blue-400'
        },
        { 
            id: 2, 
            label: 'Total Sections',
            value: new Set(classes.map(c => c.section)).size,
            change: '+6', 
            icon: BookOpenIcon, 
            color: 'purple',
            gradient: 'from-purple-600 to-purple-400'
        },
        { 
            id: 3,
            label: 'Total Students',
            value: classes.reduce((acc, c) => acc + c.students, 0),
            change: '+24', 
            icon: UsersIcon, 
            color: 'emerald',
            gradient: 'from-emerald-600 to-emerald-400'
        },
        { 
            id: 4,
            label: 'Active Teachers',
            value: new Set(classes.map(c => c.teacher)).size,
            change: '+4', 
            icon: ClockIcon, 
            color: 'amber',
            gradient: 'from-amber-600 to-amber-400'
        },
    ];

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
            
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                
                {/* Header with Glass Effect */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                                    <div className="relative p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                                        <BuildingLibraryIcon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            Class Management
                                        </h1>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                        <GlobeAltIcon className="h-4 w-4" />
                                        Organize and manage all academic classes
                                    </p>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleCreate}
                                className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <PlusIcon className="h-5 w-5 mr-2 relative z-10 transition-transform group-hover:rotate-90" />
                                <span className="relative z-10">Add New Class</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards with Hover Effects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.id}
                                className="group relative animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium">
                                            {stat.change} this week
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Tabs with Modern Design */}
                <div className="mb-6">
                    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-2 border border-white/20 dark:border-gray-700/30 inline-flex" style={{ display: 'none' }}>
                        {['classes', 'sections', 'schedule'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`relative px-6 py-2.5 text-sm font-medium capitalize rounded-xl transition-all duration-300 ${
                                    selectedTab === tab
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                {tab}
                                {selectedTab === tab && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="Search classes, teachers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="relative w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Content Cards */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700 shadow-xl overflow-hidden">
                    <Table
                        data={filteredClasses}
                        columns={classColumns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                <Form
                    isOpen={isModalOpen}
                    formData={formData}
                    setFormData={setFormData}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={formInitialData}
                    isLoading={false} // No API calls yet, so not loading
                    title="Class"
                />
            </div>
        </div>
    );
};

export default ClassManagement;