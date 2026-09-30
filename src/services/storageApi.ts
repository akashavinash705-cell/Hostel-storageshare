import {
  BookingRecord,
  FirebaseCompatibleStore,
  StorageListing,
  UserAccount,
  UserRolePreference,
} from '../types';

import closetImg from '../assets/images/storage_closet_hostel_a_1790785342497.jpg';
import lockerImg from '../assets/images/storage_locker_block_2_1790785355846.jpg';
import cornerImg from '../assets/images/storage_room_corner_hostel_b_1790785369114.jpg';
import cabinetImg from '../assets/images/storage_cabinet_girls_wing_1790785381338.jpg';

const STORAGE_KEY = 'campus_storeshare_db_v1';
const SESSION_KEY = 'campus_storeshare_active_user_v1';
const MAKER_UNLOCK_KEY = 'campus_storeshare_maker_unlocked_v1';

export const BUILT_IN_MAKER_USERNAME = 'Avinash@saec';
export const BUILT_IN_MAKER_PASSWORD = 'avi123';

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_maker_avinash',
    username: BUILT_IN_MAKER_USERNAME,
    email: 'Avinash@saec.edu.in',
    password: BUILT_IN_MAKER_PASSWORD,
    fullName: 'Avinash (App Maker)',
    rolePreference: 'Unified (Seeker & Host)',
    hostelBlock: 'Hostel A • Admin Suite',
    phone: '+91 98400 11223',
    isMaker: true,
    createdAt: '2026-04-10T08:00:00.000Z',
  },
  {
    id: 'usr_host_karthik',
    username: 'karthik@saec',
    email: 'karthik@saec.edu.in',
    password: 'karthik123',
    fullName: 'Karthik R.',
    rolePreference: 'Unified (Seeker & Host)',
    hostelBlock: 'Hostel A • Block 2',
    phone: '+91 98401 22310',
    isMaker: false,
    createdAt: '2026-04-12T10:15:00.000Z',
  },
  {
    id: 'usr_host_priya',
    username: 'priya.sharma@saec',
    email: 'priya.sharma@saec.edu.in',
    password: 'priya2026',
    fullName: 'Priya Sharma',
    rolePreference: 'Unified (Seeker & Host)',
    hostelBlock: 'Hostel C • Block 3',
    phone: '+91 97910 33901',
    isMaker: false,
    createdAt: '2026-04-14T14:30:00.000Z',
  },
  {
    id: 'usr_host_rohit',
    username: 'rohit_mech@saec',
    email: 'rohit.verma@saec.edu.in',
    password: 'mech404',
    fullName: 'Rohit Verma',
    rolePreference: 'Unified (Seeker & Host)',
    hostelBlock: 'Hostel B • Block 1',
    phone: '+91 94441 88219',
    isMaker: false,
    createdAt: '2026-04-15T17:45:00.000Z',
  },
];

