"use client";

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/app/components/Icon';

export default function BuyerInquiryPage() {
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Buyer Profile
    buyerType: 'individual',
    companyName: '',
    website: '',
    businessOfInterest: '',

    // Financial Qualification
    liquidCapital: '',
    netWorth: '',
    fundingSource: '',
    financingNeeded: false,

    // Experience & Background
    industryExperience: '',
    acquisitionExperience: false,
    backgroundSummary: '',

    // Timeline & Intent
    purchaseTimeline: '',
    primaryMotivation: '',

    // Agreement
    agreesToNDA: false,
    agreesToProcess: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '', lastName: '', email: '', phone: '',
          buyerType: 'individual', companyName: '', website: '', businessOfInterest: '',
          liquidCapital: '', netWorth: '', fundingSource: '',
          financingNeeded: false,
          industryExperience: '', acquisitionExperience: false,
          backgroundSummary: '',
          purchaseTimeline: '', primaryMotivation: '',
          agreesToNDA: false, agreesToProcess: false,
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">Acquisition Opportunities</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#264C3F] leading-[0.95] mb-6">
              Portfolio Companies<br />
              <span className="text-[#9E8461] italic font-light">Available for Acquisition</span>
            </h1>
            <p className="text-lg md:text-xl text-[#264C3F]/70 leading-relaxed max-w-3xl mb-8 font-light">
              Xecuit Holdings periodically makes select portfolio companies available for acquisition to qualified buyers.
              Profitable businesses with strong fundamentals and growth potential.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#264C3F]/60">
              <Icon icon="lucide:shield-check" className="text-[#9E8461]" />
              <span>Qualified buyers only • NDA required for details</span>
            </div>
          </div>
        </section>

        {/* Main Content with Form */}
        <section className="relative py-16 md:py-24 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left Column - Business Overview */}
              <div className="space-y-8">
                <div>
                  <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">Opportunity Overview</span>
                  <h2 className="text-3xl md:text-4xl font-serif text-[#264C3F] mt-4 leading-tight mb-6">
                    Portfolio Companies
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-1 h-12 bg-[#9E8461] shrink-0 mt-1"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#264C3F] mb-2">Proven Businesses</h3>
                      <p className="text-[#264C3F]/70 font-light">Profitable companies with established track records, strong unit economics, and sustainable competitive advantages.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-1 h-12 bg-[#9E8461] shrink-0 mt-1"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#264C3F] mb-2">Ready for Transition</h3>
                      <p className="text-[#264C3F]/70 font-light">Documented operations, established teams, and clean financials ready for smooth handover to new ownership.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-1 h-12 bg-[#9E8461] shrink-0 mt-1"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#264C3F] mb-2">Growth Runway</h3>
                      <p className="text-[#264C3F]/70 font-light">Each opportunity has significant upside potential through strategic expansion, operational improvements, and market development.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-1 h-12 bg-[#9E8461] shrink-0 mt-1"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#264C3F] mb-2">Transparent Process</h3>
                      <p className="text-[#264C3F]/70 font-light">Comprehensive data rooms, thorough due diligence support, and clear communication throughout the acquisition process.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-[#264C3F]/10 bg-[#C7D1C2]/20 rounded-2xl">
                  <h4 className="text-[#264C3F] font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="lucide:info" className="text-[#9E8461]" />
                    Next Steps
                  </h4>
                  <p className="text-[#264C3F]/70 font-light text-sm leading-relaxed">
                    Complete the buyer qualification form to initiate the process. Qualified buyers will receive
                    an NDA and detailed information on available opportunities. We prioritize serious, qualified
                    buyers and aim to respond within 48 hours.
                  </p>
                </div>
              </div>

              {/* Right Column - Qualification Form */}
              <div className="bg-white p-8 md:p-10 rounded-sm shadow-lg">
                <div className="mb-8">
                  <h2 className="text-2xl font-serif text-[#264C3F] mb-2">Buyer Qualification Form</h2>
                  <p className="text-sm text-[#264C3F]/60">
                    All fields required unless noted optional. Information kept confidential.
                  </p>
                </div>

                {submitStatus === 'success' ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-[#C7D1C2]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon icon="lucide:check" className="text-3xl text-[#264C3F]" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#264C3F] mb-3">Submission Received</h3>
                    <p className="text-[#264C3F]/70 font-light">
                      Thank you for your interest in our portfolio companies. We will review your qualification and contact you within 48 hours with next steps.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div className="pb-6 border-b border-[#E2DBCF]/30">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E8461] mb-4">Contact Information</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">First Name *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Last Name *</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="you@company.com"
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
                          required
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Buyer Profile */}
                    <div className="pb-6 border-b border-[#E2DBCF]/30">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E8461] mb-4">Buyer Profile</h3>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Buyer Type *</label>
                        <select
                          name="buyerType"
                          value={formData.buyerType}
                          onChange={handleInputChange}
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all appearance-none"
                          required
                        >
                          <option value="individual">Individual Buyer</option>
                          <option value="company">Corporate Buyer</option>
                          <option value="private_equity">Private Equity / Investment Firm</option>
                          <option value="family_office">Family Office</option>
                          <option value="search_fund">Search Fund</option>
                        </select>
                      </div>

                      {(formData.buyerType === 'company' || formData.buyerType === 'private_equity' || formData.buyerType === 'family_office') && (
                        <>
                          <div className="mt-4">
                            <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Company/Organization Name *</label>
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
                              required
                            />
                          </div>
                          <div className="mt-4">
                            <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Website</label>
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              placeholder="https://"
                              className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
                            />
                          </div>
                        </>
                      )}

                      <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Business of Interest</label>
                        <input
                          type="text"
                          name="businessOfInterest"
                          value={formData.businessOfInterest}
                          onChange={handleInputChange}
                          placeholder="Which opportunity are you interested in? (optional)"
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
                        />
                        <p className="text-[10px] text-[#264C3F]/40 mt-1">Optional — Specify if you're interested in a particular opportunity</p>
                      </div>
                    </div>

                    {/* Financial Qualification */}
                    <div className="pb-6 border-b border-[#E2DBCF]/30">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E8461] mb-4">Financial Qualification</h3>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Liquid Capital Available *</label>
                        <select
                          name="liquidCapital"
                          value={formData.liquidCapital}
                          onChange={handleInputChange}
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all appearance-none"
                          required
                        >
                          <option value="">Select range</option>
                          <option value="under_100k">Under $100,000</option>
                          <option value="100k_250k">$100,000 - $250,000</option>
                          <option value="250k_500k">$250,000 - $500,000</option>
                          <option value="500k_1m">$500,000 - $1,000,000</option>
                          <option value="1m_2m">$1,000,000 - $2,000,000</option>
                          <option value="2m_5m">$2,000,000 - $5,000,000</option>
                          <option value="5m_10m">$5,000,000 - $10,000,000</option>
                          <option value="10m_25m">$10,000,000 - $25,000,000</option>
                          <option value="25m_50m">$25,000,000 - $50,000,000</option>
                          <option value="50m_100m">$50,000,000 - $100,000,000</option>
                          <option value="100m_250m">$100,000,000 - $250,000,000</option>
                          <option value="250m_500m">$250,000,000 - $500,000,000</option>
                          <option value="500m_1b">$500,000,000 - $1,000,000,000</option>
                          <option value="over_1b">Over $1,000,000,000</option>
                        </select>
                      </div>

                      <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Net Worth (approximate) *</label>
                        <select
                          name="netWorth"
                          value={formData.netWorth}
                          onChange={handleInputChange}
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all appearance-none"
                          required
                        >
                          <option value="">Select range</option>
                          <option value="under_500k">Under $500,000</option>
                          <option value="500k_1m">$500,000 - $1,000,000</option>
                          <option value="1m_5m">$1,000,000 - $5,000,000</option>
                          <option value="5m_10m">$5,000,000 - $10,000,000</option>
                          <option value="10m_25m">$10,000,000 - $25,000,000</option>
                          <option value="25m_50m">$25,000,000 - $50,000,000</option>
                          <option value="50m_100m">$50,000,000 - $100,000,000</option>
                          <option value="100m_250m">$100,000,000 - $250,000,000</option>
                          <option value="250m_500m">$250,000,000 - $500,000,000</option>
                          <option value="500m_1b">$500,000,000 - $1,000,000,000</option>
                          <option value="over_1b">Over $1,000,000,000</option>
                        </select>
                      </div>

                      <div className="mt-4">
                        <label className="block text-[10px] mnemonic tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Primary Funding Source *</label>
                        <input
                          type="text"
                          name="fundingSource"
                          value={formData.fundingSource}
                          onChange={handleInputChange}
                          placeholder="e.g., Cash, SBA Loan, Investor Capital, etc."
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all"
                          required
                        />
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="financingNeeded"
                          id="financingNeeded"
                          checked={formData.financingNeeded}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[#9E8461]"
                        />
                        <label htmlFor="financingNeeded" className="text-sm text-[#264C3F]/70">
                          Will require external financing for acquisition
                        </label>
                      </div>
                    </div>

                    {/* Experience & Background */}
                    <div className="pb-6 border-b border-[#E2DBCF]/30">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E8461] mb-4">Experience & Background</h3>

                      <div className="space-y-4 mb-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Primary Industry Experience *</label>
                          <select
                            name="industryExperience"
                            value={formData.industryExperience}
                            onChange={handleInputChange}
                            className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all appearance-none"
                            required
                          >
                            <option value="">Select your industry</option>
                            <option value="health_wellness">Health & Wellness / Fitness</option>
                            <option value="ecommerce_dtc">E-commerce / DTC</option>
                            <option value="technology_software">Technology / Software / SaaS</option>
                            <option value="manufacturing">Manufacturing / Industrial</option>
                            <option value="retail_consumer">Retail / Consumer Goods</option>
                            <option value="financial_services">Financial Services / Banking</option>
                            <option value="real_estate">Real Estate / Construction</option>
                            <option value="healthcare">Healthcare / Medical</option>
                            <option value="energy">Energy / Utilities</option>
                            <option value="telecom">Telecommunications</option>
                            <option value="transportation_logistics">Transportation / Logistics</option>
                            <option value="food_beverage">Food & Beverage</option>
                            <option value="education">Education / EdTech</option>
                            <option value="media_entertainment">Media / Entertainment</option>
                            <option value="professional_services">Professional Services (Legal, Consulting, etc.)</option>
                            <option value="automotive">Automotive / Transportation</option>
                            <option value="aerospace_defense">Aerospace & Defense</option>
                            <option value="agriculture">Agriculture / AgTech</option>
                            <option value="pharma_biotech">Pharmaceuticals / Biotechnology</option>
                            <option value="hospitality_travel">Hospitality / Travel</option>
                            <option value="private_equity">Private Equity / Investment Management</option>
                            <option value="family_office">Family Office / Wealth Management</option>
                            <option value="conglomerate">Conglomerate / Holding Company</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="acquisitionExperience"
                            checked={formData.acquisitionExperience}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-[#9E8461]"
                          />
                          <span className="text-sm text-[#264C3F]/70">Prior experience acquiring businesses</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Background Summary *</label>
                        <textarea
                          name="backgroundSummary"
                          value={formData.backgroundSummary}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Briefly describe your relevant background, experience, and capacity to operate this business..."
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all resize-none"
                          required
                        ></textarea>
                      </div>
                    </div>

                    {/* Timeline & Intent */}
                    <div className="pb-6 border-b border-[#E2DBCF]/30">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E8461] mb-4">Timeline & Intent</h3>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Purchase Timeline *</label>
                        <select
                          name="purchaseTimeline"
                          value={formData.purchaseTimeline}
                          onChange={handleInputChange}
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all appearance-none"
                          required
                        >
                          <option value="">Select timeline</option>
                          <option value="immediate">Immediate (within 30 days)</option>
                          <option value="1_3_months">1-3 months</option>
                          <option value="3_6_months">3-6 months</option>
                          <option value="6_12_months">6-12 months</option>
                          <option value="exploring">Just exploring, no specific timeline</option>
                        </select>
                      </div>

                      <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-[#264C3F]/60 mb-2 font-semibold">Primary Motivation *</label>
                        <select
                          name="primaryMotivation"
                          value={formData.primaryMotivation}
                          onChange={handleInputChange}
                          className="w-full bg-[#F5F3EF] border-0 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E8461] transition-all appearance-none"
                          required
                        >
                          <option value="">Select motivation</option>
                          <option value="primary_income">Primary source of income</option>
                          <option value="diversification">Investment diversification</option>
                          <option value="add_on">Acquisition as add-on to existing portfolio</option>
                          <option value="lifestyle">Lifestyle business</option>
                          <option value="growth">Growth opportunity</option>
                        </select>
                      </div>
                    </div>

                    {/* Agreements */}
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreesToNDA"
                          checked={formData.agreesToNDA}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[#9E8461] mt-0.5"
                          required
                        />
                        <span className="text-sm text-[#264C3F]/70">
                          I agree to sign a Non-Disclosure Agreement (NDA) to receive confidential business information *
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreesToProcess"
                          checked={formData.agreesToProcess}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[#9E8461] mt-0.5"
                          required
                        />
                        <span className="text-sm text-[#264C3F]/70">
                          I understand that submission of this form does not guarantee access to business information and that qualification is at the seller's discretion *
                        </span>
                      </label>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#9E8461] text-white font-bold py-4 text-sm uppercase tracking-[0.2em] hover:bg-[#8A7354] transition-all rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          'Submit Qualification'
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-[#264C3F]/50 text-center mt-4">
                      Your information is confidential and will only be used to evaluate your qualification for this acquisition.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="relative py-16 md:py-24 px-6 md:px-24 bg-[#E2DBCF] section-divider">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <span className="text-[#9E8461] text-sm font-semibold tracking-[0.2em] uppercase">The Process</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#264C3F] mt-4">What Happens Next</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#9E8461] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-[#264C3F] mb-2">Submit Form</h3>
                <p className="text-[#264C3F]/60 text-sm">Complete the qualification form with accurate information about your background and financial capacity.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#9E8461] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-[#264C3F] mb-2">Review & NDA</h3>
                <p className="text-[#264C3F]/60 text-sm">Qualified buyers receive an NDA and comprehensive information memorandum within 48 hours.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#9E8461] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-[#264C3F] mb-2">Due Diligence</h3>
                <p className="text-[#264C3F]/60 text-sm">Review detailed financials, operations, and begin structured due diligence process.</p>
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
                <Link href="/careers" className="text-sm text-[#E2DBCF]/60 hover:text-white">Careers</Link>
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
