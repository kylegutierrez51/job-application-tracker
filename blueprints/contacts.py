from flask import Blueprint, render_template, current_app, jsonify

contacts_bp = Blueprint("contacts", __name__)

@contacts_bp.route("/")
def index():
    return render_template("contacts.html")



@contacts_bp.route("/api/count")
def api_contacts_count():
    db = current_app.db
    contacts_count = db.get_contacts_count()
    return jsonify({'count': contacts_count})