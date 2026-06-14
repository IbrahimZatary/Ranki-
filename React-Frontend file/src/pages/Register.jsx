import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axiosClient.post('/Auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      // Auto-login
      const loginRes = await axiosClient.post('/Auth/login', { 
        email: formData.email, 
        password: formData.password 
      });
      if (loginRes.data.accessToken) {
        localStorage.setItem('token', loginRes.data.accessToken);
        navigate('/subscription');
      }
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.message?.toLowerCase().includes('exist')) {
        setError('Email already exists');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="p-6">
        <Link to="/" className="text-2xl font-bold font-heading">Ranki</Link>
      </nav>
      
      <div className="flex-grow flex justify-center items-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-border p-8 shadow-sm"
        >
          <h2 className="text-3xl font-heading mb-6">Sign up</h2>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm border border-red-200">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Full Name</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="input-field" 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field" 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Password</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="input-field" 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="input-field" 
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary mt-6"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-textSecondary">
            Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
