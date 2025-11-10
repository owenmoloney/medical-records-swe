import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("/home/students/omoloney/public_html/medical_project/private/medical-project-6a2aa-firebase-adminsdk-fbsvc-d1e31d38e3.json")

try:
    firebase_admin.initialize_app(cred)
    print("Firebase connection successful!")
except Exception as e:
    print(f"Error connecting to Firebase: {e}")
