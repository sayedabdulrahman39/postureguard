import React from 'react';

export default function PrivacySection() {
  return (
    <section id="privacy" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Camera Never Leaves Your Device</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            PostureGuard runs entirely in your browser using MediaPipe WASM. Zero video data is ever sent to our servers.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center w-full max-w-xs">
            <div className="text-3xl mb-4">📷</div>
            <h3 className="font-bold mb-2">Webcam</h3>
            <p className="text-sm text-gray-400">Captures local feed</p>
          </div>
          <div className="hidden md:block text-2xl text-gray-600">→</div>
          <div className="bg-gray-800 p-6 rounded-xl border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)] text-center w-full max-w-xs relative overflow-hidden">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="font-bold mb-2">MediaPipe (Browser)</h3>
            <p className="text-sm text-gray-400">Local inference only</p>
          </div>
          <div className="hidden md:block text-2xl text-red-500 font-bold">⤫</div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center w-full max-w-xs opacity-50">
            <div className="text-3xl mb-4">☁️</div>
            <h3 className="font-bold mb-2">Cloud Server</h3>
            <p className="text-sm text-gray-400">No video storage ever</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "No Video Storage", desc: "We couldn't spy on you even if we tried." },
            { title: "No Cloud Upload", desc: "Inference happens 100% on-device." },
            { title: "Open CV Model", desc: "Uses standard, verifiable MediaPipe Pose." },
            { title: "GDPR Compliant", desc: "Only anonymized telemetry is stored." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-gray-800/50 p-6 rounded-lg">
              <h4 className="font-bold text-red-400 mb-2">✓ {feature.title}</h4>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
