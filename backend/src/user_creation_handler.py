from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/create-user', methods=['POST'])
def create_user():
    data = request.json
    username = data['username']
    password = data['password']
    # Bög
    real_ip = request.headers.get('X-Real-IP')
    forwarded_for = request.headers.get('X-Forwarded-For')

    print("Real client IP:", real_ip)
    print("Forwarded chain:", forwarded_for)
    print(jsonify({"status": "user created"}))	
    return jsonify({"status": "user created"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
