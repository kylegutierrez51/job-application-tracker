from flask import Blueprint, render_template, request, current_app, jsonify

applications_bp = Blueprint("applications", __name__)

def serialize_application(application):
    return {
        **application,
        'application_date': application['application_date'].isoformat() if application['application_date'] is not None else None,
        'response_date': application['response_date'].isoformat() if application['response_date'] is not None else None,
        'interview_date': application['interview_date'].isoformat() if application['interview_date'] is not None else None,
        'created_at': application['created_at'].isoformat() if application['created_at'] is not None else None,
    }


@applications_bp.route("/", methods=["GET", "POST"])
def index():
    db = current_app.db
    
    if request.method == 'POST':
        # VALIDATION LOGIC
        data = request.get_json()
        db.add_application(data)
        return jsonify({'success': True})
    
    if request.method == 'GET':
        applications = [serialize_application(a) for a in db.get_all_applications()]
        return render_template("applications.html", applications=applications)



@applications_bp.route("/<int:application_id>", methods=["PUT", "DELETE"])
def modify_application(application_id):
    db = current_app.db

    if request.method == 'PUT':
        # VALIDATION LOGIC
        data = request.get_json()
        db.edit_application(data, application_id)
        print('Edited Application: ', db.get_application(application_id), '\n')
        return jsonify({'success': True})

    if request.method == 'DELETE':
        db.delete_application(application_id)
        return jsonify({'success': True})



@applications_bp.route("/api/count")
def api_applications_count():
    db = current_app.db
    applications_count = db.get_applications_count()
    return jsonify({'count': applications_count})









