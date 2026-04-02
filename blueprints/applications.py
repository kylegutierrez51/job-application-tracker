from flask import Blueprint, render_template, request, current_app, jsonify
import json

applications_bp = Blueprint("applications", __name__)

def serialize_application(application):
    return {
        **application,
        'application_date': application['application_date'].isoformat() if application['application_date'] is not None else None,
        'response_date': application['response_date'].isoformat() if application['response_date'] is not None else None,
        'interview_date': application['interview_date'].isoformat() if application['interview_date'] is not None else None,
        'created_at': application['created_at'].isoformat() if application['created_at'] is not None else None,
        'interview_data': json.loads(application['interview_data']) if application.get('interview_data') else None,
    }


@applications_bp.route("/", methods=["GET", "POST"])
def index():
    db = current_app.db
    
    if request.method == 'POST':
        # VALIDATION LOGIC
        data = request.get_json()
        for key in ['application_date', 'status', 'resume_version', 'response_date', 'interview_date', 'notes']:
            if not data.get(key): # catches both empty strings and entirely absent keys (for 'status')
                data[key] = None
        data['cover_letter_sent'] = 1 if data.get('cover_letter_sent') in ('1', 1, True) else 0
        new_id = db.add_application(data)
        application = db.get_application(new_id)
        return jsonify({'success': True, 'application': serialize_application(application)})
    
    if request.method == 'GET':
        applications = [serialize_application(a) for a in db.get_all_applications()]
        return render_template("applications.html", applications=applications)



@applications_bp.route("/<int:application_id>", methods=["PUT", "DELETE"])
def modify_application(application_id):
    db = current_app.db

    if request.method == 'PUT':
        # VALIDATION LOGIC
        data = request.get_json()
        for key in ['application_date', 'status', 'resume_version', 'response_date', 'interview_date', 'notes']:
            if not data.get(key): # catches both empty strings and entirely absent keys (for 'status')
                data[key] = None
        data['cover_letter_sent'] = 1 if data.get('cover_letter_sent') in ('1', 1, True) else 0
        db.edit_application(data, application_id)
        application = db.get_application(application_id)
        return jsonify({'success': True, 'application': serialize_application(application)})

    if request.method == 'DELETE':
        db.delete_application(application_id)
        return jsonify({'success': True})



@applications_bp.route("/api/count")
def api_applications_count():
    db = current_app.db
    applications_count = db.get_applications_count()
    return jsonify({'count': applications_count})









