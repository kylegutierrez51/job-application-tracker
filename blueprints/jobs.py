from flask import Blueprint, render_template

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/")
def index():
    return "<h1>jobs</h1>"