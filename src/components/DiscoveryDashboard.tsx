import React, { useMemo, useState } from 'react';
import { Archive, PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { SpaceCategory, StorageListing, UserAccount } from '../types';

interface DiscoveryDashboardProps {
  listings: StorageListing[];
  currentUser: UserAccount | null;
  onSelectListing: (listing: StorageListing) => void;
  onNavigateHost: () => void;
  onNavigateAuth: () => void;
}

const SPACE_CATEGORIES: Array<'All' | SpaceCategory> = [
  'All',
  'Closet',
  'Locker',
  'Room Corner',
  'Wardrobe Cabinet',
];

export const DiscoveryDashboard: React.FC<DiscoveryDashboardProps> = ({
  listings,
  currentUser,
  onSelectListing,
  onNavigateHost,
  onNavigateAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [selectedCategory, setSelectedCategory] = useState<'All' | SpaceCategory>('All');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.location.toLowerCase().includes(q) ||
        item.hostelName.toLowerCase().includes(q) ||
        item.blockName.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.spaceType.toLowerCase().includes(q) ||
        item.hostName.toLowerCase().includes(q) ||
        item.distance.toLowerCase().includes(q);

      const matchesPrice = item.pricePerMonth <= maxPrice;
      const matchesCategory =
        selectedCategory === 'All' || item.spaceType === selectedCategory;

      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [listings, searchQuery, maxPrice, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Hero + Search & Filter Module */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase mb-2">
              Semester Break Micro-Storage · Verified Campus Hostellers
            </p>
            <h1
              className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display"
              style={{ textWrap: 'balance' }}
            >
              Store Luggage & Books Inside Your Own Hostel Block
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              Book lockable closets, steel corridor lockers, and dry room corners from verified
              fellow students staying or locking rooms over the semester break.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNavigateHost}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>List Your Unused Hostel Space</span>
            </button>
            {!currentUser && (
              <button
                type="button"
                onClick={onNavigateAuth}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>

        {/* Search & Price Range Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          {/* Search Input (6 cols) */}
          <div className="md:col-span-6">
            <label
              htmlFor="campus-search"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Search by Location, Hostel, Block, or Host
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="campus-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Try "Hostel A", "Block 2", "Closet", or "Karthik"'
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Price Slider Filter (6 cols) */}
          <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="inline-flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Monthly Budget Filter (0 – 300 / month)</span>
              </span>
              <span className="font-mono text-blue-700 font-bold tabular-nums">
                0 – ₹{maxPrice} / month
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={300}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum monthly price filter"
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1 tabular-nums">
              <span>₹0</span>
              <span>₹100</span>
              <span>₹200</span>
              <span>₹300 / mo</span>
            </div>
          </div>
        </div>

        {/* Interactive Space Type Filter Bar + Quick Location Shortcuts */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {SPACE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'All Space Types' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
            <span className="whitespace-nowrap">Quick filter:</span>
            {['Hostel A', 'Block 2', 'Hostel B', 'Hostel C'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSearchQuery(searchQuery === loc ? '' : loc)}
                className={`px-2.5 py-1 rounded border text-xs transition-colors whitespace-nowrap ${
                  searchQuery === loc
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Above-the-Fold Listing Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Available Campus Micro-Storage ({filteredListings.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Every listing card displays Price, Location, Space Type, and Availability Dates
              upfront.
            </p>
          </div>
          {(searchQuery || maxPrice < 300 || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setMaxPrice(300);
                setSelectedCategory('All');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
            <Archive className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              No storage spaces match your current filter
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Try raising the monthly price slider up to ₹300 / month or clearing the search
              query to see all verified campus spaces.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setMaxPrice(300);
                setSelectedCategory('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Show All Spaces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isBroken = brokenImages[listing.id];
              return (
                <article
                  key={listing.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 hover:border-slate-300"
                >
                  <div>
                    {/* 4:3 Image Container with Zero-Broken-Image Fallback */}
                    <div
                      onClick={() => onSelectListing(listing)}
                      className="relative aspect-4/3 bg-slate-100 cursor-pointer overflow-hidden"
                    >
                      {!isBroken ? (
                        <img
                          src={listing.imageUrl}
                          alt={`${listing.title} at ${listing.location}`}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setBrokenImages((prev) => ({ ...prev, [listing.id]: true }))
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-4 text-center">
                          <Archive className="w-8 h-8 mb-2 text-blue-600" />
                          <span className="text-xs font-semibold text-slate-700">
                            {listing.spaceType} · {listing.location}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 flex items-end justify-between text-white">
                        <div>
                          <p className="text-xs font-medium text-slate-200">
                            {listing.location} · {listing.distance}
                          </p>
                        </div>
                        <div className="text-right font-mono font-bold text-base sm:text-lg tabular-nums">
                          ₹{listing.pricePerMonth} <span className="text-xs font-normal">/ month</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content — Clean Zero-Pill Metadata & Above-the-Fold Details */}
                    <div className="p-5 space-y-3">
                      {/* Unboxed Metadata Kicker with Typographic Separators */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-semibold text-blue-700">{listing.spaceType}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-slate-700 font-medium">
                          {listing.availableFrom} – {listing.availableTo}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">Up to {listing.capacityBoxes} boxes</span>
                      </div>

                      <h3
                        onClick={() => onSelectListing(listing)}
                        className="text-base sm:text-lg font-bold text-slate-900 font-display leading-snug cursor-pointer hover:text-blue-700 transition-colors"
                      >
                        {listing.title}
                      </h3>

                      {/* Structured Above-the-Fold Key Facts Grid */}
                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div>
                          <span className="text-slate-400 block">Location & Distance</span>
                          <span className="font-medium text-slate-800">
                            {listing.location} ({listing.distance.split(' ')[0]})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Availability Window</span>
                          <span className="font-mono font-semibold text-slate-800 tabular-nums">
                            {listing.availableFrom} – {listing.availableTo}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Space Type & Size</span>
                          <span className="font-medium text-slate-800">
                            {listing.spaceType} ({listing.dimensions})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Verified Host</span>
                          <span className="font-medium text-emerald-800">
                            {listing.hostName} · ID Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3">
                    <div className="font-mono tabular-nums">
                      <span className="text-base font-bold text-slate-900">
                        {listing.pricePerMonth} / month
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        No hidden platform fee
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectListing(listing)}
                      className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                    >
                      BOOK SPACE
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
