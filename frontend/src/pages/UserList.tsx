import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Edit, Trash2, Mail, Phone, ChevronDown, Users } from 'lucide-react';
import api from '../services/api';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('users', {
                params: { search, role: roleFilter }
            });
            setUsers(response.data.data.users);
            setError(null);
        } catch (err: any) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage staff, student, and admin accounts with precision.</p>
                </div>
                <button className="btn-3d btn-3d-primary py-3 px-8 shadow-xl shadow-blue-500/20">
                    <UserPlus size={20} className="animate-pulse" /> Add New User
                </button>
            </div>

            <div className="card-modern border-none shadow-xl shadow-slate-200/50 p-0 overflow-visible">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or ID..."
                            className="input-modern pl-12 h-12 bg-slate-50/50 border-transparent focus:bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                className="input-modern pl-12 pr-10 h-12 bg-slate-50/50 border-transparent focus:bg-white appearance-none"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="School Admin">Admin</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Security Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-xl w-48"></div></td>
                                        <td className="px-8 py-6"><div className="h-8 bg-slate-100 rounded-lg w-24"></div></td>
                                        <td className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-lg w-40"></div></td>
                                        <td className="px-8 py-6 text-center"><div className="h-6 bg-slate-100 rounded-full w-16 mx-auto"></div></td>
                                        <td className="px-8 py-6"></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <Users size={48} className="text-slate-200" />
                                            </div>
                                            <div className="text-slate-400 font-medium italic">No users matching your current criteria found.</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300 mr-4">
                                                    {user.first_name[0]}{user.last_name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user.first_name} {user.last_name}</div>
                                                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">ID: {user.id.substring(0, 8).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.role_name === 'School Admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                user.role_name === 'Teacher' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    'bg-cyan-100 text-cyan-700 border border-cyan-200'
                                                }`}>
                                                {user.role_name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-xs font-bold text-slate-600">
                                                    <Mail size={14} className="mr-2 text-slate-400" /> {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center text-xs font-bold text-slate-500">
                                                        <Phone size={14} className="mr-2 text-slate-400" /> {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-100 text-slate-400 border border-slate-200'
                                                }`}>
                                                <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
