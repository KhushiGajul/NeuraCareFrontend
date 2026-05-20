import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    setRole(userRole);
    setIsLoggedIn(!!userId);
    setIsOpen(false); // Auto close mobile drawer on route change
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setRole(null);
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-[999] w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0057b7] to-[#00a6e0] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
          <div className="hidden sm:block text-left">
            <h1 className="text-xl font-bold text-gray-900">NeuraCare</h1>
            <p className="text-xs text-gray-500 font-medium">Clinical Intelligence Platform</p>
          </div>
        </Link>

        {/* Navigation Links - Desktop Only */}
        <nav className="hidden md:flex items-center gap-8">
          {role === 'doctor' || role === 'admin' ? (
            <>
              <Link to="/doctor-dashboard" className="text-gray-900 font-medium hover:text-[#0057b7] transition-colors text-sm">Doctor Dashboard</Link>
              <Link to="/query" className="text-gray-900 font-medium hover:text-[#0057b7] transition-colors text-sm">Query</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-900 font-medium hover:text-[#0057b7] transition-colors text-sm">Dashboard</Link>
              <Link to="/chat" className="text-gray-900 font-medium hover:text-[#0057b7] transition-colors text-sm">Chat AI</Link>
              <Link to="/news" className="text-gray-900 font-medium hover:text-[#0057b7] transition-colors text-sm">News</Link>
              <Link to="/video" className="text-gray-900 font-medium hover:text-[#0057b7] transition-colors text-sm">Videos</Link>
              <Link to="/contact" className="text-gray-900 font-medium hover:text-[#0057b7] transition-colors text-sm">Contact</Link>
            </>
          )}
        </nav>

        {/* Actions - Desktop Only */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="text-sm font-semibold px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-slate-50 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-[#0057b7] transition-colors">
                Sign In
              </Link>
              <Link to="/signup">
                <button className="text-sm font-semibold px-6 py-2.5 rounded-full bg-[#0057b7] text-white hover:bg-blue-800 transition-colors">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Navigation Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-4 shadow-inner">
          <nav className="flex flex-col gap-2">
            {role === 'doctor' || role === 'admin' ? (
              <>
                <Link to="/doctor-dashboard" className="text-gray-900 font-semibold hover:text-[#0057b7] transition-colors text-sm py-2 border-b border-gray-50 text-left">Doctor Dashboard</Link>
                <Link to="/query" className="text-gray-900 font-semibold hover:text-[#0057b7] transition-colors text-sm py-2 border-b border-gray-50 text-left">Query</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-gray-900 font-semibold hover:text-[#0057b7] transition-colors text-sm py-2 border-b border-gray-50 text-left">Dashboard</Link>
                <Link to="/chat" className="text-gray-900 font-semibold hover:text-[#0057b7] transition-colors text-sm py-2 border-b border-gray-50 text-left">Chat AI</Link>
                <Link to="/news" className="text-gray-900 font-semibold hover:text-[#0057b7] transition-colors text-sm py-2 border-b border-gray-50 text-left">News</Link>
                <Link to="/video" className="text-gray-900 font-semibold hover:text-[#0057b7] transition-colors text-sm py-2 border-b border-gray-50 text-left">Videos</Link>
                <Link to="/contact" className="text-gray-900 font-semibold hover:text-[#0057b7] transition-colors text-sm py-2 border-b border-gray-50 text-left">Contact</Link>
              </>
            )}
          </nav>
          
          <div className="pt-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="w-full text-center text-sm font-semibold px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-slate-50 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="w-full text-center text-sm font-semibold py-3 text-gray-700 hover:text-[#0057b7] transition-colors border-b border-gray-50">
                  Sign In
                </Link>
                <Link to="/signup" className="w-full">
                  <button className="w-full text-sm font-semibold px-6 py-3 rounded-xl bg-[#0057b7] text-white hover:bg-blue-800 transition-colors">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar