import os
from flask import g, request, jsonify, make_response
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt

from utils.get_uid import get_uid


def register_routes(app, mydb: MySQLConnection):
    @app.route("/send-friend-request", methods=["POST"])
    def send_friend_request():
        data = request.json
        sender_id = g.uid
        receiver_username: str = data["username"]
        receiver_username = receiver_username.strip()

        receiver_id, e = get_uid(receiver_username, mydb)

        if receiver_id is None:
            return jsonify({"status": 500, "desc": e.args[0]}), 500

        if sender_id is receiver_id:
            return jsonify({"status": 500, "desc": "You can't add yourself!"}), 500

        query = "SELECT * FROM friend_requests WHERE (sender_id = %s AND receiver_id = %s) OR (receiver_id = %s AND sender_id = %s)"
        values = (sender_id, receiver_id, sender_id, receiver_id)

        cursor = mydb.cursor()
        cursor.execute(query, values)
        result = cursor.fetchone()

        if result:
            return jsonify({"status": 500, "desc": "Friend request already sent!"}), 500

        uid1 = min(sender_id, receiver_id)
        uid2 = max(sender_id, receiver_id)

        query = "SELECT * FROM friendships WHERE user1_id = %s AND user2_id = %s"
        values = (uid1, uid2)

        cursor = mydb.cursor()
        cursor.execute(query, values)
        result = cursor.fetchone()

        if result:
            return jsonify({"status": 500, "desc": "You´re already friends!"}), 500

        query = "INSERT INTO friend_requests (sender_id ,receiver_id) VALUES (%s, %s)"
        values = (sender_id, receiver_id)
        try:
            mydb.cursor().execute(query, values)
            mydb.commit()
        except mysql.connector.Error as e:
            mydb.rollback()
            print("Insert failed:", e)

            return jsonify({"status": 500, "desc": e.errno}), 500

        return jsonify({"status": 200, "desc": "Friend request sent!"}), 200
