
import { Request, Response } from 'express';
import { BookingModel, MechanicProfileModel, UserModel } from '../models/schemas';
import { BookingStatus, ServiceType } from '../../types';

// Mock Socket IO import structure
// import { io } from '../server'; 

/**
 * Handles SOS Emergency Request
 * 1. Creates Booking
 * 2. Finds nearest online verified mechanics
 * 3. Emits socket event to mechanics
 */
export const triggerSOS = async (req: any, res: any) => {
  try {
    const { lat, lng, serviceType } = req.body;
    const customerId = req.user?._id; // Extracted from JWT Middleware

    // 1. Create Booking
    const booking = await BookingModel.create({
      customerId,
      serviceType: serviceType || ServiceType.SOS_TOWING,
      status: BookingStatus.SEARCHING,
      isSOS: true,
      location: {
        geo: { type: 'Point', coordinates: [lng, lat] }
      }
    });

    // 2. Find Nearest Mechanics (Max 5km radius)
    const nearbyMechanics = await MechanicProfileModel.find({
      isOnline: true,
      kycStatus: 'APPROVED',
      currentLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 5000 // meters
        }
      }
    }).populate('userId');

    if (nearbyMechanics.length === 0) {
        return res.status(404).json({ message: 'No mechanics nearby', bookingId: booking._id });
    }

    // 3. Notify Mechanics via Socket & FCM (Pseudo-code)
    const mechanicIds = nearbyMechanics.map((m: any) => m.userId._id.toString());
    
    // io.to(mechanicIds).emit('job_offer', {
    //   bookingId: booking._id,
    //   location: { lat, lng },
    //   type: 'SOS'
    // });

    return res.status(201).json({ 
      success: true, 
      booking, 
      message: `Alerted ${nearbyMechanics.length} mechanics` 
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
