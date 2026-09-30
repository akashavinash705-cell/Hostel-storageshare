import React, { useState } from 'react';
import {
  Archive,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  PlusCircle,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  BookingRecord,
  SpaceCategory,
  StorageListing,
  UserAccount,
} from '../types';

interface MyBookingsProps {
  bookings: BookingRecord[];
  currentUser: UserAccount | null;
  onViewBookingDetails: (booking: BookingRecord) => void;
  onConfirmBooking: (bookingId: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onBrowseSpaces: () => void;
}

export const MyBookingsView: React.FC<MyBookingsProps> = ({
  bookings,
  onViewBookingDetails,
  onConfirmBooking,
  onDeleteBooking,
  onBrowseSpaces,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase mb-1.5">
            Active Reservations & Handover Passes
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            My Campus Storage Bookings ({bookings.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Inspect handover schedules, host contact details, or cancel/delete any booking.
          </p>
        </div>

        <button
          type="button"
          onClick={onBrowseSpaces}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Find More Storage Spaces
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <Archive className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-900 font-display">
            No active storage bookings yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Select any closet, corridor locker, or room corner from the Search & Discovery
            Dashboard to request or confirm your semester break storage.
          </p>
          <button
            type="button"
            onClick={onBrowseSpaces}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Explore Campus Storage
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'Confirmed';
            return (
              <article
                key={booking.id}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2.5 flex-1">
                  {/* Unboxed Status & Metadata Line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`font-semibold inline-flex items-center gap-1 ${
                        isConfirmed ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isConfirmed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isConfirmed ? 'Booking Confirmed' : 'Pending Host Approval'}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="font-medium text-slate-700">
                      {booking.listingLocation}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="text-blue-700 font-semibold">
                      {booking.spaceType}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      ₹{booking.pricePerMonth} / month
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    {booking.listingTitle}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        Dates:{' '}
                        <strong className="font-mono text-slate-900">
                          {booking.startDate} – {booking.endDate}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Handover:{' '}
                        <strong className="font-mono text-slate-900">
                          {booking.startDate} • {booking.handoverTime}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        Host: <strong className="text-slate-900">{booking.hostName}</strong> (
                        {booking.hostPhone})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: View Details + Approve (if pending) + Delete / Cancel */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {!isConfirmed && (
                    <button
                      type="button"
                      onClick={() => onConfirmBooking(booking.id)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Confirm Booking
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onViewBookingDetails(booking)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    VIEW DETAILS
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteBooking(booking.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel / Delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface HostSpaceViewProps {
  currentUser: UserAccount | null;
  listings: StorageListing[];
  onCreateListing: (payload: {
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
  }) => void;
  onDeleteListing: (listingId: string) => void;
  onNavigateAuth: () => void;
  onSelectListing: (listing: StorageListing) => void;
}

export const HostSpaceView: React.FC<HostSpaceViewProps> = ({
  currentUser,
  listings,
  onCreateListing,
  onDeleteListing,
  onNavigateAuth,
  onSelectListing,
}) => {
  const [title, setTitle] = useState('');
  const [hostelName, setHostelName] = useState('Hostel A');
  const [blockName, setBlockName] = useState('Block 2');
  const [distance, setDistance] = useState('100m from Main Gate');
  const [spaceType, setSpaceType] = useState<SpaceCategory>('Closet');
  const [pricePerMonth, setPricePerMonth] = useState(120);
  const [availableFrom, setAvailableFrom] = useState('01 May');
  const [availableTo, setAvailableTo] = useState('31 May');
  const [capacityBoxes, setCapacityBoxes] = useState(4);
  const [dimensions, setDimensions] = useState('4 ft × 3 ft × 4 ft');
  const [roomNumber, setRoomNumber] = useState('Room 208, Floor 2, Hostel A • Block 2');
  const [hostPhone, setHostPhone] = useState(currentUser?.phone || '+91 98400 55100');
  const [defaultHandoverTime, setDefaultHandoverTime] = useState('10:00 AM');
  const [handoverInstructions, setHandoverInstructions] = useState(
    'Meet at hostel block reception 10 minutes prior to drop-off time and call host.'
  );
  const [publishedBanner, setPublishedBanner] = useState<string | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateListing({
      title: title.trim() || `${spaceType} Storage in ${hostelName} • ${blockName}`,
      hostelName,
      blockName,
      distance,
      spaceType,
      pricePerMonth,
      availableFrom,
      availableTo,
      capacityBoxes,
      dimensions,
      roomNumber,
      hostPhone,
      storageRules: [
        'All cartons and bags must be sealed and labeled with your student ID.',
        'No perishable food items or open liquids.',
      ],
      securityGuidelines: [
        'Room remains double-locked during semester break.',
        '24/7 hostel corridor CCTV and warden desk log.',
      ],
      handoverInstructions,
      defaultHandoverTime,
    });
    setTitle('');
    setPublishedBanner(
      'Your storage space is now live on the Search & Discovery Dashboard!'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase mb-1.5">
            Unified Account · Host a Space & Earn During Semester Break
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            List Your Unused Closet, Locker, or Room Corner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            You can publish storage spaces and book storage using the exact same account.
          </p>
        </div>

        {!currentUser && (
          <button
            type="button"
            onClick={onNavigateAuth}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
          >
            Sign In to Link Your Name
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Publish New Space Form (7 cols) */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 font-display pb-4 border-b border-slate-100">
            Create New Campus Storage Listing
          </h2>

          <form onSubmit={handlePublish} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="host-title"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Space Listing Title
              </label>
              <input
                id="host-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Lockable Walk-In Closet Lower Shelf"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="host-hostel"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Hostel Name
                </label>
                <input
                  id="host-hostel"
                  type="text"
                  required
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  placeholder="Hostel A"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="host-block"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Block
                </label>
                <input
                  id="host-block"
                  type="text"
                  required
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  placeholder="Block 2"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="host-type"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Space Type
                </label>
                <select
                  id="host-type"
                  value={spaceType}
                  onChange={(e) => setSpaceType(e.target.value as SpaceCategory)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Closet">Closet</option>
                  <option value="Locker">Locker</option>
                  <option value="Room Corner">Room Corner</option>
                  <option value="Wardrobe Cabinet">Wardrobe Cabinet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="host-price"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Monthly Rate (₹0 – ₹300)
                </label>
                <input
                  id="host-price"
                  type="number"
                  min={0}
                  max={300}
                  required
                  value={pricePerMonth}
                  onChange={(e) => setPricePerMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 tabular-nums"
                />
              </div>
              <div>
                <label
                  htmlFor="host-from"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Available From
                </label>
                <input
                  id="host-from"
                  type="text"
                  required
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  placeholder="01 May"
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="host-to"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Available Until
                </label>
                <input
                  id="host-to"
                  type="text"
                  required
                  value={availableTo}
                  onChange={(e) => setAvailableTo(e.target.value)}
                  placeholder="31 May"
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="host-room"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Exact Room / Locker Location
                </label>
                <input
                  id="host-room"
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="host-phone-input"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Host Contact Phone
                </label>
                <input
                  id="host-phone-input"
                  type="text"
                  required
                  value={hostPhone}
                  onChange={(e) => setHostPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="host-distance"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Campus Landmark Distance
                </label>
                <input
                  id="host-distance"
                  type="text"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="host-dims"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Dimensions
                </label>
                <input
                  id="host-dims"
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="host-time"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Default Handover Time
                </label>
                <input
                  id="host-time"
                  type="text"
                  value={defaultHandoverTime}
                  onChange={(e) => setDefaultHandoverTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="host-instructions"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Handover Instructions for Storage Seekers
              </label>
              <textarea
                id="host-instructions"
                rows={2}
                value={handoverInstructions}
                onChange={(e) => setHandoverInstructions(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {publishedBanner && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 font-medium">
                {publishedBanner}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Space to Marketplace</span>
            </button>
          </form>
        </section>

        {/* Active Campus Listings Management (5 cols) */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Live Campus Listings ({listings.length})
            </h2>
            <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Synced</span>
            </span>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {listings.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-blue-700">{item.spaceType}</span> ·{' '}
                    {item.location} ·{' '}
                    <span className="font-mono font-bold text-slate-900">
                      ₹{item.pricePerMonth}/mo
                    </span>
                  </div>
                  <h3
                    onClick={() => onSelectListing(item)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {item.availableFrom} – {item.availableTo} · Host: {item.hostName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteListing(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
