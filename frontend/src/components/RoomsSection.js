import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RoomCard from './RoomCard';
import { motion } from 'framer-motion';

const RoomsSection = () => {
  const rooms = useSelector(state => state.rooms.data);
  const loading = useSelector(state => state.rooms.loading);

  if (loading) {
    return <div className="text-center py-8">Loading rooms...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-manrope font-bold">Rooms</h2>
        <span className="text-sm text-muted-foreground">{rooms.length} rooms</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <RoomCard room={room} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoomsSection;