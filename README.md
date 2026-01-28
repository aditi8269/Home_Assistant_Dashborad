# E1 Smart Home Dashboard

A modern, mobile-first smart home control dashboard built with the MERN stack (MongoDB, Express.js, React, Node.js). Features a beautiful dark/light theme design with colorful room cards and comprehensive home automation controls.

## Features

### 🏠 Room Management
- **5 Pre-configured Rooms**: Living Room, Bedroom, Kitchen, Bathroom, Guest Room
- Color-coded room cards with unique accent colors
- Real-time temperature monitoring
- Device activity tracking
- Expandable/collapsible room controls

### 💡 Device Controls
Each room includes:
- **Lights**: On/Off toggle with brightness slider (0-100%)
- **AC/Climate**: On/Off with temperature control (16-30°C)
- **Windows/Curtains**: Open/Close with position control (0-100%)

### 🔐 Security System
- Arm/Disarm system
- Door lock control
- Motion sensor monitoring
- Alarm state indicator
- Real-time security alerts

### ⚡ Energy Monitoring
- Daily and weekly energy consumption tracking
- Per-room energy usage breakdown
- Interactive Recharts area chart visualization
- Total household energy statistics

### 🎵 Media Control
- Play/Pause controls
- Volume adjustment (0-100%)
- Current media display
- Device selection
- Living room speaker integration

### 🎨 Theme System
- Dark mode (default)
- Light mode toggle
- Theme preference persistence via localStorage
- Smooth theme transitions

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly controls (44px minimum touch targets)
- Adaptive layouts for phone, tablet, and desktop
- Bottom navigation on mobile, sidebar on desktop

## Tech Stack

### Backend
- **MongoDB**: NoSQL database with Motor async driver
- **Zod**: Data validation and serialization
- **CORS**: Cross-origin resource sharing enabled
- **NODE.JS**: for runtime Environment
- **EXPRESS.js**: For handling APIs and Middlewares

### Frontend
- **React 19**: Latest React with hooks
- **Redux Toolkit**: State management
- **Recharts**: Data visualization
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Pre-built accessible components
- **Lucide React**: Modern icon library

## Project Structure

```
/app
├── backend/
│   ├── server.js              # application with all routes , Schemas , Dumy Data
│   ├── requirements.txt       # backend dependencies
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js           # Main layout with sidebar/header
│   │   │   ├── RoomsSection.js     # Room grid display
│   │   │   ├── RoomCard.js         # Individual room card
│   │   │   ├── DeviceControl.js    # Device control component
│   │   │   ├── SecurityPanel.js    # Security system panel
│   │   │   ├── EnergyMonitor.js    # Energy monitoring dashboard
│   │   │   ├── MediaControl.js     # Media player controls
│   │   │   └── ui/                 # Shadcn UI components
│   │   ├── store/
│   │   │   ├── index.js            # Redux store configuration
│   │   │   └── slices/             # Redux slices
│   │   │       ├── roomsSlice.js
│   │   │       ├── securitySlice.js
│   │   │       ├── energySlice.js
│   │   │       ├── mediaSlice.js
│   │   │       └── themeSlice.js
│   │   ├── pages/
│   │   │   └── Dashboard.js        # Main dashboard page
│   │   ├── App.js                  # Root component
│   │   ├── index.js                # Entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   └── tailwind.config.js
│

```

## API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms and their devices
- `PUT /api/rooms/{room_id}` - Update room data

### Devices
- `GET /api/devices/{device_id}` - Get specific device
- `PUT /api/devices/{device_id}` - Update device state/value

### Security
- `GET /api/security` - Get security system status
- `PUT /api/security` - Update security settings

### Energy
- `GET /api/energy` - Get energy consumption data

### Media
- `GET /api/media` - Get media player state
- `PUT /api/media` - Update media controls

### Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences (theme)

## Setup Instructions

### Prerequisites
- Node.js 16+
- MongoDB running locally

### Backend Setup
```bash
cd /app/backend
npm install -r requirements.txt
# Database will be automatically seeded on first startup
```

### Frontend Setup
```bash
cd /app/frontend
yarn install
```

### Running the Application
The application is already configured to run via supervisor:
- Backend: http://0.0.0.0:8000
- Frontend: http://localhost:3000

## Demo Data

The application comes pre-seeded with realistic mock data:
- 5 rooms with unique configurations
- 3 devices per room (light, AC, curtain/window)
- Security system with armed state
- Energy consumption data for all rooms
- Media player with Spotify integration mockup

## State Management

Redux Toolkit is used for centralized state management with the following slices:
- **Rooms**: All room and device data
- **Security**: Security system state
- **Energy**: Energy consumption data
- **Media**: Media player state
- **Theme**: Dark/light mode preference

## Future Enhancements

Consider adding:
- Real Home Assistant integration
- Voice control (Alexa/Google Home)
- Automation rules and schedules
- Multi-user support with authentication
- Historical data analytics
- Push notifications
- Weather integration
- Camera feeds
- Smart doorbell integration

## License

Built with ❤️ by E1 Smart Home Team

---

For support or questions, refer to the system documentation or contact the development team.
