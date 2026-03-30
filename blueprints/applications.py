from flask import Blueprint, render_template

applications_bp = Blueprint("applications", __name__)

@applications_bp.route("/")
def index():
    return "<h1>applications</h1>"