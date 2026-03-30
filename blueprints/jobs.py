from flask import Blueprint, render_template

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/")
def index():
    return render_template("jobs.html")