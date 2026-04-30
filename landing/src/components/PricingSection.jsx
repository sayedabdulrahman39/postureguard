import React from 'react';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600">Invest in your posture, not in recurring subscriptions.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-gray-500 mb-6">Basic slouch protection</p>
            <div className="text-4xl font-extrabold mb-8">$0</div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600"><span className="text-green-500 mr-2">✓</span> On-device Slouch Detection</li>
              <li className="flex items-center text-gray-600"><span className="text-green-500 mr-2">✓</span> Force-Feedback Blur Overlay</li>
              <li className="flex items-center text-gray-600"><span className="text-green-500 mr-2">✓</span> Daily Session Timer</li>
            </ul>
            <button className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-red-600 p-8 rounded-2xl border border-red-500 shadow-xl shadow-red-600/20 text-white transform md:-translate-y-4">
            <div className="text-sm font-bold bg-white text-red-600 px-3 py-1 rounded-full inline-block mb-4">MOST POPULAR</div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-red-100 mb-6">Advanced analytics & focus modes</p>
            <div className="text-4xl font-extrabold mb-8">$4.99<span className="text-lg font-medium text-red-200">/mo</span> <span className="text-sm font-normal block text-red-200 mt-1">or $149 one-time</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-white"><span className="text-white mr-2">✓</span> Everything in Free</li>
              <li className="flex items-center text-white"><span className="text-white mr-2">✓</span> Weekly Fatigue Analytics</li>
              <li className="flex items-center text-white"><span className="text-white mr-2">✓</span> Spotify Integration (Pause on Slouch)</li>
              <li className="flex items-center text-white"><span className="text-white mr-2">✓</span> Custom Break Timers</li>
              <li className="flex items-center text-white"><span className="text-white mr-2">✓</span> Multi-profile Support</li>
            </ul>
            <button className="w-full py-3 px-4 bg-white text-red-600 rounded-xl font-bold hover:bg-gray-50 transition shadow-lg">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
