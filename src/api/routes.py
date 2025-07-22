from flask import request, jsonify, Blueprint
from api.models import db, User, Favorite
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

@api.after_request
def apply_cors_headers(response):
    origin = request.headers.get("Origin")
    response.headers["Access-Control-Allow-Origin"] = origin or "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

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

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({ "msg": "Invalid credentials." }), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({ "msg": "User not found." }), 404
    return jsonify({
        "msg": f"Welcome {user.email}!",
        "user": user.serialize()
    }), 200

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify({ "favorites": [fav.serialize() for fav in favorites] }), 200

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    data = request.get_json()
    item_name = data.get("item_name")

    if not item_name:
        return jsonify({ "msg": "Item name is required" }), 400

    user_id = get_jwt_identity()
    new_fav = Favorite(item_name=item_name, user_id=user_id)
    db.session.add(new_fav)
    db.session.commit()

    return jsonify(new_fav.serialize()), 201

@api.route('/favorites/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):
    user_id = get_jwt_identity()
    fav = Favorite.query.filter_by(id=id, user_id=user_id).first()

    if not fav:
        return jsonify({ "msg": "Favorite not found." }), 404

    db.session.delete(fav)
    db.session.commit()
    return jsonify({ "msg": "Favorite deleted" }), 200

@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({ "message": "Welcome from the Flask backend!" }), 200


