import React from 'react';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
        Stop Slouching. <span className="text-red-600">Protect Your Spine.</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
        Privacy-first Chrome Extension that uses on-device Computer Vision to detect slouching and enforces correction via a Force-Feedback blur mechanism.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-lg hover:shadow-red-500/30">
          Add to Chrome — It's Free
        </button>
        <button className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition">
          See How It Works
        </button>
      </div>
      
      {/* Demo Placeholder */}
      <div className="mt-16 bg-gray-200 rounded-2xl w-full max-w-4xl mx-auto aspect-video flex items-center justify-center shadow-2xl overflow-hidden border border-gray-100">
        <p className="text-gray-500 font-medium">[Demo GIF/Video Placeholder: Detect → Warn → Correct]</p>
      </div>
    </section>
  );
}
