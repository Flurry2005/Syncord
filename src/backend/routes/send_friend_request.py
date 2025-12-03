import os
from flask import g, request, jsonify, make_response
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt


def register_routes(app, mydb: MySQLConnection):
    @app.route("/send-friend-request", methods=["POST"])
    def send_friend_request():
        data = request.json
        sender_id = g.uid
        receiver_username: str = data["username"]
        receiver_username = receiver_username.strip()

        receiver_id, e = get_receiver_uid(receiver_username, mydb)

        if receiver_id is None:
            return jsonify({"status": 500, "desc": e.args[0]})

        query = "INSERT INTO friend_requests (sender_id ,receiver_id) VALUES (%s, %s)"
        values = (sender_id, receiver_id)
        try:
            mydb.cursor().execute(query, values)
            mydb.commit()
        except mysql.connector.Error as e:
            mydb.rollback()
            print("Insert failed:", e)

            return jsonify({"status": 500, "desc": e.errno})

        return jsonify({"status": 200, "desc": "Friend request sent!"})

    def get_receiver_uid(receiver_username, mydb: MySQLConnection):
        try:
            query = "SELECT user_id FROM users WHERE username = %s;"
            values = (receiver_username,)

            cursor = mydb.cursor()
            cursor.execute(query, values)
            result = cursor.fetchone()

            if not result:
                raise KeyError("User not found!")
            return result[0], None
        except KeyError as e:
            return None, e
