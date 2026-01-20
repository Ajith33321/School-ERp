import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, MapPin, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const OrgRegistrationWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        orgName: '',
        subdomain: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post('/auth/register-org', formData);
            setStep(4); // Success step
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-gray-100 h-2 flex">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-primary-500' : 'bg-transparent'}`}
                        />
                    ))}
                </div>

                <div className="p-8">
                    <div className="flex justify-between mb-8">
                        {[
                            { s: 1, icon: Building2, label: 'Basic Info' },
                            { s: 2, icon: User, label: 'Admin Account' },
                            { s: 3, icon: MapPin, label: 'Details' },
                            { s: 4, icon: CheckCircle, label: 'Finish' }
                        ].map((item) => (
                            <div key={item.s} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${step === item.s ? 'bg-primary-600 text-white' :
                                        step > item.s ? 'bg-success text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    <item.icon size={20} />
                                </div>
                                <span className={`text-xs font-semibold ${step === item.s ? 'text-primary-600' : 'text-gray-500'}`}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-xl font-bold text-gray-900">Organization Identity</h2>
                                <p className="text-gray-500">Let's start with your institution's name and subdomain.</p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                                    <input
                                        name="orgName" value={formData.orgName} onChange={handleChange}
                                        className="input-field" placeholder="e.g. St. Xavier's High School" required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                                    <div className="flex">
                                        <input
                                            name="subdomain" value={formData.subdomain} onChange={handleChange}
                                            className="input-field rounded-r-none" placeholder="school-name" required
                                        />
                                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm italic">
                                            .schoolerp.com
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="button" onClick={nextStep} className="btn-primary flex items-center">
                                        Next <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-xl font-bold text-gray-900">Admin Account</h2>
                                <p className="text-gray-500">Create the primary administrator account for this organization.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" placeholder="John" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" placeholder="Doe" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="admin@school.com" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input name="password" type="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••••" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••••" required />
                                    </div>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={prevStep} className="btn-secondary flex items-center">
                                        <ArrowLeft size={18} className="mr-2" /> Back
                                    </button>
                                    <button type="button" onClick={nextStep} className="btn-primary flex items-center">
                                        Next <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-xl font-bold text-gray-900">Final Details</h2>
                                <p className="text-gray-500">Almost there! We just need a few more contact details.</p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} className="input-field h-24" placeholder="123 Education Lane, Learning City"></textarea>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={prevStep} className="btn-secondary flex items-center">
                                        <ArrowLeft size={18} className="mr-2" /> Back
                                    </button>
                                    <button type="submit" disabled={loading} className="btn-primary flex items-center">
                                        {loading ? 'Creating...' : 'Register Organization'} <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="text-center py-12 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                                <p className="text-gray-500 mb-8">
                                    Your organization account has been created. You can now log in using the administrator credentials.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="btn-primary w-full py-3"
                                >
                                    Go to Login
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrgRegistrationWizard;
