"use client";

import { useEffect } from "react";
import Link from "next/link";
import Icon from '@/app/components/Icon';

export default function CareersPage() {
  useEffect(() => {
    // Load Iconify
    const script = document.createElement("script");
    script.src = "https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js";
    document.head.appendChild(script);

    // Contact overlay functions
    const openContact = () => {
      const overlay = document.getElementById('contact-overlay');
      if (overlay) {
        overlay.classList.remove('translate-y-full');
        document.body.style.overflow = 'hidden';
      }
    };

    const closeContact = () => {
      const overlay = document.getElementById('contact-overlay');
      if (overlay) {
        overlay.classList.add('translate-y-full');
        document.body.style.overflow = '';
      }
    };

    const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const submitBtn = form.querySelector('#careers-submit-btn') as HTMLButtonElement;
      const originalText = submitBtn.textContent;

      const formData = {
        name: (form.querySelector('[name="name"]') as HTMLInputElement).value,
        email: (form.querySelector('[name="email"]') as HTMLInputElement).value,
        company: (form.querySelector('[name="company"]') as HTMLInputElement).value,
        inquiry: (form.querySelector('[name="inquiry"]') as HTMLTextAreaElement).value,
        inquiry_type: (form.querySelector('[name="inquiry_type"]') as HTMLSelectElement).value,
      };

      try {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const response = await fetch('/api/careers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || 'Thank you for your interest. We will be in touch within 2 weeks.');
          form.reset();
          closeContact();
        } else {
          alert(data.error || 'Failed to send inquiry. Please try again.');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('Failed to send inquiry. Please try again.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    };

    // Make functions globally available
    (window as any).openContact = openContact;
    (window as any).closeContact = closeContact;
    (window as any).handleContactSubmit = handleContactSubmit;

    return () => {
      const existingScript = document.querySelector('script[src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#E2DBCF] relative">
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
            <button
              onClick={() => (window as any).openContact?.()}
              className="px-5 py-2 border border-[#264C3F]/30 rounded-full hover:bg-[#264C3F] hover:text-[#E2DBCF] transition-all"
            >
              Contact
            </button>
          </nav>
        </header>

        {/* Breadcrumbs */}
        <div className="relative z-40 px-6 md:px-24 pt-8 pb-4">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#264C3F]/40 font-bold">
            <Link href="/" className="hover:text-[#9E8461] transition-colors">Xecuit</Link>
            <span>/</span>
            <span className="text-[#264C3F]/60">Careers</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-6 md:px-24 bg-[#E2DBCF]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">Join Xecuit</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#264C3F] leading-[0.95] mb-8">
              Build Your Legacy<br />
              <span className="text-[#9E8461] italic font-light">at Xecuit</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#264C3F]/70 leading-relaxed max-w-3xl mb-12 font-light">
              Where compound systems and compounding careers intersect. Join us now and shape the future of institutional holding companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => (window as any).openContact?.()}
                className="px-10 py-4 bg-[#264C3F] text-[#E2DBCF] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#264C3F]/90 transition-all rounded-full"
              >
                Join Talent Community
              </button>
              <a
                href="#why-xecuit"
                className="px-10 py-4 border border-[#264C3F]/30 text-[#264C3F] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#264C3F] hover:text-[#E2DBCF] transition-all rounded-full text-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Why Xecuit Section */}
        <section id="why-xecuit" className="relative py-24 md:py-32 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:mb-20">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">01 — Why Xecuit</span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#264C3F] mt-6 leading-tight">
                Why Top Talent<br />Chooses Xecuit
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Value Pillar 1 */}
              <div className="p-10 border border-[#264C3F]/10 bg-[#C7D1C2]/20 rounded-2xl group hover:border-[#264C3F]/30 transition-all">
                <Icon icon="lucide:briefcase" className="text-3xl text-[#9E8461] mb-6" />
                <h3 className="text-2xl font-serif text-[#264C3F] mb-4">One Career, Multiple Companies</h3>
                <p className="text-[#264C3F]/70 leading-relaxed font-light">
                  Portfolio mobility across our ecosystem. Move between platform companies, operating roles, and strategic positions without leaving the firm.
                </p>
              </div>

              {/* Value Pillar 2 */}
              <div className="p-10 border border-[#264C3F]/10 bg-[#C7D1C2]/20 rounded-2xl group hover:border-[#264C3F]/30 transition-all">
                <Icon icon="lucide:trending-up" className="text-3xl text-[#9E8461] mb-6" />
                <h3 className="text-2xl font-serif text-[#264C3F] mb-4">Careers That Compound</h3>
                <p className="text-[#264C3F]/70 leading-relaxed font-light">
                  Evergreen structure, not 5-year fund cycles. Build lasting value without exit-driven disruption or artificial career timelines.
                </p>
              </div>

              {/* Value Pillar 3 */}
              <div className="p-10 border border-[#264C3F]/10 bg-[#C7D1C2]/20 rounded-2xl group hover:border-[#264C3F]/30 transition-all">
                <Icon icon="lucide:users" className="text-3xl text-[#9E8461] mb-6" />
                <h3 className="text-2xl font-serif text-[#264C3F] mb-4">Shape Our Future</h3>
                <p className="text-[#264C3F]/70 leading-relaxed font-light">
                  Join now and help build the firm. Early team members define culture, processes, and the trajectory of Xecuit for years to come.
                </p>
              </div>

              {/* Value Pillar 4 */}
              <div className="p-10 border border-[#264C3F]/10 bg-[#C7D1C2]/20 rounded-2xl group hover:border-[#264C3F]/30 transition-all">
                <Icon icon="lucide:layers" className="text-3xl text-[#9E8461] mb-6" />
                <h3 className="text-2xl font-serif text-[#264C3F] mb-4">Operating + Investing</h3>
                <p className="text-[#264C3F]/70 leading-relaxed font-light">
                  Best of both worlds. Deep operational engagement building businesses alongside strategic investment perspective and ecosystem thinking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="relative py-24 md:py-32 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">02 — Who We Are</span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#264C3F] mt-6 leading-tight">
                A Different Model
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl md:text-2xl text-[#264C3F] leading-relaxed font-light mb-8">
                Xecuit Holdings is an evergreen holding company, not a fund. We build platform-anchored ecosystems across industry-agnostic opportunities.
              </p>
              <p className="text-lg text-[#264C3F]/70 leading-relaxed font-light mb-6">
                What makes us different:
              </p>
              <ul className="space-y-4 text-[#264C3F]/70 font-light">
                <li className="flex gap-4 items-start">
                  <div className="w-1.5 h-6 bg-[#9E8461] shrink-0 mt-1"></div>
                  <span><strong className="text-[#264C3F]">Evergreen capital:</strong> No fund cycles, no forced exits. We build for the long term.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-1.5 h-6 bg-[#9E8461] shrink-0 mt-1"></div>
                  <span><strong className="text-[#264C3F]">Ecosystem approach:</strong> Platform businesses with complementary companies creating structural advantages.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-1.5 h-6 bg-[#9E8461] shrink-0 mt-1"></div>
                  <span><strong className="text-[#264C3F]">Operating focus:</strong> We don't just invest—we build, operate, and scale businesses.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-1.5 h-6 bg-[#9E8461] shrink-0 mt-1"></div>
                  <span><strong className="text-[#264C3F]">Data-driven:</strong> AI-enabled workflows enhance decision-making without replacing disciplined judgment.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Who We're Looking For */}
        <section className="relative py-24 md:py-32 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:mb-20">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">03 — Future Roles</span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#264C3F] mt-6 leading-tight">
                We're Always Looking<br />for Exceptional Talent
              </h2>
              <p className="text-lg text-[#264C3F]/60 mt-8 max-w-3xl font-light">
                While we're not hiring immediately, we're building relationships for roles opening in the coming months. We prioritize talent over rigid job descriptions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Investment Professionals */}
              <div className="bg-[#34574b] p-8 rounded-xl flex flex-col h-full border border-[#f9f7f4]/30">
                <Icon icon="lucide:bar-chart-3" className="text-3xl text-[#9E8461] mb-6" />
                <h4 className="text-lg font-serif text-[#f9f7f4] mb-4">Investment Professionals</h4>
                <p className="text-[#f9f7f4]/70 leading-relaxed font-light text-sm">
                  Underwriting, due diligence, and portfolio management across our ecosystem.
                </p>
              </div>

              {/* Operating Partners */}
              <div className="bg-[#34574b] p-8 rounded-xl flex flex-col h-full border border-[#f9f7f4]/30">
                <Icon icon="lucide:settings" className="text-3xl text-[#9E8461] mb-6" />
                <h4 className="text-lg font-serif text-[#f9f7f4] mb-4">Operating Partners</h4>
                <p className="text-[#f9f7f4]/70 leading-relaxed font-light text-sm">
                  Leadership roles within portfolio companies driving operational excellence.
                </p>
              </div>

              {/* Platform Builders */}
              <div className="bg-[#34574b] p-8 rounded-xl flex flex-col h-full border border-[#f9f7f4]/30">
                <Icon icon="lucide:code-2" className="text-3xl text-[#9E8461] mb-6" />
                <h4 className="text-lg font-serif text-[#f9f7f4] mb-4">Platform Builders</h4>
                <p className="text-[#f9f7f4]/70 leading-relaxed font-light text-sm">
                  Technology, data science, and product development capabilities.
                </p>
              </div>

              {/* Specialist Functions */}
              <div className="bg-[#34574b] p-8 rounded-xl flex flex-col h-full border border-[#f9f7f4]/30">
                <Icon icon="lucide:target" className="text-3xl text-[#9E8461] mb-6" />
                <h4 className="text-lg font-serif text-[#f9f7f4] mb-4">Specialist Functions</h4>
                <p className="text-[#f9f7f4]/70 leading-relaxed font-light text-sm">
                  Finance, legal, marketing, and other critical support functions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founding Vision */}
        <section className="relative py-24 md:py-32 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">04 — Our Foundation</span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#264C3F] mt-6 leading-tight">
                The Vision Behind Xecuit
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Vision Pillar 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-6 bg-[#9E8461] shrink-0 mt-1"></div>
                <div>
                  <h4 className="text-xl font-serif text-[#264C3F] mb-3">Aligned Capital</h4>
                  <p className="text-[#264C3F]/70 leading-relaxed font-light">
                    We built Xecuit to create a better model for long-term value creation where talent, capital, and time are aligned in the same direction.
                  </p>
                </div>
              </div>

              {/* Vision Pillar 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-6 bg-[#9E8461] shrink-0 mt-1"></div>
                <div>
                  <h4 className="text-xl font-serif text-[#264C3F] mb-3">Institution Building</h4>
                  <p className="text-[#264C3F]/70 leading-relaxed font-light">
                    Early team members are not just joining a company but building an institution that will endure for generations.
                  </p>
                </div>
              </div>

              {/* Vision Pillar 3 */}
              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-6 bg-[#9E8461] shrink-0 mt-1"></div>
                <div>
                  <h4 className="text-xl font-serif text-[#264C3F] mb-3">Long-Term Thinking</h4>
                  <p className="text-[#264C3F]/70 leading-relaxed font-light">
                    We seek people who think in decades rather than quarters and want to build something that lasts beyond a single fund cycle.
                  </p>
                </div>
              </div>

              {/* Vision Pillar 4 */}
              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-6 bg-[#9E8461] shrink-0 mt-1"></div>
                <div>
                  <h4 className="text-xl font-serif text-[#264C3F] mb-3">People First</h4>
                  <p className="text-[#264C3F]/70 leading-relaxed font-light">
                    We believe people matter more than profit. Our faith and values guide how we work, treat others, and make decisions with integrity and respect.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 border border-[#264C3F]/10 bg-[#C7D1C2]/20 rounded-2xl">
              <p className="text-lg text-[#264C3F] leading-relaxed font-light text-center">
                We are looking for like-minded people who share our commitment to ethical work, treating others with dignity, and building something meaningful together.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="relative py-24 md:py-32 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">05 — What We Offer</span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#264C3F] mt-6 leading-tight">
                Benefits & Comp
              </h2>
              <p className="text-lg text-[#264C3F]/60 mt-6 font-light">
                We believe in transparency. Here's what you can expect:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="flex gap-4 items-start">
                <Icon icon="lucide:check-circle" className="text-[#9E8461] text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="text-lg font-serif text-[#264C3F] mb-2">Competitive Compensation</h4>
                  <p className="text-[#264C3F]/70 font-light">We attract top talent with compensation that reflects the value our team creates.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Icon icon="lucide:check-circle" className="text-[#9E8461] text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="text-lg font-serif text-[#264C3F] mb-2">Flexible Work</h4>
                  <p className="text-[#264C3F]/70 font-light">Remote-first culture with intentional in-person collaboration.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Icon icon="lucide:check-circle" className="text-[#9E8461] text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="text-lg font-serif text-[#264C3F] mb-2">Health & Wellness</h4>
                  <p className="text-[#264C3F]/70 font-light">Comprehensive health, dental, and vision insurance.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Icon icon="lucide:check-circle" className="text-[#9E8461] text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="text-lg font-serif text-[#264C3F] mb-2">Learning & Development</h4>
                  <p className="text-[#264C3F]/70 font-light">Budget for conferences, courses, and professional growth.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 px-6 md:px-24 bg-[#264C3F] text-[#E2DBCF]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-serif mb-8">Initiate a Dialogue.</h2>
            <p className="text-xl text-[#E2DBCF]/70 mb-12 max-w-2xl mx-auto font-light">
              We personally review every inquiry and respond within 2 weeks. We're building relationships for roles opening in the coming months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window as any).openContact?.()}
                className="px-12 py-5 bg-[#9E8461] text-[#E2DBCF] text-sm font-bold uppercase tracking-widest hover:bg-[#9E8461]/90 transition-all rounded-full"
              >
                Join Talent Community
              </button>
              <a
                href="mailto:careers@xecuit.com"
                className="px-12 py-5 border border-[#E2DBCF]/30 text-[#E2DBCF] text-sm font-bold uppercase tracking-widest hover:bg-[#E2DBCF] hover:text-[#264C3F] transition-all rounded-full text-center"
              >
                careers@xecuit.com
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-[#264C3F] py-20 px-6 md:px-24 border-t border-[#E2DBCF]/5 footer-area">
          <div className="hero-grain-overlay opacity-30"></div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex flex-col gap-6">
              <img
                src="/xecuit-icon-light-grey.png"
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
                <a href="/#our-horizon" className="text-sm text-[#E2DBCF]/60 hover:text-white">
                  Our Horizon
                </a>
                <a href="/#scale-experience" className="text-sm text-[#E2DBCF]/60 hover:text-white">
                  Scale and Experience
                </a>
                <a href="/#perspectives" className="text-sm text-[#E2DBCF]/60 hover:text-white">
                  Perspectives
                </a>
                <a href="/#framework" className="text-sm text-[#E2DBCF]/60 hover:text-white">
                  The Framework
                </a>
                <a href="/#principles" className="text-sm text-[#E2DBCF]/60 hover:text-white">
                  Principles
                </a>
                <Link href="/careers" className="text-sm text-[#E2DBCF]/60 hover:text-white">
                  Careers
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest text-[#E2DBCF]/30 font-bold">Legal</span>
                <a href="/#privacy" className="text-sm text-[#E2DBCF]/60 hover:text-white">
                  Privacy Policy
                </a>
                <a href="/#disclaimer" className="text-sm text-[#E2DBCF]/60 hover:text-white">
                  Legal Disclaimer
                </a>
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

        {/* Contact Overlay */}
        <div
          id="contact-overlay"
          className="fixed inset-0 z-[1000] bg-[#264C3F] translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] overflow-y-auto"
        >
          <div className="min-h-screen w-full flex flex-col p-6 md:p-12 lg:p-24">
            <div className="flex justify-between items-center mb-8 md:mb-12">
              <img
                src="/xecuit-icon-light-grey.png"
                alt="Xecuit"
                className="h-8 w-auto"
              />
              <button
                onClick={() => (window as any).closeContact?.()}
                className="group flex items-center gap-2 text-[#E2DBCF]/40 hover:text-[#E2DBCF] transition-colors"
              >
                <span className="text-[10px] uppercase tracking-widest">Close</span>
                <Icon icon="lucide:x" className="text-3xl" />
              </button>
            </div>

            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl md:text-5xl font-serif text-[#E2DBCF] mb-4">Join Our Talent Community</h2>
                <p className="text-[#E2DBCF]/70 text-lg md:text-xl font-light leading-relaxed max-w-3xl">
                  We're building relationships for roles opening in the coming months. Share your background and interests, and we'll be in touch.
                </p>
              </div>

              <form
                id="careers-contact-form"
                className="grid md:grid-cols-2 gap-x-8 gap-y-6"
                onSubmit={(e) => (window as any).handleContactSubmit?.(e)}
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#9E8461] font-bold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="bg-transparent border-b border-[#E2DBCF]/20 py-2 text-[#E2DBCF] placeholder:text-[#E2DBCF]/20 focus:outline-none focus:border-[#9E8461] transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#9E8461] font-bold">Organization</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Current or past company"
                    className="bg-transparent border-b border-[#E2DBCF]/20 py-2 text-[#E2DBCF] placeholder:text-[#E2DBCF]/20 focus:outline-none focus:border-[#9E8461] transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#9E8461] font-bold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="direct@example.com"
                    className="bg-transparent border-b border-[#E2DBCF]/20 py-2 text-[#E2DBCF] placeholder:text-[#E2DBCF]/20 focus:outline-none focus:border-[#9E8461] transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#9E8461] font-bold">Area of Interest</label>
                  <select
                    name="inquiry_type"
                    className="bg-transparent border-b border-[#E2DBCF]/20 py-2 text-[#E2DBCF] focus:outline-none focus:border-[#9E8461] transition-colors appearance-none"
                  >
                    <option className="bg-[#264C3F]" value="investment">Investment Professional</option>
                    <option className="bg-[#264C3F]" value="operating">Operating Partner</option>
                    <option className="bg-[#264C3F]" value="platform">Platform Builder (Tech/Data)</option>
                    <option className="bg-[#264C3F]" value="specialist">Specialist Function</option>
                    <option className="bg-[#264C3F]" value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#9E8461] font-bold">Your Background</label>
                  <textarea
                    name="inquiry"
                    rows={3}
                    placeholder="Share your experience, interests, and what excites you about Xecuit..."
                    className="bg-transparent border-b border-[#E2DBCF]/20 py-2 text-[#E2DBCF] placeholder:text-[#E2DBCF]/20 focus:outline-none focus:border-[#9E8461] transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    id="careers-submit-btn"
                    className="px-16 py-4 bg-[#9E8461] text-[#E2DBCF] text-sm font-bold uppercase tracking-[0.3em] hover:bg-[#9E8461]/90 transition-all rounded-full w-full md:w-auto"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
