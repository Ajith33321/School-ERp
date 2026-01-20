import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '../../utils/cn';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-[100px] opacity-40"></div>
            </div>

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className={cn(
                "flex-1 flex flex-col transition-all duration-500 relative z-10",
                isSidebarOpen ? "lg:ml-72" : "lg:ml-24"
            )}>
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </main>

                <footer className="p-8 border-t border-slate-100 text-center text-slate-400 text-xs font-bold tracking-widest uppercase">
                    &copy; 2026 EduFlow School ERP &bull; Premium Education Management
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;
