export type SpaceCategory = 'Closet' | 'Locker' | 'Room Corner' | 'Wardrobe Cabinet';

export type UserRolePreference = 'Storage Seeker' | 'Space Host' | 'Unified (Seeker & Host)';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  password: string; // Stored in plaintext/decryptable format for App Maker Vault inspection
  fullName: string;
  rolePreference: UserRolePreference;
  hostelBlock: string;
  phone: string;
  isMaker?: boolean;
  createdAt: string;
}

export interface StorageListing {
  id: string;
  title: string;
  location: string; // e.g., "Hostel A • Block 2"
  hostelName: string; // e.g., "Hostel A"
  blockName: string; // e.g., "Block 2"
  distance: string; // e.g., "110m from Main Gate"
  spaceType: SpaceCategory;
  pricePerMonth: number; // e.g., 120
  availableFrom: string; // e.g., "01 May"
  availableTo: string; // e.g., "31 May"
  capacityBoxes: number;
  dimensions: string;
  hostId: string;
  hostUsername: string;
  hostName: string; // e.g., "Karthik"
  hostDepartment: string;
  hostPhone: string;
  roomNumber: string;
  verifiedHost: boolean;
  storageRules: string[];
  securityGuidelines: string[];
  handoverInstructions: string;
  defaultHandoverTime: string; // e.g., "10:00 AM"
  imageUrl: string;
  createdAt: string;
}

export type BookingStage = 'Pending Host Approval' | 'Confirmed';

export interface BookingRecord {
  id: string;
  listingId: string;
  listingTitle: string;
  listingLocation: string;
  spaceType: SpaceCategory;
  pricePerMonth: number;
  totalPrice: number;
  startDate: string; // e.g., "01 May"
  endDate: string; // e.g., "31 May"
  handoverTime: string; // e.g., "10:00 AM"
  boxCount: number;
  itemDescription: string;
  seekerId: string;
  seekerUsername: string;
  seekerName: string;
  seekerPhone: string;
  hostId: string;
  hostUsername: string;
  hostName: string;
  hostPhone: string;
  roomNumber: string;
  handoverInstructions: string;
  storageRules: string[];
  securityGuidelines: string[];
  status: BookingStage;
  createdAt: string;
  imageUrl: string;
}

export interface FirebaseCompatibleStore {
  meta: {
    schemaVersion: string;
    appName: string;
    lastSyncedAt: string;
  };
  collections: {
    users: Record<string, UserAccount>;
    listings: Record<string, StorageListing>;
    bookings: Record<string, BookingRecord>;
  };
}
