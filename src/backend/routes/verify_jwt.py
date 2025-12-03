import os
from flask import request, jsonify, make_response
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt


def register_routes(app):
    @app.route("/verify-jwt", methods=["GET"])
    def verify_jwt():
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"status": 401, "desc": "No token"}), 401

        token = auth_header.split(" ")[1]
        try:
            res = jwt.decode(token, os.environ.get("SECRET"), algorithms="HS256")
            return jsonify({"status": 200, "desc": "Valid token"})
        except jwt.ExpiredSignatureError:
            return jsonify({"status": 500, "desc": "Token Expired"})
        except jwt.InvalidTokenError:
            return jsonify({"status": 500, "desc": "Invalid token"})
