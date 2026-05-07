import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl text-navy mb-4 font-serif"
          >
            Invest in your <span className="italic">Health.</span>
          </motion.h1>
          <p className="text-lg text-navy/60 font-medium tracking-tight">Choose a plan that fits your digital lifestyle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <PricingCard 
            title="Free"
            price="0"
            icon={<Zap className="text-navy" />}
            features={[
              "Real-time Posture Monitoring",
              "25px Gaussian Blur Feedback",
              "Local AI Processing",
              "Desktop Integration"
            ]}
            unavailable={[
              "30-day Historical Analytics",
              "Weekly Performance Reports",
              "Spotify Focus Integration"
            ]}
          />

          {/* Pro Tier */}
          <PricingCard 
            title="Pro"
            price="2.99"
            highlighted={true}
            icon={<Crown className="text-accent-blue" />}
            features={[
              "Everything in Free",
              "30-day Deep Analytics",
              "Weekly Trend Reports",
              "Focus Mode Integration",
              "Spotify Sync",
              "Priority Health Support"
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const PricingCard = ({ title, price, features, unavailable = [], highlighted = false, icon }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`glass-card p-10 flex flex-col ${highlighted ? 'border-accent-blue border-2 ring-4 ring-accent-blue/10 bg-white/60' : ''}`}
  >
    <div className="flex justify-between items-start mb-8">
      <div>
        <div className="text-sm font-bold text-accent-blue uppercase tracking-widest mb-1">{title}</div>
        <div className="flex items-baseline">
          <span className="text-4xl font-serif font-bold text-navy">${price}</span>
          <span className="text-navy/40 ml-1 font-medium">/month</span>
        </div>
      </div>
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
    </div>

    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-navy/80 text-sm font-semibold">
          <Check className="w-4 h-4 text-emerald-500" />
          {f}
        </li>
      ))}
      {unavailable.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-navy/30 text-sm font-semibold">
          <X className="w-4 h-4" />
          {f}
        </li>
      ))}
    </ul>

    <button className={`w-full py-4 rounded-full font-bold transition-all ${highlighted ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'bg-navy text-white'}`}>
      Get Started
    </button>
  </motion.div>
);

export default Pricing;
