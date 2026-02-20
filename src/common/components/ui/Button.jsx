import React from 'react'
import {
    PlusIcon,
} from '@heroicons/react/24/outline';

const Button = ({ handleCreate, className, label }) => {
    return (
        <button
            onClick={handleCreate}
            className={className}
        >
            <PlusIcon className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90" />
            {label}
        </button>
    )
}

export default Button
