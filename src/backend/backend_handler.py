import os
from flask import Flask, request, jsonify, g
import mysql.connector
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import jwt
from flask_cors import CORS
from routes import login, register, retreive_friends, verify_jwt, send_friend_request
from dotenv import load_dotenv

load_dotenv()


class BackendHandler:

    def __init__(self):
        self.app = Flask(__name__)
        CORS(
            self.app,
            supports_credentials=True,
            origins=[
                "http://localhost:5123",
                "capacitor://localhost",
                "http://localhost",
            ],
        )

        self.ph = PasswordHasher(
            time_cost=3,
            memory_cost=65536,
            parallelism=1,
            hash_len=32,
        )

        self.mydb = mysql.connector.connect(
            host="localhost",
            user=os.environ.get("DBUSERNAME"),
            database="communication_app",
            password=os.environ.get("DBPASSWORD"),
        )
        self.app.before_request(self.before_every_request)

        self.register_routes()

    def register_routes(self):
        login.register_routes(self.app, self.mydb, self.ph)
        register.register_routes(self.app, self.mydb, self.ph)
        retreive_friends.register_routes(self.app, self.mydb)
        verify_jwt.register_routes(self.app)
        send_friend_request.register_routes(self.app, self.mydb)

    def before_every_request(self):
        real_ip = request.headers.get("X-Real-IP")
        forwarded_for = request.headers.get("X-Forwarded-For")
        print(
            f'\n{"Incoming request from " + real_ip + ";" + forwarded_for:^50}\n{"-"*50}'
        )

        if (
            request.endpoint != "login"
            and request.endpoint != "register"
            and request.endpoint != "verify-jwt"
        ):
            resp = self.verify_jwt()
            if resp is not None:
                return resp

    def verify_jwt(self):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"status": 401, "desc": "No token"}), 401

        token = auth_header.split(" ")[1]
        try:
            res = jwt.decode(token, os.environ.get("SECRET"), algorithms="HS256")
            g.uid = res["uid"]
            g.username = res["username"]
            print(g.uid)
            return None
        except jwt.ExpiredSignatureError:
            return jsonify({"status": 500, "desc": "Token Expired"})
        except jwt.InvalidTokenError:
            return jsonify({"status": 500, "desc": "Invalid token"})


if __name__ == "__main__":
    handler = BackendHandler()
    handler.app.run(host="127.0.0.1", port=5000)
