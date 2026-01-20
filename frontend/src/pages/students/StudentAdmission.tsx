import React, { useState, useEffect } from 'react';
import {
    User,
    Users,
    GraduationCap,
    Save,
    ArrowLeft,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const StudentAdmission: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const applicationId = queryParams.get('applicationId');

    const [activeTab, setActiveTab] = useState('student');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!applicationId);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        email: '',
        phone: '',
        religion: '',
        caste: '',
        category: 'general',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        parent_details: {
            father_name: '',
            father_email: '',
            father_phone: '',
            father_occupation: '',
            mother_name: '',
            mother_email: '',
            mother_phone: '',
            mother_occupation: '',
        },
        current_class_id: '',
        section_id: '',
        roll_number: '',
        house: '',
        academic_year_id: 'e6988c83-4a11-4778-9e1e-42c2f26d36e2', // Default
        previous_school: '',
        admission_class: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classRes = await api.get('academic/classes');
                setClasses(classRes.data.data);

                if (applicationId) {
                    const appRes = await api.get(`applications?id=${applicationId}`);
                    const app = appRes.data.data[0]; // Simplified
                    if (app) {
                        setFormData(prev => ({
                            ...prev,
                            first_name: app.first_name,
                            last_name: app.last_name,
                            date_of_birth: app.date_of_birth.split('T')[0],
                            gender: app.gender,
                            email: app.email || '',
                            phone: app.phone || '',
                            address: app.address,
                            city: app.city,
                            state: app.state,
                            pincode: app.pincode,
                            current_class_id: app.applying_for_class_id,
                            parent_details: {
                                ...prev.parent_details,
                                father_name: app.parent_name,
                                father_email: app.parent_email || '',
                                father_phone: app.parent_phone,
                                father_occupation: app.parent_occupation || '',
                            },
                        }));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch initial data');
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [applicationId]);

    useEffect(() => {
        if (formData.current_class_id) {
            const fetchSections = async () => {
                try {
                    const res = await api.get(`academic/sections?classId=${formData.current_class_id}`);
                    setSections(res.data.data);
                } catch (err) {
                    console.error('Failed to fetch sections');
                }
            };
            fetchSections();
        }
    }, [formData.current_class_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('students/admit', {
                ...formData,
                application_id: applicationId
            });
            alert('Student admitted successfully!');
            navigate('/users'); // Redirect to student list
        } catch (err) {
            alert('Failed to admit student');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Student Admission</h1>
                    <p className="text-gray-500">Fill in the details to enroll a new student.</p>
                </div>
                <button onClick={() => navigate(-1)} className="btn-secondary flex items-center">
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
            </div>

            <div className="card">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {[
                        { id: 'student', label: 'Student Info', icon: User },
                        { id: 'parent', label: 'Parent Info', icon: Users },
                        { id: 'academic', label: 'Academic & Local', icon: GraduationCap }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-primary-600 text-primary-600 bg-primary-50/30'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={18} className="mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Student Tab */}
                    {activeTab === 'student' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-900">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">First Name *</label>
                                    <input type="text" name="first_name" required className="input-field" value={formData.first_name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Last Name *</label>
                                    <input type="text" name="last_name" required className="input-field" value={formData.last_name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Date of Birth *</label>
                                    <input type="date" name="date_of_birth" required className="input-field" value={formData.date_of_birth} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Gender *</label>
                                    <select name="gender" required className="input-field" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Blood Group</label>
                                    <select name="blood_group" className="input-field" value={formData.blood_group} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Category</label>
                                    <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                                        <option value="general">General</option>
                                        <option value="obc">OBC</option>
                                        <option value="sc">SC</option>
                                        <option value="st">ST</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1">Full Address *</label>
                                    <textarea name="address" required rows={2} className="input-field" value={formData.address} onChange={handleChange}></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">City *</label>
                                    <input type="text" name="city" required className="input-field" value={formData.city} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">State *</label>
                                    <input type="text" name="state" required className="input-field" value={formData.state} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Parent Tab */}
                    {activeTab === 'parent' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="border-l-4 border-primary-500 pl-4 mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Father's Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-900">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Name *</label>
                                    <input type="text" name="parent_details.father_name" required className="input-field" value={formData.parent_details.father_name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Phone *</label>
                                    <input type="tel" name="parent_details.father_phone" required className="input-field" value={formData.parent_details.father_phone} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Email</label>
                                    <input type="email" name="parent_details.father_email" className="input-field" value={formData.parent_details.father_email} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-semibold mb-1">Occupation</label>
                                    <input type="text" name="parent_details.father_occupation" className="input-field" value={formData.parent_details.father_occupation} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="border-l-4 border-secondary-500 pl-4 pt-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Mother's Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-900">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Name</label>
                                    <input type="text" name="parent_details.mother_name" className="input-field" value={formData.parent_details.mother_name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Phone</label>
                                    <input type="tel" name="parent_details.mother_phone" className="input-field" value={formData.parent_details.mother_phone} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-semibold mb-1">Occupation</label>
                                    <input type="text" name="parent_details.mother_occupation" className="input-field" value={formData.parent_details.mother_occupation} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Academic Tab */}
                    {activeTab === 'academic' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Class *</label>
                                    <select name="current_class_id" required className="input-field" value={formData.current_class_id} onChange={handleChange}>
                                        <option value="">Select Class</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Section *</label>
                                    <select name="section_id" required className="input-field" value={formData.section_id} onChange={handleChange}>
                                        <option value="">Select Section</option>
                                        {sections.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Roll Number</label>
                                    <input type="number" name="roll_number" className="input-field" value={formData.roll_number} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">House</label>
                                    <input type="text" name="house" className="input-field" value={formData.house} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1">Previous School</label>
                                    <input type="text" name="previous_school" className="input-field" value={formData.previous_school} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 flex justify-end space-x-4">
                        <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-8">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-12 flex items-center"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                            Admit Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentAdmission;
