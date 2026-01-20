import React from 'react';
import { Bell, Search, Menu, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    return (
        <header className="h-20 glass border-b border-white/20 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm backdrop-blur-xl">
            <div className="flex items-center space-x-6">
                <button
                    onClick={toggleSidebar}
                    className="p-3 rounded-xl lg:hidden text-slate-600 hover:bg-white/50 transition-all active:scale-95 shadow-sm bg-white"
                >
                    <Menu size={22} />
                </button>

                <div className="hidden md:flex items-center relative group">
                    <Search className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search for everything..."
                        className="pl-12 pr-6 py-3 bg-white border-2 border-slate-100 rounded-[18px] focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 w-80 text-sm font-medium transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="w-12 h-12 flex items-center justify-center text-slate-500 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-[16px] relative transition-all duration-300 shadow-sm border border-slate-100 active:scale-95 group">
                    <Bell size={22} className="group-hover:rotate-[15deg] transition-transform" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full border-2 border-white text-[10px] font-black text-white flex items-center justify-center animate-bounce shadow-md">3</span>
                </button>

                <div className="h-10 w-px bg-slate-200 mx-2 opacity-50"></div>

                <div className="flex items-center space-x-4 pl-2 group cursor-pointer hover:bg-white/50 p-2 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-900 leading-none tracking-tight">
                            {user ? `${user.firstName} ${user.lastName}` : 'Administrator'}
                        </p>
                        <p className="text-[10px] text-blue-500 mt-1.5 uppercase tracking-widest font-black opacity-80">
                            {user?.role || 'Super Admin'}
                        </p>
                    </div>

                    <div className="relative">
                        <div className="h-12 w-12 rounded-[18px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-lg transform group-hover:rotate-6 transition-transform">
                            {user ? user.firstName[0] : 'A'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                </div>

                <button
                    onClick={() => dispatch(logout())}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-[16px] border border-transparent transition-all active:scale-95"
                    title="Logout"
                >
                    <LogOut size={22} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
