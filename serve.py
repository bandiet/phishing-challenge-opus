#!/usr/bin/env python3
"""Lokaler Server ohne Cache: python3 serve.py [port]"""
import http.server
import os
import sys


class OhneCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def handle(self):
        try:
            super().handle()
        except (BrokenPipeError, ConnectionResetError):
            pass


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 64
    daemon_threads = True


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8811
os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(f'Phishing Challenge Opus läuft auf http://127.0.0.1:{port}', flush=True)
Server(('127.0.0.1', port), OhneCache).serve_forever()
