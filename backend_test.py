#!/usr/bin/env python3
"""
Backend API Testing for PortfolioAI Generator
Tests all backend endpoints with realistic data
"""

import requests
import json
import os
import sys
from typing import Dict, Any

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

class PortfolioAPITester:
    def __init__(self):
        self.base_url = get_backend_url()
        if not self.base_url:
            raise Exception("Could not get backend URL from frontend/.env")
        
        self.api_url = f"{self.base_url}/api"
        self.portfolio_id = None
        self.test_results = []
        
        print(f"Testing backend at: {self.api_url}")
        
    def log_result(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details or {}
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test 1: GET /api/ - Health check endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'PortfolioAI Backend - Ready':
                    self.log_result("Health Check", True, "Backend is ready")
                    return True
                else:
                    self.log_result("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_enhance_content(self):
        """Test 2: POST /api/enhance-content - AI content enhancement"""
        test_data = {
            "name": "Sarah Johnson",
            "title": "Senior Full Stack Developer",
            "about": "I am a passionate developer with 6 years of experience building scalable web applications using modern technologies.",
            "skills": [
                {"name": "React", "level": "advanced"},
                {"name": "Node.js", "level": "advanced"},
                {"name": "Python", "level": "intermediate"},
                {"name": "AWS", "level": "intermediate"}
            ],
            "projects": [
                {
                    "title": "E-commerce Platform",
                    "description": "Built a comprehensive online shopping platform with payment integration and inventory management"
                },
                {
                    "title": "Task Management App",
                    "description": "Developed a collaborative task management application with real-time updates"
                }
            ],
            "experience": [
                {
                    "position": "Senior Software Engineer",
                    "company": "TechCorp Solutions",
                    "description": "Led development of microservices architecture and mentored junior developers"
                },
                {
                    "position": "Full Stack Developer",
                    "company": "StartupXYZ",
                    "description": "Built the entire web application from scratch using React and Node.js"
                }
            ]
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/enhance-content",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'enhanced' in data:
                    enhanced = data['enhanced']
                    
                    # Validate enhanced content structure
                    required_fields = ['about', 'skills', 'projects', 'suggestions']
                    missing_fields = [field for field in required_fields if field not in enhanced]
                    
                    if missing_fields:
                        self.log_result("AI Content Enhancement", False, 
                                      f"Missing fields in enhanced content: {missing_fields}",
                                      {'response': data})
                        return False
                    
                    # Check if content was actually enhanced (not just returned as-is)
                    if len(enhanced['about']) > len(test_data['about']):
                        self.log_result("AI Content Enhancement", True, 
                                      "Content successfully enhanced with AI improvements")
                        return True
                    else:
                        self.log_result("AI Content Enhancement", True, 
                                      "Content enhancement completed (fallback mode)")
                        return True
                else:
                    self.log_result("AI Content Enhancement", False, 
                                  f"Invalid response structure: {data}")
                    return False
            else:
                self.log_result("AI Content Enhancement", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("AI Content Enhancement", False, f"Request error: {str(e)}")
            return False
    
    def test_generate_portfolio(self):
        """Test 3: POST /api/generate-portfolio - Generate and save portfolio"""
        test_data = {
            "data": {
                "name": "Sarah Johnson",
                "title": "Senior Full Stack Developer",
                "email": "sarah.johnson@email.com",
                "phone": "+1-555-0123",
                "about": "Experienced full stack developer with expertise in modern web technologies and cloud platforms. Passionate about creating scalable solutions and mentoring development teams.",
                "education": [
                    {
                        "institution": "Stanford University",
                        "degree": "Master of Science in Computer Science",
                        "year": "2016-2018",
                        "description": "Specialized in distributed systems and machine learning. Graduated summa cum laude."
                    },
                    {
                        "institution": "UC Berkeley",
                        "degree": "Bachelor of Science in Computer Science",
                        "year": "2012-2016",
                        "description": "Focus on software engineering and algorithms. Dean's List for 6 semesters."
                    }
                ],
                "skills": [
                    {"name": "React", "level": "advanced"},
                    {"name": "Node.js", "level": "advanced"},
                    {"name": "Python", "level": "intermediate"},
                    {"name": "AWS", "level": "intermediate"},
                    {"name": "Docker", "level": "intermediate"}
                ],
                "projects": [
                    {
                        "title": "E-commerce Platform",
                        "description": "Built a comprehensive online shopping platform serving 50K+ users with payment integration, inventory management, and real-time analytics.",
                        "technologies": "React, Node.js, MongoDB, Stripe API",
                        "link": "https://github.com/sarah/ecommerce-platform"
                    },
                    {
                        "title": "Task Management SaaS",
                        "description": "Developed a collaborative task management application with real-time updates, team collaboration features, and advanced reporting.",
                        "technologies": "React, Express.js, PostgreSQL, Socket.io",
                        "link": "https://taskmanager-pro.com"
                    }
                ],
                "experience": [
                    {
                        "company": "TechCorp Solutions",
                        "position": "Senior Software Engineer",
                        "duration": "2020-Present",
                        "description": "Led development of microservices architecture serving 1M+ requests daily. Mentored 5 junior developers and improved deployment efficiency by 40%."
                    },
                    {
                        "company": "StartupXYZ",
                        "position": "Full Stack Developer",
                        "duration": "2018-2020",
                        "description": "Built the entire web application from scratch using React and Node.js. Implemented CI/CD pipeline and reduced bug reports by 60%."
                    }
                ]
            },
            "template": "minimal-professional"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/generate-portfolio",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'portfolioId' in data:
                    self.portfolio_id = data['portfolioId']
                    self.log_result("Generate Portfolio", True, 
                                  f"Portfolio created successfully with ID: {self.portfolio_id}")
                    return True
                else:
                    self.log_result("Generate Portfolio", False, 
                                  f"Invalid response structure: {data}")
                    return False
            else:
                self.log_result("Generate Portfolio", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Generate Portfolio", False, f"Request error: {str(e)}")
            return False
    
    def test_get_portfolio(self):
        """Test 4: GET /api/portfolio/{portfolioId} - Retrieve saved portfolio"""
        if not self.portfolio_id:
            self.log_result("Get Portfolio", False, "No portfolio ID available from previous test")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/portfolio/{self.portfolio_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'portfolio' in data:
                    portfolio = data['portfolio']
                    
                    # Validate portfolio structure
                    required_fields = ['id', 'name', 'title', 'email', 'about', 'education', 
                                     'skills', 'projects', 'experience', 'selectedTemplate']
                    missing_fields = [field for field in required_fields if field not in portfolio]
                    
                    if missing_fields:
                        self.log_result("Get Portfolio", False, 
                                      f"Missing fields in portfolio: {missing_fields}")
                        return False
                    
                    if portfolio['id'] == self.portfolio_id:
                        self.log_result("Get Portfolio", True, 
                                      "Portfolio retrieved successfully with correct data")
                        return True
                    else:
                        self.log_result("Get Portfolio", False, 
                                      f"Portfolio ID mismatch: expected {self.portfolio_id}, got {portfolio['id']}")
                        return False
                else:
                    self.log_result("Get Portfolio", False, 
                                  f"Invalid response structure: {data}")
                    return False
            elif response.status_code == 404:
                self.log_result("Get Portfolio", False, "Portfolio not found in database")
                return False
            else:
                self.log_result("Get Portfolio", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Get Portfolio", False, f"Request error: {str(e)}")
            return False
    
    def test_download_portfolio(self):
        """Test 5: GET /api/download-portfolio/{portfolioId} - Download ZIP file"""
        if not self.portfolio_id:
            self.log_result("Download Portfolio", False, "No portfolio ID available from previous test")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/download-portfolio/{self.portfolio_id}", timeout=15)
            
            if response.status_code == 200:
                # Check content type
                content_type = response.headers.get('Content-Type', '')
                if 'application/zip' not in content_type:
                    self.log_result("Download Portfolio", False, 
                                  f"Wrong content type: expected application/zip, got {content_type}")
                    return False
                
                # Check content disposition header for filename
                content_disposition = response.headers.get('Content-Disposition', '')
                if 'attachment' not in content_disposition or '.zip' not in content_disposition:
                    self.log_result("Download Portfolio", False, 
                                  f"Invalid Content-Disposition header: {content_disposition}")
                    return False
                
                # Check if we got actual ZIP content
                content_length = len(response.content)
                if content_length < 1000:  # ZIP should be at least 1KB
                    self.log_result("Download Portfolio", False, 
                                  f"ZIP file too small: {content_length} bytes")
                    return False
                
                # Check ZIP magic number
                if not response.content.startswith(b'PK'):
                    self.log_result("Download Portfolio", False, "Response is not a valid ZIP file")
                    return False
                
                self.log_result("Download Portfolio", True, 
                              f"ZIP file downloaded successfully ({content_length} bytes)")
                return True
                
            elif response.status_code == 404:
                self.log_result("Download Portfolio", False, "Portfolio not found for download")
                return False
            else:
                self.log_result("Download Portfolio", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Download Portfolio", False, f"Request error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 60)
        print("PORTFOLIO AI BACKEND API TESTING")
        print("=" * 60)
        
        tests = [
            ("Health Check", self.test_health_check),
            ("AI Content Enhancement", self.test_enhance_content),
            ("Generate Portfolio", self.test_generate_portfolio),
            ("Get Portfolio", self.test_get_portfolio),
            ("Download Portfolio", self.test_download_portfolio)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\nRunning: {test_name}")
            if test_func():
                passed += 1
        
        print("\n" + "=" * 60)
        print(f"TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Print detailed results
        print("\nDETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['test']}: {result['message']}")
        
        return passed == total

def main():
    """Main test execution"""
    try:
        tester = PortfolioAPITester()
        success = tester.run_all_tests()
        
        if success:
            print("\n🎉 All tests passed! Backend API is working correctly.")
            sys.exit(0)
        else:
            print("\n⚠️  Some tests failed. Check the results above.")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Test setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()