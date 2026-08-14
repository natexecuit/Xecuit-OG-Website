/**
 * Calculator Hub - Main landing page for Xecuit calculators
 */

import Link from 'next/link';
import Icon from '@/app/components/Icon';

export default function CalculatorHubPage() {
  const categories = [
    {
      title: 'M&A Deal Analysis',
      description: 'Comprehensive deal viability analysis with debt capacity, IRR, MOIC, and projections',
      path: '/calc/ma-analysis',
      icon: 'lucide:bar-chart-2',
      calculators: ['Full Deal Analysis', 'Debt Capacity', 'Returns & Metrics'],
      color: 'bg-[#C7D1C2]/20',
      featured: true,
    },
    {
      title: 'Success Fee',
      description: 'Calculate M&A advisor fees, retainers, and Lehman scale pricing',
      path: '/calc/success-fee',
      icon: 'lucide:dollar-sign',
      calculators: ['Simple % Fee', 'Retainer + Success Fee', 'Lehman Scale'],
      color: 'bg-[#9E8461]/20',
    },
    {
      title: 'Financing',
      description: 'Analyze interest expenses, blended rates, DSCR, and leverage ratios',
      path: '/calc/financing',
      icon: 'lucide:landmark',
      calculators: ['Interest Expense', 'Blended Rate', 'DSCR', 'Leverage Ratio'],
      color: 'bg-[#D4C4B5]/20',
    },
    {
      title: 'Valuation',
      description: 'Compute EBITDA margins, implied valuations, and trading comps',
      path: '/calc/valuation',
      icon: 'lucide:trending-up',
      calculators: ['EBITDA Margin', 'Implied Valuation', 'Trading Comps'],
      color: 'bg-[#E2DBCF]/20',
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#E2DBCF]">
        {/* Film grain overlay */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="film-grain"></div>
        </div>

        {/* Header Navigation */}
        <header className="relative z-50 w-full px-6 py-8 md:px-12 flex justify-between items-center main-nav">
          <Link href="/" className="flex items-center">
            <img
              src="/xecuit-dark-green-logo.png"
              alt="Xecuit Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <nav className="flex gap-10 items-center text-xs uppercase tracking-[0.2em] font-medium text-[#264C3F]/70">
            <Link href="/" className="hover:text-[#264C3F] transition-colors">Home</Link>
            <a
              href="mailto:acquisitions@xecuit.com"
              className="px-5 py-2 border border-[#264C3F]/30 rounded-full hover:bg-[#264C3F] hover:text-[#E2DBCF] transition-all"
            >
              Contact
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-6 md:px-24 bg-[#E2DBCF]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">
                Financial Tools
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#264C3F] leading-[0.95] mb-6">
              Investment Banking<br />
              <span className="text-[#9E8461] italic font-light">Calculators</span>
            </h1>
            <p className="text-lg md:text-xl text-[#264C3F]/70 leading-relaxed max-w-3xl mb-8 font-light">
              Quick calculations for M&A transactions, financing analysis, and valuation work.
              Export results as PNG for presentations and deal discussions.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#264C3F]/60">
              <Icon icon="lucide:zap" className="text-[#9E8461]" />
              <span>Instant calculations • Mobile-optimized • Export to PNG</span>
            </div>
          </div>
        </section>

        {/* Calculator Categories */}
        <section className="relative py-16 md:py-24 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">
                Select Calculator
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  href={category.path}
                  className="group block bg-white p-8 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon icon={category.icon} className="text-2xl text-[#264C3F]" />
                  </div>

                  <h3 className="text-2xl font-serif text-[#264C3F] mb-3">
                    {category.title}
                  </h3>

                  <p className="text-sm text-[#264C3F]/70 leading-relaxed mb-6">
                    {category.description}
                  </p>

                  <div className="space-y-2">
                    {category.calculators.map((calc) => (
                      <div
                        key={calc}
                        className="flex items-center gap-2 text-xs text-[#264C3F]/50"
                      >
                        <div className="w-1 h-1 bg-[#9E8461] rounded-full" />
                        <span>{calc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#9E8461] uppercase tracking-wider group-hover:gap-3 transition-all">
                    <span>Open Calculator</span>
                    <Icon icon="lucide:arrow-right" className="text-sm" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="relative py-16 md:py-24 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-[#264C3F] mb-8">
              Built for Deal Professionals
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 bg-[#9E8461] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="lucide:smartphone" className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-[#264C3F] mb-2">Mobile First</h3>
                <p className="text-sm text-[#264C3F]/60">
                  Large touch targets and instant calculations optimized for phones and tablets
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-[#9E8461] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="lucide:download" className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-[#264C3F] mb-2">Export Results</h3>
                <p className="text-sm text-[#264C3F]/60">
                  One-tap PNG export with Xecuit branding for client presentations and emails
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-[#9E8461] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="lucide:shield" className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-[#264C3F] mb-2">Private & Secure</h3>
                <p className="text-sm text-[#264C3F]/60">
                  All calculations happen in your browser — no data is stored or transmitted
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-[#264C3F] py-20 px-6 md:px-24 border-t border-[#E2DBCF]/5 footer-area">
          <div className="hero-grain-overlay opacity-30"></div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex flex-col gap-6">
              <img
                src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769145963546-a43cd5a8/Xecuit_Icon_Light_Grey.png"
                alt="Xecuit Logo"
                className="h-8 w-auto object-contain opacity-80 self-start"
              />
              <div className="max-w-xs space-y-4">
                <p className="text-[#E2DBCF]/40 text-sm font-light leading-relaxed">
                  Evergreen holding company constructing platform-anchored ecosystems across industry-agnostic opportunities.
                </p>
                <p className="text-[#E2DBCF]/60 text-xs uppercase tracking-widest font-bold">
                  1603 Capitol Avenue Cheyenne, WY 82001
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-16">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest text-[#E2DBCF]/30 font-bold">Company</span>
                <a href="/#our-horizon" className="text-sm text-[#E2DBCF]/60 hover:text-white">Our Horizon</a>
                <a href="/#scale-experience" className="text-sm text-[#E2DBCF]/60 hover:text-white">Scale & Experience</a>
                <a href="/#perspectives" className="text-sm text-[#E2DBCF]/60 hover:text-white">Perspectives</a>
                <a href="/#framework" className="text-sm text-[#E2DBCF]/60 hover:text-white">The Framework</a>
                <a href="/#principles" className="text-sm text-[#E2DBCF]/60 hover:text-white">Principles</a>
                <a href="/careers" className="text-sm text-[#E2DBCF]/60 hover:text-white">Careers</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest text-[#E2DBCF]/30 font-bold">Legal</span>
                <a href="/#privacy" className="text-sm text-[#E2DBCF]/60 hover:text-white">Privacy Policy</a>
                <a href="/#disclaimer" className="text-sm text-[#E2DBCF]/60 hover:text-white">Legal Disclaimer</a>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#E2DBCF]/5">
            <p className="text-[10px] md:text-[11px] text-[#E2DBCF]/30 leading-relaxed uppercase tracking-widest text-justify md:text-left">
              Xecuit is a investment firm and does not seek, solicit or accept investors that are not eligible clients of Xecuit. Nothing contained in this website and/or any links constitutes investment advice or a recommendation to purchase or sell any security or financial product. You may not rely upon Xecuit or its affiliates for any investment advice.
            </p>
          </div>

          <div className="max-w-7xl mx-auto mt-8 flex justify-between items-center">
            <span className="text-[10px] text-[#E2DBCF]/40 uppercase tracking-widest font-bold">
              © 2026 Xecuit Holdings LLC | All rights Reserved.
            </span>
            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/company/xecuit/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:linkedin" className="text-[#E2DBCF]/30 hover:text-[#E2DBCF] cursor-pointer text-lg" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
