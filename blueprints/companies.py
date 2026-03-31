from flask import Blueprint, render_template, current_app, request, jsonify

companies_bp = Blueprint("companies", __name__)


def serialize_company(company):
    return {
        **company,
        'created_at': company['created_at'].isoformat() if company['created_at'] is not None else None,
    }


@companies_bp.route("/", methods=['GET', 'POST'])
def index():
    db = current_app.db

    if request.method == 'POST':
        # VALIDATION LOGIC
        data = request.get_json()
        db.add_job(data)
        return jsonify({'success': True})

    if request.method == 'GET':
        companies = [serialize_company(c) for c in db.get_all_companies()]
        return render_template("companies.html", companies=companies)



@companies_bp.route("/<int:company_id>", methods=["PUT", "DELETE"])
def modify_job(company_id):
    db = current_app.db

    if request.method == 'PUT':
        # VALIDATION LOGIC
        data = request.get_json()
        db.edit_company(data, company_id)
        print('Edited Company: ', db.get_company(company_id), '\n')
        return jsonify({'success': True})

    if request.method == 'DELETE':
        db.delete_company(company_id)
        return jsonify({'success': True})




@companies_bp.route("/api")
def api_companies():
    db = current_app.db
    companies = db.get_companies_for_select()
    return jsonify({'companies': companies})