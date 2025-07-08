

from flask import request, jsonify, Blueprint
from api.models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# Apply CORS header after every request
@api.after_request
def apply_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
    else:
        response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Signup endpoint
@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({ "msg": "Email and password are required." }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({ "msg": "User already exists." }), 400

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({ "msg": "User created successfully." }), 201

# Login endpoint
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({ "msg": "Email and password are required." }), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({ "msg": "Invalid credentials." }), 401

    access_token = create_access_token(identity=str(user.id))  # Ensure identity is a string
    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200

# Protected route (JWT required)
@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    current_user_id = get_jwt_identity()
    if not isinstance(current_user_id, str):
        current_user_id = str(current_user_id)  # Ensure ID is a string if needed

    user = User.query.get(current_user_id)
    if not user:
        return jsonify({ "msg": "User not found." }), 404

    return jsonify({
        "msg": f"Welcome {user.email}!",
        "user": user.serialize()
    }), 200

# Public route
@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({ "message": "Welcome from the Flask backend!" }), 200

