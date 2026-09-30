import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  MapPin,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { BookingRecord, StorageListing, UserAccount } from '../types';

interface SpaceDetailsViewProps {
  listing: StorageListing;
  currentUser: UserAccount | null;
  onBack: () => void;
  onCreateBooking: (
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
  ) => BookingRecord;
  onConfirmBookingStage: (bookingId: string) => void;
  onOpenConfirmationPage: (booking: BookingRecord) => void;
}

export const SpaceDetailsView: React.FC<SpaceDetailsViewProps> = ({
  listing,
  currentUser,
  onBack,
  onCreateBooking,
  onConfirmBookingStage,
  onOpenConfirmationPage,
}) => {
  const [startDate, setStartDate] = useState(listing.availableFrom || '01 May');
  const [endDate, setEndDate] = useState(listing.availableTo || '31 May');
  const [handoverTime, setHandoverTime] = useState(
    listing.defaultHandoverTime || '10:00 AM'
  );
  const [boxCount, setBoxCount] = useState(2);
  const [itemDescription, setItemDescription] = useState(
    '2 sealed carton boxes (textbooks & clothes) + 1 duffle bag'
  );
  const [seekerPhone, setSeekerPhone] = useState(
    currentUser?.phone || '+91 98400 55100'
  );
  const [imgError, setImgError] = useState(false);

  // Two-stage booking state tracking inside Page 3
  const [stageOneBooking, setStageOneBooking] = useState<BookingRecord | null>(
    null
  );

  const handleStageOneRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const created = onCreateBooking(listing, {
      startDate,
      endDate,
      handoverTime,
      boxCount,
      itemDescription,
      seekerPhone,
      initialStage: 'Pending Host Approval',
    });
    setStageOneBooking(created);
  };

  const handleStageTwoConfirm = () => {
    if (stageOneBooking) {
      onConfirmBookingStage(stageOneBooking.id);
      const confirmedBooking: BookingRecord = {
        ...stageOneBooking,
        status: 'Confirmed',
      };
      onOpenConfirmationPage(confirmedBooking);
    } else {
      // Direct confirm if clicked directly
      const created = onCreateBooking(listing, {
        startDate,
        endDate,
        handoverTime,
        boxCount,
        itemDescription,
        seekerPhone,
        initialStage: 'Confirmed',
      });
      onOpenConfirmationPage(created);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Breadcrumb Back Link */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search & Discovery</span>
        </button>

        <div className="text-xs text-slate-500 font-mono">
          Page 3 · Space Details & Two-Stage Booking Flow
        </div>
      </div>

      {/* Main Split View: Space Details Left (7 cols) + Contiguous Booking Module Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Space Gallery, Host Identity, Rules, and Security */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="aspect-16/9 bg-slate-100 relative overflow-hidden">
              {!imgError ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-600 font-semibold text-sm">
                  {listing.spaceType} · {listing.location}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-6 text-white">
                <p className="text-xs font-medium text-blue-300">
                  {listing.location} · {listing.distance} · {listing.spaceType}
                </p>
                <h1 className="text-xl sm:text-3xl font-bold font-display mt-1">
                  {listing.title}
                </h1>
              </div>
            </div>

            {/* Key Specifications Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-t border-slate-200 bg-slate-50/60 text-xs p-4 gap-3 sm:gap-0">
              <div className="sm:px-3">
                <span className="text-slate-400 block">Monthly Rate</span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {listing.pricePerMonth} / month
                </span>
              </div>
              <div className="sm:px-3">
                <span className="text-slate-400 block">Location</span>
                <span className="font-semibold text-slate-900">{listing.location}</span>
              </div>
              <div className="sm:px-3">
                <span className="text-slate-400 block">Availability</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {listing.availableFrom} – {listing.availableTo}
                </span>
              </div>
              <div className="sm:px-3">
                <span className="text-slate-400 block">Dimensions & Limit</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {listing.dimensions} ({listing.capacityBoxes} boxes)
                </span>
              </div>
            </div>
          </div>

          {/* Host Identity & Trust Verification Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-display font-bold text-lg flex items-center justify-center shrink-0">
                  {listing.hostName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 font-display">
                      Hosted by {listing.hostName}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verified Campus Host</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{listing.hostDepartment}</p>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-600">
                Room: <span className="font-semibold text-slate-900">{listing.roomNumber}</span>
              </div>
            </div>

            {/* Storage Rules & Security Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Host Storage Rules</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {listing.storageRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">·</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Security & Safety Guidelines</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {listing.securityGuidelines.map((guide, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">·</span>
                      <span>{guide}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Handover Protocol: </span>
              {listing.handoverInstructions}
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Two-Stage Booking Request Module */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs lg:sticky lg:top-24 space-y-6">
          <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                ₹{listing.pricePerMonth}
              </span>
              <span className="text-xs sm:text-sm text-slate-500"> / month</span>
            </div>
            <span className="text-xs font-medium text-emerald-700">
              Available {listing.availableFrom} – {listing.availableTo}
            </span>
          </div>

          {/* Two-Stage Progress Indicator */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-lg text-xs">
            <div
              className={`px-3 py-2 rounded-md font-semibold flex items-center gap-1.5 ${
                !stageOneBooking
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-emerald-700 bg-emerald-50/70'
              }`}
            >
              <span>1. Request to Book</span>
            </div>
            <div
              className={`px-3 py-2 rounded-md font-semibold flex items-center gap-1.5 ${
                stageOneBooking
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <span>2. Confirmed Booking</span>
            </div>
          </div>

          {!stageOneBooking ? (
            <form onSubmit={handleStageOneRequest} className="space-y-4">
              {/* Date Range Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="booking-start"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="booking-start"
                      type="text"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="01 May"
                      className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="booking-end"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="booking-end"
                      type="text"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="31 May"
                      className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Date Range Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                <span>Quick select:</span>
                {[
                  { label: '01 May – 31 May', start: '01 May', end: '31 May' },
                  { label: '15 May – 15 Jun', start: '15 May', end: '15 Jun' },
                  { label: '01 Jun – 30 Jun', start: '01 Jun', end: '30 Jun' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setStartDate(preset.start);
                      setEndDate(preset.end);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="handover-time"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Drop-Off Time
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="handover-time"
                      type="text"
                      required
                      value={handoverTime}
                      onChange={(e) => setHandoverTime(e.target.value)}
                      placeholder="10:00 AM"
                      className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="box-count"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Number of Boxes / Bags
                  </label>
                  <input
                    id="box-count"
                    type="number"
                    min={1}
                    max={listing.capacityBoxes}
                    value={boxCount}
                    onChange={(e) => setBoxCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="item-desc"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Items to Store (For Host Handover Log)
                </label>
                <input
                  id="item-desc"
                  type="text"
                  required
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="seeker-phone"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Your Contact Number
                </label>
                <input
                  id="seeker-phone"
                  type="text"
                  required
                  value={seekerPhone}
                  onChange={(e) => setSeekerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Price Summary */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    Storage Window ({startDate} – {endDate})
                  </span>
                  <span className="font-mono tabular-nums">₹{listing.pricePerMonth}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Campus Host Verification & Tamper Seal</span>
                  <span className="font-mono text-emerald-700">Included</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Payable at Drop-Off</span>
                  <span className="font-mono tabular-nums">₹{listing.pricePerMonth} / month</span>
                </div>
              </div>

              {/* Stage 1 & Direct Stage 2 Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  STAGE 1: REQUEST TO BOOK ({startDate} – {endDate})
                </button>
                <button
                  type="button"
                  onClick={handleStageTwoConfirm}
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                >
                  Instant Host Approval & Confirm Booking
                </button>
              </div>
            </form>
          ) : (
            /* Stage 1 Completed -> Ready for Stage 2 Host Confirmation */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Stage 1 Complete: Request Sent to {listing.hostName}</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your booking request for{' '}
                  <span className="font-mono font-semibold">
                    {stageOneBooking.startDate} – {stageOneBooking.endDate}
                  </span>{' '}
                  at <span className="font-semibold">{listing.location}</span> is currently in{' '}
                  <strong>Pending Host Approval</strong> state.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Host & Location:</span>
                  <span className="font-semibold text-slate-900">
                    {listing.hostName} · {listing.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requested Dates:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {stageOneBooking.startDate} – {stageOneBooking.endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Drop-Off Slot:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {stageOneBooking.startDate} • {stageOneBooking.handoverTime}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStageTwoConfirm}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>STAGE 2: APPROVE & VIEW CONFIRMED HANDOVER</span>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              Exact Room ({listing.roomNumber}) and Host Phone unlocked on Confirmation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
