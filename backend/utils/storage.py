import os
import uuid
import json

UPLOAD_DIR = "uploads"
DB_FILE = "data/documents.json"

# Ensure folders exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs("data", exist_ok=True)

# Ensure DB exists
if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w") as f:
        json.dump({}, f)


def save_file(uploaded_file):
    """Save uploaded file -> return file_id, file_path"""
    file_id = str(uuid.uuid4())
    extension = uploaded_file.filename.split(".")[-1]

    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.{extension}")

    with open(file_path, "wb") as f:
        f.write(uploaded_file.file.read())

    return file_id, file_path


def save_metadata(file_id, info):
    """Save metadata to JSON DB"""
    with open(DB_FILE, "r") as f:
        db = json.load(f)

    db[file_id] = info

    with open(DB_FILE, "w") as f:
        json.dump(db, f, indent=4)


def get_metadata(file_id):
    """Retrieve metadata from DB"""
    with open(DB_FILE, "r") as f:
        db = json.load(f)

    return db.get(file_id, None)
