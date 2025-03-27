import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Loader } from './Loader';
import { Navigation } from './Navigation';

export const Layout = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show loader for dashboard page (root path)
    if (location.pathname === '/') {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-spark-dark">
      <div className="absolute inset-0 z-0 cyber-grid opacity-20"></div>
      <div className="relative z-10 flex h-screen ">
        <Navigation />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex-1  overflow-y-auto py-4 md:p-8 "
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};
