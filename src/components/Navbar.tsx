import React from 'react';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-[#0a192f] border-b border-[#1e2a3f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Target className="w-8 h-8 text-[#ff4757]" />
            <span className="text-xl font-bold">Aim Trainer</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-[#ff4757] transition-colors">Home</Link>
            <Link to="/play" className="hover:text-[#ff4757] transition-colors">Play</Link>
            <Link to="/contact" className="hover:text-[#ff4757] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;