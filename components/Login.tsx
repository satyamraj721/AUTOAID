
import React, { useState, useEffect } from 'react';
import { UserRole, IUser } from '../types';
import { authStorage } from '../utils/storage';

interface LoginProps {
  onLogin: (user: IUser) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  
  // Form States
  const [identifier, setIdentifier] = useState(''); // Phone or Email/UserID
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [vehicleModel, setVehicleModel] = useState(''); // For Customer Signup
  
  // UI States
  const [step, setStep] = useState<'INPUT' | 'VERIFY'>('INPUT');
  const [method, setMethod] = useState<'OTP' | 'PASSWORD'>('PASSWORD'); // Default to Password for stability
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize Storage
  useEffect(() => {
    authStorage.init();
  }, []);

  // Reset state on tab/mode switch
  useEffect(() => {
    setStep('INPUT');
    setError('');
    setIdentifier('');
    setPassword('');
    setOtp('');
    setFullName('');
    // Admin always uses password
    if (activeRole === UserRole.ADMIN) {
      setMethod('PASSWORD');
    }
  }, [activeRole, authMode]);

  const handleSubmitInput = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate Network Delay
    setTimeout(() => {
      setLoading(false);
      
      if (!identifier) {
        setError('Please enter your mobile number or User ID');
        return;
      }

      if (authMode === 'LOGIN') {
         // LOGIN FLOW
         if (method === 'PASSWORD') {
             const result = authStorage.loginUser(identifier, password, activeRole);
             if (result.success && result.user) {
                 onLogin(result.user);
             } else {
                 // Provide hint for Admin default
                 if (activeRole === UserRole.ADMIN) {
                     setError('Invalid Credentials. Try: admin / admin123');
                 } else {
                     setError(result.message || 'Login failed');
                 }
             }
         } else {
             // OTP Flow (Simulation)
             if (identifier.length < 3) {
                 setError('Please enter a valid ID');
                 return;
             }
             setStep('VERIFY'); // Move to OTP screen
         }
      } else {
         // SIGNUP FLOW
         if (!fullName) {
             setError('Full Name is required');
             return;
         }
         if (!password) {
             setError('Please set a password');
             return;
         }

         const newUser = {
             _id: '', // Handled by storage
             role: activeRole,
             phoneNumber: identifier,
             fullName: fullName,
             password: password,
             isVerified: true,
             vehicle: activeRole === UserRole.CUSTOMER && vehicleModel ? {
                 make: 'Generic',
                 model: vehicleModel,
                 year: '2023',
                 plateNumber: 'NEW-USER-01'
             } : undefined
         };

         const result = authStorage.registerUser(newUser);
         if (result.success && result.user) {
             onLogin(result.user);
         } else {
             setError(result.message || 'Signup failed');
         }
      }
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const cleanOtp = otp.trim();
      if (cleanOtp === '1234' || cleanOtp === '0000') {
         // OTP Login successful - simulate user retrieval or create temp
         // For this demo, we try to find the user in DB, if not found, we login as temp
         const result = authStorage.loginUser(identifier, '123', activeRole); // Try default password? 
         // Actually, OTP bypasses password. We just check if user exists or create temp.
         
         // For the purpose of this storage demo, we will just create a mock object
         // In a real app, verifyOTP returns the user token
         const mockUser: IUser = {
            _id: `otp-user-${Date.now()}`,
            role: activeRole,
            phoneNumber: identifier,
            fullName: 'Verified User',
            isVerified: true
         };
         onLogin(mockUser);
      } else {
        setError('Invalid OTP. Please enter 1234.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* LEFT SIDE - BRANDING */}
        <div className={`lg:w-1/2 p-12 flex flex-col justify-between text-white bg-gradient-to-br ${activeRole === UserRole.MECHANIC ? 'from-slate-800 to-slate-900' : activeRole === UserRole.ADMIN ? 'from-gray-900 to-black' : 'from-red-600 to-red-800'}`}>
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">AutoAid</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              {activeRole === UserRole.CUSTOMER && "Roadside Assistance, Anytime, Anywhere."}
              {activeRole === UserRole.MECHANIC && "Grow Your Business with AutoAid Partner."}
              {activeRole === UserRole.ADMIN && "System Administration & Dispatch."}
            </h2>
            <p className="text-white/80 text-lg">
              {activeRole === UserRole.CUSTOMER && "Join millions of users who trust us for fast repairs, towing, and maintenance."}
              {activeRole === UserRole.MECHANIC && "Receive real-time job requests, track earnings, and manage your team effectively."}
              {activeRole === UserRole.ADMIN && "Secure access for platform controllers."}
            </p>
          </div>
          <div className="mt-8 flex space-x-2">
             <div className="h-2 w-16 bg-white/50 rounded-full"></div>
             <div className="h-2 w-4 bg-white/20 rounded-full"></div>
             <div className="h-2 w-4 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="lg:w-1/2 p-8 lg:p-12 bg-white relative">
          
          {/* Role Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
            {[UserRole.CUSTOMER, UserRole.MECHANIC, UserRole.ADMIN].map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${activeRole === role ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {authMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {authMode === 'LOGIN' ? 'Enter your details to access your account' : 'Fill in the details to get started'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center animate-pulse">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {error}
            </div>
          )}

          {step === 'INPUT' ? (
            <form onSubmit={handleSubmitInput} className="space-y-5">
              
              {authMode === 'SIGNUP' && (
                <div className="animate-fade-in-down">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                   />
                </div>
              )}

              {authMode === 'SIGNUP' && activeRole === UserRole.CUSTOMER && (
                 <div className="animate-fade-in-down">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      placeholder="e.g. Honda City"
                      value={vehicleModel}
                      onChange={e => setVehicleModel(e.target.value)}
                   />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeRole === UserRole.ADMIN ? 'Username' : 'Mobile Number / ID'}
                </label>
                <input 
                  type={activeRole === UserRole.ADMIN ? "text" : "text"}
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder={activeRole === UserRole.ADMIN ? "admin" : "9876543210"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoFocus
                />
              </div>

              {(method === 'PASSWORD' || authMode === 'SIGNUP') && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                      {authMode === 'SIGNUP' ? 'Set Password' : 'Password'}
                  </label>
                  <input 
                    type="password"
                    autoComplete={authMode === 'SIGNUP' ? 'new-password' : 'current-password'}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-[0.98] flex justify-center items-center ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black'}`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  authMode === 'SIGNUP' ? 'Sign Up' : (method === 'OTP' ? 'Get OTP' : 'Login')
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in-up">
               <div className="text-center mb-4">
                 <p className="text-sm text-gray-500">We sent a code to <span className="font-bold text-gray-900">{identifier}</span></p>
                 <button type="button" onClick={() => setStep('INPUT')} className="text-xs text-indigo-600 hover:underline mt-1">Wrong number?</button>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Enter OTP</label>
                  <input 
                    type="text"
                    name="otp"
                    autoComplete="one-time-code" 
                    className="w-full text-center text-3xl tracking-[1em] font-bold py-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="••••"
                    maxLength={4}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    autoFocus
                  />
                  <p className="text-center text-xs text-gray-400 mt-2">Try '1234'</p>
               </div>

               <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-[0.98] flex justify-center items-center ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col items-center space-y-3">
             {activeRole !== UserRole.ADMIN && authMode === 'LOGIN' && (
               <button 
                 onClick={() => {
                    setMethod(method === 'OTP' ? 'PASSWORD' : 'OTP');
                    setStep('INPUT');
                 }} 
                 className="text-sm font-medium text-gray-600 hover:text-gray-900"
               >
                 {method === 'OTP' ? 'Login with Password instead' : 'Login with OTP instead'}
               </button>
             )}
             
             <div className="text-sm text-gray-500">
               {authMode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
               <button 
                onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                className="ml-1 font-bold text-indigo-600 hover:text-indigo-800"
               >
                 {authMode === 'LOGIN' ? 'Sign Up' : 'Login'}
               </button>
             </div>

             {activeRole === UserRole.ADMIN && (
               <p className="text-xs text-gray-400 mt-4">Default: admin / admin123</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
