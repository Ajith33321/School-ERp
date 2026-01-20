import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Book,
    Edit,
    Trash2,
    MoreVertical,
    Download,
    Upload
} from 'lucide-react';
import api from '../../services/api';

interface Category {
    id: string;
    name: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category_id: string;
    category_name: string;
    total_copies: number;
    available_copies: number;
    shelf_location: string;
}

const BookMaster: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        categoryId: '',
        shelfLocation: '',
        totalCopies: 1,
        publisher: '',
        language: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, [selectedCategory]);

    const fetchData = async () => {
        try {
            const [booksRes, catsRes] = await Promise.all([
                api.get(`library/books${selectedCategory ? `?categoryId=${selectedCategory}` : ''}`),
                api.get('library/categories')
            ]);
            setBooks(booksRes.data.data);
            setCategories(catsRes.data.data);
        } catch (error) {
            console.error('Error fetching library data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('library/books', formData);
            setIsModalOpen(false);
            fetchData();
            setFormData({
                title: '',
                author: '',
                isbn: '',
                categoryId: '',
                shelfLocation: '',
                totalCopies: 1,
                publisher: '',
                language: '',
                description: ''
            });
        } catch (error) {
            console.error('Error creating book:', error);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Book Master</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage library catalog and book availability</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <Upload size={18} />
                        Import
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Book
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, author or ISBN..."
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            className="input-field"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Filter size={18} />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Books Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Book Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">ISBN</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-center">Copies</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Shelf</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-4 h-16 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                                    <Book size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                                    <div className="text-xs text-gray-500">by {book.author}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{book.category_name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-gray-500">{book.isbn}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm font-medium text-gray-900">{book.available_copies} / {book.total_copies}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {book.shelf_location || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${book.available_copies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {book.available_copies > 0 ? 'Available' : 'Issued'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                <button className="p-1 hover:text-primary-600"><Edit size={16} /></button>
                                                <button className="p-1 hover:text-red-600"><Trash2 size={16} /></button>
                                                <button className="p-1 hover:text-gray-600"><MoreVertical size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No books found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Book Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0">
                            <h3 className="text-lg font-bold text-gray-900">Add New Book</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <form onSubmit={handleCreateBook} className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.isbn}
                                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                    <select
                                        required
                                        className="input-field"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Location</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.shelfLocation}
                                        onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="input-field"
                                        value={formData.totalCopies}
                                        onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.publisher}
                                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="input-field"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookMaster;
