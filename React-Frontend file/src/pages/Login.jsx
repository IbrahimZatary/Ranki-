import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/Auth/login', { email, password });
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
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
          <h2 className="text-3xl font-heading mb-6">Log in</h2>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm border border-red-200">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field" 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field" 
                required
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center text-sm text-textSecondary cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 accent-accent"
                />
                Remember me
              </label>
              <a href="#" className="text-sm text-accent hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary mt-6"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-textSecondary">
            Don't have an account? <Link to="/register" className="text-accent font-medium hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
