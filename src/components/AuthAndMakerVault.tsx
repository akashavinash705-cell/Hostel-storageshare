import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  ShieldCheck,
  Trash2,
  Unlock,
  UserPlus,
} from 'lucide-react';
import {
  BUILT_IN_MAKER_PASSWORD,
  BUILT_IN_MAKER_USERNAME,
  storageApi,
} from '../services/storageApi';
import { UserAccount, UserRolePreference } from '../types';

interface AuthAndMakerVaultProps {
  currentUser: UserAccount | null;
  users: UserAccount[];
  isMakerUnlocked: boolean;
  onAuthSuccess: (user: UserAccount, destination?: 'discover' | 'host-space') => void;
  onMakerUnlockChange: (unlocked: boolean) => void;
  onUsersChange: (users: UserAccount[]) => void;
  onNavigateDiscover: () => void;
  onNavigateHost: () => void;
}

export const AuthAndMakerVault: React.FC<AuthAndMakerVaultProps> = ({
  currentUser,
  users,
  isMakerUnlocked,
  onAuthSuccess,
  onMakerUnlockChange,
  onUsersChange,
  onNavigateDiscover,
  onNavigateHost,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form states — uses exact username inserted by the user (never auto-generates random usernames)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [hostelBlock, setHostelBlock] = useState('Hostel A • Block 2');
  const [phone, setPhone] = useState('+91 98400 55100');
  const [rolePreference, setRolePreference] = useState<UserRolePreference>(
    'Unified (Seeker & Host)'
  );
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Admin / Maker Vault states
  const [makerUsernameInput, setMakerUsernameInput] = useState('');
  const [makerPasswordInput, setMakerPasswordInput] = useState('');
  const [makerError, setMakerError] = useState<string | null>(null);
  const [showAllVaultPasswords, setShowAllVaultPasswords] = useState(true);
  const [revealedRows, setRevealedRows] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUser = username.trim() || 'student@campus.edu';
    const trimmedPass = password || 'campus123';

    if (authMode === 'register') {
      const registered = storageApi.registerUser({
        username: trimmedUser,
        email: trimmedUser.includes('@') ? trimmedUser : `${trimmedUser}@campus.edu`,
        password: trimmedPass,
        fullName: fullName.trim() || undefined,
        rolePreference,
        hostelBlock,
        phone,
      });
      onUsersChange(storageApi.getUsers());
      if (registered.isMaker) {
        onMakerUnlockChange(true);
      }
      setAuthFeedback(
        `Account created and signed in as "${registered.username}". Your single account has full access to both Find Storage and Host a Space.`
      );
      onAuthSuccess(registered);
    } else {
      const loggedIn = storageApi.loginUser(trimmedUser, trimmedPass, rolePreference);
      onUsersChange(storageApi.getUsers());
      if (loggedIn.isMaker) {
        onMakerUnlockChange(true);
      }
      setAuthFeedback(
        `Signed in as "${loggedIn.username}". You can now both Find Storage and Host a Space with this account.`
      );
      onAuthSuccess(loggedIn);
    }
  };

  const handleMakerUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = storageApi.verifyMakerAccess(makerUsernameInput, makerPasswordInput);
    if (ok) {
      setMakerError(null);
      onMakerUnlockChange(true);
      // Also sign in as Avinash@saec if not already signed in
      const makerAccount = storageApi.loginUser(
        BUILT_IN_MAKER_USERNAME,
        BUILT_IN_MAKER_PASSWORD
      );
      onUsersChange(storageApi.getUsers());
      onAuthSuccess(makerAccount);
    } else {
      setMakerError(
        'Invalid Maker credentials. Use the built-in App Maker credentials (Avinash@saec / avi123).'
      );
    }
  };

  const handleCopyCredentials = (user: UserAccount) => {
    navigator.clipboard?.writeText(
      `Username: ${user.username} | Password: ${user.password}`
    );
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDeleteVaultUser = (userId: string) => {
    const updated = storageApi.deleteUserFromVault(userId);
    onUsersChange(updated);
  };

  const handleDownloadJson = () => {
    const jsonStr = storageApi.exportFirebaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus-storeshare-firebase-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleRowReveal = (id: string) => {
    setRevealedRows((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? showAllVaultPasswords),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase mb-2">
          Page 1 · Unified Campus Authentication & App Maker Vault
        </p>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display">
          One Account for Finding Storage & Hosting Space
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
          Sign in or register with your exact preferred username. Every account automatically
          unlocks both <strong>Find Storage (Seeker)</strong> and{' '}
          <strong>Host a Space (Host)</strong> without switching accounts.
        </p>
      </div>

      {/* Active Session Banner if signed in */}
      {currentUser && (
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                Signed in as <span className="font-mono">{currentUser.username}</span> (
                {currentUser.fullName})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-800">
              Unified Account Active · Hostel: {currentUser.hostelBlock} · You can book storage
              and publish host spaces with this account.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNavigateDiscover}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Go to Find Storage
            </button>
            <button
              type="button"
              onClick={onNavigateHost}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Go to Host a Space
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Grid: Student Login/Register Left + Maker Vault Access Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Student Login / Register Card */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                {authMode === 'login'
                  ? 'Sign In to Campus StoreShare'
                  : 'Create Unified Student Account'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Uses your exact entered username · Instant error-free sign-in
              </p>
            </div>

            {/* Interactive Segmented Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthFeedback(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthFeedback(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  authMode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="auth-username"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Username or Student Email (Exact username preserved)
              </label>
              <input
                id="auth-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., student@campus.edu or Avinash@saec"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
              />
              <p className="mt-1 text-xs text-slate-500">
                We never overwrite your username with a random ID—you log in with the exact
                username you enter here.
              </p>
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showFormPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowFormPassword((v) => !v)}
                  aria-label={showFormPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  {showFormPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label
                    htmlFor="auth-fullname"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="auth-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Arjun Kumar"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="auth-hostel"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Hostel & Block
                  </label>
                  <input
                    id="auth-hostel"
                    type="text"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    placeholder="e.g., Hostel A • Block 2"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="auth-phone"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Campus Mobile / WhatsApp Number
                  </label>
                  <input
                    id="auth-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98400 55100"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Starting Dashboard Preference (Both modes remain unlocked on your account)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    'Unified (Seeker & Host)',
                    'Storage Seeker',
                    'Space Host',
                  ] as UserRolePreference[]
                ).map((roleOption) => (
                  <button
                    key={roleOption}
                    type="button"
                    onClick={() => setRolePreference(roleOption)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                      rolePreference === roleOption
                        ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {roleOption}
                  </button>
                ))}
              </div>
            </div>

            {authFeedback && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900">
                {authFeedback}
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              >
                {authMode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>SIGN IN</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>CREATE ACCOUNT & SIGN IN</span>
                  </>
                )}
              </button>

              {/* Quick Fill Helpers for fast testing */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400">Quick fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setUsername(BUILT_IN_MAKER_USERNAME);
                    setPassword(BUILT_IN_MAKER_PASSWORD);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors"
                >
                  Avinash@saec
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('karthik@saec');
                    setPassword('karthik123');
                  }}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors"
                >
                  karthik@saec
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Right 5 Cols: App Maker / Admin Vault Gate Card */}
        <section className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                In-Built Maker Access
              </p>
              <h2 className="text-lg sm:text-xl font-bold font-display mt-1">
                Admin / App Maker Credential Vault
              </h2>
            </div>
            {isMakerUnlocked ? (
              <Unlock className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Lock className="w-5 h-5 text-slate-400 shrink-0" />
            )}
          </div>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Restricted to the App Maker. Inspect all registered student usernames and plaintext
            passwords stored in the system.
          </p>

          {!isMakerUnlocked ? (
            <form onSubmit={handleMakerUnlockSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="maker-username"
                  className="block text-xs font-medium text-slate-300 mb-1"
                >
                  Maker Username
                </label>
                <input
                  id="maker-username"
                  type="text"
                  required
                  value={makerUsernameInput}
                  onChange={(e) => setMakerUsernameInput(e.target.value)}
                  placeholder="Avinash@saec"
                  className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="maker-password"
                  className="block text-xs font-medium text-slate-300 mb-1"
                >
                  Maker Password
                </label>
                <input
                  id="maker-password"
                  type="password"
                  required
                  value={makerPasswordInput}
                  onChange={(e) => setMakerPasswordInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {makerError && (
                <p className="text-xs text-red-400 bg-red-950/60 border border-red-800/60 rounded-lg p-2.5">
                  {makerError}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Maker Vault</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMakerUsernameInput(BUILT_IN_MAKER_USERNAME);
                    setMakerPasswordInput(BUILT_IN_MAKER_PASSWORD);
                  }}
                  className="px-3 py-2 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Auto-fill Avinash@saec
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-800/70 text-xs text-emerald-200 space-y-1">
                <p className="font-semibold text-emerald-300">
                  Maker Vault Unlocked ({BUILT_IN_MAKER_USERNAME})
                </p>
                <p>
                  Master credential table is active below with full plaintext password
                  inspection for all {users.length} registered accounts.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAllVaultPasswords((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  {showAllVaultPasswords ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Mask Passwords</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show All Plaintext</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Firebase JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    storageApi.lockMakerVault();
                    onMakerUnlockChange(false);
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Lock Vault
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Master Credential Vault Table (Visible ONLY when Maker Access is unlocked) */}
      {isMakerUnlocked && (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Admin / App Maker Master Credential Vault ({users.length} Registered Users)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Authenticated as Maker <span className="font-mono">{BUILT_IN_MAKER_USERNAME}</span> ·
                Real-time LocalStorage & Firebase JSON credential inspection
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowJsonInspector((v) => !v)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                {showJsonInspector ? 'Hide Raw JSON Store' : 'Inspect Raw JSON Store'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Student / Maker</th>
                  <th className="py-3 px-4">Username (Login ID)</th>
                  <th className="py-3 px-4">Plaintext Password</th>
                  <th className="py-3 px-4">Hostel & Block</th>
                  <th className="py-3 px-4">Access Scope</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {users.map((u) => {
                  const isRevealed = revealedRows[u.id] ?? showAllVaultPasswords;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>{u.fullName}</div>
                        <div className="text-xs text-slate-500 font-mono">{u.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                        {u.username}
                        {u.isMaker ? ' · [Maker]' : ''}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded bg-slate-100 text-slate-900 font-semibold select-all">
                            {isRevealed ? u.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRowReveal(u.id)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title={isRevealed ? 'Hide password' : 'Show plaintext password'}
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{u.hostelBlock}</td>
                      <td className="py-3 px-4 text-slate-600">
                        Unified (Seeker & Host)
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCredentials(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            {copiedId === u.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          {!u.isMaker && (
                            <button
                              type="button"
                              onClick={() => handleDeleteVaultUser(u.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remove user from vault"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showJsonInspector && (
            <div className="p-6 bg-slate-950 border-t border-slate-800 text-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400">
                  Firebase-Compatible Persistent LocalStorage Schema
                </span>
              </div>
              <pre className="text-xs font-mono overflow-x-auto max-h-80 p-4 bg-slate-900 rounded-lg border border-slate-800">
                {storageApi.exportFirebaseJson()}
              </pre>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
