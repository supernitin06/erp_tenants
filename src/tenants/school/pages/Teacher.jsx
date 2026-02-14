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
    name: '',
    email: '',
    phone: '',
    subject: '',
    department: '',
    qualification: '',
    experience: '',
    joiningDate: '',
    salary: '',
    address: '',
    status: 'active',
    courses: [],
  });

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseInput, setCourseInput] = useState('');

  useEffect(() => {
    if (teacher && mode === 'edit') {
      setFormData(teacher);
      setSelectedCourses(teacher.courses || []);
    } else {
      resetForm();
    }
  }, [teacher, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      department: '',
      qualification: '',
      experience: '',
      joiningDate: '',
      salary: '',
      address: '',
      status: 'active',
      courses: [],
    });
    setSelectedCourses([]);
    setCourseInput('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = () => {
    if (courseInput.trim()) {
      const newCourses = [...selectedCourses, courseInput.trim()];
      setSelectedCourses(newCourses);
      setFormData(prev => ({ ...prev, courses: newCourses }));
      setCourseInput('');
    }
  };

  const handleRemoveCourse = (index) => {
    const newCourses = selectedCourses.filter((_, i) => i !== index);
    setSelectedCourses(newCourses);
    setFormData(prev => ({ ...prev, courses: newCourses }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'add' ? 'Add New Teacher' : 'Edit Teacher'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="john@school.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Full address"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Primary Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Advanced Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Ph.D. in Mathematics"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Salary ($/month)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="away">Away</option>
                  <option value="busy">Busy</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Courses Teaching</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                placeholder="Add a course (e.g., Calculus I)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCourse())}
              />
              <button
                type="button"
                onClick={handleAddCourse}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCourses.map((course, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300 flex items-center gap-2"
                >
                  {course}
                  <button
                    type="button"
                    onClick={() => handleRemoveCourse(index)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
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
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Teacher Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
              {teacher.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{teacher.name}</h3>
              <p className="text-slate-400">{teacher.subject} • {teacher.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-white">{teacher.email}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="text-white">{teacher.phone}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Qualification</p>
              <p className="text-white">{teacher.qualification || 'N/A'}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Experience</p>
              <p className="text-white">{teacher.experience || 'N/A'} years</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Joining Date</p>
              <p className="text-white">{teacher.joiningDate || 'N/A'}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Salary</p>
              <p className="text-white">${teacher.salary || 'N/A'}/month</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Courses Teaching</h4>
            <div className="flex flex-wrap gap-2">
              {teacher.courses && teacher.courses.length > 0 ? (
                teacher.courses.map((course, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                    {course}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">No courses assigned</p>
              )}
            </div>
          </div>

          {teacher.address && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Address</h4>
              <p className="text-slate-300">{teacher.address}</p>
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
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <div className="p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white text-center mb-2">Delete Teacher</h3>
          <p className="text-slate-400 text-center mb-6">
            Are you sure you want to delete <span className="text-white font-medium">{teacherName}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
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
  const { data: teachers = [], isLoading } = useGetTeachersQuery(tenantName);
  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [showFilters, setShowFilters] = useState(false);

  // Filter teachers based on search, department, and status
  useEffect(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(teacher => teacher.department === selectedDepartment);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === selectedStatus);
    }

    setFilteredTeachers(filtered);
  }, [searchTerm, selectedDepartment, selectedStatus, teachers]);

  const handleAddTeacher = async (newTeacher) => {
    try {
      const teacherData = {
        ...newTeacher,
        experience: newTeacher.experience ? Number(newTeacher.experience) : 0,
        salary: newTeacher.salary ? Number(newTeacher.salary) : 0,
        joiningDate: newTeacher.joiningDate || null,
        avatar: newTeacher.name.split(' ').map(n => n[0]).join(''),
        rating: 4.5,
        students: 0,
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
        experience: updatedTeacher.experience ? Number(updatedTeacher.experience) : 0,
        salary: updatedTeacher.salary ? Number(updatedTeacher.salary) : 0,
        joiningDate: updatedTeacher.joiningDate || null,
      };
      await updateTeacher({ tenantName, id: updatedTeacher.id, data: teacherData }).unwrap();
    } catch (error) {
      console.error("Failed to update teacher", error);
      alert(error?.data?.message || "Failed to update teacher");
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await deleteTeacher({ tenantName, id }).unwrap();
    } catch (error) {
      console.error("Failed to delete teacher", error);
      alert("Failed to delete teacher");
    }
  };

  const stats = [
    { label: 'Total Teachers', value: teachers.length.toString(), icon: FiUsers, color: 'blue', change: '+2 this month' },
    { label: 'Active Teachers', value: teachers.filter(t => t.status === 'active').length.toString(), icon: FiCheck, color: 'green', change: 'Currently teaching' },
    { label: 'Departments', value: [...new Set(teachers.map(t => t.department))].length.toString(), icon: FiBookOpen, color: 'purple', change: '8 subjects' },
    { label: 'Avg Rating', value: (teachers.reduce((acc, t) => acc + (t.rating || 0), 0) / teachers.length).toFixed(1) + ' ★', icon: FiAward, color: 'yellow', change: 'Excellent' },
  ];

  const departments = ['all', ...new Set(teachers.map(t => t.department))];
  const statuses = ['all', 'active', 'away', 'busy', 'inactive'];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Teacher Management
        </h1>
        <p className="text-slate-400">Complete CRUD operations for faculty management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-slate-500 group-hover:text-slate-400 transition-colors">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teachers by name, subject, department..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
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

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700 p-4 mb-6 animate-in slide-in-from-top-5 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {teacher.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{teacher.name}</h3>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <FiBookOpen className="w-3 h-3" />
                    {teacher.subject}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${teacher.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                  ${teacher.status === 'away' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                  ${teacher.status === 'busy' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                  ${teacher.status === 'inactive' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' : ''}
                `}>
                  {teacher.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-sm">
                <span className="text-slate-500">Students</span>
                <p className="text-white font-medium">{teacher.students || 0}</p>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Rating</span>
                <p className="text-yellow-400 font-medium flex items-center gap-1">
                  <FiStar className="w-3 h-3 fill-current" /> {teacher.rating || 'N/A'}
                </p>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Experience</span>
                <p className="text-white font-medium">{teacher.experience || 0} yrs</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {teacher.courses && teacher.courses.slice(0, 3).map((course, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-700/50 rounded-md text-xs text-slate-300 border border-slate-600"
                >
                  {course}
                </span>
              ))}
              {teacher.courses && teacher.courses.length > 3 && (
                <span className="px-2 py-1 bg-slate-700/50 rounded-md text-xs text-slate-300 border border-slate-600">
                  +{teacher.courses.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <FiMail className="w-4 h-4" />
                <span className="truncate max-w-[150px]">{teacher.email}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setIsDetailsModalOpen(true);
                  }}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-blue-400"
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
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-purple-400"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-red-400"
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
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <FiUsers className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No teachers found</h3>
          <p className="text-slate-400 mb-6">Try adjusting your filters or add a new teacher</p>
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
        onConfirm={() => selectedTeacher && handleDeleteTeacher(selectedTeacher.id)}
        teacherName={selectedTeacher?.name}
      />
    </div>
  );
};

export default TeacherManagement;
