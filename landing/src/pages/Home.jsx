import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Wind, TrendingUp, AlertCircle, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="pt-32 pb-20 px-4">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-20">
        <div className="relative h-[600px] rounded-[32px] overflow-hidden glass-card mb-12">
          {/* Video Placeholder Container */}
          <div className="absolute inset-0 bg-navy/10 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent z-10" />
             <video 
               autoPlay 
               loop 
               muted 
               playsInline
               className="w-full h-full object-cover scale-105"
             >
               <source src="/hero-posture.mp4" type="video/mp4" />
             </video>
          </div>
          
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl text-white mb-6 font-serif"
            >
              The Science of <br /> <span className="italic">Perfect Posture.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl font-medium"
            >
              Experience the Force-Feedback model. Build a "Golden Posture" habit 
              through real-time Gaussian reinforcement.
            </motion.p>
          </div>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <StatCard 
            icon={<Wind className="text-accent-blue" />}
            title="-30%"
            label="Lung Capacity"
            description="Research shows slouching restricts the diaphragm, reducing oxygen intake significantly."
          />
          <StatCard 
            icon={<Brain className="text-accent-blue" />}
            title="Brain Fog"
            label="Cognitive Impact"
            description="Poor posture restricts blood flow to the prefrontal cortex, causing mental fatigue."
          />
          <StatCard 
            icon={<Activity className="text-accent-blue" />}
            title="Real-time"
            label="Neural Feedback"
            description="Our 25px Gaussian blur acts as negative reinforcement for habit formation."
          />
        </div>
      </section>

      {/* Deep Dive Content - 500+ Words Section */}
      <section className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl text-navy mb-8 font-serif">The Silent Epidemic of the <br /> <span className="text-accent-blue italic">Hunched Generation.</span></h2>
        </div>

        <div className="prose prose-lg text-navy/80 leading-relaxed space-y-8 font-medium">
          <p>
            We live in an era defined by screens. From the moment we wake up to the second we close our eyes, our bodies are in a constant state of forward-leaning tension. This isn't just a matter of "bad habits"; it is a global health crisis that medical professionals are calling the "Silent Epidemic." The modern worker, student, and creator spend an average of 9 to 11 hours a day in a seated position, often hunched over laptops or smartphones. This physical state, colloquially known as "Tech Neck," is fundamentally altering our skeletal structure and neural pathways.
          </p>

          <p>
            Research from leading ergonomic institutes suggests that a 15-degree forward tilt of the head adds an effective weight of 27 pounds to the cervical spine. At 60 degrees—the common angle for checking a smartphone—that weight jumps to a staggering 60 pounds. This sustained pressure doesn't just cause back pain; it triggers a cascade of systemic failures. When we slouch, our rib cage collapses inward, compressing the lungs and reducing their total capacity by up to 30%. This chronic oxygen deprivation is a primary driver of the "Brain Fog" that plagues the modern workforce, leading to decreased productivity, mood swings, and long-term cognitive decline.
          </p>

          <div className="glass-card p-8 border-l-8 border-accent-blue not-prose">
            <h3 className="text-2xl mb-4 text-navy font-serif">The "Force-Feedback" Model</h3>
            <p className="text-navy/80 font-medium">
              PostureGuard doesn't just "notify" you. It utilizes a scientifically backed "Force-Feedback" mechanism. Most posture trackers rely on vibration or sound—stimuli that the brain quickly learns to ignore (habituation). PostureGuard takes a different approach. When you slouch for more than 5 seconds, our AI triggers a 25px Gaussian blur overlay across your entire screen.
            </p>
            <p className="mt-4 text-navy/80 font-medium">
              This isn't just an annoyance; it's an environmental constraint. Your brain, seeking to restore its visual input, subconsciously forces your body to realign. This negative reinforcement cycle bypasses conscious effort, building what we call "Neural Habituation." Over time, your body learns to maintain a "Golden Posture" not because you are thinking about it, but because your environment demands it.
            </p>
          </div>

          <p>
            The philosophy behind PostureGuard is rooted in "Pre-Pain Prevention." Most people only seek help once they experience chronic pain or permanent spinal curvature. We aim to intervene during the sub-clinical phase. By providing real-time neural feedback, we are effectively training the subconscious mind to recognize the body's position in space (proprioception).
          </p>

          <p>
            In the long term, the goal of PostureGuard is its own obsolescence. We don't want you to use the app forever; we want you to rebuild the muscle memory that the digital age has stolen from you. By correcting the tilt of your pelvis, the retraction of your shoulders, and the alignment of your cervical spine, we aren't just protecting your back—we are restoring your breathing, your focus, and your long-term health. The "Hunched Generation" doesn't have to be the future. With the right feedback loops, we can reclaim the upright dignity of the human form.
          </p>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, title, label, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-8 text-center"
  >
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
      {icon}
    </div>
    <div className="text-4xl font-serif font-bold text-navy mb-2">{title}</div>
    <div className="text-sm font-bold text-accent-blue uppercase tracking-wider mb-4">{label}</div>
    <p className="text-sm text-navy/60 leading-relaxed font-medium">
      {description}
    </p>
  </motion.div>
);

export default Home;
