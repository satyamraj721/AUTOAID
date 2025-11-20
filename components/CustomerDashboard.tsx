
import React, { useState, useEffect } from 'react';
import { LiveMap } from './LiveMap';
import { ChatWindow } from './ChatWindow';
import { BookingStatus, IBooking, ServiceType, UserRole, IUser } from '../types';
import { MOCK_MECHANICS as MECHANICS_LIST } from '../constants';

interface Props {
  user: IUser;
  onLogout: () => void;
}

// Mock History Data
const PAST_BOOKINGS: IBooking[] = [
  {
    _id: 'bk-old-1',
    customerId: 'cust-1',
    customerName: 'John Customer',
    customerPhone: '123',
    serviceType: ServiceType.SOS_TOWING,
    status: BookingStatus.COMPLETED,
    location: { address: '123 Main St, NY', geo: { type: 'Point', coordinates: [-73.98, 40.75] }},
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    finalCost: 150,
    mechanicName: 'Mike Fixit'
  },
  {
    _id: 'bk-old-2',
    customerId: 'cust-1',
    customerName: 'John Customer',
    customerPhone: '123',
    serviceType: ServiceType.FLAT_TIRE,
    status: BookingStatus.COMPLETED,
    location: { address: 'Queens Blvd, NY', geo: { type: 'Point', coordinates: [-73.92, 40.73] }},
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    finalCost: 80,
    mechanicName: 'Speedy Tires'
  },
  {
    _id: 'bk-old-3',
    customerId: 'cust-1',
    customerName: 'John Customer',
    customerPhone: '123',
    serviceType: ServiceType.WASHING,
    status: BookingStatus.CANCELLED,
    location: { address: 'Home', geo: { type: 'Point', coordinates: [-73.95, 40.72] }},
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    finalCost: 0,
    mechanicName: 'Quick Lube'
  }
];