const INITIAL_LISTINGS: StorageListing[] = [
  {
    id: 'lst_hostel_a_closet_1',
    title: 'Walk-In Closet Lower & Mid Compartment',
    location: 'Hostel A • Block 2',
    hostelName: 'Hostel A',
    blockName: 'Block 2',
    distance: '110m from Main Gate',
    spaceType: 'Closet',
    pricePerMonth: 120,
    availableFrom: '01 May',
    availableTo: '31 May',
    capacityBoxes: 4,
    dimensions: '4.5 ft × 3 ft × 4 ft',
    hostId: 'usr_host_karthik',
    hostUsername: 'karthik@saec',
    hostName: 'Karthik',
    hostDepartment: 'B.E. CSE · 3rd Year · Verified Resident',
    hostPhone: '+91 98401 22310',
    roomNumber: 'Room 204, Floor 2, Hostel A • Block 2',
    verifiedHost: true,
    storageRules: [
      'All cartons and duffle bags must be sealed and labeled with your student ID.',
      'No perishable food items, open liquids, or flammable lab chemicals.',
      'Maximum 4 standard luggage boxes or 2 suitcases + 2 carton boxes.',
    ],
    securityGuidelines: [
      'Individual steel padlock latch on the inner closet door (bring your own secondary lock or use host key).',
      'Room stays double-locked during vacation; Resident Warden master registry logged.',
      '24/7 CCTV coverage in Block 2 ground and 2nd floor corridor.',
    ],
    handoverInstructions:
      'Meet at Hostel A • Block 2 reception lobby 10 minutes before handover. Call Karthik on arrival; items will be tagged and locked inside Room 204 closet compartment together.',
    defaultHandoverTime: '10:00 AM',
    imageUrl: closetImg,
    createdAt: '2026-04-12T11:00:00.000Z',
  },
  {
    id: 'lst_hostel_a_locker_2',
    title: 'Heavy-Duty Steel Corridor Locker #14',
    location: 'Hostel A • Block 2',
    hostelName: 'Hostel A',
    blockName: 'Block 2',
    distance: '85m from Academic Block',
    spaceType: 'Locker',
    pricePerMonth: 90,
    availableFrom: '01 May',
    availableTo: '15 Jun',
    capacityBoxes: 2,
    dimensions: '2.5 ft × 2 ft × 4.5 ft',
    hostId: 'usr_host_karthik',
    hostUsername: 'karthik@saec',
    hostName: 'Karthik',
    hostDepartment: 'B.E. CSE · 3rd Year · Verified Resident',
    hostPhone: '+91 98401 22310',
    roomNumber: 'Locker Bay B, Ground Floor, Hostel A • Block 2',
    verifiedHost: true,
    storageRules: [
      'Ideal for textbooks, winter bedding rolls, lab kits, and 1 medium trolley bag.',
      'No wet umbrellas, unsealed toiletries, or Fragile glass monitors.',
      'Key handover must be signed in the StoreShare handover log.',
    ],
    securityGuidelines: [
      'Reinforced 16-gauge powder-coated steel locker with dual-pin tumbler lock.',
      'Direct line of sight from the Block 2 Warden Security Desk.',
      'Tamper-evident security seal sticker applied at drop-off.',
    ],
    handoverInstructions:
      'Collect the duplicate locker tag at Room 204 or Ground Floor Security Desk in Hostel A • Block 2. You may attach your personal padlock to the secondary hasp.',
    defaultHandoverTime: '11:30 AM',
    imageUrl: lockerImg,
    createdAt: '2026-04-13T09:20:00.000Z',
  },
  {
    id: 'lst_hostel_b_corner_3',
    title: 'Dry Sunlit Room Corner + Elevated Trunk Rack',
    location: 'Hostel B • Block 1',
    hostelName: 'Hostel B',
    blockName: 'Block 1',
    distance: '190m from Central Library',
    spaceType: 'Room Corner',
    pricePerMonth: 180,
    availableFrom: '01 May',
    availableTo: '30 Jun',
    capacityBoxes: 6,
    dimensions: '6 ft × 4 ft × 5 ft',
    hostId: 'usr_host_rohit',
    hostUsername: 'rohit_mech@saec',
    hostName: 'Rohit Verma',
    hostDepartment: 'B.E. Mechanical · 3rd Year · Verified Resident',
    hostPhone: '+91 94441 88219',
    roomNumber: 'Room 312, Floor 3, Hostel B • Block 1',
    verifiedHost: true,
    storageRules: [
      'Supports large items: mini-cooler, study chair, mattress roll, and up to 5 boxes.',
      'Items are placed on elevated wooden pallets away from floor moisture.',
      'Schedule pickup at least 12 hours in advance via phone or WhatsApp.',
    ],
    securityGuidelines: [
      'Single-occupancy corner room staying locked throughout summer internship break.',
      'Photo inventory taken at drop-off for mutual verification.',
      'Biometric turnstile entry required at Hostel B main entrance.',
    ],
    handoverInstructions:
      'Use the service lift in Hostel B • Block 1 to reach the 3rd floor. Room 312 is the second door on the right. Trolley cart available at the guard desk.',
    defaultHandoverTime: '02:00 PM',
    imageUrl: cornerImg,
    createdAt: '2026-04-15T18:00:00.000Z',
  },
  {
    id: 'lst_hostel_c_cabinet_4',
    title: 'Lockable Birchwood Double Wardrobe Cabinet',
    location: 'Hostel C • Block 3',
    hostelName: 'Hostel C',
    blockName: 'Block 3',
    distance: '140m from North Dining Hall',
    spaceType: 'Wardrobe Cabinet',
    pricePerMonth: 150,
    availableFrom: '05 May',
    availableTo: '05 Jun',
    capacityBoxes: 3,
    dimensions: '3.5 ft × 2.5 ft × 6 ft',
    hostId: 'usr_host_priya',
    hostUsername: 'priya.sharma@saec',
    hostName: 'Priya Sharma',
    hostDepartment: 'B.E. ECE · 2nd Year · Verified Resident',
    hostPhone: '+91 97910 33901',
    roomNumber: 'Room 209, Floor 2, Hostel C • Block 3',
    verifiedHost: true,
    storageRules: [
      'Clean garments, bedding bags, books, and electronics in padded cases welcome.',
      'Naphthalene/camphor moisture packets provided inside cabinet shelves.',
      'Strictly no food packets or scented liquids.',
    ],
    securityGuidelines: [
      'Dedicated built-in mortise lock on both birchwood doors.',
      'Women’s residential wing with 24/7 biometric access and floor matron supervision.',
      'Digital handover receipt generated immediately upon confirmation.',
    ],
    handoverInstructions:
      'Check in at Hostel C • Block 3 reception desk and call Priya. Handover takes place in Room 209 between 09:30 AM and 05:30 PM.',
    defaultHandoverTime: '10:00 AM',
    imageUrl: cabinetImg,
    createdAt: '2026-04-16T12:10:00.000Z',
  },
];

