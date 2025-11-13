#!/usr/bin/env python3
"""
Simple HTTP server for testing the Smart Control AI Prototype
Run this script to start a local development server
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuration
PORT = 8080
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for MQTT testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.end_headers()

def main():
    # Change to the web-prototype directory
    script_dir = Path(__file__).parent
    web_prototype_dir = script_dir / 'web-prototype'
    
    if not web_prototype_dir.exists():
        print(f"Error: {web_prototype_dir} directory not found!")
        print("Please make sure you're running this script from the project root.")
        sys.exit(1)
    
    os.chdir(web_prototype_dir)
    
    # Start the server
    with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Smart Control AI Prototype Server")
        print(f"📱 Server running at: http://{HOST}:{PORT}")
        print(f"🎮 Demo page: http://{HOST}:{PORT}/demo.html")
        print(f"📱 Main app: http://{HOST}:{PORT}/index.html")
        print(f"📁 Serving files from: {web_prototype_dir}")
        print(f"🌐 Open in mobile browser for best experience")
        print(f"⏹️  Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Try to open browser automatically
        try:
            webbrowser.open(f'http://{HOST}:{PORT}/demo.html')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped.")
            sys.exit(0)

if __name__ == '__main__':
    main()
