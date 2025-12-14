from flask_socketio import SocketIO

socketio = SocketIO()
online_users = {}  # user_id: socket_id
