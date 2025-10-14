import React, { useState } from 'react';
import { Eye, EyeOff, SuGharLogo, AppleLogo, GoogleLogo, FacebookLogo } from './icons';

interface SignUpPageProps {
    setCurrentPage: (page: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ setCurrentPage }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
                        
                        <h2 className="text-3xl font-bold font-atkinson text-text-main mb-6">Sign Up</h2>

                        <form onSubmit={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
                            <div className="space-y-4">
                                <input 
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                />
                                <input 
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                />
                                 <input 
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                />
                                <input 
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                />
                                <div className="relative">
                                    <input 
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600">
                                        {passwordVisible ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between my-4 text-sm">
                                <label className="flex items-center text-text-secondary">
                                    <input type="checkbox" className="w-4 h-4 mr-2 text-accent-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent-secondary"/>
                                    Remember me
                                </label>
                                <a href="#" className="font-medium text-accent-secondary hover:underline">Forgot Password?</a>
                            </div>

                            <div className="mb-6">
                                 <label className="flex items-center text-text-secondary text-sm">
                                    <input type="checkbox" className="w-4 h-4 mr-2 text-accent-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent-secondary" required/>
                                    I agree to the <a href="#" className="mx-1 font-medium text-accent-secondary hover:underline">Terms of Service</a> & <a href="#" className="ml-1 font-medium text-accent-secondary hover:underline">Privacy Policy</a>
                                </label>
                            </div>

                            <button type="submit" className="w-full bg-accent-secondary text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition-colors duration-300 shadow-lg shadow-purple-200">
                                Sign Up
                            </button>

                            <div className="mt-4 text-center text-sm text-text-secondary">
                                Already have an account? <button type="button" onClick={() => setCurrentPage('login')} className="font-medium text-accent-secondary hover:underline">Log In</button>
                            </div>
                        </form>

                        <div className="flex items-center my-6">
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