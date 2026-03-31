from flask import Blueprint, render_template, current_app, request, jsonify

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
    }


@jobs_bp.route("/")
def index():
    db = current_app.db
    jobs = [serialize_job(j) for j in db.get_all_jobs()]
    return render_template("jobs.html", jobs=jobs)



@jobs_bp.route("/<int:job_id>", methods=["PUT", "DELETE"])
def modify_job(job_id):

    data = request.get_json()
    db = current_app.db

    if request.method == 'PUT':
        # VALIDATION LOGIC BEFORE DB QUERY

        db.edit_job(data, job_id)
        print('Edited Job: ', db.get_job(job_id), '\n');
        return jsonify({'success': True})
    
    if request.method == 'DELETE':
        db.delete_job(data, job_id)



    





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