// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS setup
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));

app.use(express.json()); // for parsing application/json

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// === Mongoose Schemas ===
const deviceSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  state: String,
  value: Number,
  room_id: String,
}, { _id: false });

const roomSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  color: String,
  temperature: Number,
  devices: [deviceSchema],
});

const securitySchema = new mongoose.Schema({
  armed: Boolean,
  doorLocked: Boolean,
  motionDetected: Boolean,
  alarmState: String,
}, { collection: 'security' });

const energySchema = new mongoose.Schema({
  room_id: String,
  room_name: String,
  daily_usage: Number,
  weekly_usage: Number,
});

const mediaSchema = new mongoose.Schema({
  playing: Boolean,
  volume: Number,
  currentMedia: String,
  device: String,
}, { collection: 'media' });

const preferencesSchema = new mongoose.Schema({
  theme: String,
}, { collection: 'preferences' });

const Room = mongoose.model('Room', roomSchema);
const Security = mongoose.model('Security', securitySchema);
const Energy = mongoose.model('Energy', energySchema);
const Media = mongoose.model('Media', mediaSchema);
const Preferences = mongoose.model('Preferences', preferencesSchema);

// === Routes ===

// Root
app.get('/api', (req, res) => {
  res.json({ message: "Smart Home Dashboard API" });
});

// Get Rooms
app.get('/api/rooms', async (req, res) => {
  const rooms = await Room.find({}, { _id: 0, __v: 0 }).lean();
  res.json(rooms);
});

// Update Room
app.put('/api/rooms/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const updateData = req.body;

  const updatedRoom = await Room.findOneAndUpdate(
    { id: roomId },
    updateData,
    { upsert: true, new: true, runValidators: true }
  ).lean();

  res.json(updatedRoom);
});

// Get Device
app.get('/api/devices/:deviceId', async (req, res) => {
  const deviceId = req.params.deviceId;
  const room = await Room.findOne({ 'devices.id': deviceId }, { _id: 0 }).lean();

  if (!room) {
    return res.status(404).json({ detail: 'Device not found' });
  }

  const device = room.devices.find(d => d.id === deviceId);
  res.json(device);
});

// Update Device
app.put('/api/devices/:deviceId', async (req, res) => {
  const deviceId = req.params.deviceId;
  const { state, value } = req.body;

  const room = await Room.findOne({ 'devices.id': deviceId });

  if (!room) {
    return res.status(404).json({ detail: 'Device not found' });
  }

  const device = room.devices.find(d => d.id === deviceId);
  if (state !== undefined) device.state = state;
  if (value !== undefined) device.value = value;

  await room.save();

  res.json(device);
});

// Get Security
app.get('/api/security', async (req, res) => {
  const security = await Security.findOne({}, { _id: 0, __v: 0 }).lean();
  if (!security) return res.status(404).json({ detail: "Security system not found" });
  res.json(security);
});

// Update Security
app.put('/api/security', async (req, res) => {
  const data = req.body;
  const updated = await Security.findOneAndUpdate({}, data, { upsert: true, new: true });
  res.json(updated);
});

// Get Energy Data
app.get('/api/energy', async (req, res) => {
  const energy = await Energy.find({}, { _id: 0, __v: 0 }).lean();
  res.json(energy);
});

// Get Media
app.get('/api/media', async (req, res) => {
  const media = await Media.findOne({}, { _id: 0, __v: 0 }).lean();
  if (!media) return res.status(404).json({ detail: "Media control not found" });
  res.json(media);
});

// Update Media
app.put('/api/media', async (req, res) => {
  const data = req.body;
  const updated = await Media.findOneAndUpdate({}, data, { upsert: true, new: true });
  res.json(updated);
});

// Get Preferences
app.get('/api/preferences', async (req, res) => {
  const prefs = await Preferences.findOne({}, { _id: 0, __v: 0 }).lean();
  if (!prefs) return res.json({ theme: "dark" });
  res.json(prefs);
});

