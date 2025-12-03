import os
from flask import g, request, jsonify, make_response
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt


def register_routes(app, mydb: MySQLConnection):
    @app.route("/retrieve-friend-requests", methods=["GET"])
    def retrieve_friend_requests():
        user_id = g.uid
        friend_requests = []

        query = "SELECT sender_id FROM friend_requests WHERE receiver_id =  %s"
        values = (user_id,)

        cursor = mydb.cursor()
        cursor.execute(query, values)
        result = cursor.fetchall()
        print(result)

        for row in result:
            get_friend_info_query = "SELECT username FROM users WHERE user_id = %s"
            sender_id = (row[0],)
            cursor = mydb.cursor()
            cursor.execute(get_friend_info_query, sender_id)
            username = cursor.fetchone()
            friend_requests.append(username[0])
        print(friend_requests)

        return jsonify({"status": 200, "data": friend_requests})
