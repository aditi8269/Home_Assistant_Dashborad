#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class SmartHomeAPITester:
    def __init__(self, base_url="https://smart-home-mern.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, description=""):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        if description:
            print(f"   Description: {description}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                self.passed_tests.append(f"{name} - {description}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list) and len(response_data) > 0:
                        print(f"   Response: {len(response_data)} items returned")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200],
                    "description": description
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "description": description
            })
            return False, {}

    def test_basic_endpoints(self):
        """Test basic API endpoints"""
        print("\n=== TESTING BASIC ENDPOINTS ===")
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200, description="Basic API health check")
        
        # Test rooms endpoint
        success, rooms = self.run_test("Get Rooms", "GET", "rooms", 200, description="Fetch all rooms with devices")
        if success and rooms:
            print(f"   Found {len(rooms)} rooms")
            for room in rooms:
                print(f"   - {room.get('name', 'Unknown')} ({room.get('color', 'No color')})")
        
        return success, rooms

    def test_room_functionality(self, rooms):
        """Test room-related functionality"""
        print("\n=== TESTING ROOM FUNCTIONALITY ===")
        
        if not rooms:
            print("❌ No rooms available for testing")
            return False
            
        # Test room colors match expected values
        expected_colors = {
            'Living Room': '#F59E0B',
            'Bedroom': '#EC4899', 
            'Kitchen': '#10B981',
            'Bathroom': '#06B6D4',
            'Guest Room': '#8B5CF6'
        }
        
        color_test_passed = True
        for room in rooms:
            room_name = room.get('name')
            room_color = room.get('color')
            expected_color = expected_colors.get(room_name)
            
            if expected_color and room_color == expected_color:
                print(f"✅ {room_name} color correct: {room_color}")
                self.passed_tests.append(f"Room color - {room_name}")
            else:
                print(f"❌ {room_name} color mismatch: expected {expected_color}, got {room_color}")
                color_test_passed = False
                self.failed_tests.append({
                    "test": f"Room color - {room_name}",
                    "expected": expected_color,
                    "actual": room_color
                })
        
        # Test device functionality
        test_room = rooms[0] if rooms else None
        if test_room and test_room.get('devices'):
            device = test_room['devices'][0]
            device_id = device.get('id')
            
            # Test get device
            self.run_test("Get Device", "GET", f"devices/{device_id}", 200, 
                         description=f"Get device {device.get('name')}")
            
            # Test update device state
            update_data = {"state": "off" if device.get('state') == 'on' else "on"}
            self.run_test("Update Device State", "PUT", f"devices/{device_id}", 200, 
                         data=update_data, description="Toggle device state")
            
            # Test update device value
            if device.get('value') is not None:
                update_data = {"value": 50}
                self.run_test("Update Device Value", "PUT", f"devices/{device_id}", 200,
                             data=update_data, description="Update device value")
        
        return color_test_passed

    def test_security_system(self):
        """Test security system functionality"""
        print("\n=== TESTING SECURITY SYSTEM ===")
        
        # Get security status
        success, security = self.run_test("Get Security", "GET", "security", 200,
                                         description="Get security system status")
        
        if success and security:
            print(f"   Armed: {security.get('armed')}")
            print(f"   Door Locked: {security.get('doorLocked')}")
            print(f"   Motion Detected: {security.get('motionDetected')}")
            print(f"   Alarm State: {security.get('alarmState')}")
            
            # Test security update
            update_data = {
                "armed": not security.get('armed', False),
                "doorLocked": security.get('doorLocked', True),
                "motionDetected": security.get('motionDetected', False),
                "alarmState": security.get('alarmState', 'disarmed')
            }
            self.run_test("Update Security", "PUT", "security", 200, data=update_data,
                         description="Toggle security arm state")
        
        return success

    def test_energy_monitoring(self):
        """Test energy monitoring functionality"""
        print("\n=== TESTING ENERGY MONITORING ===")
        
        success, energy = self.run_test("Get Energy Data", "GET", "energy", 200,
                                       description="Get energy usage data for all rooms")
        
        if success and energy:
            print(f"   Found energy data for {len(energy)} rooms")
            total_daily = sum(room.get('daily_usage', 0) for room in energy)
            total_weekly = sum(room.get('weekly_usage', 0) for room in energy)
            print(f"   Total daily usage: {total_daily:.1f} kWh")
            print(f"   Total weekly usage: {total_weekly:.1f} kWh")
            
            # Verify all rooms have energy data
            for room in energy:
                if not all(key in room for key in ['room_id', 'room_name', 'daily_usage', 'weekly_usage']):
                    print(f"❌ Missing energy data fields for {room.get('room_name', 'Unknown')}")
                    success = False
        
        return success

    def test_media_control(self):
        """Test media control functionality"""
        print("\n=== TESTING MEDIA CONTROL ===")
        
        success, media = self.run_test("Get Media Status", "GET", "media", 200,
                                      description="Get media control status")
        
        if success and media:
            print(f"   Playing: {media.get('playing')}")
            print(f"   Volume: {media.get('volume')}%")
            print(f"   Current Media: {media.get('currentMedia')}")
            print(f"   Device: {media.get('device')}")
            
            # Test media update
            update_data = {
                "playing": not media.get('playing', False),
                "volume": media.get('volume', 50),
                "currentMedia": media.get('currentMedia', ''),
                "device": media.get('device', '')
            }
            self.run_test("Update Media", "PUT", "media", 200, data=update_data,
                         description="Toggle media play/pause")
        
        return success

    def test_user_preferences(self):
        """Test user preferences functionality"""
        print("\n=== TESTING USER PREFERENCES ===")
        
        success, prefs = self.run_test("Get Preferences", "GET", "preferences", 200,
                                      description="Get user theme preferences")
        
        if success:
            print(f"   Theme: {prefs.get('theme', 'Not set')}")
            
            # Test preference update
            new_theme = "light" if prefs.get('theme') == 'dark' else "dark"
            update_data = {"theme": new_theme}
            self.run_test("Update Preferences", "PUT", "preferences", 200, data=update_data,
                         description=f"Change theme to {new_theme}")
        
        return success

    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🚀 Starting Smart Home API Test Suite")
        print(f"Testing against: {self.base_url}")
        
        # Test basic endpoints
        success, rooms = self.test_basic_endpoints()
        if not success:
            print("❌ Basic endpoints failed, stopping tests")
            return False
            
        # Test all functionality
        self.test_room_functionality(rooms)
        self.test_security_system()
        self.test_energy_monitoring()
        self.test_media_control()
        self.test_user_preferences()
        
        # Print final results
        print(f"\n📊 TEST RESULTS")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {len(self.failed_tests)}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"  - {failure.get('test', 'Unknown')}: {failure.get('error', failure.get('response', 'Unknown error'))}")
        
        return len(self.failed_tests) == 0

def main():
    tester = SmartHomeAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())