import React, { useState } from 'react';
import {
    Search,
    Filter,
    UserPlus,
    Mail,
    Phone,
    BadgeCheck,
    MapPin,
    Briefcase,
    MoreHorizontal,
    ChevronRight,
    ChevronDown
} from 'lucide-react';

const StaffDirectory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const staffMembers = [
        {
            id: 1,
            name: 'Dr. Sarah Wilson',
            role: 'Senior Math Teacher',
            department: 'Mathematics',
            email: 's.wilson@school.com',
            phone: '+1 234 567 8901',
            status: 'Active',
            location: 'Room 302',
            avatar: 'SW',
            color: 'blue'
        },
        {
            id: 2,
            name: 'Mr. James Miller',
            role: 'History Head',
            department: 'Social Science',
            email: 'j.miller@school.com',
            phone: '+1 234 567 8902',
            status: 'Active',
            location: 'Room 105',
            avatar: 'JM',
            color: 'indigo'
        },
        {
            id: 3,
            name: 'Ms. Emily Chen',
            role: 'Biology Teacher',
            department: 'Science',
            email: 'e.chen@school.com',
            phone: '+1 234 567 8903',
            status: 'On Leave',
            location: 'Lab A',
            avatar: 'EC',
            color: 'teal'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Directory</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and connect with your elite teaching and support team.</p>
                </div>
                <button className="btn-3d btn-3d-primary py-3 px-8 shadow-xl shadow-blue-500/20">
                    <UserPlus size={20} className="animate-pulse" />
                    <span>Add Staff Member</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="card-modern p-4 border-none shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-4 justify-between items-center overflow-visible">
                <div className="relative flex-1 max-w-xl w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, role, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-modern pl-12 h-12 bg-slate-50/50 border-transparent focus:bg-white"
                    />
                </div>
                <button className="flex items-center space-x-2 px-6 py-3 border-2 border-slate-100 rounded-xl hover:bg-slate-50 hover:border-blue-200 transition-all font-bold text-slate-600">
                    <Filter size={18} />
                    <span>Advanced Filters</span>
                </button>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staffMembers.map((staff) => (
                    <div key={staff.id} className="card-modern p-0 group flex flex-col h-full border-none shadow-xl shadow-slate-200/40">
                        {/* Header with Gradient Background */}
                        <div className={`h-24 bg-gradient-to-br transition-all duration-500 rounded-t-3xl ${staff.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                            staff.color === 'indigo' ? 'from-indigo-600 to-purple-700' :
                                'from-teal-500 to-emerald-600'
                            }`}>
                            <div className="flex justify-end p-4">
                                <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="px-6 pb-6 relative flex-1 flex flex-col">
                            {/* Avatar Overlay */}
                            <div className="absolute -top-12 left-6">
                                <div className="h-24 w-24 bg-white p-1.5 rounded-3xl shadow-2xl group-hover:-translate-y-1 transition-transform duration-500">
                                    <div className={`h-full w-full rounded-[20px] flex items-center justify-center text-white font-black text-2xl shadow-inner ${staff.color === 'blue' ? 'bg-blue-500' :
                                        staff.color === 'indigo' ? 'bg-indigo-600' :
                                            'bg-teal-500'
                                        }`}>
                                        {staff.avatar}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14 flex-1">
                                <div className="space-y-1 mb-6">
                                    <div className="flex items-center">
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{staff.name}</h3>
                                        {staff.status === 'Active' && <BadgeCheck className="ml-2 text-blue-500 fill-blue-50" size={20} />}
                                    </div>
                                    <p className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center">
                                        <Briefcase size={14} className="mr-2" />
                                        {staff.role}
                                    </p>
                                </div>

                                <div className="space-y-4 text-sm text-slate-500 mb-8">
                                    <div className="flex items-start">
                                        <div className="p-2 bg-slate-50 rounded-lg mr-3 group-hover:bg-blue-50 transition-colors">
                                            <Mail size={16} className="text-slate-400 group-hover:text-blue-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</div>
                                            <div className="font-bold text-slate-700">{staff.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="p-2 bg-slate-50 rounded-lg mr-3 group-hover:bg-indigo-50 transition-colors">
                                            <Phone size={16} className="text-slate-400 group-hover:text-indigo-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</div>
                                            <div className="font-bold text-slate-700">{staff.phone}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="p-2 bg-slate-50 rounded-lg mr-3 group-hover:bg-teal-50 transition-colors">
                                            <MapPin size={16} className="text-slate-400 group-hover:text-teal-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location • Dept</div>
                                            <div className="font-bold text-slate-700">{staff.location} • {staff.department}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
                                <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${staff.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                    <div className={`h-1.5 w-1.5 rounded-full mr-2 ${staff.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                    {staff.status}
                                </span>
                                <button className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors flex items-center group/btn uppercase tracking-widest">
                                    View Full Profile
                                    <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffDirectory;
