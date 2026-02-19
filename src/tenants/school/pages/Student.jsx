import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    useGetStudentsQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
} from '../api/studentapi';
import Form from '../../../common/components/ui/Form';
import Table from '../../../common/components/ui/Table';
import StatsCard from '../../../common/components/ui/StatsCard';
import SearchBar from '../../../common/components/ui/SearchBar';

import { 
    PlusIcon, 
    UsersIcon, 
    AcademicCapIcon,
    UserGroupIcon,
    ChartBarIcon,
    SparklesIcon,
    IdentificationIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

const Student = () => {
    const { tenantName } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('all');

    const [formData, setFormData] = useState({
        studentId: '',
        firstName: '',
        lastName: '',
        email: '',
        classId: '',
        sectionId: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        parentName: '',
        parentPhone: '',
    });

    const { data: studentsData, isLoading, error, refetch } = useGetStudentsQuery(tenantName);
    const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
    const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
    const [deleteStudent] = useDeleteStudentMutation();

    // Debugging: Log data to console to verify API response
    useEffect(() => {
        console.log("Student Page - Tenant:", tenantName);
        console.log("Student Page - Data:", studentsData);
        console.log("Student Page - Error:", error);
    }, [tenantName, studentsData, error]);

    const students = useMemo(() => {
        if (!studentsData) return [];
        let data = [];
        if (Array.isArray(studentsData)) data = studentsData;
        else if (Array.isArray(studentsData.students)) data = studentsData.students;
        else if (Array.isArray(studentsData.data)) data = studentsData.data;
        
        // Ensure we only return valid objects
        return data.filter(item => item && typeof item === 'object');
    }, [studentsData]);

    const studentColumns = useMemo(() => [
        { key: 'studentId', header: 'Student ID', isPrimary: true, className: 'font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap', render: item => `#${item.studentId}` },
        { key: 'fullName', header: 'Full Name', isSecondary: true, className: 'text-slate-900 dark:text-white font-medium whitespace-nowrap', render: item => `${item.firstName} ${item.lastName}` },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone', className: 'text-slate-500 dark:text-slate-400 whitespace-nowrap' },
        { key: 'gender', header: 'Gender', className: 'text-slate-500 dark:text-slate-400' },
        {
            key: 'isActive', header: 'Status', render: item => (
                <span className={`inline-flex px-3 py-1 text-[11px] uppercase tracking-wider rounded-full font-bold ${item.isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                    }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
    ], []);

    const studentFields = {
        firstName: { label: 'First Name', type: 'text', icon: UsersIcon, tab: 'basic' },
        lastName: { label: 'Last Name', type: 'text', icon: UsersIcon, tab: 'basic' },
        studentId: { label: 'Student ID', type: 'text', icon: IdentificationIcon, tab: 'basic' },
        email: { label: 'Email', type: 'email', icon: EnvelopeIcon, tab: 'contact' },
        phone: { label: 'Phone', type: 'tel', icon: PhoneIcon, tab: 'contact' },
        gender: { label: 'Gender', type: 'select', icon: UsersIcon, tab: 'personal' },
        dateOfBirth: { label: 'Date of Birth', type: 'date', icon: CalendarIcon, tab: 'personal' },
        address: { label: 'Address', type: 'textarea', icon: MapPinIcon, tab: 'location' },
        classId: { label: 'Class', type: 'text', icon: AcademicCapIcon, tab: 'professional' },
        sectionId: { label: 'Section', type: 'text', icon: UserGroupIcon, tab: 'professional' },
        parentName: { label: 'Parent Name', type: 'text', icon: UsersIcon, tab: 'contact' },
        parentPhone: { label: 'Parent Phone', type: 'tel', icon: PhoneIcon, tab: 'contact' },
    };

    // Filter students based on search and gender
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = searchTerm === '' || 
                student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesGender = filterGender === 'all' || student.gender?.toLowerCase() === filterGender;
            
            return matchesSearch && matchesGender;
        });
    }, [students, searchTerm, filterGender]);

    const totalStudents = useMemo(() => (studentsData?.count || students.length || 0), [studentsData, students]);
    
    // Calculate statistics
    const stats = useMemo(() => {
        const male = students.filter(s => s.gender?.toLowerCase() === 'male').length;
        const female = students.filter(s => s.gender?.toLowerCase() === 'female').length;
        const other = students.filter(s => s.gender && !['male', 'female'].includes(s.gender?.toLowerCase())).length;
        
        return { male, female, other };
    }, [students]);

    const handleCreate = () => {
        setSelectedStudent(null);
        setFormData({
            studentId: '',
            firstName: '',
            lastName: '',
            email: '',
            classId: '',
            sectionId: '',
            phone: '',
            gender: '',
            dateOfBirth: '',
            address: '',
            parentName: '',
            parentPhone: '',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await deleteStudent({ tenantName, id }).unwrap();
            } catch (err) {
                alert('Failed to delete student');
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedStudent) {
                await updateStudent({
                    tenantName,
                    id: selectedStudent.id,
                    data: formData
                }).unwrap();
            } else {
                await createStudent({
                    tenantName,
                    data: formData
                }).unwrap();
            }
            setIsModalOpen(false);
        } catch (err) {
            alert(err?.data?.message || 'Something went wrong');
        }
    };

    const handleSearch = (term, filters) => {
        setSearchTerm(term);
        if (filters.gender) {
            setFilterGender(filters.gender);
        } else {
            setFilterGender('all');
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <div className="relative px-4 md:px-6 max-w-7xl mx-auto space-y-6 md:space-y-8 py-6 md:py-8 animate-in fade-in duration-500">

                {/* Header Section with Enhanced Design */}
                <div className="relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/30">
                                    <AcademicCapIcon className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                        Student Management
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base flex items-center gap-1">
                                        <SparklesIcon className="h-4 w-4" />
                                        Manage student records and track academic progress
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCreate}
                            className="group w-full sm:w-auto flex justify-center items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-xl hover:shadow-cyan-600/40 active:scale-95"
                        >
                            <PlusIcon className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90" />
                            Add New Student
                        </button>
                    </div>
                </div>

                {/* Stats Cards with Enhanced Design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Students"
                        value={totalStudents}
                        icon={UsersIcon}
                        color="blue"
                        subtitle="Active Students"
                    />
                    <StatsCard
                        title="Male Students"
                        value={stats.male}
                        icon={UserGroupIcon}
                        color="blue"
                        subtitle={`${totalStudents ? Math.round((stats.male / totalStudents) * 100) : 0}% of total`}
                    />
                    <StatsCard
                        title="Female Students"
                        value={stats.female}
                        icon={UserGroupIcon}
                        color="pink"
                        subtitle={`${totalStudents ? Math.round((stats.female / totalStudents) * 100) : 0}% of total`}
                    />
                    <StatsCard
                        title="Classes"
                        value={new Set(students.map(s => s.classId)).size}
                        icon={ChartBarIcon}
                        color="purple"
                        subtitle={`${new Set(students.map(s => s.sectionId)).size} Sections`}
                    />
                </div>

                {/* Search and Filter Bar */}
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search students by name, email, or ID..."
                    filters={[
                        {
                            key: 'gender',
                            label: 'Gender',
                            type: 'select',
                            options: [
                                { value: 'all', label: 'All Genders' },
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' }
                            ]
                        }
                    ]}
                    initialFilters={{ gender: 'all' }}
                />

                {/* Error Message with Enhanced Design */}
                {error && (
                    <div className="bg-rose-500/10 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-4 text-rose-500 dark:text-rose-400 text-sm flex items-center gap-3">
                        <div className="p-2 bg-rose-500/20 rounded-lg">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        {error?.data?.message || 'Failed to load students'}
                    </div>
                )}

                {/* Table Container with Enhanced Design */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700 shadow-xl overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-96">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-cyan-200 dark:border-cyan-900 border-t-cyan-600 dark:border-t-cyan-400 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <span className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                Loading students...
                            </span>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-slate-500 dark:text-slate-400 p-8 text-center">
                            <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl mb-4">
                                <UsersIcon className="h-12 w-12 opacity-50" />
                            </div>
                            <p className="font-medium text-xl text-slate-900 dark:text-white mb-2">No students found</p>
                            <p className="text-sm opacity-60 max-w-md">
                                {searchTerm || filterGender !== 'all' 
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Get started by adding your first student to the system'}
                            </p>
                            {(searchTerm || filterGender !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterGender('all');
                                    }}
                                    className="mt-4 px-4 py-2 text-sm bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredStudents.length}</span> of{' '}
                                    <span className="font-semibold text-slate-900 dark:text-white">{students.length}</span> students
                                </p>
                            </div>
                            <Table
                                data={filteredStudents}
                                columns={studentColumns}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </>
                    )}
                </div>

                {/* Modal with Enhanced Design */}
                <Form
                    isOpen={isModalOpen}
                    formData={formData}
                    setFormData={setFormData}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={selectedStudent}
                    isLoading={isCreating || isUpdating}
                    title="Student"
                    fields={studentFields}
                />
            </div>
        </div>
    );
};

export default Student;