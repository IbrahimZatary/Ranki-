import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionSelection() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body p-6 flex flex-col">
      <nav className="mb-12">
        <h1 className="text-2xl font-bold font-heading text-center">Ranki</h1>
      </nav>

      <main className="flex-grow max-w-5xl mx-auto w-full text-center">
        <h2 className="text-4xl font-heading mb-4 text-textPrimary">Choose your plan</h2>
        <p className="text-xl text-textSecondary mb-12">First month free trial</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="card border-border flex flex-col bg-white">
            <h3 className="text-2xl font-heading mb-2">Basic</h3>
            <div className="text-4xl font-bold mb-6">29 JOD<span className="text-lg font-normal text-textSecondary">/month</span></div>
            <ul className="space-y-3 mb-8 flex-grow text-textSecondary">
              <li>• 5 keywords</li>
              <li>• Weekly scan</li>
              <li>• Basic recommendations</li>
            </ul>
            <button onClick={() => setShowModal(true)} className="btn-secondary w-full">Select Plan</button>
          </div>
          
          <div className="card border-accent border-2 relative flex flex-col bg-white shadow-tinted">
            <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-sm font-bold rounded-bl-lg rounded-tr-lg">POPULAR</div>
            <h3 className="text-2xl font-heading mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-6">79 JOD<span className="text-lg font-normal text-textSecondary">/month</span></div>
            <ul className="space-y-3 mb-8 flex-grow text-textSecondary">
              <li>• 25 keywords</li>
              <li>• Daily scan</li>
              <li>• Advanced recommendations</li>
            </ul>
            <button onClick={() => setShowModal(true)} className="btn-primary w-full">Select Plan</button>
          </div>

          <div className="card border-border flex flex-col bg-white">
            <h3 className="text-2xl font-heading mb-2">Business</h3>
            <div className="text-4xl font-bold mb-6">199 JOD<span className="text-lg font-normal text-textSecondary">/month</span></div>
            <ul className="space-y-3 mb-8 flex-grow text-textSecondary">
              <li>• Unlimited keywords</li>
              <li>• Daily scan</li>
              <li>• Priority support</li>
            </ul>
            <button onClick={() => setShowModal(true)} className="btn-secondary w-full">Select Plan</button>
          </div>
        </div>
      </main>

      {/* Fake Stripe Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-8 max-w-md w-full text-left shadow-deep relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold mr-3">S</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Demo Checkout</h3>
                  <p className="text-xs text-gray-500">Test mode</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card information</label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <input 
                      type="text" 
                      placeholder="1234 5678 9123 0000" 
                      className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="MM / YY" 
                        className="w-1/2 px-3 py-2 border-r border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input 
                        type="text" 
                        placeholder="CVC" 
                        className="w-1/2 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country or region</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Jordan</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => navigate('/onboarding')}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 transition-colors flex justify-center items-center"
              >
                Pay Now
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                This is a demo payment form. No real charges will be made. You can leave fields blank.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
