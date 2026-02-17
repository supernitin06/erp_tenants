import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FiUsers,
  FiBookOpen,
  FiClock,
  FiAward,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiMail,
  FiBarChart2,
  FiMapPin,
  FiStar,
  FiCalendar,
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiDownload,
  FiUpload,
  FiUserPlus
} from 'react-icons/fi';
import {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation
} from '../api/schoolApi';

// Teacher Form Modal Component
const TeacherFormModal = ({ isOpen, onClose, teacher, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    qualification: '',
    experience: '',
    joiningDate: '',
    address: '',
  });

  useEffect(() => {
    if (teacher && mode === 'edit') {
      setFormData(teacher);
    } else {
      resetForm();
    }
  }, [teacher, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      qualification: '',
      experience: '',
      joiningDate: '',
      address: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {mode === 'add' ? 'Add New Teacher' : 'Edit Teacher'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="john@school.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Full address"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Professional Information</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Ph.D. in Mathematics"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Experience (years)</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="5 Years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              {mode === 'add' ? 'Add Teacher' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Teacher Details Modal
const TeacherDetailsModal = ({ isOpen, onClose, teacher }) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Teacher Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
              {teacher.firstName?.[0]}{teacher.lastName?.[0]}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{teacher.firstName} {teacher.lastName}</h3>
              <p className="text-xs text-slate-500 mb-1">ID: {teacher.teacherId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-slate-900 dark:text-white">{teacher.email}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="text-slate-900 dark:text-white">{teacher.phone}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Qualification</p>
              <p className="text-slate-900 dark:text-white">{teacher.qualification || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Experience</p>
              <p className="text-slate-900 dark:text-white">{teacher.experience || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Joining Date</p>
              <p className="text-slate-900 dark:text-white">{teacher.joiningDate || 'N/A'}</p>
            </div>
          </div>

          {teacher.address && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Address</h4>
              <p className="text-slate-600 dark:text-slate-300">{teacher.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, teacherName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <div className="p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Delete Teacher</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
            Are you sure you want to delete <span className="text-slate-900 dark:text-white font-medium">{teacherName}</span>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Teacher Management Component
const TeacherManagement = () => {
  const { tenantName } = useParams();
  const { data: teachersData, isLoading, error: queryError } = useGetTeachersQuery(tenantName, {
    skip: !tenantName,
  });
  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [showFilters, setShowFilters] = useState(false);

  // Debugging: Log data to console to verify API response and Tenant
  useEffect(() => {
    console.log("Teacher Page - Tenant:", tenantName);
    console.log("Teacher Page - Data:", teachersData);
    console.log("Teacher Page - Error:", queryError);
  }, [tenantName, teachersData, queryError]);

  const teachers = React.useMemo(() => {
    if (!teachersData) return [];
    if (Array.isArray(teachersData)) return teachersData;
    if (Array.isArray(teachersData.teachers)) return teachersData.teachers;
    if (Array.isArray(teachersData.data)) return teachersData.data;
    return [];
  }, [teachersData]);

  // Filter teachers using useMemo (prevents render loops)
  const filteredTeachers = React.useMemo(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        (teacher.firstName + ' ' + teacher.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacherId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [teachers, searchTerm]);

  const handleAddTeacher = async (newTeacher) => {
    try {
      const teacherData = {
        ...newTeacher,
        joiningDate: newTeacher.joiningDate || null,
      };
      await createTeacher({ tenantName, data: teacherData }).unwrap();
    } catch (error) {
      console.error("Failed to create teacher", error);
      alert(error?.data?.message || "Failed to create teacher");
    }
  };

  const handleEditTeacher = async (updatedTeacher) => {
    try {
      const teacherData = {
        ...updatedTeacher,
        joiningDate: updatedTeacher.joiningDate || null,
      };
      await updateTeacher({ tenantName, id: updatedTeacher._id || updatedTeacher.id || updatedTeacher.teacherId, data: teacherData }).unwrap();
    } catch (error) {
      console.error("Failed to update teacher", error);
      alert(error?.data?.message || "Failed to update teacher");
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await deleteTeacher({ tenantName, id: id }).unwrap();
    } catch (error) {
      console.error("Failed to delete teacher", error);
      alert("Failed to delete teacher");
    }
  };

  const stats = [
    { label: 'Total Teachers', value: teachers.length.toString(), icon: FiUsers, color: 'blue', change: '+2 this month' },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Teacher Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Complete CRUD operations for faculty management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teachers by name, email, or ID..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setFormMode('add');
              setSelectedTeacher(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <FiUserPlus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Error Display */}
      {queryError && (
        <div className="bg-rose-500/10 backdrop-blur-sm rounded-xl border border-rose-500/20 p-4 text-rose-500 dark:text-rose-400 text-sm flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-500/20 rounded-lg">
                <FiAlertCircle className="h-5 w-5" />
            </div>
            <div>
                <p className="font-bold">Error: {queryError.status}</p>
                <p>
                  {queryError?.data?.message || 'Failed to load teachers. Please check the API endpoint and server status.'}
                </p>
            </div>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher._id || teacher.id || teacher.teacherId}
            className="bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{teacher.firstName} {teacher.lastName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {teacher.qualification}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-3">
              <div className="text-sm">
                <span className="text-slate-500">Experience</span>
                <p className="text-slate-900 dark:text-white font-medium">{teacher.experience || '0 Years'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <FiMail className="w-4 h-4" />
                <span className="truncate max-w-[150px]">{teacher.email}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setIsDetailsModalOpen(true);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-blue-400"
                  title="View Details"
                >
                  <FiEye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setFormMode('edit');
                    setIsFormModalOpen(true);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-purple-400"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
            <FiUsers className="w-12 h-12 text-slate-400 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No teachers found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or add a new teacher</p>
          <button
            onClick={() => {
              setFormMode('add');
              setSelectedTeacher(null);
              setIsFormModalOpen(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors inline-flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Add Your First Teacher
          </button>
        </div>
      )}

      {/* Modals */}
      <TeacherFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        teacher={selectedTeacher}
        onSubmit={formMode === 'add' ? handleAddTeacher : handleEditTeacher}
        mode={formMode}
      />

      <TeacherDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        teacher={selectedTeacher}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedTeacher && handleDeleteTeacher(selectedTeacher._id || selectedTeacher.id || selectedTeacher.teacherId)}
        teacherName={selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : ''}
      />
    </div>
  );
};

export default TeacherManagement;