export const CustomerDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'ACTIVITY'>('HOME');
  const [activeBooking, setActiveBooking] = useState<IBooking | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Simulate finding a mechanic
  useEffect(() => {
    if (activeBooking?.status === BookingStatus.SEARCHING) {
      const timer = setTimeout(() => {
        setActiveBooking(prev => prev ? {
          ...prev,
          status: BookingStatus.EN_ROUTE,
          mechanicId: 'mech-1',
          mechanicName: 'Mike @ AutoFix',
        } : null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeBooking?.status]);

  const handleBook = (type: ServiceType) => {
    setActiveBooking({
      _id: 'new-booking',
      customerId: user._id,
      customerName: user.fullName || 'Customer',
      customerPhone: user.phoneNumber,
      serviceType: type,
      status: BookingStatus.SEARCHING,
      location: { address: 'Current Location', geo: { type: 'Point', coordinates: [0,0] }},
      createdAt: new Date().toISOString()
    });
  };

  const cancelBooking = () => {
    setActiveBooking(null);
    setShowChat(false);
  };

  const getServiceIcon = (type: ServiceType) => {
    switch(type) {
        case ServiceType.SOS_TOWING: return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        );
        case ServiceType.FLAT_TIRE: return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        );
        default: return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen relative bg-gray-50">
      
      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        
        {activeTab === 'HOME' && (
            <>
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 pointer-events-auto">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold">{user.fullName}</span>
                    </div>
                </div>

                {/* Map */}
                <div className="absolute inset-0">
                    <LiveMap 
                        userRole={UserRole.CUSTOMER} 
                        activeBooking={activeBooking} 
                        mechanics={MECHANICS_LIST} 
                    />
                </div>

                 {/* Chat Window */}
                {showChat && activeBooking && (
                    <ChatWindow 
                    recipientName={activeBooking.mechanicName || 'Mechanic'} 
                    onClose={() => setShowChat(false)} 
                    currentUserRole="CUSTOMER"
                    />
                )}

                {/* Bottom Sheet */}
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out z-20 max-h-[70vh] overflow-y-auto pb-20">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-6"></div>

                    {!activeBooking ? (
                        <div className="px-6 pb-8">
                            <div className="flex items-center space-x-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                                <div className="flex-shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 border border-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-sm font-bold">Honda City</span>
                                </div>
                                <div className="flex-shrink-0 bg-white text-gray-500 px-4 py-2 rounded-lg border border-gray-200 flex items-center space-x-2">
                                    <span className="text-sm font-medium">+ Add Vehicle</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-4">Where can we help?</h2>
                            
                            <button onClick={() => handleBook(ServiceType.SOS_TOWING)} className="w-full bg-red-600 text-white py-4 rounded-xl shadow-lg shadow-red-200 flex items-center justify-center space-x-3 mb-6 transform active:scale-95 transition-transform">
                                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                <span className="text-lg font-bold">EMERGENCY SOS</span>
                            </button>

                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Services</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div onClick={() => handleBook(ServiceType.PERIODIC_MAINTENANCE)} className="border border-gray-200 p-4 rounded-xl hover:border-primary cursor-pointer transition-colors group">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                    </div>
                                    <p className="font-semibold text-gray-800">Periodic Service</p>
                                    <p className="text-xs text-gray-500">Oil change & more</p>
                                </div>
                                <div onClick={() => handleBook(ServiceType.DENTING_PAINTING)} className="border border-gray-200 p-4 rounded-xl hover:border-primary cursor-pointer transition-colors group">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                                    </div>
                                    <p className="font-semibold text-gray-800">Denting & Paint</p>
                                    <p className="text-xs text-gray-500">Scratch removal</p>
                                </div>
                                <div onClick={() => handleBook(ServiceType.FLAT_TIRE)} className="border border-gray-200 p-4 rounded-xl hover:border-primary cursor-pointer transition-colors group">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <p className="font-semibold text-gray-800">Tyres & Wheels</p>
                                    <p className="text-xs text-gray-500">Alignment & repair</p>
                                </div>
                                <div onClick={() => handleBook(ServiceType.WASHING)} className="border border-gray-200 p-4 rounded-xl hover:border-primary cursor-pointer transition-colors group">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-2 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <p className="font-semibold text-gray-800">Cleaning</p>
                                    <p className="text-xs text-gray-500">Spa & Wash</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="px-6 pb-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {activeBooking.status === BookingStatus.SEARCHING ? 'Finding Mechanic...' : activeBooking.status === BookingStatus.EN_ROUTE ? 'Mechanic En Route' : 'Service In Progress'}
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Order ID: #{activeBooking._id}</p>
                                </div>
                                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                                    {activeBooking.status.replace('_', ' ')}
                                </span>
                            </div>

                            {activeBooking.status === BookingStatus.SEARCHING ? (
                                <div className="flex flex-col items-center justify-center py-6">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                                    <p className="text-gray-500">Connecting to nearby partners...</p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800">{activeBooking.mechanicName}</h3>
                                            <div className="flex items-center text-yellow-500 text-sm">
                                                <span>★ 4.8</span>
                                                <span className="text-gray-400 mx-1">•</span>
                                                <span className="text-gray-500">Honda Civic (Tow Truck)</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                            </button>
                                            <button onClick={() => setShowChat(!showChat)} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button onClick={cancelBooking} className="w-full py-3 text-red-600 font-semibold border border-red-200 rounded-lg hover:bg-red-50">
                                Cancel Request
                            </button>
                        </div>
                    )}
                </div>
            </>
        )}

        {activeTab === 'ACTIVITY' && (
             <div className="h-full flex flex-col bg-gray-50 pb-20">
                {/* History Header */}
                <div className="bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">Past Activity</h1>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {PAST_BOOKINGS.map((booking) => (
                        <div key={booking._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
                            <div className={`p-3 rounded-full ${booking.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {getServiceIcon(booking.serviceType)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800">{booking.serviceType.replace('_', ' ')}</h3>
                                    <span className="text-sm font-bold text-gray-900">₹{booking.finalCost}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{booking.mechanicName}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(booking.createdAt).toDateString()} • {new Date(booking.createdAt).toLocaleTimeString()}</p>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {PAST_BOOKINGS.length === 0 && (
                         <div className="text-center py-10 text-gray-400">No past activity</div>
                    )}
                </div>
             </div>
        )}

      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-30">
            <button onClick={() => setActiveTab('HOME')} className={`flex-1 flex flex-col items-center justify-center h-full ${activeTab === 'HOME' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span className="text-[10px] font-bold mt-1">Home</span>
            </button>
            <button onClick={() => setActiveTab('ACTIVITY')} className={`flex-1 flex flex-col items-center justify-center h-full ${activeTab === 'ACTIVITY' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-[10px] font-bold mt-1">Activity</span>
            </button>
            <button onClick={onLogout} className="flex-1 flex flex-col items-center justify-center h-full text-gray-400 hover:text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span className="text-[10px] font-bold mt-1">Logout</span>
            </button>
      </div>

    </div>
  );
};
