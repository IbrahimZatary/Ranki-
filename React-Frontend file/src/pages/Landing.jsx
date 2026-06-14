import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-body relative overflow-hidden">
      {/* Animated Ambient Background Blob */}
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent rounded-full mix-blend-multiply filter blur-[150px] opacity-30 pointer-events-none"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto mt-24 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-heading mb-6 tracking-tight text-textPrimary leading-tight">
            Are you invisible <br/> to AI?
          </h1>
          <p className="text-xl md:text-2xl text-textSecondary mb-10 max-w-3xl mx-auto">
            Ranki shows where you appear in ChatGPT and tells you what to fix.
          </p>
          <button 
            onClick={() => navigate('/register')} 
            className="btn-primary text-xl px-10 py-5 rounded-btn shadow-tinted hover:shadow-deep"
          >
            Get Started – Free Audit
          </button>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-12 text-textPrimary">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-left">
              <div className="text-accent text-5xl font-heading mb-4">1.</div>
              <h3 className="text-xl font-heading mb-2">Sign up</h3>
              <p className="text-textSecondary">Create your account in seconds.</p>
            </div>
            <div className="card text-left">
              <div className="text-accent text-5xl font-heading mb-4">2.</div>
              <h3 className="text-xl font-heading mb-2">Enter your business</h3>
              <p className="text-textSecondary">Provide your website and industry details.</p>
            </div>
            <div className="card text-left">
              <div className="text-accent text-5xl font-heading mb-4">3.</div>
              <h3 className="text-xl font-heading mb-2">Get visibility report + fixes</h3>
              <p className="text-textSecondary">See your AI rank and get actionable recommendations.</p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-12 text-textPrimary">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="card border-border flex flex-col">
              <h3 className="text-2xl font-heading mb-2">Basic</h3>
              <div className="text-4xl font-bold mb-6">29 JOD<span className="text-lg font-normal text-textSecondary">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-grow text-textSecondary">
                <li>• 5 keywords</li>
                <li>• Weekly scan</li>
                <li>• Basic recommendations</li>
              </ul>
              <button onClick={() => navigate('/register')} className="btn-secondary w-full">Select Plan</button>
            </div>
            
            <div className="card border-accent border-2 relative flex flex-col shadow-tinted">
              <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-sm font-bold rounded-bl-lg rounded-tr-lg">POPULAR</div>
              <h3 className="text-2xl font-heading mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">79 JOD<span className="text-lg font-normal text-textSecondary">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-grow text-textSecondary">
                <li>• 25 keywords</li>
                <li>• Daily scan</li>
                <li>• Advanced recommendations</li>
              </ul>
              <button onClick={() => navigate('/register')} className="btn-primary w-full">Select Plan</button>
            </div>

            <div className="card border-border flex flex-col">
              <h3 className="text-2xl font-heading mb-2">Business</h3>
              <div className="text-4xl font-bold mb-6">199 JOD<span className="text-lg font-normal text-textSecondary">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-grow text-textSecondary">
                <li>• Unlimited keywords</li>
                <li>• Daily scan</li>
                <li>• Priority support</li>
              </ul>
              <button onClick={() => navigate('/register')} className="btn-secondary w-full">Select Plan</button>
            </div>
          </div>
        </motion.div>

        {/* Trust Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-32 pb-20"
        >
          <p className="text-textSecondary text-lg mb-8 uppercase tracking-widest font-semibold">Trusted by Jordanian businesses</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            {/* Logos Placeholders */}
            <div className="text-2xl font-heading font-bold">Zain</div>
            <div className="text-2xl font-heading font-bold">Arab Bank</div>
            <div className="text-2xl font-heading font-bold">Royal Jordanian</div>
            <div className="text-2xl font-heading font-bold">Hikma</div>
            <div className="text-2xl font-heading font-bold">Umniah</div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
