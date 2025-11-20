
import React from 'react';
import { IMechanicProfile, IBooking, BookingStatus, UserRole } from '../types';

interface LiveMapProps {
  mechanics?: IMechanicProfile[];
  bookings?: IBooking[]; // For Admin View
  activeBooking?: IBooking | null; // For Customer/Mechanic View
  userRole?: UserRole;
  center?: { lat: number; lng: number };
}

export const LiveMap: React.FC<LiveMapProps> = ({ 
  mechanics = [], 
  bookings = [], 
  activeBooking, 
  userRole = UserRole.ADMIN 
}) => {
  
  const isCustomer = userRole === UserRole.CUSTOMER;

  // Simplified Projection Logic
  // We define a "bounding box" for our demo area (Roughly NYC)
  const MIN_LAT = 40.7000;
  const MAX_LAT = 40.8200;
  const MIN_LNG = -74.0300;
  const MAX_LNG = -73.9000;

  const getPosition = (lat: number, lng: number) => {
    // Clamp values
    const clampedLat = Math.min(Math.max(lat, MIN_LAT), MAX_LAT);
    const clampedLng = Math.min(Math.max(lng, MIN_LNG), MAX_LNG);

    const y = ((MAX_LAT - clampedLat) / (MAX_LAT - MIN_LAT)) * 100;
    const x = ((clampedLng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
    
    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div className="relative w-full h-full bg-gray-200 overflow-hidden group">
      {/* Mock Map Background - CSS Pattern */}
      <div className="absolute inset-0 opacity-40" 
           style={{ 
             backgroundColor: '#e5e7eb',
             backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)',
             backgroundSize: '50px 50px' 
           }}>
      </div>

      {/* Simulated Water/Parks */}
      <div className="absolute top-[10%] left-0 w-[20%] h-[80%] bg-blue-200/30 rounded-r-full blur-xl pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[15%] h-[30%] bg-green-200/30 rounded-full blur-xl pointer-events-none"></div>

      {/* Simulated Roads (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <path d="M0 200 Q 400 300 800 200 T 1600 200" stroke="#cbd5e1" strokeWidth="20" fill="none" />
        <path d="M300 0 V 800" stroke="#cbd5e1" strokeWidth="20" fill="none" />
        <path d="M600 800 V 0" stroke="#cbd5e1" strokeWidth="20" fill="none" />
        <path d="M0 500 L 1000 400" stroke="#cbd5e1" strokeWidth="15" fill="none" />
      </svg>

      {/* --- ADMIN & CUSTOMER VIEW: Show Mechanics --- */}
      {(userRole === UserRole.ADMIN || isCustomer) && mechanics.map((mech) => {
        const pos = getPosition(mech.currentLocation!.coordinates[1], mech.currentLocation!.coordinates[0]);
        return (
          <div
            key={mech.userId}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out hover:z-50 group/marker"
            style={pos}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transition-transform hover:scale-125 ${mech.isOnline ? 'bg-green-600' : 'bg-gray-400'}`}>
               {mech.specializations.includes('SOS_TOWING') ? (
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
               ) : (
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
               )}
            </div>
            {/* Tooltip */}
            {userRole === UserRole.ADMIN && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/marker:opacity-100 whitespace-nowrap pointer-events-none">
                {mech.name}
              </div>
            )}
          </div>
        );
      })}

      {/* --- CUSTOMER VIEW: My Location --- */}
      {isCustomer && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50 animate-ping"></span>
            <div className="relative w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADMIN VIEW: Show Active Bookings --- */}
      {userRole === UserRole.ADMIN && bookings.map(booking => {
         const pos = getPosition(booking.location.geo.coordinates[1], booking.location.geo.coordinates[0]);
         return (
           <div key={booking._id} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20" style={pos}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white animate-bounce ${booking.status === BookingStatus.SEARCHING ? 'bg-red-600' : 'bg-orange-500'}`}>
                !
              </div>
           </div>
         )
      })}

      {/* Legend / Attribution */}
      <div className="absolute bottom-1 right-1 text-[10px] text-gray-500 bg-white/50 px-1 pointer-events-none">
        © AutoAid Maps Data
      </div>
    </div>
  );
};
