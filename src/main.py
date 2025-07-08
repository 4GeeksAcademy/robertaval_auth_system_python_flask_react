
import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from api.models import db
from api.routes import api

app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///test.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('FLASK_APP_KEY', 'super-secret-key')


frontend_origin = os.getenv('FRONTEND_ORIGIN', '*')
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": frontend_origin}})

# JWT and DB
db.init_app(app)
jwt = JWTManager(app)

# Routes
app.register_blueprint(api, url_prefix="/api")

@app.route('/')
def index():
    return jsonify({ "msg": "Backend is up." }), 200

if __name__ == "__main__":
    from flask.cli import main as flask_main
    flask_main()
