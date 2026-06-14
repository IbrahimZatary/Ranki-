import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function BusinessInfoForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    websiteUrl: 'https://',
    industry: '',
    country: 'Jordan',
    productsServices: '',
    targetCustomer: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      val = 'https://' + val;
    }
    setFormData({ ...formData, websiteUrl: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosClient.post('/business-profile', {
        businessName: formData.businessName,
        websiteUrl: formData.websiteUrl,
        industry: formData.industry,
        country: formData.country,
        productsServices: formData.productsServices,
        targetCustomer: formData.targetCustomer
      });
      navigate('/scan');
    } catch (err) {
      console.error(err);
      setError('Failed to save business profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 font-body">
      <nav className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold font-heading">Ranki</h1>
      </nav>

      <main className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-textSecondary mb-2 font-medium">
            <span>Step 2 of 2</span>
            <span>Business Profile</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-accent h-full w-full"></div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-white"
        >
          <h2 className="text-3xl font-heading mb-2">Tell us about your business</h2>
          <p className="text-textSecondary mb-8">This helps our AI understand your exact market position.</p>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm border border-red-200 rounded-btn">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Business Name *</label>
              <input 
                type="text" 
                className="input-field" 
                required
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">Website URL *</label>
                <input 
                  type="url" 
                  className="input-field" 
                  required
                  value={formData.websiteUrl}
                  onChange={handleUrlChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">Industry *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  placeholder="e.g. Real Estate, Solar"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Country *</label>
              <select 
                className="input-field bg-white" 
                required
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              >
                <option>Jordan</option>
                <option>UAE</option>
                <option>Saudi Arabia</option>
                <option>Egypt</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Products / Services *</label>
              <textarea 
                className="input-field h-24 resize-none" 
                required
                placeholder="Comma separated (e.g. Solar panels, Battery backup)"
                value={formData.productsServices}
                onChange={(e) => setFormData({...formData, productsServices: e.target.value})}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Target Customer *</label>
              <textarea 
                className="input-field h-24 resize-none" 
                required
                placeholder="Who are you trying to reach?"
                value={formData.targetCustomer}
                onChange={(e) => setFormData({...formData, targetCustomer: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 text-lg mt-4"
            >
              {loading ? 'Saving Profile...' : 'Start AI Scan'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
