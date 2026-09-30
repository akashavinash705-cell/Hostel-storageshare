/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AuthAndMakerVault } from './components/AuthAndMakerVault';
import { BookingConfirmationView } from './components/BookingConfirmationView';
import { DiscoveryDashboard } from './components/DiscoveryDashboard';
import { HostSpaceView, MyBookingsView } from './components/MyBookingsAndHostView';
import { ActiveTab, Navbar } from './components/Navbar';
import { SpaceDetailsView } from './components/SpaceDetailsView';
import { storageApi } from './services/storageApi';
import { BookingRecord, SpaceCategory, StorageListing, UserAccount } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    storageApi.getCurrentUser()
  );
  const [users, setUsers] = useState<UserAccount[]>(() => storageApi.getUsers());
  const [listings, setListings] = useState<StorageListing[]>(() =>
    storageApi.getListings()
  );
  const [bookings, setBookings] = useState<BookingRecord[]>(() =>
    storageApi.getBookings()
  );
  const [isMakerUnlocked, setIsMakerUnlocked] = useState<boolean>(() =>
    storageApi.isMakerVaultUnlocked(storageApi.getCurrentUser())
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [selectedListing, setSelectedListing] = useState<StorageListing | null>(
    null
  );
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleSelectListing = (listing: StorageListing) => {
    setSelectedListing(listing);
    setActiveTab('space-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateBooking = (
    listing: StorageListing,
    payload: {
      startDate: string;
      endDate: string;
      handoverTime: string;
      boxCount: number;
      itemDescription: string;
      seekerPhone: string;
      initialStage: 'Pending Host Approval' | 'Confirmed';
    }
  ): BookingRecord => {
    // Ensure a valid user account exists even if booking before signing in
    let activeAccount = currentUser;
    if (!activeAccount) {
      activeAccount = storageApi.loginUser('student@campus.edu', 'campus123');
      setCurrentUser(activeAccount);
      setUsers(storageApi.getUsers());
    }

    const created = storageApi.createBooking(activeAccount, listing, payload);
    setBookings(storageApi.getBookings());
    setSelectedBooking(created);
    setToastMessage(
      payload.initialStage === 'Confirmed'
        ? `Booking Confirmed for ${listing.location} (${created.startDate} – ${created.endDate}).`
        : `Stage 1 Request submitted to ${listing.hostName}. Approve to unlock handover pass.`
    );
    return created;
  };

  const handleConfirmBookingStage = (bookingId: string) => {
    const updated = storageApi.confirmBooking(bookingId);
    const allBookings = storageApi.getBookings();
    setBookings(allBookings);
    if (updated) {
      setSelectedBooking(updated);
      setToastMessage(
        `Booking Confirmed! Handover scheduled for ${updated.startDate} • ${updated.handoverTime}.`
      );
    }
  };

  const handleDeleteOrCancelBooking = (bookingId: string) => {
    const remaining = storageApi.deleteBooking(bookingId);
    setBookings(remaining);
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking(null);
    }
    setActiveTab('my-bookings');
    setToastMessage('Booking has been cancelled and removed from your active bookings.');
  };

  const handleCreateListing = (payload: {
    title: string;
    hostelName: string;
    blockName: string;
    distance: string;
    spaceType: SpaceCategory;
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
  }) => {
    let activeAccount = currentUser;
    if (!activeAccount) {
      activeAccount = storageApi.loginUser('student@campus.edu', 'campus123');
      setCurrentUser(activeAccount);
      setUsers(storageApi.getUsers());
    }

    storageApi.createListing(activeAccount, payload);
    setListings(storageApi.getListings());
    setToastMessage(
      `Published "${payload.title}" in ${payload.hostelName} • ${payload.blockName}!`
    );
  };

  const handleDeleteListing = (listingId: string) => {
    const updated = storageApi.deleteListing(listingId);
    setListings(updated);
    setToastMessage('Storage listing removed.');
  };

  const handleLogout = () => {
    storageApi.logoutUser();
    setCurrentUser(null);
    setToastMessage('Signed out of your session.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        bookingCount={bookings.length}
        isMakerUnlocked={isMakerUnlocked}
        onLogout={handleLogout}
      />

      {/* Non-intrusive Action Feedback Banner */}
      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs sm:text-sm px-4 py-2.5 text-center font-medium">
          {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'discover' && (
          <DiscoveryDashboard
            listings={listings}
            currentUser={currentUser}
            onSelectListing={handleSelectListing}
            onNavigateHost={() => setActiveTab('host-space')}
            onNavigateAuth={() => setActiveTab('auth-vault')}
          />
        )}

        {activeTab === 'space-details' && (
          <SpaceDetailsView
            listing={selectedListing || listings[0]}
            currentUser={currentUser}
            onBack={() => setActiveTab('discover')}
            onCreateBooking={handleCreateBooking}
            onConfirmBookingStage={handleConfirmBookingStage}
            onOpenConfirmationPage={(booking) => {
              setSelectedBooking(booking);
              setActiveTab('booking-confirmation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'booking-confirmation' && selectedBooking && (
          <BookingConfirmationView
            booking={selectedBooking}
            onConfirmBooking={handleConfirmBookingStage}
            onCancelOrDeleteBooking={handleDeleteOrCancelBooking}
            onBackToMyBookings={() => setActiveTab('my-bookings')}
            onBrowseMoreSpaces={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'booking-confirmation' && !selectedBooking && (
          <MyBookingsView
            bookings={bookings}
            currentUser={currentUser}
            onViewBookingDetails={(b) => {
              setSelectedBooking(b);
              setActiveTab('booking-confirmation');
            }}
            onConfirmBooking={handleConfirmBookingStage}
            onDeleteBooking={handleDeleteOrCancelBooking}
            onBrowseSpaces={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'my-bookings' && (
          <MyBookingsView
            bookings={bookings}
            currentUser={currentUser}
            onViewBookingDetails={(b) => {
              setSelectedBooking(b);
              setActiveTab('booking-confirmation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onConfirmBooking={handleConfirmBookingStage}
            onDeleteBooking={handleDeleteOrCancelBooking}
            onBrowseSpaces={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'host-space' && (
          <HostSpaceView
            currentUser={currentUser}
            listings={listings}
            onCreateListing={handleCreateListing}
            onDeleteListing={handleDeleteListing}
            onNavigateAuth={() => setActiveTab('auth-vault')}
            onSelectListing={handleSelectListing}
          />
        )}

        {activeTab === 'auth-vault' && (
          <AuthAndMakerVault
            currentUser={currentUser}
            users={users}
            isMakerUnlocked={isMakerUnlocked}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              if (user.rolePreference === 'Space Host') {
                setActiveTab('host-space');
              } else if (!user.isMaker) {
                setActiveTab('discover');
              }
            }}
            onMakerUnlockChange={setIsMakerUnlocked}
            onUsersChange={setUsers}
            onNavigateDiscover={() => setActiveTab('discover')}
            onNavigateHost={() => setActiveTab('host-space')}
          />
        )}
      </main>

      {/* Quiet Campus Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-800 font-display">
              Campus StoreShare
            </span>{' '}
            · Peer-to-Peer Micro-Storage for Hostellers
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className="hover:text-slate-900 transition-colors"
            >
              Search & Discovery
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('host-space')}
              className="hover:text-slate-900 transition-colors"
            >
              Host a Space
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my-bookings')}
              className="hover:text-slate-900 transition-colors"
            >
              My Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('auth-vault')}
              className="hover:text-slate-900 transition-colors"
            >
              Sign In & Maker Vault
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
