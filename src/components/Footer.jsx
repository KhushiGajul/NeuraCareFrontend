import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col">
            <Link to="/" className="text-2xl font-extrabold text-[#0057b7] mb-4">
              NeuraCare
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Empowering healthcare providers with secure, clinically-validated AI tools that enhance patient outcomes and streamline operational efficiency.
            </p>
            
          </div>

          {/* Solutions */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold mb-5 uppercase text-xs tracking-widest">Solutions</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-500 hover:text-[#0057b7] text-sm font-medium transition-colors">Clinical AI Assistant</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0057b7] text-sm font-medium transition-colors">Predictive Diagnostics</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0057b7] text-sm font-medium transition-colors">Telehealth Integration</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0057b7] text-sm font-medium transition-colors">Enterprise Security</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold mb-5 uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-500 hover:text-[#0057b7] text-sm font-medium transition-colors">Documentation</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0057b7] text-sm font-medium transition-colors">API Reference</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0057b7] text-sm font-medium transition-colors">Clinical Studies</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0057b7] text-sm font-medium transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold mb-5 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0057b7] mt-0.5" />
                <span className="text-gray-500 text-sm font-medium">hello@neuracare.ai</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0057b7] mt-0.5" />
                <span className="text-gray-500 text-sm font-medium">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0057b7] mt-0.5" />
                <span className="text-gray-500 text-sm font-medium leading-relaxed">
                  100 Innovation Drive<br />San Francisco, CA 94103
                </span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-medium flex items-center gap-1">
            © {new Date().getFullYear()} NeuraCare. Made with <Heart className="w-4 h-4 text-red-500 mx-0.5" fill="currentColor" /> for better health.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">Terms of Service</Link>
            <Link to="#" className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">Cookie Settings</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;