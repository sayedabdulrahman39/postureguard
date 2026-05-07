import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, UserCheck, ShieldOff, Cpu, Lock, Shield, Brain, Activity } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-20 px-4">
      <section className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl text-navy mb-8 font-serif"
          >
            Philosophy & <br /> <span className="text-accent-blue italic">Privacy First.</span>
          </motion.h1>
        </div>

        <div className="prose prose-lg text-navy/80 leading-relaxed space-y-8 font-medium">
          <h2 className="text-3xl text-navy font-serif">The Doctrine of Pre-Pain Prevention</h2>
          <p>
            PostureGuard was founded on a singular, uncompromising principle: "Pre-Pain Prevention." In the traditional medical model, intervention only occurs after the manifestation of symptoms. We wait for the back to ache, the neck to stiffen, or the migraine to trigger before we acknowledge that something is wrong. This reactive approach is fundamentally flawed in a world where our environmental stressors—namely, our digital devices—are constant and unrelenting.
          </p>

          <p>
            By the time you feel pain, your body has already undergone significant musculoskeletal stress. Your muscles have tightened, your fascia has begun to remodel, and your neural pathways have accepted a "new normal" of poor alignment. PostureGuard operates in the sub-clinical space. We use artificial intelligence to monitor the subtle, early-stage deviations from optimal alignment that eventually lead to chronic conditions. By correcting these micro-slouches in real-time, we prevent the "pain event" from ever occurring. This is the difference between fixing a broken bridge and ensuring the bolts never loosen in the first place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 not-prose">
            <AboutCard 
              icon={<ShieldCheck className="text-accent-blue" />}
              title="Zero-Knowledge Architecture"
              description="Your video data never leaves your device. It is processed in ephemeral RAM and instantly discarded."
            />
            <AboutCard 
              icon={<Cpu className="text-accent-blue" />}
              title="RAM-Only Processing"
              description="We do not write image data to disk. The AI model analyzes coordinates and forgets the image within milliseconds."
            />
          </div>

          <h2 className="text-3xl text-navy font-serif">A Commitment to Ethical AI</h2>
          <p>
            In an era where privacy is often traded for functionality, PostureGuard stands as a "Zero-Knowledge" platform. We recognize the inherent sensitivity of using a camera for health monitoring. This is why our developers engineered the system to be physically incapable of storing or uploading video data. The AI processing happens entirely within your device's RAM.
          </p>

          <p>
            When you activate PostureGuard, the video stream from your webcam is converted into a series of mathematical landmarks (X, Y, and Z coordinates). The actual image is then immediately discarded from the temporary memory. Our servers never see your face, your home, or your environment. We don't want your data; we want your health. This architectural choice isn't just about security—it's about building a relationship of trust. You should feel comfortable keeping PostureGuard active throughout your entire workday, knowing that your privacy is protected by physics and logic, not just a privacy policy.
          </p>

          <p>
            The future of health-tech must be decentralized and private. As we integrate more sensors and more intelligence into our daily lives, the potential for data misuse grows. PostureGuard is our contribution to a more ethical digital future. We are proving that it is possible to build powerful, AI-driven wellness tools that respect the individual's right to digital sovereignty.
          </p>

          <div className="glass-card p-8 bg-accent-blue/5 border-none not-prose">
            <h3 className="text-2xl text-navy mb-4 font-serif italic">Beyond Monitoring</h3>
            <p className="text-navy/80 leading-relaxed font-medium">
              We view ourselves as part of the broader bio-hacking movement. We aren't just a software utility; we are a neural training tool. By utilizing the Gaussian reinforcement model, we are helping users reclaim their biological heritage of upright posture. Humans were not evolved to look down at glass rectangles. We were evolved to look at the horizon. PostureGuard is the digital bridge that helps us maintain that ancestral alignment in a modern world.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const AboutCard = ({ icon, title, description }) => (
  <div className="glass-card p-6 border-none bg-white/60">
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
      {icon}
    </div>
    <h3 className="font-serif text-xl text-navy mb-2">{title}</h3>
    <p className="text-sm text-navy/60 font-medium leading-relaxed">{description}</p>
  </div>
);

export default About;
