from flask import Blueprint, render_template, current_app
import json

job_match_bp = Blueprint("job-match", __name__)


def serialize_job(job):
    return {
        **job,
        'salary_min': float(job['salary_min']) if job['salary_min'] is not None else None,
        'salary_max': float(job['salary_max']) if job['salary_max'] is not None else None,
        'requirements': json.loads(job['requirements']) if job.get('requirements') else None,
    }


@job_match_bp.route("/")
def index():
    db = current_app.db
    jobs = [serialize_job(j) for j in db.get_jobs_for_matching()]
    return render_template("job_match.html", jobs=jobs)
