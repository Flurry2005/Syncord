import os
from flask import request, jsonify, make_response
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt


def register_routes(app, mydb: MySQLConnection, ph: PasswordHasher):
    @app.route("/login", methods=["POST"])
    def login():
        data = request.json
        username: str = data["username"]
        username = username.strip()
        password = data["password"]

        if username == "" or password == "":
            return jsonify({"status": 500, "desc": "Login Failed!"})

        try:
            query = "SELECT user_id, username, password_hash FROM communication_app.users WHERE username = %s"
            values = (username,)

            cursor = mydb.cursor()
            cursor.execute(query, values)
            result = cursor.fetchone()
            id, db_username, db_password_hash = result
        except Exception as err:
            print(err)
            return jsonify({"status": 500, "desc": "Login Failed, user not found!"})

        try:
            ph.verify(db_password_hash, password)

            payload = {
                "uid": id,
                "username": db_username,
                "exp": time.time() + 3600,
            }

            token: bytes | str = jwt.encode(
                payload, os.environ.get("SECRET"), algorithm="HS256"
            )

            if type(token) == bytes:
                token: bytes = token.decode("utf-8")

            resp = make_response(
                jsonify({"status": 200, "desc": "Login Successful!", "token": token})
            )
            resp.set_cookie(
                key="token",
                value=token,
                expires=payload["exp"],
                httponly=True,
                secure=True,
                samesite="None",
                path="/",
            )
            return resp
        except Exception as e:
            print(e)
            return jsonify({"status": 500, "desc": "Login Failed!"})
