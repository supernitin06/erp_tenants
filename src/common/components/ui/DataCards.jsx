import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
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

    // Rainbow Skeleton Loader
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-44 rounded-xl relative overflow-hidden
                        bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 
                        dark:from-pink-950/30 dark:via-purple-950/30 dark:to-blue-950/30
                        animate-pulse"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                    </div>
                ))}
            </div>
        );
    }

    // Colorful Empty State
    if (!data.length) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 rounded-2xl relative overflow-hidden
                bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 
                dark:from-pink-600 dark:via-purple-600 dark:to-blue-600
                shadow-xl"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)]" />
                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-white text-lg font-bold mb-2 drop-shadow-lg">
                        {emptyMessage}
                    </p>
                    <p className="text-white/80 text-sm drop-shadow">
                        Ready to add some color? 🎨
                    </p>
                </div>
            </motion.div>
        );
    }

    // Vibrant color palette for cards
    const colorPalettes = [
        {
            gradient: "from-pink-500 to-rose-500",
            light: "bg-pink-50 dark:bg-pink-950/20",
            border: "border-pink-200 dark:border-pink-800",
            text: "text-pink-600 dark:text-pink-400",
            shadow: "shadow-pink-200 dark:shadow-pink-900/30"
        },
        {
            gradient: "from-purple-500 to-indigo-500",
            light: "bg-purple-50 dark:bg-purple-950/20",
            border: "border-purple-200 dark:border-purple-800",
            text: "text-purple-600 dark:text-purple-400",
            shadow: "shadow-purple-200 dark:shadow-purple-900/30"
        },
        {
            gradient: "from-blue-500 to-cyan-500",
            light: "bg-blue-50 dark:bg-blue-950/20",
            border: "border-blue-200 dark:border-blue-800",
            text: "text-blue-600 dark:text-blue-400",
            shadow: "shadow-blue-200 dark:shadow-blue-900/30"
        },
        {
            gradient: "from-green-500 to-emerald-500",
            light: "bg-green-50 dark:bg-green-950/20",
            border: "border-green-200 dark:border-green-800",
            text: "text-green-600 dark:text-green-400",
            shadow: "shadow-green-200 dark:shadow-green-900/30"
        },
        {
            gradient: "from-yellow-500 to-amber-500",
            light: "bg-yellow-50 dark:bg-yellow-950/20",
            border: "border-yellow-200 dark:border-yellow-800",
            text: "text-yellow-600 dark:text-yellow-400",
            shadow: "shadow-yellow-200 dark:shadow-yellow-900/30"
        },
        {
            gradient: "from-orange-500 to-red-500",
            light: "bg-orange-50 dark:bg-orange-950/20",
            border: "border-orange-200 dark:border-orange-800",
            text: "text-orange-600 dark:text-orange-400",
            shadow: "shadow-orange-200 dark:shadow-orange-900/30"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
                {data.map((item, index) => {
                    const colors = colorPalettes[index % colorPalettes.length];
                    
                    return (
                        <motion.div
                            key={item.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={`group relative rounded-xl overflow-hidden
                            bg-white dark:bg-gray-900
                            border-2 ${colors.border}
                            shadow-lg ${colors.shadow}
                            transition-all duration-300`}
                        >
                            {/* Colorful top bar */}
                            <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />
                            
                            {/* Colored background effect */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 
                            bg-gradient-to-br ${colors.gradient} transition-opacity duration-500`} />

                            <div className="relative p-5">
                                {/* Header with colored accent */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`text-lg font-bold ${colors.text}`}>
                                            {item[titleKey]}
                                        </h3>
                                        <div className={`h-1 w-12 bg-gradient-to-r ${colors.gradient} rounded-full mt-1`} />
                                    </div>

                                    {/* Colorful action buttons */}
                                    {(onEdit || onDelete) && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className={`p-2 rounded-lg
                                                    ${colors.light} ${colors.text}
                                                    hover:bg-gradient-to-r ${colors.gradient}
                                                    hover:text-white
                                                    shadow-md hover:shadow-lg
                                                    transition-all duration-300`}
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-2 rounded-lg
                                                    bg-red-50 text-red-600
                                                    dark:bg-red-950/20 dark:text-red-400
                                                    hover:bg-gradient-to-r from-red-500 to-pink-500
                                                    hover:text-white
                                                    shadow-md hover:shadow-lg
                                                    transition-all duration-300"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Fields with colorful badges */}
                                <div className="space-y-3">
                                    {fields.map((field) => (
                                        <div 
                                            key={field.key} 
                                            className="flex justify-between items-center
                                            border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
                                        >
                                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                                                {field.label}
                                            </span>

                                            <span className={`text-sm font-semibold px-3 py-1 rounded-full
                                            ${colors.light} ${colors.text}`}>
                                                {field.render
                                                    ? field.render(item[field.key], item)
                                                    : item[field.key] ?? "✨"}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Colorful extra content */}
                                {extraContent && (
                                    <div className={`mt-4 pt-3 border-t border-dashed ${colors.border}`}>
                                        <div className={`text-xs ${colors.text} opacity-80`}>
                                            {extraContent(item)}
                                        </div>
                                    </div>
                                )}

                                {/* Decorative color dots */}
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colors.gradient} opacity-50`} />
                                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colors.gradient} opacity-30`} />
                                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colors.gradient} opacity-10`} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default DataCards;