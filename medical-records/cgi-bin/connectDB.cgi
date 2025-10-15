#!/usr/bin/env python3

import mysql.connector
import json
import sys

# header + blank line
print("Content-Type: application/json")
print() 

try:
    # connect to mysql
    conn = mysql.connector.connect(
        host="localhost",
        user="mballard",
        password="passwordNine",   
        database="mballard"
    )

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM patients;")
    rows = cursor.fetchall()
    # resolve date format issues
    for row in rows:
        for key, value in row.items():
            if hasattr(value, 'isoformat'):  
                row[key] = value.isoformat()
    cursor.close()
    conn.close()

    print(json.dumps(rows))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
