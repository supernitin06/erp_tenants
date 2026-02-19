import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    useGetAllClassesQuery,
    useCreateClassMutation,
    useUpdateClassMutation,
} from '../api/classApi';

import Form from '../../../common/components/ui/Form';
import Table from '../../../common/components/ui/Table';
import DataCards from '../../../common/components/ui/DataCards';

import { PlusIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const initialFormState = {
    name: '',
    section: '',
    academicYear: '',
    description: '',
};

const ClassManagement = () => {

    const { tenantName } = useParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    const { data: classesData, isLoading, error, refetch } =
        useGetAllClassesQuery({ tenantId: tenantName });

    const [createClass, { isLoading: isCreating }] =
        useCreateClassMutation();

    const [updateClass, { isLoading: isUpdating }] =
        useUpdateClassMutation();

    const classes = classesData?.classes || [];
    const totalClasses = classes.length;

    // ---------------- CREATE ----------------
    const handleCreate = () => {
        setSelectedClass(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    // ---------------- EDIT ----------------
    const handleEdit = (cls) => {
        setSelectedClass(cls);
        setFormData({
            name: cls.name || '',
            section: cls.section || '',
            classTeacher: cls.classTeacher || '',
            capacity: cls.capacity || '',
        });
        setIsModalOpen(true);
    };

    // ---------------- SUBMIT ----------------
    const handleSubmit = async (data) => {
        try {

            if (!data.name) {
                alert("Class name is required");
                return;
            }

            if (selectedClass) {
                await updateClass({
                    tenantId: tenantName,
                    id: selectedClass.id,
                    data
                }).unwrap();
            } else {
                await createClass({
                    tenantId: tenantName,
                    data
                }).unwrap();
            }

            setIsModalOpen(false);
            setSelectedClass(null);
            setFormData(initialFormState);
            refetch();

        } catch (err) {
            alert(err?.data?.message || 'Something went wrong');
        }
    };

    // ---------------- CARD FIELDS ----------------
    const cardFields = [
        { key: 'name', label: 'Class Name' },
        { key: 'section', label: 'Section' },
        { key: 'academicYear', label: 'Academic Year' },
        { key: 'description', label: 'Description' },
    ];

    const columns = [
        { key: 'name', header: 'Class Name', isPrimary: true },
        { key: 'section', header: 'Section' },
        { key: 'academicYear', header: 'Academic Year' },
        { key: 'description', header: 'Description' },
    ];

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Class Management
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm">
                        Manage school classes and sections.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl shadow-lg hover:opacity-90 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Class
                </button>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-4">
                    <AcademicCapIcon className="h-6 w-6 text-indigo-400" />
                    <div>
                        <p className="text-slate-400 text-sm uppercase">
                            Total Classes
                        </p>
                        <p className="text-xl font-bold text-white">
                            {totalClasses}
                        </p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-400">
                    {error?.data?.message || 'Failed to load classes'}
                </div>
            )}

            {/* <Table
                data={classes}
                columns={columns}
                onEdit={handleEdit}
                primaryKey="id"
                isLoading={isLoading}
            /> */}


            {/* Data Cards */}
            <DataCards
                data={classes}
                fields={cardFields}
                titleKey="name"
                loading={isLoading}
                onEdit={handleEdit}
                primaryKey="id"
                emptyMessage="No classes found"
            />

            {/* Modal Form */}
            <Form
                isOpen={isModalOpen}
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedClass}
                isLoading={isCreating || isUpdating}
                type="class"
            />
        </div>
    );
};

export default ClassManagement;