function createInitialStore(): FirebaseCompatibleStore {
  const usersMap: Record<string, UserAccount> = {};
  for (const u of INITIAL_USERS) {
    usersMap[u.id] = u;
  }

  const listingsMap: Record<string, StorageListing> = {};
  for (const l of INITIAL_LISTINGS) {
    listingsMap[l.id] = l;
  }

  return {
    meta: {
      schemaVersion: '1.0.0-firebase-json',
      appName: 'Campus StoreShare',
      lastSyncedAt: new Date().toISOString(),
    },
    collections: {
      users: usersMap,
      listings: listingsMap,
      bookings: {},
    },
  };
}

export function loadStore(): FirebaseCompatibleStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialStore();
      saveStore(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as FirebaseCompatibleStore;
    if (!parsed.collections || !parsed.collections.users || !parsed.collections.listings) {
      const initial = createInitialStore();
      saveStore(initial);
      return initial;
    }

    // Ensure built-in maker account Avinash@saec / avi123 is always present and intact
    const existingMaker = Object.values(parsed.collections.users).find(
      (u) => u.username.toLowerCase() === BUILT_IN_MAKER_USERNAME.toLowerCase()
    );
    if (!existingMaker) {
      parsed.collections.users['usr_maker_avinash'] = INITIAL_USERS[0];
      saveStore(parsed);
    } else {
      existingMaker.password = BUILT_IN_MAKER_PASSWORD;
      existingMaker.isMaker = true;
    }

    // Ensure local asset images are up to date on default listings
    if (parsed.collections.listings['lst_hostel_a_closet_1']) {
      parsed.collections.listings['lst_hostel_a_closet_1'].imageUrl = closetImg;
    }
    if (parsed.collections.listings['lst_hostel_a_locker_2']) {
      parsed.collections.listings['lst_hostel_a_locker_2'].imageUrl = lockerImg;
    }
    if (parsed.collections.listings['lst_hostel_b_corner_3']) {
      parsed.collections.listings['lst_hostel_b_corner_3'].imageUrl = cornerImg;
    }
    if (parsed.collections.listings['lst_hostel_c_cabinet_4']) {
      parsed.collections.listings['lst_hostel_c_cabinet_4'].imageUrl = cabinetImg;
    }

    return parsed;
  } catch {
    const initial = createInitialStore();
    saveStore(initial);
    return initial;
  }
}

