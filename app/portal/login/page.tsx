"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/portal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      console.log('[Login] Response:', data);
      console.log('[Login] Response status:', response.status);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to dashboard
      console.log('[Login] Redirecting to dashboard...');
      window.location.href = '/portal/dashboard';
    } catch (err: any) {
      console.error('[Login] Error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[#E2DBCF]">
      {/* Font definitions */}
      <style jsx global>{`
        @font-face {
          font-family: 'Gilroy';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383871-7a29b740/Gilroy-Regular.ttf') format('truetype');
          font-weight: 400;
        }
        @font-face {
          font-family: 'Gilroy';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383794-c0dd6ba6/Gilroy-Medium.ttf') format('truetype');
          font-weight: 500;
        }
        @font-face {
          font-family: 'Gilroy';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154322537-56f5335a/Gilroy-Bold.ttf') format('truetype');
          font-weight: 700;
        }
        body {
          font-family: 'Gilroy', sans-serif;
          background-color: #E2DBCF;
          color: #264C3F;
        }
        .xecuit-card {
          box-shadow: 0 10px 40px -15px rgba(38, 76, 63, 0.1);
        }
        input::placeholder {
          color: rgba(38, 76, 63, 0.4);
        }
        .xecuit-button {
          background-color: #9E8461;
        }
        .xecuit-button:hover {
          background-color: #8A7354;
        }
      `}</style>

      {/* Brand Logo Centered */}
      <div className="mb-12">
        <img
          src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154265122-c5d8062c/Group_59.png"
          alt="Xecuit Logo"
          className="h-12 w-auto"
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[440px] bg-white p-10 sm:p-12 xecuit-card rounded-sm">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">
            COUNTERPARTY ACCESS PORTAL
          </h1>
          <p className="text-sm font-medium leading-relaxed opacity-90 max-w-[320px] mx-auto">
            Authorized access to Xecuit Holdings acquisition materials, capital framework, and strategic resources.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-widest mb-2 opacity-60">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@firm.com"
              className="w-full bg-[#F5F3EF] border-none px-4 py-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-widest mb-2 opacity-60">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F5F3EF] border-none px-4 py-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full xecuit-button text-white font-bold py-4 text-sm uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Access Portal'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Notice */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.15em] opacity-50 max-w-[400px] leading-loose">
          Confidential Property of Xecuit Holdings LLC.<br />
          Access is monitored and restricted to authorized counterparties only.
        </p>
      </div>
    </div>
  );
}
