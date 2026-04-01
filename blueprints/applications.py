from flask import Blueprint, render_template, current_app, jsonify

applications_bp = Blueprint("applications", __name__)

@applications_bp.route("/")
def index():
    return render_template("applications.html")



@applications_bp.route("/api/count")
def api_applications_count():
    db = current_app.db
    applications_count = db.get_applications_count()
    return jsonify({'count': applications_count})