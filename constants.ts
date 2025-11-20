
import { BookingStatus, ServiceType, UserRole, IBooking, IMechanicProfile, IUser, IGeoLocation } from './types';

// Mock Admin User
export const MOCK_ADMIN: IUser = {
  _id: 'admin-001',
  fullName: 'Super Admin',
  role: UserRole.ADMIN,
  phoneNumber: '+1555000000',
  isVerified: true
};

// Helper to generate random location around NYC
// Center: 40.758896, -73.985130
const BASE_LAT = 40.758896;
const BASE_LNG = -73.985130;
const generateLoc = (latOffset: number, lngOffset: number): IGeoLocation => ({
  type: 'Point',
  coordinates: [BASE_LNG + lngOffset, BASE_LAT + latOffset]
});

// Expanded Mock Mechanics List
export const MOCK_MECHANICS: IMechanicProfile[] = [
  {
    userId: 'mech-1',
    name: 'Mike Fixit',
    isOnline: true,
    currentLocation: generateLoc(-0.02, 0.01), // Chelsea
    specializations: [ServiceType.FLAT_TIRE, ServiceType.SOS_JUMPSTART],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.8,
    totalJobs: 120
  },
  {
    userId: 'mech-2',
    name: 'Tow Master Pro',
    isOnline: true,
    currentLocation: generateLoc(0.03, -0.02), // Upper West Side
    specializations: [ServiceType.SOS_TOWING],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.9,
    totalJobs: 340
  },
  {
    userId: 'mech-3',
    name: 'Quick Lube & Wash',
    isOnline: false,
    currentLocation: generateLoc(0.01, 0.03), // Queens
    specializations: [ServiceType.GENERAL_SERVICE, ServiceType.WASHING],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.5,
    totalJobs: 210
  },
  {
    userId: 'mech-4',
    name: 'Battery Boss',
    isOnline: true,
    currentLocation: generateLoc(-0.04, -0.01), // Lower Manhattan
    specializations: [ServiceType.SOS_JUMPSTART],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.7,
    totalJobs: 85
  },
  {
    userId: 'mech-5',
    name: 'Downtown Towing',
    isOnline: true,
    currentLocation: generateLoc(-0.05, 0.02), // Brooklyn Bridge
    specializations: [ServiceType.SOS_TOWING],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.6,
    totalJobs: 150
  },
  {
    userId: 'mech-6',
    name: 'Harlem Auto Care',
    isOnline: true,
    currentLocation: generateLoc(0.06, -0.01), // Harlem
    specializations: [ServiceType.PERIODIC_MAINTENANCE],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.2,
    totalJobs: 40
  },
  {
    userId: 'mech-7',
    name: 'Eastside Fixers',
    isOnline: true,
    currentLocation: generateLoc(0.02, 0.04), // Astoria
    specializations: [ServiceType.DENTING_PAINTING],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.4,
    totalJobs: 90
  },
  {
    userId: 'mech-8',
    name: 'Midnight Rescue',
    isOnline: true,
    currentLocation: generateLoc(-0.01, -0.04), // Hoboken side
    specializations: [ServiceType.SOS_TOWING, ServiceType.SOS_JUMPSTART],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 5.0,
    totalJobs: 12
  },
  {
    userId: 'mech-9',
    name: 'Joe\'s Garage',
    isOnline: false,
    currentLocation: generateLoc(0.005, -0.005), // Midtown
    specializations: [ServiceType.GENERAL_SERVICE],
    kycStatus: 'PENDING',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 0,
    totalJobs: 0
  },
  {
    userId: 'mech-10',
    name: 'Speedy Tires',
    isOnline: true,
    currentLocation: generateLoc(-0.03, 0.03), // Williamsburg
    specializations: [ServiceType.FLAT_TIRE],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.8,
    totalJobs: 410
  },
  {
    userId: 'mech-11',
    name: 'Alpha Auto',
    isOnline: true,
    currentLocation: generateLoc(0.04, 0.01), // Upper East
    specializations: [ServiceType.PERIODIC_MAINTENANCE],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.3,
    totalJobs: 67
  },
  {
    userId: 'mech-12',
    name: 'Mobile Mechanic Unit 1',
    isOnline: true,
    currentLocation: generateLoc(-0.015, 0.005), // Murray Hill
    specializations: [ServiceType.SOS_JUMPSTART, ServiceType.FLAT_TIRE],
    kycStatus: 'APPROVED',
    kycDocuments: { licenseUrl: '#', idCardUrl: '#' },
    rating: 4.9,
    totalJobs: 220
  }
];

// Mock Live SOS Requests
export const MOCK_BOOKINGS: IBooking[] = [
  {
    _id: 'bk-101',
    customerId: 'cust-1',
    customerName: 'Alice Walker',
    customerPhone: '+15550101010',
    serviceType: ServiceType.SOS_TOWING,
    status: BookingStatus.SEARCHING,
    location: {
      address: '42nd St & 8th Ave, NY',
      geo: generateLoc(0.001, 0.001)
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bk-102',
    customerId: 'cust-2',
    customerName: 'Bob Builder',
    customerPhone: '+15550202020',
    serviceType: ServiceType.FLAT_TIRE,
    status: BookingStatus.EN_ROUTE,
    mechanicId: 'mech-1',
    mechanicName: 'Mike Fixit', 
    location: {
      address: 'Brooklyn Bridge Entrance',
      geo: generateLoc(-0.05, 0.015)
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    costEstimate: 1500
  },
  {
    _id: 'bk-103',
    customerId: 'cust-3',
    customerName: 'Sarah Connor',
    customerPhone: '+15550303030',
    serviceType: ServiceType.SOS_JUMPSTART,
    status: BookingStatus.IN_PROGRESS,
    mechanicId: 'mech-12',
    mechanicName: 'Mobile Mechanic Unit 1',
    location: {
      address: 'Central Park West',
      geo: generateLoc(0.045, -0.02)
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    costEstimate: 800
  }
];
