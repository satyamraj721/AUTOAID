
import { IUser, UserRole, IMechanicProfile, ServiceType } from '../types';
import { MOCK_MECHANICS } from '../constants';

const KEYS = {
  USERS: 'autoaid_users_v1',
  MECHANICS: 'autoaid_mechanics_v1'
};

interface StoredUser extends IUser {
  password?: string;
}

const SEED_ADMINS: StoredUser[] = [
  {
    _id: 'admin-1',
    fullName: 'Super Admin',
    role: UserRole.ADMIN,
    phoneNumber: 'admin', // Username for admin
    password: 'admin123',
    isVerified: true,
    email: 'admin@autoaid.com'
  },
  {
    _id: 'admin-2', // Fallback for easy testing
    fullName: 'Dev Admin',
    role: UserRole.ADMIN,
    phoneNumber: 'admin', 
    password: 'admin',
    isVerified: true
  },
  {
    _id: 'admin-3', // From previous requests
    fullName: 'Alt Admin',
    role: UserRole.ADMIN,
    phoneNumber: 'admin@123',
    password: 'admin@123',
    isVerified: true
  }
];

export const authStorage = {
  // Initialize DB with Seed Data if empty
  init: () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.USERS)) {
      const initialUsers: StoredUser[] = [
        ...SEED_ADMINS,
        // Convert Mock Mechanics to Users so they can login
        ...MOCK_MECHANICS.map(m => ({
          _id: m.userId,
          fullName: m.name,
          role: UserRole.MECHANIC,
          phoneNumber: m.userId, // Using ID as username for simplicity
          password: '123', // Default password for mechanics
          isVerified: true,
          email: `${m.userId}@autoaid.partner`
        }))
      ];
      localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem(KEYS.MECHANICS)) {
      localStorage.setItem(KEYS.MECHANICS, JSON.stringify(MOCK_MECHANICS));
    }
  },

  loginUser: (identifier: string, password: string, role: UserRole): { success: boolean; user?: IUser; message?: string } => {
    authStorage.init();
    const users: StoredUser[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    
    // Normalize identifier
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    const user = users.find(u => 
      u.role === role && 
      (u.phoneNumber === cleanId || u.email === cleanId) &&
      (u.password === cleanPass)
    );

    if (user) {
      // Return user without password
      const { password, ...safeUser } = user;
      return { success: true, user: safeUser };
    }

    return { success: false, message: 'Invalid credentials' };
  },

  registerUser: (userData: StoredUser): { success: boolean; user?: IUser; message?: string } => {
    authStorage.init();
    const users: StoredUser[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');

    // Check existence
    if (users.find(u => u.phoneNumber === userData.phoneNumber && u.role === userData.role)) {
      return { success: false, message: 'User already exists' };
    }

    // Save User
    const newUser = { ...userData, _id: `user-${Date.now()}`, isVerified: true };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    // If Mechanic, create profile
    if (userData.role === UserRole.MECHANIC) {
      const mechanics: IMechanicProfile[] = JSON.parse(localStorage.getItem(KEYS.MECHANICS) || '[]');
      const newProfile: IMechanicProfile = {
        userId: newUser._id,
        name: newUser.fullName || 'New Mechanic',
        isOnline: false,
        currentLocation: { type: 'Point', coordinates: [-73.985, 40.758] }, // Default to NYC center
        specializations: [ServiceType.GENERAL_SERVICE],
        kycStatus: 'PENDING',
        kycDocuments: { licenseUrl: '', idCardUrl: '' },
        rating: 5.0,
        totalJobs: 0
      };
      mechanics.push(newProfile);
      localStorage.setItem(KEYS.MECHANICS, JSON.stringify(mechanics));
    }

    const { password, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  }
};
