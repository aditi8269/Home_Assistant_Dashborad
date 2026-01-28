import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSecurity } from '../store/slices/securitySlice';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Bell } from 'lucide-react';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

const SecurityPanel = () => {
  const security = useSelector(state => state.security);
  const dispatch = useDispatch();

  const handleToggle = async (field, value) => {
    try {
      await dispatch(updateSecurity({
        ...security,
        [field]: value,
      })).unwrap();
      toast.success(`Security system updated`);
    } catch (error) {
      toast.error('Failed to update security');
    }
  };

  const getAlarmStateLabel = (state) => {
    const labels = {
      'armed_home': 'Armed Home',
      'armed_away': 'Armed Away',
      'disarmed': 'Disarmed',
      'triggered': 'Triggered',
      'idle': 'Idle',
    };
    return labels[state] || state;
  };

  const getAlarmStateColor = (state) => {
    if (state === 'triggered') return 'text-statusAlert';
    if (state.includes('armed')) return 'text-statusActive';
    return 'text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
      data-testid="security-panel"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-statusAlert/20">
          <Shield className="w-6 h-6 text-statusAlert" />
        </div>
        <div>
          <h2 className="text-xl font-manrope font-bold">Security System</h2>
          <p className={`text-sm ${getAlarmStateColor(security.alarmState)}`}>
            {getAlarmStateLabel(security.alarmState)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Arm System */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50">
          <div className="flex items-center gap-3">
            <Shield className={`w-5 h-5 ${security.armed ? 'text-statusActive' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-medium text-sm">Arm System</p>
              <p className="text-xs text-muted-foreground">
                {security.armed ? 'System armed' : 'System disarmed'}
              </p>
            </div>
          </div>
          <Switch
            checked={security.armed}
            onCheckedChange={(checked) => handleToggle('armed', checked)}
            data-testid="security-arm-switch"
          />
        </div>

        {/* Door Lock */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50">
          <div className="flex items-center gap-3">
            <Lock className={`w-5 h-5 ${security.doorLocked ? 'text-statusActive' : 'text-statusAlert'}`} />
            <div>
              <p className="font-medium text-sm">Door Lock</p>
              <p className="text-xs text-muted-foreground">
                {security.doorLocked ? 'Locked' : 'Unlocked'}
              </p>
            </div>
          </div>
          <Switch
            checked={security.doorLocked}
            onCheckedChange={(checked) => handleToggle('doorLocked', checked)}
            data-testid="security-door-switch"
          />
        </div>

        {/* Motion Detection */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50">
          <div className="flex items-center gap-3">
            <Eye className={`w-5 h-5 ${security.motionDetected ? 'text-statusAlert' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-medium text-sm">Motion Sensor</p>
              <p className="text-xs text-muted-foreground">
                {security.motionDetected ? 'Motion detected' : 'No motion'}
              </p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            security.motionDetected ? 'bg-statusAlert animate-pulse' : 'bg-statusInactive'
          }`} data-testid="motion-indicator" />
        </div>

        {/* Alarm State Info */}
        {security.alarmState === 'triggered' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-statusAlert/20 border border-statusAlert/50"
            data-testid="alarm-triggered-alert"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-statusAlert animate-pulse" />
              <div>
                <p className="font-medium text-sm text-statusAlert">Alarm Triggered!</p>
                <p className="text-xs text-muted-foreground">Check your property immediately</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SecurityPanel;