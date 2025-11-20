
import React, { useState } from 'react';
import { LiveMap } from './LiveMap';
import { ChatWindow } from './ChatWindow';
import { BookingStatus, IBooking, ServiceType, IUser, UserRole } from '../types';

interface Props {
  user: IUser;
  onLogout: () => void;
}

export const MechanicDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentJob, setCurrentJob] = useState<IBooking | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Simulate receiving a job
  const toggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline && !currentJob) {
      setTimeout(() => {
        setCurrentJob({
          _id: 'job-999',
          customerId: 'cust-1',
          customerName: 'Alice Johnson',
          customerPhone: '+1 555 0000',
          vehicleDetails: { make: 'Hyundai', model: 'Creta', year: '2022', plateNumber: 'KA-01-1234'},
          serviceType: ServiceType.SOS_JUMPSTART,
          status: BookingStatus.PENDING,
          location: { address: 'Downtown Market, 5th Ave', geo: { type: 'Point', coordinates: [0,0] }},
          createdAt: new Date().toISOString(),
          costEstimate: 450
        });
      }, 2000);
    }
  };

  const acceptJob = () => {
    if(currentJob) setCurrentJob({ ...currentJob, status: BookingStatus.EN_ROUTE });
  };

  const completeJob = () => {
    setCurrentJob(null); // Reset
    setShowChat(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center font-bold text-xs">
             {user.fullName?.charAt(0)}
           </div>
           <div>
             <p className="font-bold text-sm">{user.fullName}</p>
             <p className="text-xs text-gray-400">Partner ID: 8821</p>
           </div>
        </div>
        <div className="flex space-x-2">
            <button onClick={onLogout} className="text-xs text-gray-400 hover:text-white underline">Logout</button>
            <button onClick={toggleOnline} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {isOnline ? (
          <>
            <LiveMap userRole={UserRole.MECHANIC} activeBooking={currentJob} />
            
            {/* Earnings Quick View Widget */}
            {!currentJob && (
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-48">
                    <p className="text-xs text-gray-500 font-bold uppercase">Today's Earnings</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">₹ 2,450</p>
                    <div className="h-1 bg-gray-100 mt-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-3/5"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">5 Trips Completed</p>
                </div>
            )}
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200">
             <div className="text-center">
                <div className="bg-gray-300 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 animate-pulse">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-600">You are Offline</h2>
                <p className="text-gray-500">Go Online to start receiving jobs</p>
             </div>
          </div>
        )}

        {/* Chat Window */}
        {showChat && currentJob && (
           <ChatWindow 
              recipientName={currentJob.customerName} 
              onClose={() => setShowChat(false)}
              currentUserRole="MECHANIC"
           />
        )}

        {/* Job Card Overlay */}
        {isOnline && currentJob && (
          <div className="absolute bottom-0 left-0 right-0 bg-white m-4 rounded-xl shadow-2xl p-5 border-l-4 border-primary animate-slide-up">
            {currentJob.status === BookingStatus.PENDING ? (
              <div className="text-center">
                 <h3 className="text-red-600 font-bold text-lg animate-pulse">NEW JOB REQUEST</h3>
                 <h1 className="text-3xl font-bold text-gray-800 my-2">2.5 km</h1>
                 <p className="text-gray-600">{currentJob.location.address}</p>
                 <div className="bg-gray-100 p-2 rounded mt-2 inline-block text-sm font-semibold text-gray-700">
                   {currentJob.serviceType.replace('_', ' ')} • ₹{currentJob.costEstimate}
                 </div>
                 <div className="mt-6 grid grid-cols-2 gap-4">
                    <button onClick={() => setCurrentJob(null)} className="py-3 rounded-lg font-bold text-gray-600 bg-gray-200 hover:bg-gray-300">DECLINE</button>
                    <button onClick={acceptJob} className="py-3 rounded-lg font-bold text-white bg-green-600 shadow-lg shadow-green-200 hover:bg-green-700">ACCEPT JOB</button>
                 </div>
                 <div className="mt-2 relative h-1 bg-gray-200 rounded overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 bg-green-500 w-3/4"></div>
                 </div>
                 <p className="text-xs text-gray-400 mt-1">Auto-reject in 15s</p>
              </div>
            ) : (
              <div>
                {/* Active Job View */}
                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{currentJob.customerName}</h3>
                      <p className="text-sm text-gray-500">{currentJob.vehicleDetails?.model} ({currentJob.vehicleDetails?.plateNumber})</p>
                    </div>
                    <div className="flex space-x-2">
                       <button onClick={() => setShowChat(!showChat)} className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                       </button>
                       <button className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                       </button>
                    </div>
                 </div>
                 <div className="flex justify-between space-x-4">
                    <button className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors">NAVIGATE</button>
                    <button onClick={completeJob} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">COMPLETE</button>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
