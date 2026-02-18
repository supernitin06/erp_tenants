import React from "react";
import { PencilSquareIcon, TrashIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const DataCards = ({
    data = [],
    fields = [],
    titleKey = "name",
    loading = false,
    emptyMessage = "No data found",
    onEdit,
    onDelete,
    extraContent,
}) => {
    // Skeleton Loader for better UX
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
                ))}
            </div>
        );
    }

    if (!data.length) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
            >
                <div className="text-gray-400 mb-2">📭</div>
                <p className="text-gray-500 font-medium">{emptyMessage}</p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {data.map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
                    >
                        {/* Header Area */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                {item[titleKey]}
                            </h3>

                            {/* Floating Badge or Icon (Optional) */}
                            <div className="h-2 w-2 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform" />
                        </div>

                        {/* Dynamic Fields with Icon/Bullet style */}
                        <div className="space-y-3">
                            {fields.map((field) => (
                                <div key={field.key} className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                                        {field.label}
                                    </span>
                                    <div className="text-sm text-gray-700 font-medium">
                                        {field.render
                                            ? field.render(item[field.key], item)
                                            : item[field.key] ?? <span className="text-gray-300">N/A</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Custom Content Slot */}
                        {extraContent && (
                            <div className="mt-4 pt-4 border-t border-gray-50">
                                {extraContent(item)}
                            </div>
                        )}

                        {/* Action Buttons: Neumorphic style */}
                        {(onEdit || onDelete) && (
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="flex items-center justify-center h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-sm"
                                        title="Edit"
                                    >
                                        <PencilSquareIcon className="h-4 w-4" />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="flex items-center justify-center h-9 w-9 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default DataCards;