"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/app/components/Icon';

interface User {
  id: string;
  email: string;
  status: 'pending' | 'active';
  createdAt: string;
  lastAccessedAt?: string;
}

export default function AdminInvitePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  // Invite form state
  const [email, setEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Users list state
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/portal/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Not authenticated, will show login form
      }
      setIsLoadingUsers(false);
    };
    checkAuth();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const response = await fetch('/api/portal/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setIsAuthenticated(true);
      // Load users after successful authentication
      await loadUsers();
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/portal/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingInvite(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/portal/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: autoGeneratePassword ? undefined : invitePassword,
          autoGeneratePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invite');
      }

      setSuccessMessage(`✓ Invite sent to ${email}${data.password ? ` (Password: ${data.password})` : ''}`);
      setEmail('');
      setInvitePassword('');
      await loadUsers();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setSuccessMessage(`✗ ${err.message}`);
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleRevokeAccess = async (userEmail: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${userEmail}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/portal/users?email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to revoke access');
      }
    } catch (error) {
      alert('Failed to revoke access');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!isAuthenticated) {
    return <AdminLoginForm
      password={password}
      setPassword={setPassword}
      onSubmit={handleAdminLogin}
      isLoading={isAuthenticating}
      error={authError}
    />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Font definitions */}
      <style jsx global>{`
        @font-face {
          font-family: 'Gilroy-Bold';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154322537-56f5335a/Gilroy-Bold.ttf');
        }
        @font-face {
          font-family: 'Gilroy-Medium';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383794-c0dd6ba6/Gilroy-Medium.ttf');
        }
        @font-face {
          font-family: 'Gilroy-Regular';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383871-7a29b740/Gilroy-Regular.ttf');
        }
        @font-face {
          font-family: 'Gilroy-Light';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383717-8ec05135/Gilroy-Light.ttf');
        }
        body {
          font-family: 'Gilroy-Regular', sans-serif;
          color: #264C3F;
          background-color: #FFFFFF;
        }
        .font-bold { font-family: 'Gilroy-Bold', sans-serif; }
        .font-medium { font-family: 'Gilroy-Medium', sans-serif; }
        .font-light { font-family: 'Gilroy-Light', sans-serif; }
        .btn-gold {
          background-color: #9E8461;
          transition: all 0.2s ease-in-out;
        }
        .btn-gold:hover {
          background-color: #8A7354;
        }
        .input-field {
          border: 1px solid #D4D4D4;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: #264C3F;
          outline: none;
        }
        .status-active { color: #4CAF50; }
        .status-pending { color: #999999; }
        .action-dropdown {
          display: none;
        }
        .action-container:focus-within .action-dropdown {
          display: block;
        }
        @media (max-width: 768px) {
          .table-responsive thead { display: none; }
          .table-responsive tr { display: block; margin-bottom: 1rem; border: 1px solid #D4D4D4; border-radius: 0.5rem; padding: 1rem; }
          .table-responsive td { display: flex; justify-content: space-between; align-items: center; border: none !important; padding: 0.25rem 0 !important; }
          .table-responsive td::before { content: attr(data-label); font-family: 'Gilroy-Medium'; color: #264C3F; }
        }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#D4D4D4] px-6 md:px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154265122-c5d8062c/Group_59.png" alt="Xecuit" className="h-8" />
          <h1 className="hidden md:block text-xl font-medium tracking-tight border-l border-[#D4D4D4] pl-4 uppercase" style={{ fontFamily: 'Gilroy-Bold' }}>
            ADMIN PANEL – Portal Administration
          </h1>
        </div>

        {/* Desktop Logout */}
        <div className="hidden md:block">
          <button
            onClick={() => router.push('/portal/login')}
            className="text-sm font-medium hover:text-[#9E8461] transition-colors uppercase tracking-wider"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden flex items-center justify-center">
          <Icon icon="lucide:menu" className="text-2xl text-[#264C3F]" />
        </button>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-20">

        {/* SECTION 1: INVITE NEW USER */}
        <section className="max-w-2xl">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-tight">INVITE NEW USER</h2>
            <p className="text-sm text-[#264C3F]/70 font-medium">
              Grant portal access to brokers, advisors, and institutional counterparties.
            </p>
          </div>

          <form onSubmit={handleSendInvite} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-widest text-[#264C3F]">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="broker@institutional.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSendingInvite}
                  className="w-full px-4 py-3 rounded-none input-field text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-widest text-[#264C3F]">Password *</label>
                <input
                  type="password"
                  required={!autoGeneratePassword}
                  placeholder={autoGeneratePassword ? 'Auto-generated' : '••••••••'}
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  disabled={autoGeneratePassword || isSendingInvite}
                  className="w-full px-4 py-3 rounded-none input-field text-sm font-medium disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto-pass"
                checked={autoGeneratePassword}
                onChange={(e) => setAutoGeneratePassword(e.target.checked)}
                disabled={isSendingInvite}
                className="w-4 h-4 accent-[#264C3F]"
              />
              <label htmlFor="auto-pass" className="text-sm font-medium text-[#264C3F] select-none cursor-pointer">
                Auto-generate secure password
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSendingInvite}
                className="w-full md:w-auto md:px-12 py-4 btn-gold text-white font-bold text-xs uppercase tracking-widest shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingInvite ? 'Sending...' : 'Send Invite'}
              </button>
            </div>

            {/* Success/Error Message Area */}
            {successMessage && (
              <div className={`flex items-center gap-2 p-4 border ${successMessage.startsWith('✓') ? 'bg-[#4CAF50]/10 border-[#4CAF50]/20' : 'bg-red-50 border-red-200'}`}>
                <Icon icon={successMessage.startsWith('✓') ? 'lucide:check-circle' : 'lucide:x-circle'} className={successMessage.startsWith('✓') ? 'text-[#4CAF50]' : 'text-red-600'} />
                <p className={`text-sm font-medium ${successMessage.startsWith('✓') ? 'text-[#4CAF50]' : 'text-red-600'}`}>{successMessage}</p>
              </div>
            )}
          </form>
        </section>

        {/* SECTION 2: RECENT INVITES */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold uppercase tracking-tight">RECENT INVITES</h2>

          <div className="overflow-hidden border border-[#D4D4D4] rounded-none">
            <table className="w-full text-left table-responsive">
              <thead className="bg-white border-b border-[#D4D4D4]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Sent</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#D4D4D4]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F9F9F9] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium" data-label="Email">{user.email}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#264C3F]/70" data-label="Sent">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 text-sm font-bold" data-label="Status">
                      <span className={user.status === 'active' ? 'status-active' : 'status-pending'}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" data-label="Actions">
                      <div className="relative inline-block text-left action-container" tabIndex={0}>
                        <button className="p-2 hover:bg-[#D4D4D4]/30 rounded-full transition-colors">
                          <Icon icon="lucide:more-horizontal" className="text-xl" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#D4D4D4] shadow-xl z-20 action-dropdown">
                          <div className="py-1">
                            <button
                              onClick={() => {/* Resend logic could go here */}}
                              className="block w-full text-left px-4 py-2 text-xs font-medium uppercase tracking-wider hover:bg-[#E2DBCF]/30"
                            >
                              Resend Invite
                            </button>
                            <button
                              onClick={() => handleRevokeAccess(user.email)}
                              className="block w-full text-left px-4 py-2 text-xs font-medium uppercase tracking-wider hover:bg-[#E2DBCF]/30 text-red-600"
                            >
                              Revoke Access
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      No users invited yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[#D4D4D4] px-6 text-center">
        <p className="text-[10px] md:text-xs font-light text-[#999999] max-w-lg mx-auto leading-relaxed">
          CONFIDENTIAL: This portal contains proprietary information intended solely for authorized counterparties. Any unauthorized disclosure, distribution, or copying is strictly prohibited.
        </p>
        <p className="mt-4 text-[10px] font-medium uppercase tracking-widest text-[#264C3F]/40">
          © 2026 Xecuit Holdings LLC
        </p>
      </footer>
    </div>
  );
}

interface AdminLoginFormProps {
  password: string;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
}

function AdminLoginForm({ password, setPassword, onSubmit, isLoading, error }: AdminLoginFormProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#E2DBCF]">
      {/* Font definitions */}
      <style jsx global>{`
        @font-face {
          font-family: 'Gilroy-Bold';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154322537-56f5335a/Gilroy-Bold.ttf');
        }
        @font-face {
          font-family: 'Gilroy-Medium';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383794-c0dd6ba6/Gilroy-Medium.ttf');
        }
        @font-face {
          font-family: 'Gilroy-Regular';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383871-7a29b740/Gilroy-Regular.ttf');
        }
        body {
          font-family: 'Gilroy-Regular', sans-serif;
          color: #264C3F;
          background-color: #E2DBCF;
        }
        .btn-gold {
          background-color: #9E8461;
          transition: all 0.2s ease-in-out;
        }
        .btn-gold:hover {
          background-color: #8A7354;
        }
        .input-field {
          border: 1px solid #D4D4D4;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: #264C3F;
          outline: none;
        }
      `}</style>

      <div className="w-full max-w-md bg-white p-10 shadow-lg">
        <div className="text-center mb-8">
          <img
            src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154265370-6f776441/Xecuit_Logo_dark_Green.png"
            alt="Xecuit"
            className="h-10 mx-auto mb-6"
          />
          <h1 className="text-xl font-bold uppercase tracking-tight mb-2">Admin Access</h1>
          <p className="text-sm opacity-70">Enter admin password to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full bg-[#F5F3EF] border-none px-4 py-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-gold text-white font-bold py-4 text-sm uppercase tracking-widest shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Access Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
