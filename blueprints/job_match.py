from flask import Blueprint, render_template

job_match_bp = Blueprint("job-match", __name__)

@job_match_bp.route("/")
def index():
    return render_template("job_match.html")
    