from flask import Blueprint, render_template, current_app, jsonify

companies_bp = Blueprint("companies", __name__)

@companies_bp.route("/")
def index():
    return render_template("companies.html")



@companies_bp.route("/api")
def api_companies():
    db = current_app.db
    companies = db.get_companies_for_select()
    return jsonify({'companies': companies})