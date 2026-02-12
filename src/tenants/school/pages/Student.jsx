import React from 'react'

const student = () => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-cyan-400 mb-4">Student Management</h1>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-300">Welcome to the Student management module. This route is dynamic based on your tenant.</p>
            </div>
        </div>
    )
}

export default student