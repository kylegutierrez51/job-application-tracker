from flask import Blueprint, render_template

companies_bp = Blueprint("companies", __name__)

@companies_bp.route("/")
def index():
    return "<h1>companies</h1>"