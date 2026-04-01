from flask import Blueprint, render_template, request, current_app, jsonify

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/")
def index():
    return render_template("dashboard.html")


@dashboard_bp.route("/dashboard/api/stats")
def get_stats():
    db = current_app.db

    summary = db.get_dashboard_stats()
    pipeline = db.get_pipeline_stats()
    recent_activity = db.get_recent_activity()
    upcoming_interviews = db.get_upcoming_interviews()

    # Normalize summary values (Decimal → int, None → 0)
    clean_summary = {}
    for key, val in summary.items():
        clean_summary[key] = int(val) if val is not None else 0

    # Build pipeline in a fixed status order
    status_order = ['Applied', 'Phone Screen', 'Interview Scheduled', 'Interview Completed', 'Offer', 'Rejected']
    pipeline_map = {row['status']: int(row['count']) for row in pipeline}
    formatted_pipeline = [
        {'status': s, 'count': pipeline_map.get(s, 0)}
        for s in status_order
    ]

    formatted_activity = [
        {
            'job_title': row['job_title'],
            'company_name': row['company_name'],
            'application_date': row['application_date'].isoformat() if row['application_date'] else None,
            'status': row['status']
        }
        for row in recent_activity
    ]

    formatted_interviews = [
        {
            'job_title': row['job_title'],
            'company_name': row['company_name'],
            'interview_date': row['interview_date'].strftime('%b %d, %Y') if row['interview_date'] else None,
            'interview_time': row['interview_date'].strftime('%I:%M %p') if row['interview_date'] else None
        }
        for row in upcoming_interviews
    ]

    return jsonify({
        'summary': clean_summary,
        'pipeline': formatted_pipeline,
        'recent_activity': formatted_activity,
        'upcoming_interviews': formatted_interviews
    })