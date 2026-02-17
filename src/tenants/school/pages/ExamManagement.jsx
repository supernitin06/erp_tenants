import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    useGetExaminationsQuery,
    useCreateExaminationMutation,
    useUpdateExaminationMutation,
    useDeleteExaminationMutation,
} from '../api/examApi';

import Form from '../../../common/components/ui/Form';
import ExamTable from '../components/ExamTable';

import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const initialFormState = {
    name: '',
    examType: '',
    academicYear: '',
    term: '',
    startDate: '',
    endDate: '',
    description: '',
};

const ExamManagement = () => {

    const { tenantName } = useParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    const { data: examsData, isLoading, error, refetch } =
        useGetExaminationsQuery(tenantName);

    const [createExamination, { isLoading: isCreating }] =
        useCreateExaminationMutation();

    const [updateExamination, { isLoading: isUpdating }] =
        useUpdateExaminationMutation();

    const [deleteExamination] =
        useDeleteExaminationMutation();

    const exams = examsData?.examinations || [];
    const totalExams = exams.length;

    // -------------------- CREATE --------------------
    const handleCreate = () => {
        setSelectedExam(null);
        setFormData(initialFormState);
        setIsModalOpen(true);

    };

    // -------------------- EDIT --------------------

    const handleEdit = (exam) => {
        setSelectedExam(exam);
        setFormData({
            name: exam.name || '',
            examType: exam.examType || '',
            academicYear: exam.academicYear || '',
            term: exam.term || '',
            startDate: exam.startDate?.split('T')[0] || '',
            endDate: exam.endDate?.split('T')[0] || '',
            description: exam.description || '',
        });
        setIsModalOpen(true);
    };


    // -------------------- DELETE --------------------
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) return;

        try {
            await deleteExamination({ tenantName, id }).unwrap();
            refetch()
        } catch (err) {
            alert('Failed to delete exam');
        }
    };

    // -------------------- SUBMIT --------------------
    const handleSubmit = async (data) => {
        try {

            if (!data.name || !data.examType) {
                alert("Name and Exam Type are required");
                return;
            }

            if (data.endDate < data.startDate) {
                alert("End date must be after start date");
                return;
            }

            if (selectedExam) {
                await updateExamination({
                    tenantName,
                    id: selectedExam.id,
                    data
                }).unwrap();
            } else {
                await createExamination({
                    tenantName,
                    data
                }).unwrap();
            }

            setIsModalOpen(false);
            setFormData(initialFormState);
            setSelectedExam(null);

        } catch (err) {
            alert(err?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Exam Management
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm">
                        Manage examinations and schedules.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl shadow-lg hover:opacity-90 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Exam
                </button>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-4">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-400" />
                    <div>
                        <p className="text-slate-400 text-sm uppercase">
                            Total Exams
                        </p>
                        <p className="text-xl font-bold text-white">
                            {totalExams}
                        </p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-400">
                    {error?.data?.message || 'Failed to load exams'}
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                <ExamTable
                    data={exams}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modal Form */}
            <Form
                isOpen={isModalOpen}
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedExam}
                isLoading={isCreating || isUpdating}
                type="exam"
            />
        </div>
    );
};

export default ExamManagement;
