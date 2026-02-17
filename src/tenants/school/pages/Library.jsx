import React, { useState, useEffect, useMemo } from 'react';
import {
    PlusIcon,
    BookOpenIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    SparklesIcon,
    PencilIcon,
    TrashIcon,
    BuildingLibraryIcon,
    DocumentTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';

// API service imports (you'll need to create these)
import {
    useGetAllLibrariesQuery,
    useGetLibraryByIdQuery,
    useCreateLibraryMutation,
    useUpdateLibraryMutation,
    useDeleteLibraryMutation,
    useGetBooksByLibraryQuery,
    useGetBookDetailsQuery,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation
} from '../api/libraryApi';

const Library = () => {
    const { tenantName, libraryId } = useParams();
    const [selectedView, setSelectedView] = useState('libraries'); // 'libraries' or 'books'
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'library' or 'book'
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form states
    const [libraryForm, setLibraryForm] = useState({
        name: '',
        location: '',
        librarian: '',
        contact: '',
        email: '',
        establishedYear: '',
        totalCapacity: '',
        workingHours: '',
        description: ''
    });

    const [bookForm, setBookForm] = useState({
        title: '',
        author: '',
        isbn: '',
        category: '',
        publisher: '',
        publishYear: '',
        edition: '',
        pages: '',
        language: '',
        quantity: '',
        shelf: '',
        rack: '',
        description: '',
        price: ''
    });

    // API Hooks
    const { data: librariesData, isLoading: librariesLoading, error: librariesError, refetch: refetchLibraries } = useGetAllLibrariesQuery(tenantName);
    const { data: selectedLibraryData, refetch: refetchLibrary } = useGetLibraryByIdQuery(
        { tenantName, id: selectedLibrary?.id },
        { skip: !selectedLibrary?.id }
    );
    const { data: booksData, isLoading: booksLoading, refetch: refetchBooks } = useGetBooksByLibraryQuery(
        { tenantName, libraryId: selectedLibrary?.id },
        { skip: !selectedLibrary?.id }
    );

    const [createLibrary, { isLoading: isCreatingLibrary }] = useCreateLibraryMutation();
    const [updateLibrary, { isLoading: isUpdatingLibrary }] = useUpdateLibraryMutation();
    const [deleteLibrary] = useDeleteLibraryMutation();
    const [addBook, { isLoading: isAddingBook }] = useAddBookMutation();
    const [updateBook, { isLoading: isUpdatingBook }] = useUpdateBookMutation();
    const [deleteBook] = useDeleteBookMutation();

    // Process data
    const libraries = useMemo(() => {
        if (!librariesData) return [];
        return Array.isArray(librariesData) ? librariesData : 
               librariesData?.data || librariesData?.libraries || [];
    }, [librariesData]);

    const books = useMemo(() => {
        if (!booksData) return [];
        return Array.isArray(booksData) ? booksData : 
               booksData?.data || booksData?.books || [];
    }, [booksData]);

    // Filter libraries
    const filteredLibraries = useMemo(() => {
        return libraries.filter(library => 
            library.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            library.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            library.librarian?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [libraries, searchTerm]);

    // Filter books
    const filteredBooks = useMemo(() => {
        return books.filter(book => 
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [books, searchTerm]);

    // Pagination
    const paginatedLibraries = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredLibraries.slice(start, start + itemsPerPage);
    }, [filteredLibraries, currentPage]);

    const paginatedBooks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBooks.slice(start, start + itemsPerPage);
    }, [filteredBooks, currentPage]);

    const totalPages = Math.ceil(
        (selectedView === 'libraries' ? filteredLibraries.length : filteredBooks.length) / itemsPerPage
    );

    // Handlers
    const handleAddLibrary = () => {
        setModalType('library');
        setSelectedItem(null);
        setLibraryForm({
            name: '',
            location: '',
            librarian: '',
            contact: '',
            email: '',
            establishedYear: '',
            totalCapacity: '',
            workingHours: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleAddBook = () => {
        if (!selectedLibrary) {
            alert('Please select a library first');
            return;
        }
        setModalType('book');
        setSelectedItem(null);
        setBookForm({
            title: '',
            author: '',
            isbn: '',
            category: '',
            publisher: '',
            publishYear: '',
            edition: '',
            pages: '',
            language: '',
            quantity: '',
            shelf: '',
            rack: '',
            description: '',
            price: ''
        });
        setIsModalOpen(true);
    };

    const handleEditLibrary = (library) => {
        setModalType('library');
        setSelectedItem(library);
        setLibraryForm({
            name: library.name || '',
            location: library.location || '',
            librarian: library.librarian || '',
            contact: library.contact || '',
            email: library.email || '',
            establishedYear: library.establishedYear || '',
            totalCapacity: library.totalCapacity || '',
            workingHours: library.workingHours || '',
            description: library.description || ''
        });
        setIsModalOpen(true);
    };

    const handleEditBook = (book) => {
        setModalType('book');
        setSelectedItem(book);
        setBookForm({
            title: book.title || '',
            author: book.author || '',
            isbn: book.isbn || '',
            category: book.category || '',
            publisher: book.publisher || '',
            publishYear: book.publishYear || '',
            edition: book.edition || '',
            pages: book.pages || '',
            language: book.language || '',
            quantity: book.quantity || '',
            shelf: book.shelf || '',
            rack: book.rack || '',
            description: book.description || '',
            price: book.price || ''
        });
        setIsModalOpen(true);
    };

    const handleDeleteLibrary = async (id) => {
        if (window.confirm('Are you sure you want to delete this library? This will also delete all books in this library.')) {
            try {
                await deleteLibrary({ tenantName, id }).unwrap();
                refetchLibraries();
            } catch (error) {
                alert('Failed to delete library');
            }
        }
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook({ tenantName, id }).unwrap();
                refetchBooks();
            } catch (error) {
                alert('Failed to delete book');
            }
        }
    };

    const handleLibrarySubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedItem) {
                await updateLibrary({
                    tenantName,
                    id: selectedItem.id,
                    data: libraryForm
                }).unwrap();
            } else {
                await createLibrary({
                    tenantName,
                    data: libraryForm
                }).unwrap();
            }
            setIsModalOpen(false);
            refetchLibraries();
        } catch (error) {
            alert(error?.data?.message || 'Something went wrong');
        }
    };

    const handleBookSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedItem) {
                await updateBook({
                    tenantName,
                    id: selectedItem.id,
                    data: bookForm
                }).unwrap();
            } else {
                await addBook({
                    tenantName,
                    libraryId: selectedLibrary.id,
                    data: bookForm
                }).unwrap();
            }
            setIsModalOpen(false);
            refetchBooks();
        } catch (error) {
            alert(error?.data?.message || 'Something went wrong');
        }
    };

    const handleViewLibrary = (library) => {
        setSelectedLibrary(library);
        setSelectedView('books');
        setCurrentPage(1);
        setSearchTerm('');
    };

    const handleBackToLibraries = () => {
        setSelectedLibrary(null);
        setSelectedView('libraries');
        setCurrentPage(1);
        setSearchTerm('');
    };

    // Stats
    const totalLibraries = libraries.length;
    const totalBooks = books.length;
    const availableBooks = books.filter(b => b.quantity > 0).length;
    const uniqueCategories = [...new Set(books.map(b => b.category))].length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
            
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                                    <div className="relative p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl">
                                        <BuildingLibraryIcon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {selectedView === 'books' && selectedLibrary ? (
                                            <>
                                                <button
                                                    onClick={handleBackToLibraries}
                                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                                >
                                                    <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                                </button>
                                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                    {selectedLibrary.name}
                                                </h1>
                                            </>
                                        ) : (
                                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                Library Management
                                            </h1>
                                        )}
                                        <SparklesIcon className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {selectedView === 'books' && selectedLibrary 
                                            ? `Manage books in ${selectedLibrary.name} library`
                                            : 'Manage libraries and their book collections'}
                                    </p>
                                </div>
                            </div>
                            
                            <button
                                onClick={selectedView === 'libraries' ? handleAddLibrary : handleAddBook}
                                className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <PlusIcon className="h-5 w-5 mr-2 relative z-10 transition-transform group-hover:rotate-90" />
                                <span className="relative z-10">
                                    {selectedView === 'libraries' ? 'Add Library' : 'Add Book'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {selectedView === 'libraries' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-lg shadow-lg">
                                    <BuildingLibraryIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Libraries</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{totalLibraries}</p>
                                </div>
                            </div>
                        </div>
                        <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg shadow-lg">
                                    <BookOpenIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Books</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{totalBooks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-lg shadow-lg">
                                    <CheckCircleIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Available Books</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{availableBooks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-amber-600 to-amber-400 rounded-lg shadow-lg">
                                    <DocumentTextIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{uniqueCategories}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-lg shadow-lg">
                                    <BookOpenIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Books</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{totalBooks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-lg shadow-lg">
                                    <CheckCircleIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{availableBooks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg shadow-lg">
                                    <DocumentTextIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{uniqueCategories}</p>
                                </div>
                            </div>
                        </div>
                        <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-amber-600 to-amber-400 rounded-lg shadow-lg">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Issued</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{totalBooks - availableBooks}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder={selectedView === 'libraries' 
                                ? "Search libraries by name, location, or librarian..." 
                                : "Search books by title, author, ISBN, or category..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="relative w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {librariesError && (
                    <div className="mb-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-600 dark:text-rose-400">
                        <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">
                            {librariesError?.data?.message || 'Failed to load libraries. Please check your permissions.'}
                            {librariesError?.status === 403 && ' (Access Forbidden)'}
                        </p>
                    </div>
                )}

                {/* Main Content - Libraries View */}
                {selectedView === 'libraries' && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                        {librariesLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : paginatedLibraries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <BuildingLibraryIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No libraries found</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'Try a different search' : 'Add your first library to get started'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedLibraries.map((library) => (
                                    <div key={library.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                                                        <BuildingLibraryIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {library.name}
                                                    </h3>
                                                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs">
                                                        {library.totalBooks || 0} books
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="text-gray-400">📍</span>
                                                        {library.location || 'Location not specified'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="text-gray-400">👤</span>
                                                        {library.librarian || 'No librarian assigned'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="text-gray-400">📞</span>
                                                        {library.contact || 'No contact'}
                                                    </div>
                                                </div>

                                                {library.description && (
                                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        {library.description}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleViewLibrary(library)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"
                                                    title="View Books"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditLibrary(library)}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/20 rounded-lg transition-colors"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLibrary(library.id)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-colors"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content - Books View */}
                {selectedView === 'books' && selectedLibrary && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                        {booksLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : paginatedBooks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <BookOpenIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No books found</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'Try a different search' : 'Add your first book to this library'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Book Details</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ISBN</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shelf/Rack</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {paginatedBooks.map((book) => (
                                            <tr key={book.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mr-3 text-white">
                                                            📚
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {book.title}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {book.publisher} • {book.publishYear}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {book.author}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                    {book.isbn}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-medium">
                                                        {book.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {book.shelf || '-'} / {book.rack || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{book.quantity}</span>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">available</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleEditBook(book)}
                                                        className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-400 mr-3"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        className="text-rose-600 hover:text-rose-800 dark:hover:text-rose-400"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {currentPage} of {totalPages} pages
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-colors"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-colors"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit Library */}
            {isModalOpen && modalType === 'library' && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedItem ? 'Edit Library' : 'Add New Library'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleLibrarySubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Library Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={libraryForm.name}
                                            onChange={(e) => setLibraryForm({...libraryForm, name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={libraryForm.location}
                                            onChange={(e) => setLibraryForm({...libraryForm, location: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Librarian Name</label>
                                        <input
                                            type="text"
                                            value={libraryForm.librarian}
                                            onChange={(e) => setLibraryForm({...libraryForm, librarian: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            value={libraryForm.contact}
                                            onChange={(e) => setLibraryForm({...libraryForm, contact: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={libraryForm.email}
                                            onChange={(e) => setLibraryForm({...libraryForm, email: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Established Year</label>
                                        <input
                                            type="number"
                                            value={libraryForm.establishedYear}
                                            onChange={(e) => setLibraryForm({...libraryForm, establishedYear: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Capacity</label>
                                        <input
                                            type="number"
                                            value={libraryForm.totalCapacity}
                                            onChange={(e) => setLibraryForm({...libraryForm, totalCapacity: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Working Hours</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 9 AM - 6 PM"
                                            value={libraryForm.workingHours}
                                            onChange={(e) => setLibraryForm({...libraryForm, workingHours: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={libraryForm.description}
                                        onChange={(e) => setLibraryForm({...libraryForm, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreatingLibrary || isUpdatingLibrary}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-colors disabled:opacity-50"
                                    >
                                        {isCreatingLibrary || isUpdatingLibrary ? 'Saving...' : (selectedItem ? 'Update' : 'Create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Add/Edit Book */}
            {isModalOpen && modalType === 'book' && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 py-8">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedItem ? 'Edit Book' : 'Add New Book'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleBookSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Book Title *</label>
                                        <input
                                            type="text"
                                            required
                                            value={bookForm.title}
                                            onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author *</label>
                                        <input
                                            type="text"
                                            required
                                            value={bookForm.author}
                                            onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN *</label>
                                        <input
                                            type="text"
                                            required
                                            value={bookForm.isbn}
                                            onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                                        <input
                                            type="text"
                                            required
                                            value={bookForm.category}
                                            onChange={(e) => setBookForm({...bookForm, category: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publisher</label>
                                        <input
                                            type="text"
                                            value={bookForm.publisher}
                                            onChange={(e) => setBookForm({...bookForm, publisher: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish Year</label>
                                        <input
                                            type="number"
                                            value={bookForm.publishYear}
                                            onChange={(e) => setBookForm({...bookForm, publishYear: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Edition</label>
                                        <input
                                            type="text"
                                            value={bookForm.edition}
                                            onChange={(e) => setBookForm({...bookForm, edition: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pages</label>
                                        <input
                                            type="number"
                                            value={bookForm.pages}
                                            onChange={(e) => setBookForm({...bookForm, pages: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                                        <input
                                            type="text"
                                            value={bookForm.language}
                                            onChange={(e) => setBookForm({...bookForm, language: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity *</label>
                                        <input
                                            type="number"
                                            required
                                            value={bookForm.quantity}
                                            onChange={(e) => setBookForm({...bookForm, quantity: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={bookForm.price}
                                            onChange={(e) => setBookForm({...bookForm, price: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shelf</label>
                                        <input
                                            type="text"
                                            value={bookForm.shelf}
                                            onChange={(e) => setBookForm({...bookForm, shelf: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rack</label>
                                        <input
                                            type="text"
                                            value={bookForm.rack}
                                            onChange={(e) => setBookForm({...bookForm, rack: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <textarea
                                            rows="3"
                                            value={bookForm.description}
                                            onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isAddingBook || isUpdatingBook}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-colors disabled:opacity-50"
                                    >
                                        {isAddingBook || isUpdatingBook ? 'Saving...' : (selectedItem ? 'Update' : 'Add')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;