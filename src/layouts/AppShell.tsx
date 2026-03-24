import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function AppShell() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-body text-[#041920]">
      <motion.div
        key={`${location.pathname}${location.search}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Outlet />
      </motion.div>
      <BottomNav />
    </div>
  );
}
