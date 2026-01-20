import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Users, MapPin, Phone, Mail, X } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../utils/cn';

interface Branch {
    id: string;
    branch_name: string;
    branch_code: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    contact_person: string;
    email: string;
    phone: string;
    principal_id: string;
    principal_name: string;
    is_main_branch: boolean;
    status: string;
    staff_count: number;
}

const BranchManagement: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [formData, setFormData] = useState({
        branch_name: '',
        branch_code: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        contact_person: '',
        email: '',
        phone: '',
        is_main_branch: false,
        status: 'active'
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await api.get('branches');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBranch) {
                await api.put(`branches/${editingBranch.id}`, formData);
            } else {
                await api.post('branches', formData);
            }
            fetchBranches();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving branch:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this branch?')) return;

        try {
            await api.delete(`branches/${id}`);
            fetchBranches();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete branch');
        }
    };

    const handleEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setFormData({
            branch_name: branch.branch_name,
            branch_code: branch.branch_code,
            address: branch.address,
            city: branch.city,
            state: branch.state,
            country: branch.country,
            pincode: branch.pincode,
            contact_person: branch.contact_person,
            email: branch.email,
            phone: branch.phone,
            is_main_branch: branch.is_main_branch,
            status: branch.status
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBranch(null);
        setFormData({
            branch_name: '',
            branch_code: '',
            address: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
            contact_person: '',
            email: '',
            phone: '',
            is_main_branch: false,
            status: 'active'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Branch Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage multiple campuses and branches</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-3d btn-3d-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Branch
                </button>
            </div>

            {/* Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                    <div key={branch.id} className="card-modern group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                                    branch.is_main_branch ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-slate-500 to-slate-700"
                                )}>
                                    <Building2 className="text-white" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{branch.branch_name}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{branch.branch_code}</p>
                                </div>
                            </div>
                            {branch.is_main_branch && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded-lg">
                                    Main
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-start gap-2">
                                <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-600 font-medium">
                                    {branch.address}, {branch.city}, {branch.state} - {branch.pincode}
                                </p>
                            </div>
                            {branch.contact_person && (
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-slate-400" />
                                    <p className="text-sm text-slate-600 font-medium">{branch.contact_person}</p>
                                </div>
                            )}
                            {branch.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-slate-400" />
                                    <p className="text-sm text-slate-600 font-medium">{branch.email}</p>
                                </div>
                            )}
                            {branch.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-slate-400" />
                                    <p className="text-sm text-slate-600 font-medium">{branch.phone}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-blue-500" />
                                <span className="text-sm font-bold text-slate-700">{branch.staff_count} Staff</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(branch)}
                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(branch.id)}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {branches.length === 0 && (
                <div className="text-center py-20">
                    <Building2 size={64} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 mb-2">No Branches Yet</h3>
                    <p className="text-slate-500">Click "Add Branch" to create your first branch</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">
                                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Branch Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-modern w-full"
                                        value={formData.branch_name}
                                        onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Branch Code *</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-modern w-full"
                                        value={formData.branch_code}
                                        onChange={(e) => setFormData({ ...formData, branch_code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                                <textarea
                                    className="input-modern w-full"
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        className="input-modern w-full"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                                    <input
                                        type="text"
                                        className="input-modern w-full"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                                    <input
                                        type="text"
                                        className="input-modern w-full"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Pincode</label>
                                    <input
                                        type="text"
                                        className="input-modern w-full"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Person</label>
                                    <input
                                        type="text"
                                        className="input-modern w-full"
                                        value={formData.contact_person}
                                        onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        className="input-modern w-full"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="input-modern w-full"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_main_branch"
                                    checked={formData.is_main_branch}
                                    onChange={(e) => setFormData({ ...formData, is_main_branch: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300"
                                />
                                <label htmlFor="is_main_branch" className="text-sm font-bold text-slate-700">
                                    Mark as Main Branch
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-3d btn-3d-primary"
                                >
                                    {editingBranch ? 'Update Branch' : 'Create Branch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagement;
