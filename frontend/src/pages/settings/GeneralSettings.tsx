import React, { useState, useEffect } from 'react';
import {
    School,
    Mail,
    Phone,
    Globe,
    MapPin,
    Camera,
    Save,
    CheckCircle2
} from 'lucide-react';
import api from '../../services/api';

const GeneralSettings: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get('settings/profile');
            setProfile(res.data.data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            setError('Failed to load organization settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        try {
            await api.patch('settings/profile', profile);
            setSuccessMessage('Organization profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
                <div className="h-20 bg-slate-100 rounded-3xl w-1/2"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 h-64 bg-slate-100 rounded-3xl"></div>
                    <div className="md:col-span-2 h-96 bg-slate-100 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <div className="inline-flex items-center justify-center p-6 bg-red-50 rounded-full mb-6">
                    <School size={48} className="text-red-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Connection Error</h2>
                <p className="text-slate-500 mt-2 mb-8">{error || 'Could not retrieve organization data.'}</p>
                <button
                    onClick={fetchProfile}
                    className="btn-3d btn-3d-primary px-8 py-3"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Organization Settings</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure your institution's digital identity and preferences.</p>
                </div>
            </div>

            {successMessage && (
                <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-float shadow-lg shadow-green-100/50">
                    <CheckCircle2 size={24} className="text-green-500" />
                    <span className="text-sm font-black uppercase tracking-widest">{successMessage}</span>
                </div>
            )}

            <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar: Branding & Defaults */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="card-modern p-8 flex flex-col items-center text-center group border-none shadow-xl shadow-slate-200/50">
                        <div className="relative">
                            <div className="w-36 h-36 rounded-[32px] bg-slate-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl group-hover:scale-105 transition-all duration-500">
                                {profile.logo_url ? (
                                    <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-full h-full flex items-center justify-center">
                                        <School size={56} className="text-white/80" />
                                    </div>
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl text-blue-600 hover:scale-110 transition-all border border-slate-50">
                                <Camera size={20} />
                            </button>
                        </div>
                        <h3 className="font-black text-slate-900 mt-6 text-xl">Identity Branding</h3>
                        <p className="text-[11px] text-slate-400 mt-3 font-bold uppercase tracking-widest leading-relaxed">
                            Recommended: 512x512px<br />Transparent PNG preferred
                        </p>
                    </div>

                    <div className="card-modern p-8 border-none shadow-xl shadow-amber-100/30 bg-gradient-to-br from-white to-amber-50/30">
                        <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-6 flex items-center">
                            <Save size={14} className="mr-2" />
                            System Defaults
                        </h4>
                        <div className="space-y-6">
                            <div className="p-4 bg-white/60 rounded-2xl border border-amber-100/50">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Currency</label>
                                <div className="text-lg font-black text-slate-800 mt-1">₹ Indian Rupee</div>
                            </div>
                            <div className="p-4 bg-white/60 rounded-2xl border border-amber-100/50">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timezone</label>
                                <div className="text-sm font-bold text-slate-700 mt-1 flex items-center">
                                    <Globe size={14} className="mr-2 text-amber-500" />
                                    (GMT+5:30) Kolkata
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: Forms */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="card-modern p-10 space-y-8 border-none shadow-2xl shadow-slate-200/40">
                        <div className="space-y-8">
                            <h3 className="text-xl font-black text-slate-900 border-l-4 border-blue-500 pl-4 tracking-tight">
                                Basic Institution Info
                            </h3>
                            <div className="grid grid-cols-1 gap-8">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Official School Name</label>
                                    <input
                                        type="text"
                                        className="input-modern h-14 bg-slate-50/50 border-transparent focus:bg-white text-lg font-bold"
                                        value={profile.name || ''}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="Enter school name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Permanent Address</label>
                                    <textarea
                                        rows={4}
                                        className="input-modern bg-slate-50/50 border-transparent focus:bg-white text-base py-4"
                                        value={profile.address || ''}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        placeholder="Street, Building, City, State..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 pt-8 border-t border-slate-50">
                            <h3 className="text-xl font-black text-slate-900 border-l-4 border-indigo-500 pl-4 tracking-tight">
                                Communication Channels
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Official Admin Email</label>
                                    <div className="relative group">
                                        <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            className="input-modern h-14 pl-14 bg-slate-50/50 border-transparent focus:bg-white font-bold"
                                            value={profile.email || ''}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            placeholder="admin@school.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Public Helpline Number</label>
                                    <div className="relative group">
                                        <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            className="input-modern h-14 pl-14 bg-slate-50/50 border-transparent focus:bg-white font-bold"
                                            value={profile.phone || ''}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            placeholder="+91 XXXX-XXXXXX"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Institutional Website</label>
                                    <div className="relative group">
                                        <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <Globe size={20} />
                                        </div>
                                        <input
                                            type="url"
                                            className="input-modern h-14 pl-14 bg-slate-50/50 border-transparent focus:bg-white font-bold"
                                            value={profile.website || ''}
                                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                            placeholder="https://www.yourschool.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-8 border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-3d btn-3d-primary flex items-center gap-3 px-12 py-4 shadow-xl shadow-blue-500/20"
                            >
                                {saving ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Save size={20} className="animate-pulse" />
                                )}
                                <span className="text-base font-black uppercase tracking-widest">Update Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default GeneralSettings;
