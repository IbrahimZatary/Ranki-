import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <span className="text-2xl font-bold font-heading">Ranki</span>
          <p className="text-textSecondary mt-2">© 2026 Ranki. All rights reserved.</p>
        </div>
        <div className="flex space-x-8">
          <Link to="#" className="text-textSecondary hover:text-accent transition-colors">About</Link>
          <Link to="#" className="text-textSecondary hover:text-accent transition-colors">Privacy</Link>
          <Link to="#" className="text-textSecondary hover:text-accent transition-colors">Terms</Link>
          <Link to="#" className="text-textSecondary hover:text-accent transition-colors">Contact</Link>
        </div>
        <div className="flex space-x-4 mt-6 md:mt-0">
          <a href="mailto:hello@ranki.com" className="text-textSecondary hover:text-accent transition-colors">
            <Mail className="w-6 h-6" />
          </a>
          <a href="https://wa.me/123456789" className="text-textSecondary hover:text-accent transition-colors" title="WhatsApp">
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
