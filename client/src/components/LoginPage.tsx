import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, SuGharLogo, AppleLogo, GoogleLogo, FacebookLogo } from './icons';

export const LoginPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('monir@ashaproperties.com');
    const [password, setPassword] = useState('password123');
    const [showSignUp, setShowSignUp] = useState(false);
    
    const { login, register, loading, error } = useAuth();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    if (showSignUp) {
        return <SignUpForm onBack={() => setShowSignUp(false)} />;
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
                {/* Left side - Form */}
                <div className="bg-card-bg p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="flex items-center gap-4 mb-8">
                            <SuGharLogo />
                            <span className="text-4xl font-bold font-atkinson" style={{color: '#B083F1'}}>SuGhar</span>
                        </div>
                        
                        <h2 className="text-3xl font-bold font-atkinson text-text-main mb-6">Login to Dashboard</h2>

                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded text-sm">
                            <strong>Asha Properties Demo Accounts:</strong><br/>
                            Landlord: monir@ashaproperties.com<br/>
                            Tenant: farzana.akhter@example.com<br/>
                            Password: password123
                        </div>

                        <form onSubmit={handleLogin}>
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}
                            <div className="mb-4">
                                <input 
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4 relative">
                                <input 
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600">
                                    {passwordVisible ? <EyeOff /> : <Eye />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between mb-6 text-sm">
                                <label className="flex items-center text-text-secondary">
                                    <input type="checkbox" className="w-4 h-4 mr-2 text-accent-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent-secondary"/>
                                    Remember me
                                </label>
                                <a href="#" className="font-medium text-accent-secondary hover:underline">Forgot Password?</a>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-accent-secondary text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition-colors duration-300 shadow-lg shadow-purple-200 disabled:opacity-50"
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>

                            <div className="mt-4 text-center text-sm text-text-secondary">
                                Don't have an account? <button type="button" onClick={() => setShowSignUp(true)} className="font-medium text-accent-secondary hover:underline">Sign Up!</button>
                            </div>
                        </form>

                        <div className="flex items-center my-8">
                            <hr className="flex-grow border-gray-200"/>
                            <span className="mx-4 text-xs text-text-secondary">or</span>
                            <hr className="flex-grow border-gray-200"/>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button className="w-full flex justify-center items-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <AppleLogo />
                            </button>
                             <button className="w-full flex justify-center items-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <GoogleLogo className="w-6 h-6"/>
                            </button>
                             <button className="w-full flex justify-center items-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <FacebookLogo />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side - Image */}
                <div className="hidden lg:block relative">
                    <img 
                        src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                        alt="Office desk with a computer showing the SuGhar dashboard"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-10 left-10 right-10">
                        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl">
                            <p className="text-2xl font-bold font-atkinson text-text-main leading-tight">
                                See why Bangladesh's top property groups are making the switch. SuGhar: <span style={{color: '#B083F1'}}>Living made sweet.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple SignUp Form Component
const SignUpForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'tenant',
        password: '',
        confirmPassword: ''
    });
    
    const { register, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await register(formData);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto bg-card-bg p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <SuGharLogo />
                    <span className="text-4xl font-bold font-atkinson" style={{color: '#B083F1'}}>SuGhar</span>
                </div>
                
                <h2 className="text-3xl font-bold font-atkinson text-text-main mb-6">Create Account</h2>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <select
                            name="role"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="tenant">Tenant</option>
                            <option value="landlord">Landlord</option>
                            <option value="contractor">Contractor</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent-secondary text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition-colors duration-300 shadow-lg shadow-purple-200 disabled:opacity-50 mb-4"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full text-accent-secondary font-medium hover:underline"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};