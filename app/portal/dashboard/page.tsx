"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/app/components/Icon';

interface Document {
  id: string;
  title: string;
  description: string;
  icon: string;
  uploadDate: string;
  size: string;
  category: 'overview' | 'capital';
  fileUrl: string;
  downloadUrl?: string; // Optional different URL for download (e.g., PDF for HTML deck)
}

export default function PortalDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get user email from layout data attribute
  useEffect(() => {
    const container = document.querySelector('[data-user-email]');
    if (container) {
      const email = container.getAttribute('data-user-email') || '';
      setUserEmail(email);
    }
  }, []);

  // Document data - in a real app, this would come from a database
  const documents: Document[] = [
    {
      id: 'buyer-profile',
      title: 'Xecuit Buyer Profile',
      description: 'Comprehensive institutional presentation deck covering Xecuit\'s investment approach, criteria, and positioning',
      icon: 'mdi:presentation',
      uploadDate: 'May 5, 2026',
      size: 'Interactive HTML',
      category: 'overview',
      fileUrl: '/buyer-profile-deck.html',
      downloadUrl: '/documents/buyer-profile-deck.pdf',
    },
    {
      id: 'transaction-process',
      title: 'Transaction Process & Execution',
      description: 'Seven-stage acquisition process framework from preliminary evaluation through closing',
      icon: 'mdi:file-chart-outline',
      uploadDate: 'May 5, 2026',
      size: '1.6 MB',
      category: 'overview',
      fileUrl: '/documents/transaction-process.pdf',
    },
    {
      id: 'primary-capital',
      title: 'Primary Capital Relationship',
      description: 'Primary capital sources and partnership structures',
      icon: 'mdi:bank-outline',
      uploadDate: 'Jan 10, 2025',
      size: '3.2 MB',
      category: 'capital',
      fileUrl: '/documents/primary-capital.pdf',
    },
    {
      id: 'inst-capital',
      title: 'Institutional Capital Relationship',
      description: 'Institutional partner network and capital deployment framework',
      icon: 'mdi:bank-outline',
      uploadDate: 'Jan 8, 2025',
      size: '2.1 MB',
      category: 'capital',
      fileUrl: '/documents/institutional-capital.pdf',
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/portal/logout', { method: 'POST' });
      router.push('/portal/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/portal/login');
    }
  };

  const handleView = (doc: Document) => {
    window.open(doc.fileUrl, '_blank');
  };

  const handleDownload = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.downloadUrl || doc.fileUrl;
    link.download = `${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#E2DBCF] flex flex-col">
      {/* Font definitions */}
      <style jsx global>{`
        @font-face {
          font-family: 'Gilroy-Bold';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154322537-56f5335a/Gilroy-Bold.ttf');
        }
        @font-face {
          font-family: 'Gilroy-SemiBold';
          src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383945-0b144363/Gilroy-SemiBold.ttf');
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
        }
        .font-gilroy-bold { font-family: 'Gilroy-Bold'; }
        .font-gilroy-semibold { font-family: 'Gilroy-SemiBold'; }
        .font-gilroy-medium { font-family: 'Gilroy-Medium'; }
        .font-gilroy-light { font-family: 'Gilroy-Light'; }
      `}</style>

      {/* HEADER */}
      <header className="bg-[#264C3F] text-[#E2DBCF] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154265122-c5d8062c/Group_59.png"
              alt="Xecuit"
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <span className="font-gilroy-light text-sm opacity-80">Welcome, {userEmail || 'User'}</span>
            <button
              onClick={handleLogout}
              className="font-gilroy-medium text-sm border border-[#9E8461] px-4 py-1.5 rounded-sm hover:bg-[#9E8461] hover:text-white transition-all"
            >
              Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-2xl"
            >
              <Icon icon="lucide:menu" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#264C3F] border-t border-[#E2DBCF]/20 px-4 py-4">
            <div className="flex flex-col gap-4">
              <span className="font-gilroy-light text-sm opacity-80">Welcome, {userEmail || 'User'}</span>
              <button
                onClick={handleLogout}
                className="font-gilroy-medium text-sm border border-[#9E8461] px-4 py-2 rounded-sm hover:bg-[#9E8461] hover:text-white transition-all text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Intro */}
        <div className="mb-16">
          <h1 className="font-gilroy-bold text-[#264C3F] text-3xl md:text-4xl mb-6 tracking-tight">
            Counterparty Access Portal
          </h1>
          <p className="text-[#264C3F] font-gilroy-medium leading-relaxed max-w-3xl opacity-90">
            This secure environment contains Xecuit's current investment strategy, acquisition mandates, and capital structures.
            Materials provided herein are intended for authorized operating partners and institutional counterparties only.
          </p>
        </div>

        {/* Sections Wrapper */}
        <div className="space-y-16">
          {/* OVERVIEW SECTION */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b border-[#264C3F]/10 pb-4">
              <h2 className="font-gilroy-bold text-[#264C3F] text-xl tracking-wider uppercase">Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.filter(d => d.category === 'overview').map((doc) => (
                <DocumentCard key={doc.id} document={doc} onView={handleView} onDownload={handleDownload} />
              ))}
            </div>
          </section>

          {/* CAPITAL SECTION */}
          <section className="space-y-8 pb-12">
            <div className="flex items-center gap-4 border-b border-[#264C3F]/10 pb-4">
              <h2 className="font-gilroy-bold text-[#264C3F] text-xl tracking-wider uppercase">Capital</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.filter(d => d.category === 'capital').map((doc) => (
                <DocumentCard key={doc.id} document={doc} onView={handleView} onDownload={handleDownload} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[#264C3F]/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-gilroy-light text-[#264C3F] text-xs opacity-60 uppercase tracking-[0.2em]">
            Confidential. Not for distribution.
          </p>
          <p className="mt-4 font-gilroy-light text-[#264C3F] text-[10px] opacity-40 uppercase">
            © 2026 Xecuit Holdings LLC. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onDownload: (doc: Document) => void;
}

function DocumentCard({ document, onView, onDownload }: DocumentCardProps) {
  return (
    <div className="bg-white border border-[#D4D4D4] p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300" style={{ borderRadius: '8px' }}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 flex-shrink-0 bg-[#E2DBCF] flex items-center justify-center rounded-sm">
          <Icon icon={document.icon} className="text-2xl text-[#264C3F]" />
        </div>
        <div>
          <h3 className="font-gilroy-bold text-[#264C3F] text-lg leading-tight mb-1">{document.title}</h3>
          <div className="font-gilroy-light text-xs text-gray-500 uppercase tracking-tighter">
            Uploaded: {document.uploadDate} • {document.size}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onView(document)}
          className="flex-1 font-gilroy-medium text-xs border border-[#9E8461] text-[#9E8461] py-3 uppercase tracking-widest hover:bg-[#9E8461] hover:text-white transition-colors"
        >
          view
        </button>
        <button
          onClick={() => onDownload(document)}
          className="flex-1 font-gilroy-medium text-xs bg-[#9E8461] text-white py-3 uppercase tracking-widest hover:bg-[#264C3F] transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  );
}
