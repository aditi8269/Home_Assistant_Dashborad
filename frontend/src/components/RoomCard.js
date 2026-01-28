import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Wind, Blinds, ChevronDown, ChevronUp } from 'lucide-react';
import DeviceControl from './DeviceControl';

const RoomCard = ({ room }) => {
  const [expanded, setExpanded] = useState(false);

  const getRoomColor = (color) => {
    const colorMap = {
      '#F59E0B': 'livingRoom',
      '#EC4899': 'bedroom',
      '#10B981': 'kitchen',
      '#06B6D4': 'bathroom',
      '#8B5CF6': 'guestRoom',
    };
    return colorMap[color] || 'primary';
  };

  const roomColorClass = getRoomColor(room.color);
  
  const activeDevices = room.devices.filter(d => d.state === 'on' || d.state === 'open').length;

  return (
    <motion.div
      className="room-card overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`room-card-${room.id}`}
    >
      {/* Room Header */}
      <div
        className="p-5 cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${room.color}15 0%, transparent 100%)`,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-manrope font-bold mb-1">{room.name}</h3>
            <p className="text-sm text-muted-foreground">
              {activeDevices}/{room.devices.length} active
            </p>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: `${room.color}20` }}
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5" style={{ color: room.color }} />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: room.color }} />
            )}
          </div>
        </div>

        {/* Temperature Display */}
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-muted-foreground" />
          <span className="text-3xl font-manrope font-bold">{room.temperature}°C</span>
        </div>

        {/* Quick Device Icons */}
        <div className="flex gap-2 mt-4">
          {room.devices.map(device => {
            const Icon = device.type === 'light' ? Lightbulb : device.type === 'ac' ? Wind : Blinds;
            return (
              <div
                key={device.id}
                className={`p-2 rounded-lg transition-all ${
                  device.state === 'on' || device.state === 'open'
                    ? 'bg-statusActive/20 text-statusActive'
                    : 'bg-statusInactive/20 text-statusInactive'
                }`}
                data-testid={`device-icon-${device.id}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Device Controls */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5"
          >
            <div className="p-5 space-y-4 bg-background/50">
              {room.devices.map(device => (
                <DeviceControl key={device.id} device={device} roomColor={room.color} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoomCard;