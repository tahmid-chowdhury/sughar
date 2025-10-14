import React, { useState } from 'react';
import { SuGharLogo, Eye, EyeOff } from './icons';

interface LoginPageProps {
    onLogin: (email: string, password: string) => boolean;
    setCurrentPage: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(email, password);
        if (!success) {
            setError('Invalid email or password. Please try again.');
        }
    };

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
                        
                        <h2 className="text-3xl font-bold font-atkinson text-text-main mb-2">Welcome back!</h2>
                        <p className="text-text-secondary mb-8">Please enter your details to log in.</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <input 
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                    required
                                />
                                <div className="relative">
                                    <input 
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                        required
                                    />
                                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600">
                                        {passwordVisible ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

                            <div className="flex items-center justify-between my-4 text-sm">
                                <label className="flex items-center text-text-secondary">
                                    <input type="checkbox" className="w-4 h-4 mr-2 text-accent-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent-secondary"/>
                                    Remember me
                                </label>
                                <a href="#" className="font-medium text-accent-secondary hover:underline">Forgot Password?</a>
                            </div>

                            <button type="submit" className="w-full bg-accent-secondary text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition-colors duration-300 shadow-lg shadow-purple-200">
                                Log In
                            </button>

                            <div className="mt-8 text-center text-sm text-text-secondary">
                                Don't have an account? <button type="button" onClick={() => setCurrentPage('signup')} className="font-medium text-accent-secondary hover:underline">Sign Up!</button>
                            </div>
                        </form>
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