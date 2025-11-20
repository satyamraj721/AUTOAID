
import React, { useState } from 'react';
import { LiveMap } from './LiveMap';
import { MOCK_MECHANICS, MOCK_BOOKINGS } from '../constants';
import { BookingStatus } from '../types';

export const Dashboard: React.FC = () => {
  const [mechanics] = useState(MOCK_MECHANICS);
  const [bookings] = useState(MOCK_BOOKINGS);

  const activeSOS = bookings.filter(b => b.status !== BookingStatus.COMPLETED && b.status !== BookingStatus.CANCELLED).length;
  const onlineMechanics = mechanics.filter(m => m.isOnline).length;

  // Mock Revenue Data for Chart
  const revenueData = [45, 60, 35, 70, 85, 50, 65]; 

  return (
    <div className="flex flex-col space-y-8">
        
        {/* 1. Header Stats Row - Improved visual design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Emergency SOS</p>
                <h3 className="text-3xl font-black text-gray-900 mt-2">{activeSOS}</h3>
                <p className="text-xs text-red-500 font-medium mt-1">↑ 2 new in last hr</p>
              </div>
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
             <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Fleet</p>
                <h3 className="text-3xl font-black text-gray-900 mt-2">{onlineMechanics}<span className="text-lg text-gray-400 font-normal">/{mechanics.length}</span></h3>
                <p className="text-xs text-green-600 font-medium mt-1">85% Utilization</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Revenue (Today)</p>
                <h3 className="text-3xl font-black text-gray-900 mt-2">₹18.2k</h3>
                <p className="text-xs text-green-600 font-medium mt-1">↑ 12% vs yesterday</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg shadow-gray-400/20 text-white flex flex-col justify-between">
             <div>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg Response Time</p>
               <h3 className="text-3xl font-black mt-2">4m 12s</h3>
             </div>
             <div className="mt-4 w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '70%' }}></div>
             </div>
             <p className="text-xs text-gray-400 mt-2">Target: &lt; 5m 00s</p>
          </div>
        </div>

        {/* 2. Main Grid: Map + Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Live Operations Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px] lg:h-[600px] overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 <h2 className="text-lg font-bold text-gray-800">Live Dispatch Map</h2>
              </div>
              <button className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                Expand View
              </button>
            </div>
            <div className="flex-1 relative bg-gray-100">
              <LiveMap mechanics={mechanics} bookings={bookings} />
              {/* Map Overlay Controls */}
              <div className="absolute bottom-4 left-4 flex space-x-2">
                 <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow text-xs font-bold text-gray-700 border border-gray-200">
                    Mechanics: {onlineMechanics}
                 </div>
                 <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow text-xs font-bold text-red-600 border border-gray-200">
                    SOS: {activeSOS}
                 </div>
              </div>
            </div>
          </div>

          {/* Right: Analytics & Feed */}
          <div className="flex flex-col space-y-6">
            
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Weekly Trend</h2>
                  <select className="text-xs border-none bg-gray-50 text-gray-500 font-bold rounded cursor-pointer focus:ring-0">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
               </div>
               <div className="flex items-end justify-between h-40 space-x-3 px-2">
                 {revenueData.map((height, idx) => (
                   <div key={idx} className="flex-1 flex flex-col justify-end group cursor-pointer">
                      <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden h-full">
                          <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg transition-all duration-700 ease-out group-hover:bg-indigo-600" style={{ height: `${height}%` }}></div>
                      </div>
                      <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
                        {['M','T','W','T','F','S','S'][idx]}
                      </p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Service Distribution (New Feature) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
               <h2 className="text-lg font-bold text-gray-800 mb-4">Service Mix</h2>
               <div className="flex items-center space-x-6">
                  {/* CSS Pie Chart */}
                  <div className="w-24 h-24 rounded-full flex-shrink-0" style={{ background: 'conic-gradient(#ef4444 0% 35%, #3b82f6 35% 60%, #f59e0b 60% 85%, #10b981 85% 100%)' }}></div>
                  <div className="space-y-2 flex-1">
                     <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-gray-600"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>SOS Towing</span>
                        <span className="font-bold">35%</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-gray-600"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Flat Tire</span>
                        <span className="font-bold">25%</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-gray-600"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>Battery</span>
                        <span className="font-bold">25%</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-gray-600"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Others</span>
                        <span className="font-bold">15%</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* 3. Bottom Row: Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Incoming Requests */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Live Request Feed</h2>
                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-md animate-pulse">LIVE</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {bookings.map((booking, idx) => (
                        <div key={booking._id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${idx !== bookings.length - 1 ? 'border-b border-gray-50' : ''}`}>
                             <div className="flex items-center space-x-4">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.isSOS ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                     {booking.isSOS ? '!' : 'S'}
                                 </div>
                                 <div>
                                     <p className="text-sm font-bold text-gray-800">{booking.serviceType.replace('SOS_', '')}</p>
                                     <p className="text-xs text-gray-500">{booking.location.address}</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <span className={`block text-xs font-bold px-2 py-1 rounded-full ${booking.status === BookingStatus.SEARCHING ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                     {booking.status}
                                 </span>
                                 <span className="text-[10px] text-gray-400 mt-1 block">{new Date(booking.createdAt).toLocaleTimeString()}</span>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Partners (New Feature) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Top Partners (Oct)</h2>
                    <button className="text-indigo-600 text-xs font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">Mechanic</th>
                                <th className="px-6 py-3 font-medium">Jobs</th>
                                <th className="px-6 py-3 font-medium">Rating</th>
                                <th className="px-6 py-3 font-medium">Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {mechanics.slice(0, 4).map(mech => (
                                <tr key={mech.userId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{mech.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{mech.totalJobs}</td>
                                    <td className="px-6 py-4 text-yellow-600 font-bold">★ {mech.rating}</td>
                                    <td className="px-6 py-4 font-mono text-gray-700">₹{(mech.totalJobs * 450).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
  );
};