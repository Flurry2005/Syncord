import os
from flask import g, request, jsonify, make_response
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt
from utils.get_uid import get_uid


def register_routes(app, mydb: MySQLConnection):
    @app.route("/friend-request-decision", methods=["POST"])
    def friend_request_decision():
        data = request.json
        sender_uid = g.uid
        username_to_accept: str = data["username"]
        username_to_accept = username_to_accept.strip()
        accept: bool = data["accept"]

        uid_to_accept, e = get_uid(username_to_accept, mydb)

        if uid_to_accept is None:
            return jsonify({"status": 500, "desc": e.args[0]})

        if accept:
            uid1 = min(sender_uid, uid_to_accept)
            uid2 = max(sender_uid, uid_to_accept)

            query = "INSERT INTO friendships (user1_id, user2_id) VALUES (%s, %s)"
            values = (uid1, uid2)
            try:
                mydb.cursor().execute(query, values)
                mydb.commit()
            except mysql.connector.Error as e:
                mydb.rollback()
                print("Insert failed:", e)

                return jsonify({"status": 500, "desc": e.errno})

        query = "DELETE FROM friend_requests WHERE (sender_id = %s AND receiver_id = %s) OR (receiver_id = %s AND sender_id = %s)"
        values = (sender_uid, uid_to_accept, sender_uid, uid_to_accept)
        try:
            mydb.cursor().execute(query, values)
            mydb.commit()
        except mysql.connector.Error as e:
            mydb.rollback()
            print("Delete failed:", e)

            return jsonify({"status": 500, "desc": e.errno})

        return jsonify({"status": 200, "desc": "Friend request accepted!"})