export function saveStore(store: FirebaseCompatibleStore): void {
  store.meta.lastSyncedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// REST-style Mock API Service Layer
export const storageApi = {
  // GET /api/users (Admin/Maker Vault)
  getUsers(): UserAccount[] {
    const store = loadStore();
    return Object.values(store.collections.users).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // POST /api/auth/register — Uses exact username inserted by user (never overrides with random auto-generated username)
  registerUser(payload: {
    username: string;
    email?: string;
    password: string;
    fullName?: string;
    rolePreference?: UserRolePreference;
    hostelBlock?: string;
    phone?: string;
  }): UserAccount {
    const store = loadStore();
    const cleanUsername = payload.username.trim();
    const cleanPassword = payload.password || 'campus123';
    const isMakerAccount =
      cleanUsername.toLowerCase() === BUILT_IN_MAKER_USERNAME.toLowerCase();

    // Check if username already exists
    const existing = Object.values(store.collections.users).find(
      (u) =>
        u.username.toLowerCase() === cleanUsername.toLowerCase() ||
        (payload.email && u.email.toLowerCase() === payload.email.trim().toLowerCase())
    );

    if (existing) {
      // Update credentials seamlessly so registration never fails with an error
      existing.username = cleanUsername;
      existing.password = isMakerAccount ? BUILT_IN_MAKER_PASSWORD : cleanPassword;
      if (payload.fullName?.trim()) existing.fullName = payload.fullName.trim();
      if (payload.hostelBlock?.trim()) existing.hostelBlock = payload.hostelBlock.trim();
      if (payload.phone?.trim()) existing.phone = payload.phone.trim();
      if (payload.rolePreference) existing.rolePreference = payload.rolePreference;
      if (isMakerAccount) existing.isMaker = true;
      store.collections.users[existing.id] = existing;
      saveStore(store);
      localStorage.setItem(SESSION_KEY, existing.id);
      if (existing.isMaker) {
        localStorage.setItem(MAKER_UNLOCK_KEY, 'true');
      }
      return existing;
    }

    const id = `usr_${Date.now()}`;
    const derivedName =
      payload.fullName?.trim() ||
      cleanUsername.split('@')[0].replace(/[._-]/g, ' ');
    const capitalizedName =
      derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    const newUser: UserAccount = {
      id,
      username: cleanUsername,
      email: payload.email?.trim() || (cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@campus.edu`),
      password: isMakerAccount ? BUILT_IN_MAKER_PASSWORD : cleanPassword,
      fullName: capitalizedName,
      rolePreference: payload.rolePreference || 'Unified (Seeker & Host)',
      hostelBlock: payload.hostelBlock?.trim() || 'Hostel A • Block 2',
      phone: payload.phone?.trim() || '+91 98400 55100',
      isMaker: isMakerAccount,
      createdAt: new Date().toISOString(),
    };

    store.collections.users[id] = newUser;
    saveStore(store);
    localStorage.setItem(SESSION_KEY, newUser.id);
    if (newUser.isMaker) {
      localStorage.setItem(MAKER_UNLOCK_KEY, 'true');
    }
    return newUser;
  },

  // POST /api/auth/login — Error-free login using exact inserted username, with built-in Avinash@saec / avi123 maker access
  loginUser(usernameInput: string, passwordInput: string, rolePreference?: UserRolePreference): UserAccount {
    const store = loadStore();
    const cleanUsername = usernameInput.trim();
    const cleanPassword = passwordInput;

    // 1. Check Built-in Maker Access (Avinash@saec / avi123)
    if (cleanUsername.toLowerCase() === BUILT_IN_MAKER_USERNAME.toLowerCase()) {
      const maker =
        Object.values(store.collections.users).find(
          (u) => u.username.toLowerCase() === BUILT_IN_MAKER_USERNAME.toLowerCase()
        ) || INITIAL_USERS[0];
      maker.isMaker = true;
      store.collections.users[maker.id] = maker;
      saveStore(store);
      localStorage.setItem(SESSION_KEY, maker.id);
      localStorage.setItem(MAKER_UNLOCK_KEY, 'true');
      return maker;
    }

    // 2. Find existing user by username or email
    const existing = Object.values(store.collections.users).find(
      (u) =>
        u.username.toLowerCase() === cleanUsername.toLowerCase() ||
        u.email.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (existing) {
      // Update password in vault if changed so login succeeds without any error
      if (cleanPassword && existing.password !== cleanPassword) {
        existing.password = cleanPassword;
      }
      if (rolePreference) {
        existing.rolePreference = rolePreference;
      }
      store.collections.users[existing.id] = existing;
      saveStore(store);
      localStorage.setItem(SESSION_KEY, existing.id);
      return existing;
    }

    // 3. If user logs in directly with a username not yet in store, auto-provision with their exact username so login never fails
    return this.registerUser({
      username: cleanUsername,
      password: cleanPassword || 'campus123',
      rolePreference: rolePreference || 'Unified (Seeker & Host)',
    });
  },

  // GET /api/auth/session
  getCurrentUser(): UserAccount | null {
    const store = loadStore();
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;
    return store.collections.users[sessionId] || null;
  },

  // POST /api/auth/logout
  logoutUser(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  // Maker Vault Verification
  verifyMakerAccess(username: string, password: string): boolean {
    const isMatch =
      username.trim().toLowerCase() === BUILT_IN_MAKER_USERNAME.toLowerCase() &&
      password.trim() === BUILT_IN_MAKER_PASSWORD;
    if (isMatch) {
      localStorage.setItem(MAKER_UNLOCK_KEY, 'true');
    }
    return isMatch;
  },

  isMakerVaultUnlocked(currentUser: UserAccount | null): boolean {
    if (currentUser?.isMaker) return true;
    if (
      currentUser?.username.toLowerCase() === BUILT_IN_MAKER_USERNAME.toLowerCase()
    ) {
      return true;
    }
    return localStorage.getItem(MAKER_UNLOCK_KEY) === 'true';
  },

  lockMakerVault(): void {
    localStorage.removeItem(MAKER_UNLOCK_KEY);
  },

  deleteUserFromVault(userId: string): UserAccount[] {
    const store = loadStore();
    const target = store.collections.users[userId];
    if (target && !target.isMaker) {
      delete store.collections.users[userId];
      saveStore(store);
    }
    return this.getUsers();
  },

  // GET /api/listings
  getListings(): StorageListing[] {
    const store = loadStore();
    return Object.values(store.collections.listings).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // POST /api/listings — Any logged-in account can host a space
  createListing(
    user: UserAccount,
    payload: {
      title: string;
      hostelName: string;
      blockName: string;
      distance: string;
      spaceType: StorageListing['spaceType'];
      pricePerMonth: number;
      availableFrom: string;
      availableTo: string;
      capacityBoxes: number;
      dimensions: string;
      roomNumber: string;
      hostPhone: string;
      storageRules: string[];
      securityGuidelines: string[];
      handoverInstructions: string;
      defaultHandoverTime: string;
    }
  ): StorageListing {
    const store = loadStore();
    const id = `lst_${Date.now()}`;

    const imageByType: Record<StorageListing['spaceType'], string> = {
      Closet: closetImg,
      Locker: lockerImg,
      'Room Corner': cornerImg,
      'Wardrobe Cabinet': cabinetImg,
    };

    const newListing: StorageListing = {
      id,
      title: payload.title.trim(),
      hostelName: payload.hostelName.trim(),
      blockName: payload.blockName.trim(),
      location: `${payload.hostelName.trim()} • ${payload.blockName.trim()}`,
      distance: payload.distance.trim() || '100m from Campus Center',
      spaceType: payload.spaceType,
      pricePerMonth: Number(payload.pricePerMonth) || 120,
      availableFrom: payload.availableFrom.trim() || '01 May',
      availableTo: payload.availableTo.trim() || '31 May',
      capacityBoxes: Number(payload.capacityBoxes) || 4,
      dimensions: payload.dimensions.trim() || '4 ft × 3 ft × 4 ft',
      hostId: user.id,
      hostUsername: user.username,
      hostName: user.fullName || user.username.split('@')[0],
      hostDepartment: 'Verified Campus Host · Student ID Checked',
      hostPhone: payload.hostPhone.trim() || user.phone,
      roomNumber: payload.roomNumber.trim(),
      verifiedHost: true,
      storageRules:
        payload.storageRules.length > 0
          ? payload.storageRules
          : [
              'All luggage and cartons must be sealed and tagged with student ID.',
              'No perishable items or flammable substances allowed.',
            ],
      securityGuidelines:
        payload.securityGuidelines.length > 0
          ? payload.securityGuidelines
          : [
              'Double-locked room access during semester break.',
              '24/7 hostel block CCTV & warden desk entry log.',
            ],
      handoverInstructions:
        payload.handoverInstructions.trim() ||
        `Meet at ${payload.hostelName.trim()} • ${payload.blockName.trim()} lobby 10 minutes before scheduled time and call host.`,
      defaultHandoverTime: payload.defaultHandoverTime.trim() || '10:00 AM',
      imageUrl: imageByType[payload.spaceType] || closetImg,
      createdAt: new Date().toISOString(),
    };

    store.collections.listings[id] = newListing;
    saveStore(store);
    return newListing;
  },

  deleteListing(listingId: string): StorageListing[] {
    const store = loadStore();
    delete store.collections.listings[listingId];
    saveStore(store);
    return this.getListings();
  },

  // GET /api/bookings
  getBookings(): BookingRecord[] {
    const store = loadStore();
    return Object.values(store.collections.bookings).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // POST /api/bookings — Stage 1: Request to Book (or direct Confirm)
  createBooking(
    user: UserAccount,
    listing: StorageListing,
    payload: {
      startDate: string;
      endDate: string;
      handoverTime: string;
      boxCount: number;
      itemDescription: string;
      seekerPhone: string;
      initialStage?: 'Pending Host Approval' | 'Confirmed';
    }
  ): BookingRecord {
    const store = loadStore();
    const id = `bkg_${Date.now()}`;
    const booking: BookingRecord = {
      id,
      listingId: listing.id,
      listingTitle: listing.title,
      listingLocation: listing.location,
      spaceType: listing.spaceType,
      pricePerMonth: listing.pricePerMonth,
      totalPrice: listing.pricePerMonth,
      startDate: payload.startDate.trim() || listing.availableFrom,
      endDate: payload.endDate.trim() || listing.availableTo,
      handoverTime: payload.handoverTime.trim() || listing.defaultHandoverTime,
      boxCount: payload.boxCount || 2,
      itemDescription:
        payload.itemDescription.trim() || '2 sealed carton boxes + 1 travel duffle bag',
      seekerId: user.id,
      seekerUsername: user.username,
      seekerName: user.fullName || user.username,
      seekerPhone: payload.seekerPhone.trim() || user.phone,
      hostId: listing.hostId,
      hostUsername: listing.hostUsername,
      hostName: listing.hostName,
      hostPhone: listing.hostPhone,
      roomNumber: listing.roomNumber,
      handoverInstructions: listing.handoverInstructions,
      storageRules: listing.storageRules,
      securityGuidelines: listing.securityGuidelines,
      status: payload.initialStage || 'Pending Host Approval',
      createdAt: new Date().toISOString(),
      imageUrl: listing.imageUrl,
    };

    store.collections.bookings[id] = booking;
    saveStore(store);
    return booking;
  },

  // PATCH /api/bookings/:id/confirm — Stage 2: Confirmed Booking
  confirmBooking(bookingId: string): BookingRecord | null {
    const store = loadStore();
    const target = store.collections.bookings[bookingId];
    if (!target) return null;
    target.status = 'Confirmed';
    store.collections.bookings[bookingId] = target;
    saveStore(store);
    return target;
  },

  // DELETE /api/bookings/:id — Cancel / Delete booking
  deleteBooking(bookingId: string): BookingRecord[] {
    const store = loadStore();
    delete store.collections.bookings[bookingId];
    saveStore(store);
    return this.getBookings();
  },

  // Export raw Firebase-compatible JSON structure
  exportFirebaseJson(): string {
    const store = loadStore();
    return JSON.stringify(store, null, 2);
  },
};
