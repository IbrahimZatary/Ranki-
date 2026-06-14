import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="p-6 border-b border-border bg-white flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold font-heading hover:opacity-80 transition-opacity">Ranki</Link>
      <div className="space-x-4">
        <button onClick={() => navigate('/login')} className="btn-secondary">Log In</button>
        <button onClick={() => navigate('/register')} className="btn-primary">Get Started</button>
      </div>
    </nav>
  );
}
