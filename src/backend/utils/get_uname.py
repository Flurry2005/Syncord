from mysql.connector import MySQLConnection


def get_uname(uid, mydb: MySQLConnection) -> str:
    try:
        query = "SELECT username FROM users WHERE user_id = %s;"
        values = (uid,)

        cursor = mydb.cursor()
        cursor.execute(query, values)
        result = cursor.fetchone()

        if not result:
            raise KeyError("User not found!")
        return result[0]
    except KeyError as e:
        return None, e
