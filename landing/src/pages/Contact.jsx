import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, User, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl text-navy mb-4 font-serif"
          >
            Get in <span className="italic">Touch.</span>
          </motion.h1>
          <p className="text-lg text-navy/60 font-medium tracking-tight">We're here to help you reclaim your posture.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-10">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                    <input type="text" className="w-full bg-white/50 border border-white/60 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition-all font-medium text-navy" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                    <input type="email" className="w-full bg-white/50 border border-white/60 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition-all font-medium text-navy" placeholder="john@example.com" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2 ml-1">Subject</label>
                <input type="text" className="w-full bg-white/50 border border-white/60 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition-all font-medium text-navy" placeholder="How can we help?" />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2 ml-1">Message</label>
                <textarea rows="5" className="w-full bg-white/50 border border-white/60 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition-all font-medium text-navy" placeholder="Tell us more about your inquiry..."></textarea>
              </div>

              <button className="glass-button w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/40 text-center">
              <p className="text-navy/60 font-medium">Or reach out directly via email at:</p>
              <a href="mailto:support@postureguard.ai" className="text-accent-blue font-bold text-lg hover:underline transition-all">support@postureguard.ai</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
