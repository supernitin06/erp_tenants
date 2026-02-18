// import React, { useEffect } from 'react';
// import { XMarkIcon } from '@heroicons/react/24/outline';

// const Form = ({
//     isOpen,
//     formData,
//     setFormData,
//     onClose,
//     onSubmit,
//     initialData,
//     isLoading
// }) => {

//     useEffect(() => {
//         if (initialData) {
//             setFormData({
//                 ...initialData,
//                 dateOfBirth: initialData.dateOfBirth
//                     ? initialData.dateOfBirth.split('T')[0]
//                     : '',
//             });
//         } else {
//             const emptyData = Object.keys(formData).reduce((acc, key) => {
//                 acc[key] = '';
//                 return acc;
//             }, {});
//             setFormData(emptyData);
//         }
//     }, [initialData, isOpen]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const payload = {
//             ...formData,
//             dateOfBirth: formData.dateOfBirth
//                 ? new Date(formData.dateOfBirth)
//                 : null,
//         };
//         onSubmit(payload);
//     };

//     if (!isOpen) return null;

//     const inputStyle =
//         "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";

//     const labelStyle = "block text-sm font-medium text-slate-300 mb-1";

//     const formatLabel = (key) => {
//         return key
//             .replace(/([A-Z])/g, ' $1')
//             .replace(/^./, str => str.toUpperCase());
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

//             <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-fadeIn">

//                 {/* Header */}
//                 <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
//                     <h2 className="text-xl font-semibold text-white">
//                         {initialData ? 'Edit Student' : 'Add New Student'}
//                     </h2>
//                     <button
//                         onClick={onClose}
//                         className="p-2 rounded-lg hover:bg-slate-800 transition"
//                     >
//                         <XMarkIcon className="h-5 w-5 text-slate-400 hover:text-white" />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form
//                     onSubmit={handleSubmit}
//                     className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
//                 >

//                     {/* Section Title */}
//                     <div>
//                         <h3 className="text-sm uppercase tracking-wider text-cyan-400">
//                             Student Information
//                         </h3>
//                         <div className="h-px bg-slate-700 mt-2"></div>
//                     </div>

//                     {/* Grid Layout */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                         {Object.keys(formData).map((key) => {

//                             if (key === "address") {
//                                 return (
//                                     <div key={key} className="md:col-span-2">
//                                         <label className={labelStyle}>
//                                             {formatLabel(key)}
//                                         </label>
//                                         <textarea
//                                             name={key}
//                                             value={formData[key] || ''}
//                                             onChange={handleChange}
//                                             className={`${inputStyle} h-24 resize-none`}
//                                         />
//                                     </div>
//                                 );
//                             }

//                             if (key === "gender") {
//                                 return (
//                                     <div key={key}>
//                                         <label className={labelStyle}>
//                                             {formatLabel(key)}
//                                         </label>
//                                         <select
//                                             name={key}
//                                             value={formData[key] || ''}
//                                             onChange={handleChange}
//                                             className={inputStyle}
//                                         >
//                                             <option value="">Select Gender</option>
//                                             <option value="Male">Male</option>
//                                             <option value="Female">Female</option>
//                                             <option value="Other">Other</option>
//                                         </select>
//                                     </div>
//                                 );
//                             }

//                             return (
//                                 <div key={key}>
//                                     <label className={labelStyle}>
//                                         {formatLabel(key)}
//                                     </label>
//                                     <input
//                                         type={
//                                             key === "dateOfBirth"
//                                                 ? "date"
//                                                 : key === "email"
//                                                     ? "email"
//                                                     : key.toLowerCase().includes("phone")
//                                                         ? "tel"
//                                                         : "text"
//                                         }
//                                         name={key}
//                                         value={formData[key] || ''}
//                                         onChange={handleChange}
//                                         className={inputStyle}
//                                     />
//                                 </div>
//                             );
//                         })}

//                     </div>

//                     {/* Buttons */}
//                     <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition"
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-medium shadow-lg disabled:opacity-50"
//                         >
//                             {isLoading
//                                 ? "Saving..."
//                                 : initialData
//                                     ? "Update Student"
//                                     : "Create Student"}
//                         </button>
//                     </div>

//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Form;

import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Form = ({
    isOpen,
    formData,
    setFormData,
    onClose,
    onSubmit,
    initialData,
    isLoading,
    type = "student",
    classes = []
}) => {

    const formatType = (value) =>
        value.charAt(0).toUpperCase() + value.slice(1);

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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const inputStyle =
        "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";

    const labelStyle = "block text-sm font-medium text-slate-300 mb-1";

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

            <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">
                        {initialData
                            ? `Edit ${formatType(type)}`
                            : `Add New ${formatType(type)}`
                        }
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-800 transition"
                    >
                        <XMarkIcon className="h-5 w-5 text-slate-400 hover:text-white" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
                >

                    {/* Section Title */}
                    <div>
                        <h3 className="text-sm uppercase tracking-wider text-cyan-400">
                            {formatType(type)} Information
                        </h3>
                        <div className="h-px bg-slate-700 mt-2"></div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {Object.keys(formData).map((key) => {

                            if (key === "address") {
                                return (
                                    <div key={key} className="md:col-span-2">
                                        <label className={labelStyle}>
                                            {formatLabel(key)}
                                        </label>
                                        <textarea
                                            name={key}
                                            value={formData[key] || ''}
                                            onChange={handleChange}
                                            className={`${inputStyle} h-24 resize-none`}
                                        />
                                    </div>
                                );
                            }
                            if (key === "classId" && type === "exam") {
                                return (
                                    <div key={key}>
                                        <label className={labelStyle}>Class</label>
                                        <select
                                            name="classId"
                                            value={formData.classId || ''}
                                            onChange={handleChange}
                                            className={inputStyle}
                                        >
                                            <option value="">Select Class</option>

                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} {cls.section ? `- ${cls.section}` : ''}
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                );
                            }


                            if (key === "gender") {
                                return (
                                    <div key={key}>
                                        <label className={labelStyle}>
                                            {formatLabel(key)}
                                        </label>
                                        <select
                                            name={key}
                                            value={formData[key] || ''}
                                            onChange={handleChange}
                                            className={inputStyle}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                );
                            }

                            return (
                                <div key={key}>
                                    <label className={labelStyle}>
                                        {formatLabel(key)}
                                    </label>
                                    <input
                                        type={
                                            key === "dateOfBirth"
                                                ? "date"
                                                : key === "email"
                                                    ? "email"
                                                    : key.toLowerCase().includes("phone")
                                                        ? "tel"
                                                        : "text"
                                        }
                                        name={key}
                                        value={formData[key] || ''}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    />
                                </div>
                            );
                        })}

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-medium shadow-lg disabled:opacity-50"
                        >
                            {isLoading
                                ? "Saving..."
                                : initialData
                                    ? `Update ${formatType(type)}`
                                    : `Create ${formatType(type)}`
                            }
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Form;