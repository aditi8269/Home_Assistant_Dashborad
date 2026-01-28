import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Zap, Shield, Music, Settings, Menu, X, Sun, Moon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode);
  const [activeSection, setActiveSection] = useState('home');

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'media', label: 'Media', icon: Music },
  ];

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:flex lg:flex-col border-r border-border/10 bg-background/95 backdrop-blur-xl z-50">
        <div className="p-6 border-b border-border/10">
          <h1 className="text-2xl font-manrope font-bold tracking-tight">E1 Smart Home</h1>
          <p className="text-xs text-muted-foreground mt-1">Control Center</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                data-testid={`nav-${item.id}`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/10 space-y-2">
          <button
            onClick={handleThemeToggle}
            data-testid="theme-toggle-desktop"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            data-testid="settings-button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-xl border-b border-border/10 z-50 flex items-center justify-between px-4">
        <h1 className="text-xl font-manrope font-bold">E1 Smart</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleThemeToggle}
            data-testid="theme-toggle-mobile"
            className="p-2 rounded-full hover:bg-secondary transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
            className="p-2 rounded-full hover:bg-secondary transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden fixed top-16 left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border/10 z-40 p-4"
        >
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  data-testid={`mobile-nav-${item.id}`}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;