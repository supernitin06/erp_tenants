import React from 'react';
import DummyTable from '../components/DummyTable';

const LibraryBooksManagement = () => {
    const data = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', status: 'Available' },
        { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', status: 'Checked Out' },
        { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0451524935', status: 'Available' },
        { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-1503290563', status: 'Available' },
        { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769488', status: 'Checked Out' },
    ];

    const columns = [
        { key: 'title', header: 'Title' },
        { key: 'author', header: 'Author' },
        { key: 'isbn', header: 'ISBN' },
        { key: 'status', header: 'Status' },
    ];

    const handleEdit = (item) => {
        alert(`Edit ${item.title}`);
    };

    const handleDelete = (item) => {
        alert(`Delete ${item.title}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Library Management
                </h1>
                <p className="text-slate-400 mt-2">Manage library inventory and borrowing.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-amber-500 w-64"
                        />
                        <select className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-amber-500">
                            <option>All Categories</option>
                            <option>Fiction</option>
                            <option>Non-Fiction</option>
                        </select>
                    </div>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-amber-500/20">
                        + Add Book
                    </button>
                </div>
                <DummyTable
                    title="Books Inventory"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default LibraryBooksManagement;
