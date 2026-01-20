import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Users,
    Calendar,
    Settings,
    ChevronLeft,
    LogOut,
    GraduationCap,
    BookOpen,
    ClipboardList,
    ChevronDown,
    ChevronRight,
    UserCheck,
    FileText,
    DollarSign,
    Wallet,
    Library,
    Boxes,
    Bus,
    Home,
    MessageSquare,
    HeartHandshake,
    CreditCard,
    Award,
    Monitor,
    BookMarked,
    Calculator,
    Globe,
    Smartphone,
    UserPlus,
    Mail,
    Chrome,
    Image,
    MessageCircle,
    Camera
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SubMenuItem {
    label: string;
    path: string;
    badge?: string;
}

interface MenuItem {
    id: string;
    label: string;
    icon: any;
    path?: string;
    subItems?: SubMenuItem[];
    color: string;
    badge?: string;
}

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'blue' },
        { id: 'branch', label: 'Branch', icon: Building2, path: '/branch', color: 'orange', badge: 'Pro' },
        {
            id: 'admissions', label: 'Admissions', icon: GraduationCap, subItems: [
                { label: 'Online Admission', path: '/online-admission' },
                { label: 'Applications', path: '/applications' },
                { label: 'New Admission', path: '/students/admit' },
                { label: 'ID Cards', path: '/id-cards' },
                { label: 'Certificates', path: '/certificates' },
            ], color: 'indigo'
        },
        { id: 'students', label: 'Students', icon: Users, path: '/users', color: 'cyan' },
        {
            id: 'academics', label: 'Academics', icon: BookOpen, subItems: [
                { label: 'Classes & Sections', path: '/academic/classes' },
                { label: 'Subjects', path: '/academic/subjects' },
                { label: 'Routines', path: '/academic/timetable' },
                { label: 'Study Materials', path: '/study-materials', badge: 'Pro' },
            ], color: 'purple'
        },
        { id: 'homework', label: 'Homework', icon: ClipboardList, path: '/homework', color: 'pink' },
        {
            id: 'attendance', label: 'Attendance', icon: UserCheck, subItems: [
                { label: 'Student Attendance', path: '/attendance/students' },
                { label: 'Leave Applications', path: '/attendance/leaves' },
                { label: 'Staff Attendance', path: '/attendance/staff' },
            ], color: 'green'
        },
        {
            id: 'exams', label: 'Examinations', icon: FileText, subItems: [
                { label: 'Exam Setup', path: '/exams/setup' },
                { label: 'Schedules', path: '/exams/schedules' },
                { label: 'Mark Entry', path: '/exams/marks' },
                { label: 'Online Examination', path: '/online-examination' },
            ], color: 'amber'
        },
        {
            id: 'finance', label: 'Finance', icon: DollarSign, subItems: [
                { label: 'Fee Setup', path: '/finance/setup' },
                { label: 'Fee Collection', path: '/finance/collect' },
                { label: 'Accounts', path: '/accounts' },
            ], color: 'orange'
        },
        {
            id: 'payroll', label: 'Payroll', icon: Wallet, subItems: [
                { label: 'Salary Setup', path: '/payroll/setup' },
                { label: 'Payroll Batches', path: '/payroll/batches' },
            ], color: 'emerald'
        },
        {
            id: 'facilities', label: 'Facilities', icon: Library, subItems: [
                { label: 'Library', path: '/library/books' },
                { label: 'Book Issue', path: '/library/issue' },
                { label: 'Inventory', path: '/inventory/items' },
                { label: 'Stock Inward', path: '/inventory/stock-in' },
            ], color: 'teal'
        },
        {
            id: 'transport', label: 'Transport', icon: Bus, subItems: [
                { label: 'Vehicles', path: '/transport/vehicles' },
                { label: 'Routes', path: '/transport/routes' },
            ], color: 'blue', badge: 'New'
        },
        {
            id: 'hostel', label: 'Hostel', icon: Home, subItems: [
                { label: 'Hostel Master', path: '/hostel/master' },
                { label: 'Room Allocation', path: '/hostel/allocation' },
            ], color: 'indigo'
        },
        {
            id: 'communication', label: 'Communication', icon: MessageSquare, subItems: [
                { label: 'Broadcast', path: '/comm/broadcast' },
                { label: 'Templates', path: '/comm/templates' },
                { label: 'Live Chat', path: '/live-chat' },
            ], color: 'cyan'
        },
        {
            id: 'hr', label: 'HR Management', icon: HeartHandshake, subItems: [
                { label: 'Staff Directory', path: '/hr/staff' },
                { label: 'Leave Management', path: '/hr/leave' },
            ], color: 'pink'
        },
        {
            id: 'management', label: 'Management', icon: ClipboardList, subItems: [
                { label: 'Reports', path: '/reports' },
                { label: 'Subscribers', path: '/subscribers' },
                { label: 'Contact Messages', path: '/contact-messages' },
            ], color: 'violet'
        },
        {
            id: 'website', label: 'Website', icon: Chrome, subItems: [
                { label: 'Website Setup', path: '/website' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Forums', path: '/forums' },
                { label: 'Memories', path: '/memories' },
            ], color: 'sky'
        },
        {
            id: 'settings', label: 'Settings', icon: Settings, subItems: [
                { label: 'General Settings', path: '/settings' },
                { label: 'Language', path: '/language' },
                { label: 'App Settings', path: '/app-settings' },
            ], color: 'slate'
        },
    ];

    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getColorClass = (color: string, isActive: boolean) => {
        if (isActive) {
            switch (color) {
                case 'blue': return 'bg-blue-500/20 text-blue-400';
                case 'indigo': return 'bg-indigo-500/20 text-indigo-400';
                case 'cyan': return 'bg-cyan-500/20 text-cyan-400';
                case 'purple': return 'bg-purple-500/20 text-purple-400';
                case 'pink': return 'bg-pink-500/20 text-pink-400';
                case 'green': return 'bg-green-500/20 text-green-400';
                case 'orange': return 'bg-orange-500/20 text-orange-400';
                case 'amber': return 'bg-amber-500/20 text-amber-400';
                case 'teal': return 'bg-teal-500/20 text-teal-400';
                default: return 'bg-white/10 text-white';
            }
        }
        return 'text-slate-400 hover:text-white hover:bg-white/5';
    };

    const getIconColor = (color: string) => {
        switch (color) {
            case 'blue': return 'text-blue-500';
            case 'indigo': return 'text-indigo-500';
            case 'cyan': return 'text-cyan-500';
            case 'purple': return 'text-purple-500';
            case 'pink': return 'text-pink-500';
            case 'green': return 'text-green-500';
            case 'orange': return 'text-orange-500';
            case 'amber': return 'text-amber-500';
            case 'teal': return 'text-teal-500';
            default: return 'text-slate-400';
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {!isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(true)}
                ></div>
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-full transition-all duration-500 z-30 shadow-2xl overflow-hidden",
                "bg-gradient-to-b from-[#0F172A] to-[#1E293B]",
                isOpen ? "w-72" : "w-24",
                !isOpen && "translate-x-0"
            )}>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                <div className="flex flex-col h-full relative z-10">
                    {/* Logo Section */}
                    <div className={cn(
                        "p-6 flex items-center justify-between mb-4",
                        !isOpen && "flex-col gap-4 px-2"
                    )}>
                        <div className={cn(
                            "flex items-center gap-3 transition-all duration-300",
                            !isOpen && "scale-75"
                        )}>
                            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 animate-float">
                                <GraduationCap className="text-white" size={28} />
                            </div>
                            {isOpen && (
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-white tracking-tighter leading-none">EduFlow</span>
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">School ERP</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all duration-300 shadow-inner"
                        >
                            <ChevronLeft className={cn("transition-transform duration-500", !isOpen && "rotate-180")} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto no-scrollbar">
                        {menuItems.map((item) => (
                            <div key={item.id} className="group/nav">
                                {item.subItems ? (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => toggleExpand(item.id)}
                                            className={cn(
                                                "w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300",
                                                expandedItems.includes(item.id) ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 icon-3d group-hover/nav:scale-110",
                                                expandedItems.includes(item.id) ? "bg-white/10" : "bg-transparent"
                                            )}>
                                                <item.icon size={22} className={cn("transition-colors", getIconColor(item.color))} />
                                            </div>
                                            {isOpen && (
                                                <>
                                                    <span className="ml-4 flex-1 text-left">{item.label}</span>
                                                    {item.badge && (
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider",
                                                            item.badge === 'Pro' ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"
                                                        )}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {expandedItems.includes(item.id) ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-500" />}
                                                </>
                                            )}
                                        </button>
                                        {isOpen && expandedItems.includes(item.id) && (
                                            <div className="ml-12 space-y-1 py-1 border-l-2 border-slate-700/50 pl-2">
                                                {item.subItems.map((sub) => (
                                                    <NavLink
                                                        key={sub.path}
                                                        to={sub.path}
                                                        className={({ isActive }) => cn(
                                                            "flex items-center justify-between px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300",
                                                            isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                                        )}
                                                    >
                                                        <span>{sub.label}</span>
                                                        {sub.badge && (
                                                            <span className={cn(
                                                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                                                sub.badge === 'Pro' ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"
                                                            )}>
                                                                {sub.badge}
                                                            </span>
                                                        )}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <NavLink
                                        to={item.path!}
                                        className={({ isActive }) => cn(
                                            "flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300",
                                            getColorClass(item.color, isActive),
                                            isActive && "shadow-xl"
                                        )}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className={cn(
                                                    "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 icon-3d group-hover/nav:scale-110",
                                                    isActive ? "bg-white/10" : "bg-transparent"
                                                )}>
                                                    <item.icon size={22} className={cn("transition-colors", isActive ? "text-white" : getIconColor(item.color))} />
                                                </div>
                                                {isOpen && <span className="ml-4">{item.label}</span>}
                                                {isActive && isOpen && <div className="ml-auto w-2 h-2 rounded-full bg-current animate-pulse"></div>}
                                            </>
                                        )}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Profile/Action */}
                    <div className="p-4 mt-auto">
                        <div className={cn(
                            "bg-white/5 rounded-3xl p-4 border border-white/5 backdrop-blur-md transition-all duration-300",
                            !isOpen && "p-2 items-center flex flex-col"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
                                    AD
                                </div>
                                {isOpen && (
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white leading-none">Admin User</span>
                                        <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Super Admin</span>
                                    </div>
                                )}
                            </div>
                            {isOpen && (
                                <button className="w-full mt-4 py-2.5 px-4 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 group/logout">
                                    <LogOut size={16} className="group-hover/logout:-translate-x-1 transition-transform" />
                                    <span>Sign Out</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