// Update Preferences
app.put('/api/preferences', async (req, res) => {
  const data = req.body;
  const updated = await Preferences.findOneAndUpdate({}, data, { upsert: true, new: true });
  res.json(updated);
});

// Seed database function
async function seedDatabase() {
  const roomsCount = await Room.countDocuments({});
  if (roomsCount > 0) return;

  const roomsData = [
    {
      id: "living-room",
      name: "Living Room",
      color: "#F59E0B",
      temperature: 22,
      devices: [
        { id: "lr-light", name: "Main Light", type: "light", state: "on", value: 75, room_id: "living-room" },
        { id: "lr-ac", name: "AC Unit", type: "ac", state: "on", value: 22, room_id: "living-room" },
        { id: "lr-curtain", name: "Curtains", type: "curtain", state: "open", value: 100, room_id: "living-room" },
      ],
    },
    {
      id: "bedroom",
      name: "Bedroom",
      color: "#EC4899",
      temperature: 21,
      devices: [
        { id: "br-light", name: "Bedroom Light", type: "light", state: "off", value: 0, room_id: "bedroom" },
        { id: "br-ac", name: "AC Unit", type: "ac", state: "on", value: 21, room_id: "bedroom" },
        { id: "br-curtain", name: "Curtains", type: "curtain", state: "closed", value: 0, room_id: "bedroom" },
      ],
    },
    {
      id: "kitchen",
      name: "Kitchen",
      color: "#10B981",
      temperature: 18,
      devices: [
        { id: "kt-light", name: "Kitchen Light", type: "light", state: "on", value: 100, room_id: "kitchen" },
        { id: "kt-ac", name: "AC Unit", type: "ac", state: "off", value: 18, room_id: "kitchen" },
        { id: "kt-window", name: "Window", type: "curtain", state: "open", value: 50, room_id: "kitchen" },
      ],
    },
    {
      id: "bathroom",
      name: "Bathroom",
      color: "#06B6D4",
      temperature: 20,
      devices: [
        { id: "bt-light", name: "Bathroom Light", type: "light", state: "off", value: 0, room_id: "bathroom" },
        { id: "bt-ac", name: "Heater", type: "ac", state: "off", value: 20, room_id: "bathroom" },
        { id: "bt-window", name: "Window", type: "curtain", state: "closed", value: 0, room_id: "bathroom" },
      ],
    },
    {
      id: "guest-room",
      name: "Guest Room",
      color: "#8B5CF6",
      temperature: 19,
      devices: [
        { id: "gr-light", name: "Guest Light", type: "light", state: "off", value: 0, room_id: "guest-room" },
        { id: "gr-ac", name: "AC Unit", type: "ac", state: "off", value: 19, room_id: "guest-room" },
        { id: "gr-curtain", name: "Curtains", type: "curtain", state: "closed", value: 0, room_id: "guest-room" },
      ],
    },
  ];

  await Room.insertMany(roomsData);

  const securityData = {
    armed: true,
    doorLocked: true,
    motionDetected: false,
    alarmState: "armed_home",
  };
  await Security.create(securityData);

  const energyData = [
    { room_id: "living-room", room_name: "Living Room", daily_usage: 12.5, weekly_usage: 87.5 },
    { room_id: "bedroom", room_name: "Bedroom", daily_usage: 8.3, weekly_usage: 58.1 },
    { room_id: "kitchen", room_name: "Kitchen", daily_usage: 15.2, weekly_usage: 106.4 },
    { room_id: "bathroom", room_name: "Bathroom", daily_usage: 5.7, weekly_usage: 39.9 },
    { room_id: "guest-room", room_name: "Guest Room", daily_usage: 3.1, weekly_usage: 21.7 },
  ];
  await Energy.insertMany(energyData);

  const mediaData = {
    playing: false,
    volume: 35,
    currentMedia: "Spotify - Chill Vibes",
    device: "Living Room Speaker",
  };
  await Media.create(mediaData);

  const prefsData = { theme: "dark" };
  await Preferences.create(prefsData);

  console.log("Database seeded with demo data");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});