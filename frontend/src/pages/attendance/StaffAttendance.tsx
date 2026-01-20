import React, { useState, useEffect } from 'react';
import {
    Clock,
    MapPin,
    Monitor,
    LogIn,
    LogOut,
    Calendar,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const StaffAttendance: React.FC = () => {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ present: 0, late: 0, absent: 0 });
    const [checkedIn, setCheckedIn] = useState(false);
    const [todayRecord, setTodayRecord] = useState<any>(null);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

            const res = await api.get('/attendance/staff', {
                params: { startDate: startOfMonth, endDate: today }
            });

            setAttendance(res.data.data);

            // Check if today is already marked
            const todayRec = res.data.data.find((r: any) => r.attendance_date.startsWith(today));
            if (todayRec) {
                setTodayRecord(todayRec);
                if (todayRec.check_in_time && !todayRec.check_out_time) setCheckedIn(true);
            }
        } catch (err) {
            console.error('Failed to fetch staff attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            const res = await api.post('/attendance/staff/check-in', {
                deviceId: navigator.userAgent.substring(0, 50),
                ipAddress: '127.0.0.1', // Placeholder
                locationLat: 0,
                locationLong: 0
            });
            setCheckedIn(true);
            setTodayRecord(res.data.data);
            fetchAttendance();
            alert('Checked in successfully');
        } catch (err) {
            alert('Failed to check in');
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/attendance/staff/check-out');
            setCheckedIn(false);
            fetchAttendance();
            alert('Checked out successfully');
        } catch (err) {
            alert('Failed to check out');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Staff Attendance</h1>
                    <p className="text-gray-500">Track your daily working hours and attendance.</p>
                </div>
                <div className="text-sm font-bold bg-gray-100 px-4 py-2 rounded-lg">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6 text-gray-900">
                    <div className="card p-8 text-center bg-white shadow-sm border-none">
                        <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Clock size={32} />
                        </div>
                        <h2 className="text-xl font-bold mb-1">Daily Log</h2>
                        <p className="text-sm text-gray-400 mb-8 font-medium italic">Record your work hours</p>

                        {todayRecord?.check_in_time ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Check In</div>
                                        <div className="text-lg font-bold text-primary-600">{todayRecord.check_in_time}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Check Out</div>
                                        <div className="text-lg font-bold text-gray-600">{todayRecord.check_out_time || '--:--'}</div>
                                    </div>
                                </div>

                                {!todayRecord.check_out_time ? (
                                    <button
                                        onClick={handleCheckOut}
                                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-red-100"
                                    >
                                        <LogOut size={20} className="mr-2" /> Check Out
                                    </button>
                                ) : (
                                    <div className="py-4 bg-green-50 text-green-700 rounded-xl font-bold flex items-center justify-center border border-green-100 italic">
                                        <CheckCircle size={20} className="mr-2" /> Shift Completed
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleCheckIn}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-primary-100"
                            >
                                <LogIn size={20} className="mr-2" /> Check In Now
                            </button>
                        )}

                        <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                            <div className="flex items-center text-xs text-left">
                                <Monitor size={14} className="mr-2 text-gray-400" />
                                <span className="truncate">{navigator.platform}</span>
                            </div>
                            <div className="flex items-center text-xs text-left justify-end">
                                <MapPin size={14} className="mr-2 text-gray-400" />
                                <span>Local IP</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6 text-gray-900">
                    <div className="card bg-white shadow-sm border-none overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold">Recent Attendance History</h2>
                            <button className="text-xs font-bold text-primary-600 hover:text-primary-700 px-3 py-1 bg-primary-50 rounded-full">View Full Report</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Check In</th>
                                        <th className="px-6 py-4">Check Out</th>
                                        <th className="px-6 py-4">Total Hrs</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {attendance.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold">{new Date(rec.attendance_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-primary-600">{rec.check_in_time}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-600">{rec.check_out_time || '--:--'}</td>
                                            <td className="px-6 py-4 text-sm font-bold">{rec.total_hours || '0.00'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${rec.status === 'present' ? 'bg-green-100 text-green-700' :
                                                        rec.status === 'late' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {rec.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {attendance.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No attendance records found for this month.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffAttendance;
