from flask import Blueprint, render_template, current_app, request, jsonify
import json

jobs_bp = Blueprint("jobs", __name__)


# needed since Decimal and datetime.date aren't JSON serializable by default.
# They must be converted to float and isoformat
def serialize_job(job):
    return {
        **job,
        'salary_min': float(job['salary_min']) if job['salary_min'] is not None else None,
        'salary_max': float(job['salary_max']) if job['salary_max'] is not None else None,
        'date_posted': job['date_posted'].isoformat() if job['date_posted'] is not None else None,
        'created_at': job['created_at'].isoformat() if job['created_at'] is not None else None,
        'requirements': json.loads(job['requirements']) if job.get('requirements') else None,
    }


@jobs_bp.route("/", methods=["GET", "POST"])
def index():
    db = current_app.db
    
    if request.method == 'POST':
        data = request.get_json()
        data['salary_min'] = data['salary_min'] if data.get('salary_min') != '' else None
        data['salary_max'] = data['salary_max'] if data.get('salary_max') != '' else None
        data['date_posted'] = data['date_posted'] if data.get('date_posted') != '' else None
        new_id = db.add_job(data)
        job = db.get_job(new_id)
        return jsonify({'success': True, 'job': serialize_job(job)})
    
    if request.method == 'GET':
        jobs = [serialize_job(j) for j in db.get_all_jobs()]
        return render_template("jobs.html", jobs=jobs)



@jobs_bp.route("/<int:job_id>", methods=["PUT", "DELETE"])
def modify_job(job_id):
    db = current_app.db

    if request.method == 'PUT':
        data = request.get_json()
        data['salary_min'] = data['salary_min'] if data.get('salary_min') != '' else None
        data['salary_max'] = data['salary_max'] if data.get('salary_max') != '' else None
        data['date_posted'] = data['date_posted'] if data.get('date_posted') != '' else None
        db.edit_job(data, job_id)
        print('Edited Job: ', db.get_job(job_id), '\n')
        return jsonify({'success': True})

    if request.method == 'DELETE':
        db.delete_job(job_id)
        return jsonify({'success': True})



@jobs_bp.route("/api")
def api_jobs():
    db = current_app.db
    jobs = db.get_all_jobs()
    return jsonify({'jobs': [{'job_id': j['job_id'], 'job_title': j['job_title'], 'company_name': j['company_name']} for j in jobs]})


@jobs_bp.route("/api/count")
def api_jobs_count():
    db = current_app.db
    jobs_count = db.get_jobs_count()
    return jsonify({'count': jobs_count})
    





"""
jsonify({'jobs': [seralize_job(j) for j in jobs]}) looks like:

{
  "jobs": [
    {
      "job_title": "Technical Writer",
      "company_name": "Tech Solutions Inc",
      "salary_min": 55000.0,
      "salary_max": 75000.0,
      "job_type": "Contract",
      "date_posted": "2025-01-12",
      "is_active": 1,
      "posting_url": null
      ...
    },
    {
      "job_title": "Software Developer",
      ...
    }
  ]
}

jsonify turns it into an HTTP response with Content-Type: application/json
"""