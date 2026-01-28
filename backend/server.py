from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class Device(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    type: str
    state: str
    value: Optional[int] = None
    room_id: str

class Room(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    color: str
    temperature: int
    devices: List[Device]

class SecuritySystem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    armed: bool
    doorLocked: bool
    motionDetected: bool
    alarmState: str

class EnergyData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    room_id: str
    room_name: str
    daily_usage: float
    weekly_usage: float

class MediaControl(BaseModel):
    model_config = ConfigDict(extra="ignore")
    playing: bool
    volume: int
    currentMedia: str
    device: str

class UserPreferences(BaseModel):
    model_config = ConfigDict(extra="ignore")
    theme: str

class DeviceUpdate(BaseModel):
    state: Optional[str] = None
    value: Optional[int] = None

@api_router.get("/")
async def root():
    return {"message": "Smart Home Dashboard API"}

@api_router.get("/rooms", response_model=List[Room])
async def get_rooms():
    rooms = await db.rooms.find({}, {"_id": 0}).to_list(100)
    return rooms

@api_router.put("/rooms/{room_id}")
async def update_room(room_id: str, room: Room):
    room_dict = room.model_dump()
    await db.rooms.update_one({"id": room_id}, {"$set": room_dict}, upsert=True)
    return room_dict

@api_router.get("/devices/{device_id}", response_model=Device)
async def get_device(device_id: str):
    room = await db.rooms.find_one({"devices.id": device_id}, {"_id": 0})
    if not room:
        raise HTTPException(status_code=404, detail="Device not found")
    device = next((d for d in room["devices"] if d["id"] == device_id), None)
    return device

@api_router.put("/devices/{device_id}")
async def update_device(device_id: str, update: DeviceUpdate):
    room = await db.rooms.find_one({"devices.id": device_id}, {"_id": 0})
    if not room:
        raise HTTPException(status_code=404, detail="Device not found")
    
    for device in room["devices"]:
        if device["id"] == device_id:
            if update.state is not None:
                device["state"] = update.state
            if update.value is not None:
                device["value"] = update.value
            break
    
    await db.rooms.update_one(
        {"id": room["id"]},
        {"$set": {"devices": room["devices"]}}
    )
    
    updated_device = next((d for d in room["devices"] if d["id"] == device_id), None)
    return updated_device

@api_router.get("/security", response_model=SecuritySystem)
async def get_security():
    security = await db.security.find_one({}, {"_id": 0})
    if not security:
        raise HTTPException(status_code=404, detail="Security system not found")
    return security

@api_router.put("/security")
async def update_security(security: SecuritySystem):
    security_dict = security.model_dump()
    await db.security.update_one({}, {"$set": security_dict}, upsert=True)
    return security_dict

@api_router.get("/energy", response_model=List[EnergyData])
async def get_energy():
    energy = await db.energy.find({}, {"_id": 0}).to_list(100)
    return energy

@api_router.get("/media", response_model=MediaControl)
async def get_media():
    media = await db.media.find_one({}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Media control not found")
    return media

@api_router.put("/media")
async def update_media(media: MediaControl):
    media_dict = media.model_dump()
    await db.media.update_one({}, {"$set": media_dict}, upsert=True)
    return media_dict

@api_router.get("/preferences", response_model=UserPreferences)
async def get_preferences():
    prefs = await db.preferences.find_one({}, {"_id": 0})
    if not prefs:
        return {"theme": "dark"}
    return prefs

@api_router.put("/preferences")
async def update_preferences(prefs: UserPreferences):
    prefs_dict = prefs.model_dump()
    await db.preferences.update_one({}, {"$set": prefs_dict}, upsert=True)
    return prefs_dict

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db():
    await seed_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

async def seed_database():
    existing_rooms = await db.rooms.count_documents({})
    if existing_rooms > 0:
        return
    
    rooms_data = [
        {
            "id": "living-room",
            "name": "Living Room",
            "color": "#F59E0B",
            "temperature": 22,
            "devices": [
                {"id": "lr-light", "name": "Main Light", "type": "light", "state": "on", "value": 75, "room_id": "living-room"},
                {"id": "lr-ac", "name": "AC Unit", "type": "ac", "state": "on", "value": 22, "room_id": "living-room"},
                {"id": "lr-curtain", "name": "Curtains", "type": "curtain", "state": "open", "value": 100, "room_id": "living-room"}
            ]
        },
        {
            "id": "bedroom",
            "name": "Bedroom",
            "color": "#EC4899",
            "temperature": 21,
            "devices": [
                {"id": "br-light", "name": "Bedroom Light", "type": "light", "state": "off", "value": 0, "room_id": "bedroom"},
                {"id": "br-ac", "name": "AC Unit", "type": "ac", "state": "on", "value": 21, "room_id": "bedroom"},
                {"id": "br-curtain", "name": "Curtains", "type": "curtain", "state": "closed", "value": 0, "room_id": "bedroom"}
            ]
        },
        {
            "id": "kitchen",
            "name": "Kitchen",
            "color": "#10B981",
            "temperature": 18,
            "devices": [
                {"id": "kt-light", "name": "Kitchen Light", "type": "light", "state": "on", "value": 100, "room_id": "kitchen"},
                {"id": "kt-ac", "name": "AC Unit", "type": "ac", "state": "off", "value": 18, "room_id": "kitchen"},
                {"id": "kt-window", "name": "Window", "type": "curtain", "state": "open", "value": 50, "room_id": "kitchen"}
            ]
        },
        {
            "id": "bathroom",
            "name": "Bathroom",
            "color": "#06B6D4",
            "temperature": 20,
            "devices": [
                {"id": "bt-light", "name": "Bathroom Light", "type": "light", "state": "off", "value": 0, "room_id": "bathroom"},
                {"id": "bt-ac", "name": "Heater", "type": "ac", "state": "off", "value": 20, "room_id": "bathroom"},
                {"id": "bt-window", "name": "Window", "type": "curtain", "state": "closed", "value": 0, "room_id": "bathroom"}
            ]
        },
        {
            "id": "guest-room",
            "name": "Guest Room",
            "color": "#8B5CF6",
            "temperature": 19,
            "devices": [
                {"id": "gr-light", "name": "Guest Light", "type": "light", "state": "off", "value": 0, "room_id": "guest-room"},
                {"id": "gr-ac", "name": "AC Unit", "type": "ac", "state": "off", "value": 19, "room_id": "guest-room"},
                {"id": "gr-curtain", "name": "Curtains", "type": "curtain", "state": "closed", "value": 0, "room_id": "guest-room"}
            ]
        }
    ]
    
    await db.rooms.insert_many(rooms_data)
    
    security_data = {
        "armed": True,
        "doorLocked": True,
        "motionDetected": False,
        "alarmState": "armed_home"
    }
    await db.security.insert_one(security_data)
    
    energy_data = [
        {"room_id": "living-room", "room_name": "Living Room", "daily_usage": 12.5, "weekly_usage": 87.5},
        {"room_id": "bedroom", "room_name": "Bedroom", "daily_usage": 8.3, "weekly_usage": 58.1},
        {"room_id": "kitchen", "room_name": "Kitchen", "daily_usage": 15.2, "weekly_usage": 106.4},
        {"room_id": "bathroom", "room_name": "Bathroom", "daily_usage": 5.7, "weekly_usage": 39.9},
        {"room_id": "guest-room", "room_name": "Guest Room", "daily_usage": 3.1, "weekly_usage": 21.7}
    ]
    await db.energy.insert_many(energy_data)
    
    media_data = {
        "playing": False,
        "volume": 35,
        "currentMedia": "Spotify - Chill Vibes",
        "device": "Living Room Speaker"
    }
    await db.media.insert_one(media_data)
    
    prefs_data = {"theme": "dark"}
    await db.preferences.insert_one(prefs_data)
    
    logger.info("Database seeded with demo data")