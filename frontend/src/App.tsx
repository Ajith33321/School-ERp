import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Layouts
import MainLayout from './components/layout/MainLayout';
import OrgRegistrationWizard from './components/auth/OrgRegistrationWizard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Homework from './pages/Homework';
import AcademicYears from './pages/AcademicYears';
import ApplicationForm from './pages/public/ApplicationForm';
import ApplicationList from './pages/applications/ApplicationList';
import StudentAdmission from './pages/students/StudentAdmission';
import ClassManagement from './pages/academic/ClassManagement';
import SubjectManagement from './pages/academic/SubjectManagement';
import TimetableBuilder from './pages/academic/TimetableBuilder';
import AttendanceMarking from './pages/attendance/AttendanceMarking';
import LeaveApplications from './pages/attendance/LeaveApplications';
import StaffAttendance from './pages/attendance/StaffAttendance';
import ExamTypeSetup from './pages/exams/ExamTypeSetup';
import ExamList from './pages/exams/ExamList';
import MarkEntry from './pages/exams/MarkEntry';
import FeeSetup from './pages/finance/FeeSetup';
import FeeCollection from './pages/finance/FeeCollection';
import SalarySetup from './pages/payroll/SalarySetup';
import PayrollBatches from './pages/payroll/PayrollBatches';
import BookMaster from './pages/library/BookMaster';
import BookIssue from './pages/library/BookIssue';
import ItemMaster from './pages/inventory/ItemMaster';
import StockInward from './pages/inventory/StockInward';
import VehicleMaster from './pages/transport/VehicleMaster';
import RouteMaster from './pages/transport/RouteMaster';
import HostelMaster from './pages/hostel/HostelMaster';
import RoomAllocation from './pages/hostel/RoomAllocation';
import CommCenter from './pages/comm/CommCenter';
import CommTemplates from './pages/comm/CommTemplates';
import LeaveManagement from './pages/hr/LeaveManagement';
import StaffDirectory from './pages/hr/StaffDirectory';
import GeneralSettings from './pages/settings/GeneralSettings';
import AcademicSessions from './pages/settings/AcademicSessions';

// Pages (Placeholders for now)


const App: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={<OrgRegistrationWizard />} />

                {/* Protected Routes */}
                <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/organizations" element={<div>Organizations Page</div>} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/homework" element={<Homework />} />
                    <Route path="/academic-years" element={<AcademicYears />} />
                    <Route path="/applications" element={<ApplicationList />} />
                    <Route path="/students/admit" element={<StudentAdmission />} />
                    <Route path="/academic/classes" element={<ClassManagement />} />
                    <Route path="/academic/subjects" element={<SubjectManagement />} />
                    <Route path="/academic/timetable" element={<TimetableBuilder />} />
                    <Route path="/attendance/students" element={<AttendanceMarking />} />
                    <Route path="/attendance/leaves" element={<LeaveApplications />} />
                    <Route path="/attendance/staff" element={<StaffAttendance />} />
                    <Route path="/exams/setup" element={<ExamTypeSetup />} />
                    <Route path="/exams/schedules" element={<ExamList />} />
                    <Route path="/exams/marks" element={<MarkEntry />} />
                    <Route path="/finance/setup" element={<FeeSetup />} />
                    <Route path="/finance/collect" element={<FeeCollection />} />
                    <Route path="/payroll/setup" element={<SalarySetup />} />
                    <Route path="/payroll/batches" element={<PayrollBatches />} />
                    <Route path="/library/books" element={<BookMaster />} />
                    <Route path="/library/issue" element={<BookIssue />} />
                    <Route path="/inventory/items" element={<ItemMaster />} />
                    <Route path="/inventory/stock-in" element={<StockInward />} />
                    <Route path="/transport/vehicles" element={<VehicleMaster />} />
                    <Route path="/transport/routes" element={<RouteMaster />} />
                    <Route path="/hostel/master" element={<HostelMaster />} />
                    <Route path="/hostel/allocation" element={<RoomAllocation />} />
                    <Route path="/comm/broadcast" element={<CommCenter />} />
                    <Route path="/comm/templates" element={<CommTemplates />} />
                    <Route path="/hr/leave" element={<LeaveManagement />} />
                    <Route path="/hr/staff" element={<StaffDirectory />} />
                    <Route path="/academic-years" element={<AcademicSessions />} />
                    <Route path="/settings" element={<GeneralSettings />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Route>

                <Route path="/apply" element={<ApplicationForm />} />

                {/* 404 Route */}
                <Route path="*" element={<div className="min-h-screen flex items-center justify-center">404 - Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
