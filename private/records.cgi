#!/usr/local/bin/miniconda3/bin/python3

import sys
# Add local packages to path
sys.path.insert(0, "/home/students/omoloney/.local/lib/python3.11/site-packages")  # adjust Python version if needed

import cgitb
cgitb.enable(display=1)  # show errors in browser

import firebase_admin
from firebase_admin import credentials, firestore

print("Content-Type: text/html\n")

# Path to your Firebase service account key
cred_path = "/home/students/omoloney/public_html/medical_project/private/medical-project-6a2aa-firebase-adminsdk-fbsvc-d1e31d38e3.json"

# Initialize Firebase (only once)
if not firebase_admin._apps:
    firebase_admin.initialize_app(credentials.Certificate(cred_path))

db = firestore.client()

print("<html><head><title>Medical Records</title></head><body>")
print("<h1>Patient Records</h1>")
print("<table border='1' cellpadding='8'><tr><th>Name</th><th>Age</th><th>Condition</th><th>Doctor</th><th>Last Visit</th></tr>")

try:
    patients_ref = db.collection('patients')
    docs = patients_ref.stream()

    for doc in docs:
        data = doc.to_dict()
        print(f"<tr><td>{data.get('name','')}</td><td>{data.get('age','')}</td><td>{data.get('condition','')}</td><td>{data.get('doctor','')}</td><td>{data.get('last_visit','')}</td></tr>")

    print("</table>")
    print("<p>✅ Records successfully retrieved from Firestore.</p>")

except Exception as e:
    print(f"<p style='color:red;'>Error retrieving records: {e}</p>")

print("</body></html>")

