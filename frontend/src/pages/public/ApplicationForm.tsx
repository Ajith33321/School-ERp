import React, { useState, useEffect } from 'react';
import {
    User,
    Users,
    GraduationCap,
    MapPin,
    FileText,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import api from '../../services/api';

const ApplicationForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        // Student Info
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        email: '',
        phone: '',
        // Parent Info
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        parent_occupation: '',
        // Academic Info
        previous_school: '',
        previous_class: '',
        previous_percentage: '',
        applying_for_class_id: '',
        // Address
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
    });

    const [success, setSuccess] = useState(false);
    const [appNumber, setAppNumber] = useState('');

    useEffect(() => {
        // Fetch classes for the dropdown
        const fetchClasses = async () => {
            try {
                const response = await api.get('/academic/classes');
                setClasses(response.data.data);
            } catch (err) {
                console.error('Failed to fetch classes');
            }
        };
        fetchClasses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // For standalone testing, we might need a default org_id if not detected via subdomain
            const response = await api.post('/applications/public', {
                ...formData,
                academic_year_id: 'e6988c83-4a11-4778-9e1e-42c2f26d36e2' // Hardcoded for now, should be dynamic
            });
            setAppNumber(response.data.data.application_number);
            setSuccess(true);
        } catch (err) {
            alert('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full card p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="h-20 w-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                    <p className="text-gray-500 mb-6">
                        Your application has been received successfully. Please save your application number for future reference.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg mb-8">
                        <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Application Number</p>
                        <p className="text-3xl font-mono font-bold text-primary-600">{appNumber}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary w-full"
                    >
                        Submit Another Application
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900">Student Admission Application</h1>
                    <p className="mt-2 text-gray-500">Please fill out the form below to apply for admission.</p>
                </div>

                {/* Stepper */}
                <div className="mb-12 flex justify-between items-center relative max-w-2xl mx-auto">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center relative z-10">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= i ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                {i === 1 && <User size={20} />}
                                {i === 2 && <Users size={20} />}
                                {i === 3 && <GraduationCap size={20} />}
                                {i === 4 && <MapPin size={20} />}
                            </div>
                            <span className={`mt-2 text-xs font-bold ${step >= i ? 'text-primary-700' : 'text-gray-400'}`}>
                                {i === 1 && 'Student'}
                                {i === 2 && 'Parent'}
                                {i === 3 && 'Academic'}
                                {i === 4 && 'Address'}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 -z-1">
                        <div
                            className="h-full bg-primary-600 transition-all duration-500"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="card shadow-2xl overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-8">
                            {/* Step 1: Student Information */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                                            <input type="text" name="first_name" required className="input-field" value={formData.first_name} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                                            <input type="text" name="last_name" required className="input-field" value={formData.last_name} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
                                            <input type="date" name="date_of_birth" required className="input-field" value={formData.date_of_birth} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                                            <select name="gender" required className="input-field" value={formData.gender} onChange={handleChange}>
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                            <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                                            <input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Parent Information */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Parent/Guardian Name *</label>
                                            <input type="text" name="parent_name" required className="input-field" value={formData.parent_name} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Email</label>
                                            <input type="email" name="parent_email" className="input-field" value={formData.parent_email} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Phone *</label>
                                            <input type="tel" name="parent_phone" required className="input-field" value={formData.parent_phone} onChange={handleChange} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Occupation</label>
                                            <input type="text" name="parent_occupation" className="input-field" value={formData.parent_occupation} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Academic Information */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Applying for Class *</label>
                                            <select name="applying_for_class_id" required className="input-field" value={formData.applying_for_class_id} onChange={handleChange}>
                                                <option value="">Select Class</option>
                                                {classes.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Previous School Name</label>
                                            <input type="text" name="previous_school" className="input-field" value={formData.previous_school} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Previous Class</label>
                                            <input type="text" name="previous_class" className="input-field" value={formData.previous_class} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Previous Percentage (%)</label>
                                            <input type="number" step="0.01" name="previous_percentage" className="input-field" value={formData.previous_percentage} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Address Information */}
                            {step === 4 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address *</label>
                                            <textarea name="address" required rows={3} className="input-field" value={formData.address} onChange={handleChange}></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                                            <input type="text" name="city" required className="input-field" value={formData.city} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
                                            <input type="text" name="state" required className="input-field" value={formData.state} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
                                            <input type="text" name="pincode" required className="input-field" value={formData.pincode} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between items-center">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="btn-secondary flex items-center">
                                    <ArrowLeft size={18} className="mr-2" /> Previous
                                </button>
                            ) : <div></div>}

                            {step < 4 ? (
                                <button type="button" onClick={nextStep} className="btn-primary flex items-center">
                                    Next Step <ArrowRight size={18} className="ml-2" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex items-center px-8"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : <FileText size={18} className="mr-2" />}
                                    Submit Application
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
