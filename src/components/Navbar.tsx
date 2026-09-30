import React from 'react';
import { UserAccount } from '../types';

export type ActiveTab =
  | 'discover'
  | 'space-details'
  | 'booking-confirmation'
  | 'my-bookings'
  | 'host-space'
  | 'auth-vault';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: UserAccount | null;
  bookingCount: number;
  isMakerUnlocked: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  bookingCount,
  isMakerUnlocked,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('discover')}
          className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          Campus StoreShare
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onSelectTab('discover')}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'discover' || activeTab === 'space-details'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Find Storage
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('host-space')}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'host-space'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Host a Space
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('my-bookings')}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'my-bookings' || activeTab === 'booking-confirmation'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            My Bookings {bookingCount > 0 ? `(${bookingCount})` : ''}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('auth-vault')}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'auth-vault'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {isMakerUnlocked ? 'Maker Credential Vault' : 'Account & Maker Vault'}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => onSelectTab('auth-vault')}
                className="text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors truncate max-w-[160px] sm:max-w-[220px]"
                title={`Signed in as ${currentUser.username} (Access both Find Storage & Host Space)`}
              >
                {currentUser.username}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onSelectTab('auth-vault')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Row (Compact <= 40px) */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-100 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          type="button"
          onClick={() => onSelectTab('discover')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'discover' || activeTab === 'space-details'
              ? 'text-blue-700 font-semibold bg-blue-50/70'
              : 'hover:text-slate-900'
          }`}
        >
          Find Storage
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('host-space')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'host-space'
              ? 'text-blue-700 font-semibold bg-blue-50/70'
              : 'hover:text-slate-900'
          }`}
        >
          Host a Space
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('my-bookings')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'my-bookings' || activeTab === 'booking-confirmation'
              ? 'text-blue-700 font-semibold bg-blue-50/70'
              : 'hover:text-slate-900'
          }`}
        >
          My Bookings {bookingCount > 0 ? `(${bookingCount})` : ''}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('auth-vault')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'auth-vault'
              ? 'text-blue-700 font-semibold bg-blue-50/70'
              : 'hover:text-slate-900'
          }`}
        >
          {isMakerUnlocked ? 'Maker Vault' : 'Account / Vault'}
        </button>
      </div>
    </header>
  );
};
