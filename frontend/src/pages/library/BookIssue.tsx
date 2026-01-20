import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    History,
    CheckCircle,
    AlertCircle,
    User,
    Calendar,
    ArrowRightLeft,
    Book
} from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../services/api';

interface IssueRecord {
    id: string;
    book_id: string;
    title: string;
    author: string;
    member_id: string;
    issue_date: string;
    due_date: string;
    return_date: string | null;
    status: string;
    fine_amount: number;
}

const BookIssue: React.FC = () => {
    const [issueRecords, setIssueRecords] = useState<IssueRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    // Form states
    const [issueData, setIssueData] = useState({
        bookId: '',
        memberId: '',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 15 days
    });

    const [returnData, setReturnData] = useState({
        issueId: '',
        fineAmount: 0
    });

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            // Updated to fetch all issues (or active ones)
            const res = await api.get('library/books'); // Simplified for demo, should ideally have a dedicated endpoint
            // For now we'll just show we can issue/return
            setLoading(false);
        } catch (error) {
            console.error('Error fetching issues:', error);
            setLoading(false);
        }
    };

    const handleIssueBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('library/issue', issueData);
            setIsIssueModalOpen(false);
            fetchIssues();
        } catch (error) {
            console.error('Error issuing book:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Book Issue & Return</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage book circulation and member history</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsIssueModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Issue New Book
                    </button>
                </div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 bg-blue-50 border-blue-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Book size={24} /></div>
                    <div>
                        <div className="text-2xl font-bold text-blue-900">124</div>
                        <div className="text-sm text-blue-600 font-medium">Books Issued</div>
                    </div>
                </div>
                <div className="card p-6 bg-amber-50 border-amber-100 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-lg text-amber-600"><AlertCircle size={24} /></div>
                    <div>
                        <div className="text-2xl font-bold text-amber-900">18</div>
                        <div className="text-sm text-amber-600 font-medium">Overdue Returns</div>
                    </div>
                </div>
                <div className="card p-6 bg-green-50 border-green-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600"><CheckCircle size={24} /></div>
                    <div>
                        <div className="text-2xl font-bold text-green-900">$45</div>
                        <div className="text-sm text-green-600 font-medium">Fine Collected Today</div>
                    </div>
                </div>
            </div>

            {/* Recent History Table */}
            <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <History size={18} />
                        Recent Transactions
                    </h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search history..." className="input-field pl-10 h-9 text-sm" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Transaction Info</th>
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Issue Date</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* Empty state or list here */}
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                                    No recent transactions found. Start by issuing a book.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Issue Modal */}
            {isIssueModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden gap-4">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ArrowRightLeft className="text-primary-600" size={20} />
                                Issue Book
                            </h3>
                            <button onClick={() => setIsIssueModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <form onSubmit={handleIssueBook} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Book *</label>
                                <div className="relative">
                                    <Book className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter Book ID or Title"
                                        required
                                        className="input-field pl-10"
                                        value={issueData.bookId}
                                        onChange={(e) => setIssueData({ ...issueData, bookId: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Member ID / Code *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter Member ID"
                                        required
                                        className="input-field pl-10"
                                        value={issueData.memberId}
                                        onChange={(e) => setIssueData({ ...issueData, memberId: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Return Due Date *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        required
                                        className="input-field pl-10"
                                        value={issueData.dueDate}
                                        onChange={(e) => setIssueData({ ...issueData, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3">
                                <AlertCircle className="text-blue-600 shrink-0" size={18} />
                                <p className="text-xs text-blue-700">Ensure the book is physically available before issuing. The member must have no overdue returns.</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsIssueModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Issue Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookIssue;
