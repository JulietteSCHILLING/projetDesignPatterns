import mysql.connector
from mysql.connector.errors import Error

def connexion():

    # Connexion à la base de données MySQL
    try:
        print('Connexion à la base de données réussie')
        return mysql.connector.connect(host="localhost", user="root", database = 'ProjetDesignPatterns')
    except Error as e:
        print(f'Erreur de connexion à la base de données: {e}')

def fermeture(conn):
    conn.close()


conn = connexion()


# Lecture du script SQL
with open('./database/db.sql', 'r') as f:
    script_sql = f.read()

with open('./database/populating.sql', 'r') as p:
    insert = p.read()

# Exécution des scripts SQL
try:
    with conn.cursor() as cursor:
        # Séparation des instructions SQL
        sql_commands = script_sql.split(';')
        # Suppression de l'éventuel dernier élément vide
        sql_commands = [cmd.strip() for cmd in sql_commands if cmd.strip()]
        # Exécution de chaque instruction SQL
        for cmd in sql_commands:
            cursor.execute(cmd)
        conn.commit()
    print("Le script db.sql a été exécuté avec succès.")

    with conn.cursor() as c:
        sql_commands = insert.split(';')
        sql_commands = [cmd.strip() for cmd in sql_commands if cmd.strip()]
        for cmd in sql_commands:
            c.execute(cmd)
        conn.commit()
    print("Le script populating.sql a été exécuté avec succès.")


except Exception as e:
    print("Erreur lors de l'exécution du script SQL :", e)
finally:
    conn.close()
