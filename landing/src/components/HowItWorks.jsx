import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Detect",
      description: "Our on-device AI tracks your nose and shoulder midpoint distance to establish a baseline posture."
    },
    {
      number: "02",
      title: "Warn",
      description: "If you slouch below your 80% threshold for more than 2 seconds, the system activates."
    },
    {
      number: "03",
      title: "Correct",
      description: "A force-feedback blur overlay covers your active tab until you straighten your back."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="text-6xl font-extrabold text-gray-100 absolute -top-8 -left-4 z-0">
                {step.number}
              </div>
              <div className="relative z-10 pt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
