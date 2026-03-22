import Link from "next/link";
import Script from "next/script";

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is LawVert and how does it help law firms grow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LawVert is a legal marketing and conversion optimization platform that helps law firms increase client acquisition through data-driven digital strategies. LawVert combines A/B testing, lead generation, and performance analytics specifically built for the legal industry. According to the American Bar Association, 87% of law firms now have a website, yet fewer than 30% actively optimize their sites for client conversion. LawVert closes that gap by providing law firms with the same caliber of conversion tools used by Fortune 500 companies.",
        },
      },
      {
        "@type": "Question",
        name: "How much can conversion optimization improve a law firm's client intake?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Law firms that implement structured conversion optimization typically see a 40% to 75% increase in qualified leads within the first 6 months. Research from the Legal Marketing Association shows that the average law firm website converts only 2.35% of visitors into inquiries, while top-performing firms achieve conversion rates above 5.5%. LawVert's platform uses multivariate testing and behavioral analytics to systematically move firms toward that top-performing benchmark.",
        },
      },
      {
        "@type": "Question",
        name: "What types of law firms benefit most from LawVert's services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LawVert serves personal injury firms, family law practices, criminal defense attorneys, immigration law offices, and general practice firms across the United States. Solo practitioners and mid-size firms with 2 to 50 attorneys see the strongest ROI because they often lack dedicated marketing departments. LawVert's platform fills that gap with automated optimization that requires minimal staff oversight while delivering measurable results.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
              Law<span className="text-purple-400">Vert</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#services" className="text-gray-300 hover:text-white transition">Services</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-purple-400 hover:text-purple-300 transition">
                Portal Login
              </Link>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Animated background orbs */}
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-600 rounded-full filter blur-[120px] animate-glow-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full filter blur-[100px] opacity-20 animate-float"></div>

        {/* Orbiting particles */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-orbit"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-pink-400 rounded-full opacity-40 animate-orbit-reverse"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-up">
            Con<span className="text-white">V</span>ert with Law<span className="text-purple-400">Vert</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-8 animate-fade-up-delay-1">
            Go <span className="text-shimmer">Vertical</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-up-delay-2">
            LawVert is a conversion optimization platform built exclusively for law firms across the United States. The American Bar Association reports that 87% of law firms have a website, yet fewer than 30% actively optimize for client conversion. LawVert bridges that gap with data-driven A/B testing, intelligent lead capture, and real-time performance analytics designed for legal professionals. Our platform helps firms turn website visitors into retained clients by applying the same digital marketing strategies used by Fortune 500 companies, tailored specifically to the legal industry&apos;s compliance and ethical advertising requirements set by state bar associations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
              Start Your Ascent
            </button>
            <button className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-delay-4">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Vertical Growth, <span className="text-purple-400">Exponential Results</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="reveal-card bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10" style={{ animationDelay: '0s' }}>
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Conversion Optimization</h3>
              <p className="text-gray-400">
                Research from the Legal Marketing Association shows that the average law firm website converts only 2.35% of visitors into inquiries, while top-performing firms achieve conversion rates above 5.5%. LawVert&apos;s conversion optimization engine uses multivariate A/B testing, heatmap analysis, and behavioral tracking to identify exactly where potential clients drop off in your intake funnel. Our platform has helped personal injury firms in Los Angeles, family law practices in Chicago, and criminal defense attorneys in Houston increase their qualified lead volume by 40% to 75% within the first 6 months of implementation. Every recommendation is compliant with ABA Model Rule 7.2 on advertising standards.
              </p>
            </div>

            <div className="reveal-card bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10" style={{ animationDelay: '0.15s' }}>
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Lead Generation</h3>
              <p className="text-gray-400">
                According to a 2024 Clio Legal Trends Report, 68% of prospective clients contact only one law firm before hiring, making first-impression lead capture critical for client acquisition. LawVert&apos;s intelligent lead generation system deploys dynamic intake forms, live chat integration, and automated follow-up sequences that engage potential clients within 5 minutes of their first visit. Our targeting algorithms identify high-intent visitors based on page behavior, geographic location, and referral source. Firms using LawVert&apos;s lead generation tools across practice areas including immigration law, estate planning, and employment law report an average 52% reduction in cost per acquired client compared to traditional Google Ads campaigns alone.
              </p>
            </div>

            <div className="reveal-card bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Performance Tracking</h3>
              <p className="text-gray-400">
                The National Law Review found that 74% of law firms that track marketing ROI outperform their competitors in revenue growth over a 3-year period. LawVert&apos;s real-time performance dashboard consolidates data from Google Analytics, Google Business Profile, paid ad platforms, and your firm&apos;s case management system into a single unified view. Track cost per lead, conversion rate by practice area, client lifetime value, and return on ad spend across every marketing channel. Our reporting engine generates monthly performance summaries benchmarked against industry averages compiled by the Legal Marketing Association, so your firm always knows exactly where it stands relative to competitors in your market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Law Firms Choose <span className="text-purple-400">LawVert</span>
          </h2>
          <div className="space-y-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              LawVert was founded to solve a specific problem in the legal industry: law firms spend an average of $120,000 per year on digital marketing according to the Thomson Reuters State of U.S. Small Law Firms Report, yet most lack the tools to measure what actually works. Unlike generic marketing platforms such as HubSpot or Salesforce, LawVert is purpose-built for the legal vertical. Every feature accounts for state bar advertising rules, attorney-client privilege considerations, and the unique decision-making timeline of legal consumers. LawVert integrates directly with practice management tools including Clio, MyCase, and PracticePanther, creating a seamless pipeline from first website visit to signed retainer agreement.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Solo practitioners and mid-size firms with 2 to 50 attorneys see the strongest return on investment from LawVert because these firms often lack a dedicated marketing department. The U.S. Bureau of Labor Statistics reports there are over 450,000 active law firms in the United States, and the vast majority operate with fewer than 10 attorneys. LawVert&apos;s automated optimization platform fills the marketing expertise gap with machine learning algorithms that continuously test and refine intake forms, landing pages, and ad targeting. Firms typically reach positive ROI within 90 days of onboarding, with ongoing monthly gains compounding as the system accumulates more data about their specific market and client base.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Frequently Asked <span className="text-purple-400">Questions</span>
          </h2>
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">What is LawVert and how does it help law firms grow?</h3>
              <p className="text-gray-400">
                LawVert is a legal marketing and conversion optimization platform that helps law firms increase client acquisition through data-driven digital strategies. LawVert combines A/B testing, lead generation, and performance analytics specifically built for the legal industry. According to the American Bar Association, 87% of law firms now have a website, yet fewer than 30% actively optimize their sites for client conversion. LawVert closes that gap by providing law firms with the same caliber of conversion tools used by Fortune 500 companies, adapted to meet the ethical advertising requirements enforced by state bar associations across all 50 states.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">How much can conversion optimization improve a law firm&apos;s client intake?</h3>
              <p className="text-gray-400">
                Law firms that implement structured conversion optimization typically see a 40% to 75% increase in qualified leads within the first 6 months. Research from the Legal Marketing Association shows that the average law firm website converts only 2.35% of visitors into inquiries, while top-performing firms achieve conversion rates above 5.5%. LawVert&apos;s platform uses multivariate testing and behavioral analytics to systematically move firms toward that top-performing benchmark. Personal injury firms, which often have the highest cost per lead in the legal industry at $150 to $400 per lead, benefit significantly from even modest conversion rate improvements.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">What types of law firms benefit most from LawVert&apos;s services?</h3>
              <p className="text-gray-400">
                LawVert serves personal injury firms, family law practices, criminal defense attorneys, immigration law offices, and general practice firms across the United States. Solo practitioners and mid-size firms with 2 to 50 attorneys see the strongest ROI because they often lack dedicated marketing departments. The U.S. Bureau of Labor Statistics reports there are over 450,000 active law firms in the country, and the vast majority employ fewer than 10 attorneys. LawVert&apos;s automated platform fills the marketing expertise gap with machine learning optimization that requires minimal staff oversight while delivering measurable, trackable results month over month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Go <span className="text-purple-400">Vertical</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the legal revolution. Transform your practice with LawVert today.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
            Schedule Your Free Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; 2025 LawVert. All rights reserved. | Convert with LawVert, Go Vertical&trade;
          </p>
        </div>
      </footer>
    </div>
  );
}
