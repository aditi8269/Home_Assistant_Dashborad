import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMedia } from '../store/slices/mediaSlice';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Volume2, Tv } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

const MediaControl = () => {
  const media = useSelector(state => state.media);
  const dispatch = useDispatch();

  const handlePlayPause = async () => {
    try {
      await dispatch(updateMedia({
        ...media,
        playing: !media.playing,
      })).unwrap();
      toast.success(media.playing ? 'Media paused' : 'Media playing');
    } catch (error) {
      toast.error('Failed to update media');
    }
  };

  const handleVolumeChange = async (values) => {
    const newVolume = values[0];
    try {
      await dispatch(updateMedia({
        ...media,
        volume: newVolume,
      })).unwrap();
    } catch (error) {
      console.error('Failed to update volume');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
      data-testid="media-control"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-kitchen/20">
          <Music className="w-6 h-6 text-kitchen" />
        </div>
        <div>
          <h2 className="text-xl font-manrope font-bold">Media Control</h2>
          <p className="text-sm text-muted-foreground">{media.device}</p>
        </div>
      </div>

      {/* Now Playing */}
      <div className="mb-6 p-6 rounded-2xl bg-background/50 border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kitchen/20 to-bedroom/20 flex items-center justify-center">
            <Music className="w-8 h-8 text-kitchen" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{media.currentMedia}</p>
            <p className="text-sm text-muted-foreground">{media.device}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Play/Pause */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePlayPause}
            data-testid="media-play-pause-button"
            className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            {media.playing ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6" fill="currentColor" />}
          </button>
        </div>

        {/* Volume Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Volume</span>
            </div>
            <span className="text-sm font-medium">{media.volume}%</span>
          </div>
          <Slider
            value={[media.volume]}
            onValueChange={handleVolumeChange}
            max={100}
            min={0}
            step={1}
            className="cursor-pointer"
            data-testid="media-volume-slider"
          />
        </div>

        {/* Device Selector */}
        <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
          <div className="flex items-center gap-3">
            <Tv className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Output Device</p>
              <p className="text-xs text-muted-foreground">{media.device}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaControl;