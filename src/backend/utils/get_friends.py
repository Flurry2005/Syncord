from mysql.connector import MySQLConnection


def get_friends(user_id, mydb: MySQLConnection):
    try:
        query = "SELECT * FROM friendships WHERE user1_id = %s OR user2_id = %s;"
        values = (user_id, user_id)

        cursor = mydb.cursor()
        cursor.execute(query, values)
        result = cursor.fetchall()

        friend_list: dict[int, str] = {}

        for entry in result:
            if entry[0] != user_id:
                get_friend_info_query = "SELECT username FROM users WHERE user_id = %s"
                friend_id = entry[0]
                friend_id_values = (friend_id,)
                cursor = mydb.cursor()
                cursor.execute(get_friend_info_query, friend_id_values)
                username = cursor.fetchone()
                friend_list[friend_id] = username[0]
            else:
                get_friend_info_query = "SELECT username FROM users WHERE user_id = %s"
                friend_id = entry[1]
                friend_id_values = (friend_id,)
                cursor = mydb.cursor()
                cursor.execute(get_friend_info_query, friend_id_values)
                username = cursor.fetchone()
                friend_list[friend_id] = username[0]

        return friend_list
    except Exception as err:
        print(err)
        return None
