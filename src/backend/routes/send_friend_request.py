import os
from flask import request, jsonify, make_response
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt


def register_routes(app, mydb: MySQLConnection):
    @app.route("/send-friend-request", methods=["POST"])
    def send_friend_request():
        data = request.json
        username: str = data["username"]
        username = username.strip()

        try:
            query = "SELECT * FROM users WHERE username = %s;"
            values = (username,)

            cursor = mydb.cursor()
            cursor.execute(query, values)
            result = cursor.fetchone()

            if not result:
                raise KeyError("User not found!")

            return jsonify({"status": 200, "desc": "Friend request sent!"})
        except KeyError as e:
            return jsonify({"status": 500, "desc": e.args[0]})
