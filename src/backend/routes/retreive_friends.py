from flask import request, jsonify, g
import mysql.connector
from mysql.connector import MySQLConnection
from argon2 import PasswordHasher
import time
import jwt


def register_routes(app, mydb: MySQLConnection):

    @app.route("/retrieve-friends", methods=["GET"])
    def retrieve_friends():
        try:
            query = "SELECT * FROM friendships WHERE user_id = %s OR friend_id = %s;"
            values = (g.uid, g.uid)

            cursor = mydb.cursor()
            cursor.execute(query, values)
            result = cursor.fetchall()

            friend_list = []

            for entry in result:
                if entry[0] != g.uid:
                    get_friend_info_query = (
                        "SELECT username FROM users WHERE user_id = %s"
                    )
                    values_1 = (entry[0],)
                    cursor = mydb.cursor()
                    cursor.execute(get_friend_info_query, values_1)
                    username = cursor.fetchone()
                    friend_list.append(username)
                else:
                    get_friend_info_query = (
                        "SELECT username FROM users WHERE user_id = %s"
                    )
                    values_1 = (entry[1],)
                    cursor = mydb.cursor()
                    cursor.execute(get_friend_info_query, values_1)
                    username = cursor.fetchone()
                    friend_list.append(username[0])

            print(friend_list)
            return jsonify(
                {
                    "status": 200,
                    "desc": "Authorized friendlist request success!",
                    "data": friend_list,
                }
            )
        except Exception as err:
            print(err)
            return jsonify({"status": 500, "desc": "Failed to retrieve friends list!"})
