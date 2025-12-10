from mysql.connector import MySQLConnection


def get_uid(receiver_username, mydb: MySQLConnection):
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
