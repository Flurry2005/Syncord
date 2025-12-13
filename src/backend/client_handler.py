import os
from flask_socketio import SocketIO, disconnect, emit
from flask import request
import jwt
from utils.get_friends import get_friends  # implement this
from utils.get_uname import get_uname  # implement this


online_users = {}  # user_id: socket_id


def register_socket_events(socketio: SocketIO, mydb):

    @socketio.on("connect")
    def handle_connect(auth):
        result = get_uid_from_jwt(auth)
        if not result:
            return

        user_id, username = result

        online_users[user_id] = request.sid  # Map user_id to socket_id
        print(f"{username} ({user_id}) connected")

        friends: dict[int, str] = get_friends(user_id, mydb)  # uid, username

        # Alert friend connecting user is oline
        print(f"{username} has gone online, alerting friends: {friends}")
        for friend_id, friend_username in friends.items():
            if friend_id in online_users:
                emit(
                    "friend_online",
                    {"username": username},
                    room=online_users[friend_id],  # Room socket id
                )

    @socketio.on("request_initial_online_friends")
    def send_initial_online_friends():
        user_id = None
        for uid, sid in online_users.items():
            if sid == request.sid:
                user_id = uid
                break
        friends: dict[int, str] = get_friends(user_id, mydb)
        print(f"Sending online friends to connecting user: {get_uname(uid, mydb)}")
        for friend_id, friend_username in friends.items():
            if friend_id in online_users.keys():
                emit(
                    "friend_online",
                    {"username": friend_username},
                    room=online_users[user_id],
                )

    @socketio.on("disconnect")
    def handle_disconnect():
        # Find user_id by socket ID
        disconnected_user_id = None
        for uid, sid in online_users.items():
            if sid == request.sid:
                disconnected_user_id = uid
                break

        if not disconnected_user_id:
            return  # user was not tracked

        online_users.pop(disconnected_user_id)

        # Notify friends
        friends: dict[int, str] = get_friends(disconnected_user_id, mydb)
        username = get_uname(disconnected_user_id, mydb)
        print(f"{username}({disconnected_user_id}) disconnected!")
        for friend_id, friend_username in friends.items():
            if friend_id in online_users:
                emit(
                    "friend_offline",
                    {"username": username},
                    room=online_users[friend_id],
                )


def get_uid_from_jwt(auth):
    token = auth.get("token")
    if not token:
        disconnect()
        return None

    try:
        payload = jwt.decode(token, os.environ.get("SECRET"), algorithms=["HS256"])
        return payload["uid"], payload["username"]
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        disconnect()
        return None
