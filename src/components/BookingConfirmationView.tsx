import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { BookingRecord } from '../types';

interface BookingConfirmationViewProps {
  booking: BookingRecord;
  onConfirmBooking: (bookingId: string) => void;
  onCancelOrDeleteBooking: (bookingId: string) => void;
  onBackToMyBookings: () => void;
  onBrowseMoreSpaces: () => void;
}

export const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({
  booking,
  onConfirmBooking,
  onCancelOrDeleteBooking,
  onBackToMyBookings,
  onBrowseMoreSpaces,
}) => {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const isConfirmed = booking.status === 'Confirmed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToMyBookings}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </button>

        <span className="text-xs font-mono text-slate-500">
          Page 4 · Booking Confirmation & Handover Pass
        </span>
      </div>

      {/* Main Confirmation Status Banner (Green Confirmation State) */}
      <section
        className={`rounded-xl border p-6 sm:p-8 shadow-xs ${
          isConfirmed
            ? 'bg-emerald-50/90 border-emerald-300'
            : 'bg-amber-50/90 border-amber-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold text-emerald-800">
              <CheckCircle2
                className={`w-5 h-5 ${
                  isConfirmed ? 'text-emerald-600' : 'text-amber-600'
                }`}
              />
              <span>
                {isConfirmed ? 'Booking Confirmed' : 'Pending Host Approval'} · Ref #
                {booking.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              {isConfirmed
                ? 'Booking Confirmed — Handover Instructions Ready'
                : 'Booking Request Submitted — Awaiting Host Confirmation'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-700">
              Space: <strong>{booking.listingTitle}</strong> ({booking.listingLocation}) ·
              Booked by <span className="font-mono">{booking.seekerUsername}</span>
            </p>
          </div>

          <div className="text-left sm:text-right font-mono shrink-0">
            <span className="text-xs text-slate-600 block">Monthly Storage Rate</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              ₹{booking.pricePerMonth} / month
            </span>
          </div>
        </div>

        {!isConfirmed && (
          <div className="mt-5 pt-4 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-amber-900">
              Want to complete Stage 2 right away? Click Confirm to approve this booking
              and lock in your handover slot.
            </p>
            <button
              type="button"
              onClick={() => onConfirmBooking(booking.id)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Approve & Confirm Booking Now
            </button>
          </div>
        )}
      </section>

      {/* Handover Details & Host Contact Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
            Handover Schedule & Room Access Details
          </h2>
          <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            <span>Verified Campus Host Handover Pass</span>
          </span>
        </div>

        {/* 4-Box Key Handover Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Drop-Off Date & Time</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums">
              {booking.startDate} • {booking.handoverTime}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Storage Duration</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums">
              {booking.startDate} – {booking.endDate}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Host & Direct Contact</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{booking.hostName}</p>
            <p className="text-xs font-mono text-blue-700 font-semibold mt-0.5">
              {booking.hostPhone}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Exact Handover Room</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {booking.roomNumber}
            </p>
          </div>
        </div>

        {/* Specific Room Handover Instructions */}
        <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
            Specific Room Handover Instructions
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            {booking.handoverInstructions}
          </p>
          <div className="pt-2 text-xs text-slate-600 font-mono">
            Logged Items ({booking.boxCount} units): {booking.itemDescription}
          </div>
        </div>

        {/* Trust & Safety Reminder on Booking Confirmation Screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Storage Rules to Follow at Drop-Off</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {booking.storageRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">·</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Security Verification Checklist</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {booking.securityGuidelines.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Action Bar — Cancel / Delete Booking button instead of redundant loop */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBackToMyBookings}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Back to My Bookings
            </button>
            <button
              type="button"
              onClick={onBrowseMoreSpaces}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Browse More Spaces
            </button>
          </div>

          {/* Delete / Cancel Booking Action */}
          {!confirmingCancel ? (
            <button
              type="button"
              onClick={() => setConfirmingCancel(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>CANCEL / DELETE BOOKING</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-semibold text-red-800">
                Confirm cancellation?
              </span>
              <button
                type="button"
                onClick={() => onCancelOrDeleteBooking(booking.id)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors whitespace-nowrap"
              >
                Yes, Delete Booking
              </button>
              <button
                type="button"
                onClick={() => setConfirmingCancel(false)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Keep
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
