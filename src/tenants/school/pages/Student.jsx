import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    useGetStudentsQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
} from '../api/studentapi';
import Form from '../../../common/components/ui/Form';
import Table from '../../../common/components/ui/Table';

import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';

const Student = () => {
    const { tenantName } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

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

    const { data: studentsData, isLoading, error } = useGetStudentsQuery(tenantName);
    const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
    const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
    const [deleteStudent] = useDeleteStudentMutation();

    const students = studentsData?.students || [];
    const totalStudents = studentsData?.count || 0;

    const handleCreate = () => {
        setSelectedStudent(null);
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

    return (

        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Student Management
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm md:text-base">
                        Manage student records and details.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="w-full sm:w-auto flex justify-center items-center px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-xl font-medium transition shadow-lg shadow-cyan-900/30 active:scale-95"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Student
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-800/70 backdrop-blur border border-slate-700 rounded-2xl p-5 md:p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-cyan-500/10 shrink-0">
                            <UsersIcon className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Total Students</p>
                            <p className="text-xl md:text-2xl font-bold text-white">
                                {totalStudents}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-400 text-sm">
                    {error?.data?.message || 'Failed to load students'}
                </div>
            )}

            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-60">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                            <svg className="animate-spin h-8 w-8 text-cyan-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                    stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="text-sm font-medium">Loading students...</span>
                        </div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-60 text-slate-400 p-4 text-center">
                        <UsersIcon className="h-10 w-10 mb-3 opacity-30" />
                        <p className="font-medium text-lg">No students found</p>
                        <p className="text-sm opacity-60">Try adding a new student to see them here.</p>
                    </div>
                ) : (
                    <Table
                        students={students}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            <Form
                isOpen={isModalOpen}
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedStudent}
                isLoading={isCreating || isUpdating}
                type="student"
            />

        </div>
    );
};

export default Student;