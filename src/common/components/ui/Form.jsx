
// components/BeautifulForm.jsx
import React, { useEffect, useState } from 'react';
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  IdentificationIcon,
  CakeIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

const Form = ({
  isOpen,
  formData,
  setFormData,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  type = "student",
  classes = [],
  fields,
  title
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dateOfBirth: initialData.dateOfBirth
          ? initialData.dateOfBirth.split('T')[0]
          : '',
      });

      const imageField = Object.keys(fields || {}).find(key => fields[key].type === 'image');
      if (imageField && initialData[imageField]) {
        setImagePreview(initialData[imageField]);
      }
    } else {
      const emptyData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {});
      setFormData(emptyData);
      setImagePreview(null);
    }
  }, [initialData, isOpen, fields]); // Added fields and setFormData to dep array implicitly by scope but good to be explicit if needed, though usually stable.

  // useEffect(() => {
  //     if (initialData) {
  //         setFormData({
  //             ...initialData,
  //             dateOfBirth: initialData.dateOfBirth
  //                 ? initialData.dateOfBirth.split('T')[0]
  //                 : '',
  //         });
  //     } else {
  //         const emptyData = Object.keys(formData).reduce((acc, key) => {
  //             acc[key] = '';
  //             return acc;
  //         }, {});
  //         setFormData(emptyData);
  //     }
  // }, [initialData, isOpen]);


  useEffect(() => {
    if (initialData) {
      if (type === "student") {
        setFormData({
          ...initialData,
          dateOfBirth: initialData.dateOfBirth
            ? initialData.dateOfBirth.split('T')[0]
            : '',
        });
      } else if (type === "exam") {
        setFormData({
          name: initialData.name || '',
          examType: initialData.examType || '',
          academicYear: initialData.academicYear || '',
          term: initialData.term || '',
          startDate: initialData.startDate?.split('T')[0] || '',
          endDate: initialData.endDate?.split('T')[0] || '',
          description: initialData.description || '',
          classId: initialData.classId || ''
        });
      } else if (type === "exam schedule") {
        setFormData({
          subject: initialData.subject || '',
          examDate: initialData.examDate?.split('T')[0] || '',
          startTime: initialData.startTime || '',
          endTime: initialData.endTime || '',
          className: initialData.className || '',
          roomNumber: initialData.roomNumber || '',
        });
      } else if (type === "class") {
        setFormData({
          name: initialData.name || '',
          section: initialData.section || '',
          academicYear: initialData.academicYear || '',
          description: initialData.description || '',
        });
      } else {
        setFormData(initialData); // default fallback
      }
    } else {
      setFormData(Object.keys(formData).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {}));
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      dateOfBirth: formData.dateOfBirth
        ? new Date(formData.dateOfBirth)
        : null,
    };
    onSubmit(payload);
  };

  if (!isOpen) return null;

  // Field configuration with icons and types
  const defaultFieldConfig = {
    firstName: { icon: UserIcon, type: 'text', label: 'First Name', tab: 'basic' },
    lastName: { icon: UserIcon, type: 'text', label: 'Last Name', tab: 'basic' },
    email: { icon: EnvelopeIcon, type: 'email', label: 'Email Address', tab: 'contact' },
    phone: { icon: PhoneIcon, type: 'tel', label: 'Phone Number', tab: 'contact' },
    dateOfBirth: { icon: CakeIcon, type: 'date', label: 'Date of Birth', tab: 'personal' },
    gender: { icon: IdentificationIcon, type: 'select', label: 'Gender', tab: 'personal' },
    address: { icon: MapPinIcon, type: 'textarea', label: 'Address', tab: 'location' },
    city: { icon: MapPinIcon, type: 'text', label: 'City', tab: 'location' },
    country: { icon: GlobeAltIcon, type: 'text', label: 'Country', tab: 'location' },
    occupation: { icon: BriefcaseIcon, type: 'text', label: 'Occupation', tab: 'professional' },
  };

  const fieldConfig = fields || defaultFieldConfig;

  const inputStyle = `
    w-full bg-white dark:bg-slate-800/50 
    border border-slate-200 dark:border-slate-700 
    rounded-xl px-4 py-3 
    text-slate-900 dark:text-white 
    placeholder-slate-400 dark:placeholder-slate-500 
    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 
    transition-all duration-200
    hover:border-slate-300 dark:hover:border-slate-600
  `;

  const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ml-1";

  const formatLabel = (key) => {
    return fieldConfig[key]?.label || key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: UserIcon },
    { id: 'personal', name: 'Personal', icon: IdentificationIcon },
    { id: 'contact', name: 'Contact', icon: EnvelopeIcon },
    { id: 'location', name: 'Location', icon: MapPinIcon },
    { id: 'professional', name: 'Professional', icon: BriefcaseIcon },
  ];

  const renderField = (key) => {
    const config = fieldConfig[key];
    if (!config) return null;

    const Icon = config.icon || UserIcon;

    if (key === 'gender') {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            {['Male', 'Female', 'Other'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={key}
                  value={option}
                  checked={formData[key] === option}
                  onChange={handleChange}
                  className="w-4 h-4 text-cyan-600 bg-slate-100 border-slate-300 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (key === 'address') {
      return (
        <textarea
          name={key}
          value={formData[key] || ''}
          onChange={handleChange}
          rows="3"
          className={`${inputStyle} resize-none`}
          placeholder={`Enter ${formatLabel(key)}`}
        />
      );
    }

    if (config.type === 'image') {
      return (
        <div className="flex items-center space-x-4">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover border-4 border-cyan-500/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <CameraIcon className="h-8 w-8 text-white" />
              </div>
            )}
            <label
              htmlFor={key}
              className="absolute bottom-0 right-0 bg-cyan-600 p-1.5 rounded-full cursor-pointer hover:bg-cyan-700 transition-colors shadow-lg"
            >
              <CameraIcon className="h-4 w-4 text-white" />
            </label>
            <input
              type="file"
              id={key}
              name={key}
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {config.label || 'Upload Image'}
          </p>
        </div>
      );
    }

    return (
      <input
        type={config.type || 'text'}
        name={key}
        value={formData[key] || ''}
        onChange={handleChange}
        className={inputStyle}
        placeholder={`Enter ${formatLabel(key)}`}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">

      {/* Modal Container */}
      <div className="w-full max-w-4xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">

        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-5">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {initialData ? `Edit ${title}` : `Create New ${title}`}
              </h2>
              <p className="text-cyan-100 text-sm mt-1">
                {initialData ? 'Update the information below' : 'Fill in the details to create a new entry'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6">
          <nav className="flex space-x-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap
                    transition-all duration-200
                    ${activeTab === tab.id
                      ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Form Completion</span>
              <span>
                {Object.values(formData).filter(v => v && v !== '').length} / {Object.keys(formData).length} fields
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(Object.values(formData).filter(v => v && v !== '').length / Object.keys(formData).length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

            {/* Profile Image - Special Section */}
            {Object.keys(formData).some(key => fieldConfig[key]?.type === 'image') && (
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CameraIcon className="h-4 w-4 text-cyan-600" />
                  Image Upload
                </h3>
                {renderField(Object.keys(formData).find(key => fieldConfig[key]?.type === 'image'))}
              </div>
            )}

            {/* Dynamic Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.keys(formData)
                .filter(key => fieldConfig[key]?.type !== 'image' && fieldConfig[key]?.tab === activeTab)
                .map((key) => (
                  <div key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
                    <label className={labelStyle}>
                      <span className="flex items-center gap-2">
                        {fieldConfig[key]?.icon && React.createElement(fieldConfig[key].icon, { className: "h-4 w-4 text-cyan-600" })}
                        {formatLabel(key)}
                      </span>
                    </label>
                    {renderField(key)}
                  </div>
                ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative px-8 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    {initialData ? 'Update' : 'Create'} {title}
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>
        </form>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Form;