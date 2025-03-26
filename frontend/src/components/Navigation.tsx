import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch,
  Globe,
  HomeIcon,
  LinkIcon,
  Menu,
  ScreenShareOff,
  Server,
  Shield,
  X,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu when window is resized above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    // {
    //   name: 'Dashboard',
    //   icon: <HomeIcon size={20} />,
    //   path: '/',
    // },
    {
      name: 'File Scanner',
      icon: <FileSearch size={20} />,
      path: '/',
    },
    {
      name: 'URL Scanner',
      icon: <LinkIcon size={20} />,
      path: '/url-scanner',
    },
    {
      name: 'Domain Scanner',
      icon: <Globe size={20} />,
      path: '/domain-scanner',
    },
    {
      name: 'IP Scanner',
      icon: <Server size={20} />,
      path: '/ip-scanner',
    },
    {
      name: 'Phishing Detector',
      icon: <ScreenShareOff size={20} />,
      path: '/phishing-detector',
    },
    {
      name: 'Code Repair',
      icon: <Zap size={20} />,
      path: '/code-repair',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button (shown only on mobile) */}
      <div className="fixed z-30 top-4 left-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md shadow-lg bg-spark-dark-600 text-spark-gray-200"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay when mobile menu is open */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar (hidden on mobile when closed) */}
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`${collapsed ? 'w-16' : 'w-64'
          } transition-all duration-300 ease-in-out h-screen glass-panel fixed md:relative z-30 ${mobileOpen ? 'left-0' : '-left-full md:left-0'
          }`}
      >
        <div className="flex flex-col h-full py-6">
          <div className="flex items-center px-4 mb-6">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mr-2"
              >
                <div className="flex items-center gap-2">
                  <Shield size={24} className="text-spark-blue" />
                  <span className="text-lg font-bold text-gradient-blue">
                    SparkShield
                  </span>
                </div>
              </motion.div>
            )}
            {collapsed && (
              <div className="flex justify-center w-full">
                <Shield size={24} className="text-spark-blue" />
              </div>
            )}
            {/* <button */}
            {/*   onClick={() => setCollapsed(!collapsed)} */}
            {/*   className="hidden p-1 ml-auto transition-colors text-spark-gray-300 hover:text-white md:block" */}
            {/* > */}
            {/*   <PanelLeft size={18} /> */}
            {/* </button> */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 ml-auto transition-colors text-spark-gray-300 hover:text-white md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 px-2 overflow-y-auto scrollbar-none">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${isActive(item.path)
                      ? 'bg-spark-blue/10 text-white'
                      : 'text-spark-gray-300 hover:bg-spark-dark-500/70 hover:text-white'
                      } ${collapsed ? 'justify-center' : 'justify-start'}`}
                  >
                    <span
                      className={`${isActive(item.path) ? 'text-spark-blue' : ''
                        }`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span
                        className={`text-sm ${isActive(item.path) ? 'font-medium' : ''
                          }`}
                      >
                        {item.name}
                      </span>
                    )}
                    {isActive(item.path) && !collapsed && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-spark-blue"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 mt-auto">
            <div
              className={`glass-card p-3 rounded-lg ${collapsed ? 'text-center' : ''
                }`}
            >
              {!collapsed ? (
                <div>
                  <div className="flex items-center mb-2 text-xs font-medium text-spark-gray-200">
                    <Shield size={14} className="mr-1.5 text-spark-green" />
                    Shield Status: Active
                  </div>
                  <div className="text-xs text-spark-gray-300">
                    Real-time protection enabled
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Shield size={18} className="text-spark-green" />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
