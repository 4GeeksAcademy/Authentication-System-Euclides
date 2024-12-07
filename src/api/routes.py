"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# Register ENDPOINT
@api.route("/register", methods=["POST"])
def register():
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name", None)
    email = request.json.get("email", None)
    type_user = request.json.get("type_user", None)
    password = request.json.get("password", None)

    # Validar que todos los campos requeridos estén presentes
    if not all([first_name, last_name, email, type_user, password]):
        return jsonify({"msg": "Todos los campos son obligatorios."}), 400

    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "El correo electrónico ya está en uso."}), 409

    # Crear un nuevo usuario
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        type_user=type_user,
        email=email,
        password_hash=generate_password_hash(password),  # Hash de la contraseña
    )

    # Agregar el nuevo usuario a la base de datos
    db.session.add(new_user)
    db.session.commit()

    acces_token = create_access_token(identity=email)

    return jsonify({"msg": "Usuario creado exitosamente.", "user_id": new_user.id, "token": acces_token, "user": new_user.serialize()}), 201

# Login ENDPOINT
@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if email == None or password == None:
        return jsonify({"msg": "Houston we've got a problem, it seems that you forgot to enter your email or password"}), 401

    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"msg": "We couldn't find your email, but we've got a feeling it's out there having a good time. Join us and create your own adventure!"}), 404

    if check_password_hash(user.password_hash, password):  # Usar password_hash
        acces_token = create_access_token(identity=email)
        return jsonify({
                "token": acces_token,
                "user": user.serialize(),
            
            }), 200

    else:
        return jsonify({"msg": "Houston we've got a problem, it seems that your password is incorrect"}), 401