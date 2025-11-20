
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MechanicVerification } from './components/MechanicVerification';
import { Login } from './components/Login';
import { CustomerDashboard } from './components/CustomerDashboard';
import { MechanicDashboard } from './components/MechanicDashboard';
import { UserRole, IUser } from './types';

export default function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogin = (loggedInUser: IUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => setUser(null);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === UserRole.CUSTOMER) {
    return <CustomerDashboard user={user} onLogout={handleLogout} />;
  }

  if (user.role === UserRole.MECHANIC) {
    return <MechanicDashboard user={user} onLogout={handleLogout} />;
  }

  const renderAdminContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'mechanics': return <MechanicVerification />;
      case 'bookings': return <div className="p-10 text-center text-gray-500">Booking History Module</div>;
      case 'settings': return <div className="p-10 text-center text-gray-500">System Settings Module</div>;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsMobileSidebarOpen(false); }}
        isOpen={isMobileSidebarOpen}
      />
      
      <main className="flex-1 relative h-full flex flex-col lg:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center">
              <button 
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
                className="lg:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
            </div>
            
            <div className="flex items-center space-x-3 lg:space-x-6">
                <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <span className="text-xs font-semibold text-gray-600">System Operational</span>
                </div>
                <div className="flex items-center space-x-3">
                   <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-800">{user.fullName}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                   </div>
                   <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                   </button>
                </div>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide">
            {renderAdminContent()}
        </div>
      </main>
    </div>
  );
}