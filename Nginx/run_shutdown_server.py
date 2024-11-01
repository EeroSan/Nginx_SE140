from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess

class ShutdownHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/shutdown.sh':
            # Execute shutdown script
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'Shutting down Nginx...')
            
            subprocess.run(['/home/shutdown.sh'], shell=True)
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server_address = ('', 9090)
    httpd = HTTPServer(server_address, ShutdownHandler)
    print('Running shutdown server...')
    httpd.serve_forever()