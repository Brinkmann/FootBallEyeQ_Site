"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function GettingStartedPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-[#F0EFEA]">
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <Link href="/" className="flex items-center space-x-2 font-bold text-lg text-gray-900">
          <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-8 w-auto" />
          <span>Football EyeQ</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium text-gray-700">
          <Link href="/catalog" className="hover:text-[#A10115] transition font-semibold">Drill Catalogue</Link>
          <Link href="/planner" className="hover:text-[#A10115] transition font-semibold">Session Planner</Link>
          <div className="relative group">
            <span className="hover:text-[#A10115] transition cursor-pointer">Learn ▾</span>
            <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link href="/why-scanning" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Why Scanning</Link>
              <Link href="/how-it-works" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">How It Works</Link>
              <Link href="/ecosystem" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Ecosystem</Link>
              <Link href="/use-cases" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Use Cases</Link>
            </div>
          </div>
          <Link href="/resources" className="hover:text-[#A10115] transition">Resources</Link>
          <Link href="/testimonials" className="hover:text-[#A10115] transition">Testimonials</Link>
          <Link href="/contact" className="hover:text-[#A10115] transition">Contact</Link>
        </nav>
      </header>

      <section className="py-16 px-6 bg-gradient-to-b from-white to-[#F0EFEA]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up">
            <span className="text-[#D72C16]">Getting Started</span> with Football EyeQ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6" data-aos="fade-up" data-aos-delay="100">
            Select your role below. Each path guides you from signup to on-field delivery with direct links to every page you need.
          </p>
          <Link 
            href="/resources" 
            className="inline-flex items-center text-[#A10115] hover:underline text-sm font-medium"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Resources
          </Link>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">

            <div 
              data-aos="fade-up"
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#A10115] transition-all"
            >
              <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #A10115 0%, #D72C16 100%)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Individual Coach</h3>
                    <p className="text-white/80 text-sm">Free access, Premium ready</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Start planning sessions with plastic cones today. Unlock smart EyeQ cones and full-season tools when you upgrade.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#A10115] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="text-gray-900 font-medium">Create your free account</p>
                      <p className="text-gray-500 text-sm">Access the full drill library, one session slot, and up to 10 favourites.</p>
                      <Link href="/signup" className="text-[#D72C16] text-sm font-medium hover:underline">Sign up free →</Link>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#A10115] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="text-gray-900 font-medium">Build your first session</p>
                      <p className="text-gray-500 text-sm">Open the <Link href="/planner" className="text-[#D72C16] hover:underline">Session Planner</Link>, select drills from the <Link href="/catalog" className="text-[#D72C16] hover:underline">Drill Catalogue</Link>, and run them with plastic cones. This teaches the same scanning principles as EyeQ hardware.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#A10115] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="text-gray-900 font-medium">Preview Premium (early access)</p>
                      <p className="text-gray-500 text-sm">During our early-adopter phase, email <a href="mailto:obrinkmann@gmail.com" className="text-[#D72C16] hover:underline">obrinkmann@gmail.com</a> for a complimentary upgrade. Premium unlocks the full 12-session planner, unlimited favourites, and session stats.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#A10115] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="text-gray-900 font-medium">Add EyeQ when hardware arrives</p>
                      <p className="text-gray-500 text-sm">Switch exercise type in the <Link href="/catalog" className="text-[#D72C16] hover:underline">Drill Catalogue</Link> to EyeQ for smart-light progressions. Plastic drills remain available anytime.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF5F5] border border-[#F0EFEA] rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-[#A10115]">EyeQ vs Plastic:</span> EyeQ exercises require smart LED cones. Plastic exercises train the same cognitive scanning methodology using standard cones—ideal while you build your programme.
                  </p>
                </div>
              </div>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="100"
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#D72C16] transition-all"
            >
              <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #D72C16 0%, #FF6B5B 100%)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Club Coach (with code)</h3>
                    <p className="text-white/80 text-sm">Club-managed Premium</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Your club admin has generated an access code for you. Redeem it to unlock full-season planning tools immediately.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#D72C16] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="text-gray-900 font-medium">Sign up and tick the club box</p>
                      <p className="text-gray-500 text-sm">Create a free account at <Link href="/signup" className="text-[#D72C16] hover:underline">football-eyeq.com/signup</Link> and select &quot;I have a club access code&quot;.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#D72C16] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="text-gray-900 font-medium">Enter your access code</p>
                      <p className="text-gray-500 text-sm">After signup you&apos;ll land on the <Link href="/join-club" className="text-[#D72C16] hover:underline">Join Club</Link> page. Enter the 6-character code your admin sent you.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#D72C16] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="text-gray-900 font-medium">Start planning</p>
                      <p className="text-gray-500 text-sm">Access the full <Link href="/planner" className="text-[#D72C16] hover:underline">12-session Planner</Link>, browse EyeQ and Plastic drills in the <Link href="/catalog" className="text-[#D72C16] hover:underline">Catalogue</Link>, and review your progress in <Link href="/planner/stats" className="text-[#D72C16] hover:underline">Stats</Link>.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-800">Club controls:</span> Your admin sets which exercise types (EyeQ, Plastic, or both) are available to you. Contact them if you need access adjusted.
                  </p>
                </div>
              </div>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="200"
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#A10115] transition-all"
            >
              <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #6B7280 0%, #374151 100%)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Club Coach (awaiting code)</h3>
                    <p className="text-white/80 text-sm">Free until code arrives</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Your club uses Football EyeQ but you don&apos;t have your code yet? Start free, request your invite, then upgrade once it arrives.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="text-gray-900 font-medium">Create a free account</p>
                      <p className="text-gray-500 text-sm">Sign up at <Link href="/signup" className="text-[#D72C16] hover:underline">football-eyeq.com/signup</Link>. You can start exploring plastic drills and one session planner immediately.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="text-gray-900 font-medium">Email your signup address to your club admin</p>
                      <p className="text-gray-500 text-sm">Codes are email-specific. Share the exact email you used during signup so your admin can generate a matching code in their Club Dashboard.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="text-gray-900 font-medium">Redeem code when it arrives</p>
                      <p className="text-gray-500 text-sm">Visit <Link href="/join-club" className="text-[#D72C16] hover:underline">football-eyeq.com/join-club</Link> and enter your code. Your existing sessions will be preserved and full club benefits unlocked.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-amber-800">Tip:</span> Codes are single-use and email-specific. Make sure you share the exact signup email with your admin to avoid delays.
                  </p>
                </div>
              </div>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="300"
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#A10115] transition-all"
            >
              <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5A87 100%)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Club Admin</h3>
                    <p className="text-white/80 text-sm">Manage coaches & access</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  As a club administrator, you control who has access to Football EyeQ and what tools they can use. Register your club and start inviting your coaching staff.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="text-gray-900 font-medium">Register your club</p>
                      <p className="text-gray-500 text-sm">Go to <Link href="/club/signup" className="text-[#D72C16] hover:underline">football-eyeq.com/club/signup</Link> and create your admin account. You&apos;ll be taken to your Club Dashboard.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="text-gray-900 font-medium">Generate invite codes</p>
                      <p className="text-gray-500 text-sm">In the <Link href="/club/dashboard" className="text-[#D72C16] hover:underline">Club Dashboard</Link>, click &quot;Invite Coach&quot; and enter each coach&apos;s email. The system generates a unique, email-specific code you send to them.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="text-gray-900 font-medium">Set exercise access policy</p>
                      <p className="text-gray-500 text-sm">Choose whether coaches can access EyeQ drills, Plastic drills, or both. You can update this anytime in your dashboard.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="text-gray-900 font-medium">Experience the platform yourself</p>
                      <p className="text-gray-500 text-sm">As admin, you have full Premium access. Start a sample season in the <Link href="/planner" className="text-[#D72C16] hover:underline">Planner</Link> and check <Link href="/planner/stats" className="text-[#D72C16] hover:underline">Stats</Link> to understand what your coaches will see.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-800">Admin tip:</span> Share codes promptly so coaches stay synced. You can revoke or regenerate codes anytime from your dashboard.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center" data-aos="fade-up">
            Using the Platform
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center" data-aos="fade-up" data-aos-delay="100">
            Once you&apos;re set up, here&apos;s how to get the most from Football EyeQ throughout your season.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div data-aos="fade-up" className="text-center">
              <div className="w-16 h-16 bg-[#A10115] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">First Steps</h3>
              <p className="text-gray-600 text-sm mb-4">
                Browse the <Link href="/catalog" className="text-[#D72C16] hover:underline">Drill Catalogue</Link> by age group, decision theme, or difficulty. Add drills to your first <Link href="/planner" className="text-[#D72C16] hover:underline">Session Planner</Link> slot. No hardware needed—run exercises with standard cones.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="100" className="text-center">
              <div className="w-16 h-16 bg-[#D72C16] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">On-Field Delivery</h3>
              <p className="text-gray-600 text-sm mb-4">
                Open your session on a phone or tablet. Each drill shows setup, coaching points, and progressions. Tap the preview to see a quick visual. Favourite drills you love for instant access later.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="text-center">
              <div className="w-16 h-16 bg-[#1E3A5F] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Season Maintenance</h3>
              <p className="text-gray-600 text-sm mb-4">
                With Premium or club access, plan all 12 sessions in advance. Check <Link href="/planner/stats" className="text-[#D72C16] hover:underline">Stats</Link> to balance difficulty, decision themes, and game moments. Swap drills directly from the stats view.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#F0EFEA]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            <div data-aos="fade-up" className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Using Favourites</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Save drills you rely on so they&apos;re one tap away on the pitch.
              </p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#A10115] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Tap the heart icon on any drill in the <Link href="/catalog" className="text-[#D72C16] hover:underline">Drill Catalogue</Link> to favourite it.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#A10115] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free accounts store up to 10 favourites. Premium and club coaches get unlimited.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#A10115] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Filter to &quot;Favourites only&quot; in the catalogue for quick on-field access.</span>
                </li>
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Checking Stats</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Premium and club plans reveal how balanced your season plan is.
              </p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#A10115] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Open <Link href="/planner/stats" className="text-[#D72C16] hover:underline">Planner → Stats</Link> to view drill usage, game moments, and difficulty mix.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#A10115] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Remove or swap drills straight from the stats view to even out decision themes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#A10115] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Revisit this guide anytime to onboard new staff with the same flow.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-[#A10115]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3" data-aos="fade-up">
            Ready to start?
          </h2>
          <p className="opacity-90 mb-6" data-aos="fade-up" data-aos-delay="100">
            Create your free account and build your first session in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-[#A10115] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Sign Up Free
            </Link>
            <Link
              href="/resources"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition"
            >
              ↺ Back to Resources
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-center text-sm">
        &copy; {new Date().getFullYear()} Football EyeQ. All rights reserved.
      </footer>
    </div>
  );
}
