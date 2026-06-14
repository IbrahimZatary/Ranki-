import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <h1 className="text-9xl font-bold font-heading text-accent mb-4">404</h1>
        <h2 className="text-3xl font-heading mb-4">Page Not Found</h2>
        <p className="text-textSecondary mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
