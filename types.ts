
// User Roles
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  MECHANIC = 'MECHANIC',
  ADMIN = 'ADMIN',
}

// Booking Status State Machine
export enum BookingStatus {
  PENDING = 'PENDING',
  SEARCHING = 'SEARCHING', // Specifically for SOS
  ASSIGNED = 'ASSIGNED', // Mechanic accepted
  EN_ROUTE = 'EN_ROUTE', // Mechanic moving to customer
  ARRIVED = 'ARRIVED', // Mechanic at location
  IN_PROGRESS = 'IN_PROGRESS', // Work started
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Service Types
export enum ServiceType {
  SOS_TOWING = 'SOS_TOWING',
  SOS_JUMPSTART = 'SOS_JUMPSTART',
  FLAT_TIRE = 'FLAT_TIRE',
  GENERAL_SERVICE = 'GENERAL_SERVICE',
  WASHING = 'WASHING',
  PERIODIC_MAINTENANCE = 'PERIODIC_MAINTENANCE',
  DENTING_PAINTING = 'DENTING_PAINTING',
}

// GeoJSON Interface for MongoDB
export interface IGeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Vehicle Interface
export interface IVehicle {
  make: string;
  model: string;
  year: string;
  plateNumber: string;
}

// Core User Interface
export interface IUser {
  _id: string;
  phoneNumber: string;
  fullName?: string;
  role: UserRole;
  email?: string;
  profileImage?: string;
  isVerified: boolean;
  vehicle?: IVehicle; // For Customers
  fcmToken?: string;
}

// Mechanic Profile Extension
export interface IMechanicProfile {
  userId: string;
  name: string; // Flattened for UI convenience
  isOnline: boolean;
  currentLocation?: IGeoLocation;
  heading?: number; // For icon rotation (Uber-like)
  specializations: ServiceType[];
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  kycDocuments: {
    licenseUrl: string;
    idCardUrl: string;
  };
  rating: number;
  totalJobs: number;
}

// Booking Interface
export interface IBooking {
  _id: string;
  customerId: string;
  customerName: string; // Snapshot
  customerPhone: string;
  mechanicId?: string;
  mechanicName?: string;
  vehicleDetails?: IVehicle;
  serviceType: ServiceType;
  status: BookingStatus;
  location: {
    address: string;
    geo: IGeoLocation;
  };
  scheduledTime?: Date; // Null if SOS
  costEstimate?: number;
  finalCost?: number;
  createdAt: string;
}

// Socket Events
export enum SocketEvents {
  JOIN_ROOM = 'join_room',
  LOCATION_UPDATE = 'location_update',
  SOS_TRIGGER = 'sos_trigger',
  JOB_OFFER = 'job_offer',
  JOB_ACCEPTED = 'job_accepted',
  TRACKING_UPDATE = 'tracking_update',
}
