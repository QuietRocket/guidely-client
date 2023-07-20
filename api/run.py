from http.server import BaseHTTPRequestHandler
import json
import guidance

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Get the post data and parse it as JSON
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        json_data = json.loads(post_data)
        
        # Get the program from the JSON
        guidance.llm = guidance.llms.Mock()
        program = guidance(json_data["program"])
        executed = program()

        res = json.dumps({ "result": executed.text })

        # Send a 200 OK response
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write(res.encode('utf-8'))
        return