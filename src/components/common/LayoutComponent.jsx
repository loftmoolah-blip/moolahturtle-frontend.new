
import React from 'react';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { LogIn, LogOut, UserPlus, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { InvestorService } from '@/components/services/investorService';

const navLinks = [
  { name: 'Home', path: createPageUrl('Home') },
  { name: 'HowItWorks', path: createPageUrl('HowItWorks'), displayName: 'How It Works' },
  { name: 'Investors', path: createPageUrl('Investors'), displayName: 'For Investors' },
];

const Header = ({ currentPageName }) => {
  const { isAuthenticated, logout } = useAuth();
  
  const getPageNameForComparison = (path) => {
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    // This handles both simple page names and paths with query params
    return lastPart.split('?')[0];
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a href={createPageUrl('Home')} className="flex items-center gap-2">
            <span className="text-3xl">🐢</span>
            <span className="text-xl font-bold text-gray-900">Moolahturtle</span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`
                  text-lg font-medium transition-colors duration-200
                  ${currentPageName === link.name 
                    ? 'text-green-600' 
                    : 'text-gray-600 hover:text-green-600'
                  }
                `}
              >
                {link.displayName || link.name}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = createPageUrl('InvestorDashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={async () => {
                    await InvestorService.logout();
                    logout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = createPageUrl('InvestorLogin')}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Investor Login
                </Button>
                <Button onClick={() => window.location.href = createPageUrl('InvestorRegistration')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join as Investor
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = createPageUrl('Register')}
                  className="ml-2"
                >
                  Sell Property
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Moolahturtle</h3>
            <p className="text-gray-400">Your direct connection to off-market property deals.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href={createPageUrl('Home')} className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href={createPageUrl('HowItWorks')} className="text-gray-400 hover:text-white">How It Works</a></li>
              <li><a href={createPageUrl('Investors')} className="text-gray-400 hover:text-white">For Investors</a></li>
              <li><a href={createPageUrl('Documentation')} className="text-gray-400 hover:text-white">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li><a href={createPageUrl('Register')} className="text-gray-400 hover:text-white">Sell a Property</a></li>
              <li><a href={createPageUrl('InvestorRegistration')} className="text-gray-400 hover:text-white">Become an Investor</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Moolahturtle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function LayoutComponent({ children, currentPageName }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPageName={currentPageName} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
