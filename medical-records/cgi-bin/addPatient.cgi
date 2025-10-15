#!/usr/bin/env python3

import mysql.connector
import json
import sys
import os

# headers and blank line 
print("Content-Type: application/json")
print() 

# handle options request
if os.environ.get("REQUEST_METHOD") == "OPTIONS":
    sys.exit(0)

# read JSON post data
try:
    content_length = int(os.environ.get("CONTENT_LENGTH", 0))
    if content_length == 0:
        raise ValueError("No POST data received")
    post_data = sys.stdin.read(content_length)
    data = json.loads(post_data)
except Exception as e:
    print(json.dumps({"success": False, "error": f"JSON read error: {e}"}))
    sys.exit(0)

# connect + SQL query
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="mballard",
        password="passwordNine",
        database="mballard"
    )

    cursor = conn.cursor()

    sql = """
        INSERT INTO patients 
        (first_name, last_name, date_of_birth, gender, phone_number, email, address, emergency_contact_name, emergency_contact_phone)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    cursor.execute(sql, (
        data.get("first_name"),
        data.get("last_name"),
        data.get("date_of_birth"),
        data.get("gender"),
        data.get("phone_number"),
        data.get("email"),
        data.get("address"),
        data.get("emergency_contact_name"),
        data.get("emergency_contact_phone")
    ))
    conn.commit()

    print(json.dumps({"success": True, "message": "Patient added successfully"}))

except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))

finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()
