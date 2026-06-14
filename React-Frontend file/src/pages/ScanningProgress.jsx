import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ScanningProgress() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Connecting to our AEO agent...');
  const hasStarted = useRef(false);

  useEffect(() => {
    let intervalId;

    const startAndPollScan = async () => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      try {
        const startRes = await axiosClient.post('/Scan/start');
        const sessionId = startRes.data.scanSessionId;

        intervalId = setInterval(async () => {
          try {
            const statusRes = await axiosClient.get(`/Scan/status/${sessionId}`);
            const data = statusRes.data;
            
            setProgress(data.progress || 5);
            setText(data.currentStep || 'Scanning...');

            if (data.status === 'Completed') {
              clearInterval(intervalId);
              setTimeout(() => navigate('/dashboard'), 1000);
            } else if (data.status === 'Failed') {
              clearInterval(intervalId);
              setText(`Error: ${data.errorMessage || data.ErrorMessage || 'Unknown Backend Error'}`);
            }
          } catch (pollErr) {
            console.error('Polling error', pollErr);
          }
        }, 3000);
      } catch (err) {
        console.error('Failed to start scan', err);
        setText('Failed to connect to agent. Please try again.');
      }
    };

    startAndPollScan();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 font-body">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="w-24 h-24 mx-auto mb-8 relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-full h-full rounded-full border-4 border-gray-200 border-t-accent"
          ></motion.div>
        </div>

        <h2 className="text-4xl font-heading mb-4">{text}</h2>
        <p className="text-textSecondary mb-12">This takes about 2-3 minutes</p>

        <div className="w-full bg-white rounded-full h-4 overflow-hidden border border-border shadow-inner">
          <motion.div 
            className="bg-accent h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          ></motion.div>
        </div>
        <div className="mt-4 text-right text-sm text-textSecondary font-bold">
          {progress}%
        </div>
      </motion.div>
    </div>
  );
}
