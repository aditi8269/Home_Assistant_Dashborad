import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateDevice } from '../store/slices/roomsSlice';
import { Lightbulb, Wind, Blinds } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

const DeviceControl = ({ device, roomColor }) => {
  const dispatch = useDispatch();
  const [localValue, setLocalValue] = useState(device.value || 0);

  const getIcon = () => {
    switch (device.type) {
      case 'light':
        return <Lightbulb className="w-5 h-5" />;
      case 'ac':
        return <Wind className="w-5 h-5" />;
      case 'curtain':
        return <Blinds className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleToggle = async (checked) => {
    const newState = checked ? 'on' : 'off';
    try {
      await dispatch(updateDevice({
        deviceId: device.id,
        update: { state: newState },
      })).unwrap();
      toast.success(`${device.name} turned ${newState}`);
    } catch (error) {
      toast.error('Failed to update device');
    }
  };

  const handleValueChange = (values) => {
    setLocalValue(values[0]);
  };

  const handleValueCommit = async (values) => {
    const newValue = values[0];
    try {
      await dispatch(updateDevice({
        deviceId: device.id,
        update: { value: newValue },
      })).unwrap();
      toast.success(`${device.name} set to ${device.type === 'ac' ? newValue + '°C' : newValue + '%'}`);
    } catch (error) {
      toast.error('Failed to update device');
    }
  };

  const isActive = device.state === 'on' || device.state === 'open';

  return (
    <div className="space-y-3" data-testid={`device-control-${device.id}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: isActive ? `${roomColor}20` : 'hsl(var(--muted))',
              color: isActive ? roomColor : 'hsl(var(--muted-foreground))',
            }}
          >
            {getIcon()}
          </div>
          <div>
            <p className="font-medium text-sm">{device.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{device.type}</p>
          </div>
        </div>
        <Switch
        checked={isActive}
        onCheckedChange={handleToggle}
        deviceType={device.type}
        data-testid={`device-switch-${device.id}`}
      />
      </div>

      {/* Value Slider */}
      {isActive && device.value !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {device.type === 'light' ? 'Brightness' : device.type === 'ac' ? 'Temperature' : 'Position'}
            </span>
            <span className="font-medium">
              {localValue}{device.type === 'ac' ? '°C' : '%'}
            </span>
          </div>
          <Slider
            value={[localValue]}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            max={device.type === 'ac' ? 30 : 100}
            min={device.type === 'ac' ? 16 : 0}
            step={1}
            className="cursor-pointer"
            data-testid={`device-slider-${device.id}`}
          />
        </div>
      )}
    </div>
  );
};

export default DeviceControl;