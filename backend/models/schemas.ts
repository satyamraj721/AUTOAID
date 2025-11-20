import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, BookingStatus, ServiceType } from '../../types';

/**
 * User Schema
 * Base schema for all actors in the system.
 */
const UserSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true, index: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
  fullName: { type: String },
  email: { type: String, lowercase: true },
  isVerified: { type: Boolean, default: false },
  fcmToken: { type: String }, // For Push Notifications
}, { timestamps: true });

export const UserModel = mongoose.model('User', UserSchema);

/**
 * Mechanic Profile Schema
 * Stores operational data for mechanics.
 * USES 2DSPHERE INDEX FOR GEOSPATIAL QUERIES.
 */
const MechanicProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  isOnline: { type: Boolean, default: false, index: true },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [Longitude, Latitude]
  },
  kycStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  specializations: [{ type: String, enum: Object.values(ServiceType) }],
  rating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 }
});

// CRITICAL: Index for "Find nearest mechanic"
MechanicProfileSchema.index({ currentLocation: '2dsphere' });

export const MechanicProfileModel = mongoose.model('MechanicProfile', MechanicProfileSchema);

/**
 * Booking Schema
 * The core transactional record.
 */
const BookingSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mechanicId: { type: Schema.Types.ObjectId, ref: 'User' },
  serviceType: { type: String, enum: Object.values(ServiceType), required: true },
  status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
  location: {
    address: { type: String },
    geo: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    }
  },
  isSOS: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  transactionId: { type: String }, // Reference to Razorpay/Paytm
}, { timestamps: true });

export const BookingModel = mongoose.model('Booking', BookingSchema);
