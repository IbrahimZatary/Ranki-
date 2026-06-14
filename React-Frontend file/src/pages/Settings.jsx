import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background font-body pb-20">
      <nav className="p-6 border-b border-border bg-white flex justify-between items-center sticky top-0 z-50">
        <Link to="/dashboard" className="text-2xl font-bold font-heading">Ranki</Link>
        <div className="flex items-center space-x-6">
          <div className="relative group cursor-pointer flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">U</div>
            <ChevronDown className="w-4 h-4 text-textSecondary" />
            <div className="absolute right-0 top-12 w-48 bg-white border border-border rounded-xl shadow-lg hidden group-hover:block overflow-hidden">
              <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-3 hover:bg-gray-50">Dashboard</button>
              <button onClick={() => navigate('/reports')} className="w-full text-left px-4 py-3 hover:bg-gray-50">Past Reports</button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto mt-10 px-6 space-y-10">
        <h2 className="text-4xl font-heading mb-8 text-textPrimary">Settings</h2>

        {/* Profile Section */}
        <section className="card bg-white">
          <h3 className="text-2xl font-heading mb-6">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Full Name</label>
              <input type="text" className="input-field" defaultValue="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Email Address</label>
              <input type="email" className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" defaultValue="john@company.com" readOnly />
            </div>
            <button className="btn-primary mt-4">Save Changes</button>
          </div>
        </section>

        {/* Business Info Section */}
        <section className="card bg-white">
          <h3 className="text-2xl font-heading mb-6">Business Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Business Name</label>
              <input type="text" className="input-field" defaultValue="Acme Solar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Website URL</label>
              <input type="url" className="input-field" defaultValue="https://acmesolar.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Industry</label>
              <input type="text" className="input-field" defaultValue="Solar Energy" />
            </div>
            <button className="btn-primary mt-4">Update Business Info</button>
          </div>
        </section>

        {/* Password Section */}
        <section className="card bg-white">
          <h3 className="text-2xl font-heading mb-6">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Current Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">New Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Confirm New Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <button className="btn-primary mt-4">Change Password</button>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="card bg-white border-2 border-accent/20">
          <h3 className="text-2xl font-heading mb-6">Subscription</h3>
          <div className="flex justify-between items-center bg-accent/5 p-6 rounded-xl mb-6">
            <div>
              <p className="text-textSecondary text-sm uppercase tracking-wider font-bold mb-1">Current Plan</p>
              <p className="text-2xl font-heading">Pro Plan <span className="text-sm font-body text-textSecondary">(79 JOD/mo)</span></p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-full text-sm">Active</span>
          </div>
          <button onClick={() => setShowCancelModal(true)} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
            Cancel Subscription
          </button>
        </section>

        {/* Danger Zone */}
        <section className="card border-red-200 bg-red-50/30">
          <h3 className="text-2xl font-heading mb-2 text-red-700">Danger Zone</h3>
          <p className="text-textSecondary mb-6">Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={() => setShowDeleteModal(true)} className="px-6 py-3 bg-red-600 text-white font-medium rounded-btn hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </section>
      </main>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl p-8 max-w-md w-full shadow-deep">
              <h3 className="text-2xl font-heading mb-2">Cancel Subscription?</h3>
              <p className="text-textSecondary mb-8">Are you sure you want to cancel? You will lose access to daily scans and advanced reports.</p>
              <div className="flex space-x-4">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 btn-secondary">Keep Plan</button>
                <button onClick={() => setShowCancelModal(false)} className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-btn hover:bg-red-700 transition-colors">Yes, Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl p-8 max-w-md w-full shadow-deep">
              <div className="flex items-center text-red-600 mb-4">
                <AlertTriangle className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-heading">Delete Account</h3>
              </div>
              <p className="text-textSecondary mb-8">This action cannot be undone. All your reports, visibility history, and business data will be permanently erased.</p>
              <div className="flex space-x-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={() => { setShowDeleteModal(false); navigate('/'); }} className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-btn hover:bg-red-700 transition-colors">Delete Permanently</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
