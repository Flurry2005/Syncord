from flask import request, jsonify, make_response
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt


def register_routes(app, mydb: MySQLConnection, ph: PasswordHasher):
    @app.route("/register", methods=["POST"])
    def register():
        data = request.json
        username: str = data["username"]
        password: str = data["password"]
        # Ensure pass is not empty
        if password == "":
            password = None
        else:
            password.strip()
            pass_hash = hash_pass(password, ph)
        if username == "":
            username = None
        else:
            username.strip()

        print(jsonify({"status": "user created"}))

        query = "INSERT INTO users (username ,password_hash) VALUES (%s, %s)"
        values = (username, pass_hash)
        try:
            mydb.cursor().execute(query, values)
            mydb.commit()
        except mysql.connector.Error as e:
            mydb.rollback()
            print("Insert failed:", e)
            error = getErrorReason(e.errno)

            return jsonify({"status": 500, "desc": error})

        return jsonify({"status": 200, "desc": "Account created!"})


def hash_pass(password, ph: PasswordHasher):
    # Create a PasswordHasher instance with recommended settings

    # --------------------------
    # Hash a password
    # --------------------------
    hashed_password = ph.hash(password)
    return hashed_password


def getErrorReason(errno: int):
    if errno == 1048:
        return "Password/Username cant be empty"
    elif errno == 1062:
        return "Username isn't available"
    return "Unknown error"
