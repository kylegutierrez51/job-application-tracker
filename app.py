from flask import Flask;

from blueprints.applications import applications_bp
from blueprints.companies import companies_bp
from blueprints.contacts import contacts_bp
from blueprints.dashboard import dashboard_bp
from blueprints.jobs import jobs_bp

def create_app():
  app = Flask(__name__)
  
  app.register_blueprint(dashboard_bp)
  app.register_blueprint(companies_bp, url_prefix="/companies")
  app.register_blueprint(contacts_bp, url_prefix="/contacts")
  app.register_blueprint(jobs_bp, url_prefix="/jobs")
  app.register_blueprint(applications_bp, url_prefix="/applications")

  return app



if __name__ == "__main__":
  app = create_app()
  app.run(debug=True)