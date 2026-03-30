from flask import Blueprint, render_template

contacts_bp = Blueprint("contacts", __name__)

@contacts_bp.route("/")
def index():
    return "<h1>contacts</h1>"