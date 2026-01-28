import React from 'react';
import { useSelector } from 'react-redux';
import RoomsSection from '../components/RoomsSection';
import SecurityPanel from '../components/SecurityPanel';
import EnergyMonitor from '../components/EnergyMonitor';
import MediaControl from '../components/MediaControl';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const rooms = useSelector(state => state.rooms.data);
  const loading = useSelector(state => state.rooms.loading);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const totalDevicesOn = rooms.reduce((acc, room) => {
    return acc + room.devices.filter(d => d.state === 'on' || d.state === 'open').length;
  }, 0);

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      {/* Hero Section */}
      <section className="px-4 md:px-8 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-manrope font-bold tracking-tight mb-2">
            {greeting()}!
          </h1>
          <p className="text-base text-muted-foreground">
            You have {totalDevicesOn} devices active across {rooms.length} rooms.
          </p>
        </motion.div>
      </section>

      {/* Rooms Section */}
      <section id="home" className="px-4 md:px-8 py-6">
        <RoomsSection />
      </section>

      {/* Energy & Security Grid */}
      <section className="px-4 md:px-8 py-6 grid md:grid-cols-2 gap-6">
        <div id="energy">
          <EnergyMonitor />
        </div>
        <div id="security">
          <SecurityPanel />
        </div>
      </section>

      {/* Media Control */}
      <section id="media" className="px-4 md:px-8 py-6">
        <MediaControl />
      </section>
    </div>
  );
};

export default Dashboard;