from mysql.connector import Error, pooling
from contextlib import contextmanager
import os
import json
from dotenv import load_dotenv

load_dotenv() # when you import the JobTrackerDB class, load_dotenv() runs at import time before the class is even instantiated, so os.getenv() works anywhere it's called


class JobTrackerDB:
    def __init__(self):

        self.config = {
            'host': os.getenv("DB_HOST"),
            'user': os.getenv("DB_USER"),
            'password': os.getenv("DB_PASSWORD"),
            'database': os.getenv("DB_NAME")
        }
        self.pool = None

    def connect(self):
        try:
            self.pool = pooling.MySQLConnectionPool(pool_name="tracker_pool", pool_size=5, **self.config)
            return True
        except Error as e:
            print(f'Connection error: {e}')
            return False

    def _get_connection(self):
        return self.pool.get_connection()

    @contextmanager
    def _cursor(self, dictionary=False):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=dictionary)
        try:
            yield conn, cursor
        finally:
            cursor.close()
            conn.close()

    def disconnect(self):
        pass  # pool manages its own connections



    # ============================================================================================
    # Job Queries
    # ============================================================================================

    def get_all_jobs(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT j.job_id, j.job_title, c.company_name, j.salary_min, j.salary_max, j.job_type, j.date_posted, j.is_active, j.posting_url, j.job_description, j.created_at, j.company_id, j.requirements
                FROM jobs AS j
                INNER JOIN companies AS c ON j.company_id = c.company_id
            ''')
            return cursor.fetchall()

    def get_job(self, id):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT j.job_id, j.job_title, c.company_name, j.salary_min, j.salary_max, j.job_type, j.date_posted, j.is_active, j.posting_url, j.company_id, j.job_description, j.created_at, j.requirements
                FROM jobs AS j
                INNER JOIN companies AS c ON j.company_id = c.company_id
                WHERE j.job_id = %s
            ''', (id,))
            return cursor.fetchone()

    def add_job(self, job):
        with self._cursor() as (conn, cursor):
            requirements = json.dumps(job['requirements']) if job.get('requirements') else None
            cursor.execute('''
                INSERT INTO jobs (company_id, job_title, job_description, salary_min, salary_max, job_type, posting_url, date_posted, is_active, requirements)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            ''', (job['company_id'], job['job_title'], job['job_description'], job['salary_min'], job['salary_max'], job['job_type'], job['posting_url'], job['date_posted'], job['is_active'], requirements))
            conn.commit()
            return cursor.lastrowid

    def edit_job(self, job, id):
        with self._cursor() as (conn, cursor):
            requirements = json.dumps(job['requirements']) if job.get('requirements') else None
            cursor.execute('''
                UPDATE jobs
                SET company_id = %s, job_title = %s, job_description = %s, salary_min = %s, salary_max = %s, job_type = %s, posting_url = %s, date_posted = %s, is_active = %s, requirements = %s
                WHERE job_id = %s
            ''', (job['company_id'], job['job_title'], job['job_description'], job['salary_min'], job['salary_max'], job['job_type'], job['posting_url'], job['date_posted'], job['is_active'], requirements, id))
            conn.commit()

    def delete_job(self, id):
        with self._cursor() as (conn, cursor):
            cursor.execute('SELECT * FROM jobs WHERE job_id = %s', (id,))
            to_delete = cursor.fetchall()
            if to_delete:
                print(f'About to delete: {to_delete}')
                cursor.execute('DELETE FROM jobs WHERE job_id = %s', (id,))
                conn.commit()
                print(f'Deleted {cursor.rowcount} job')
            else:
                print('Job not found.')



    # Extra Job Queries

    def get_jobs_for_matching(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT j.job_id, j.job_title, c.company_name, j.salary_min, j.salary_max, j.job_type, j.posting_url, j.is_active, j.requirements
                FROM jobs AS j
                INNER JOIN companies AS c ON j.company_id = c.company_id
                WHERE j.requirements IS NOT NULL
            ''')
            return cursor.fetchall()

    def get_jobs_by_salary(self, min_salary):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute("SELECT * FROM jobs WHERE salary_min >= %s", (min_salary,))
            return cursor.fetchall()

    def get_jobs_count(self):
        with self._cursor() as (_, cursor):
            cursor.execute("SELECT COUNT(*) FROM jobs")
            return cursor.fetchone()

    # ============================================================================================
    # Company Queries
    # ============================================================================================


    def get_companies_for_select(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('SELECT company_id, company_name FROM companies ORDER BY company_name')
            return cursor.fetchall()

    def get_all_companies(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT c.company_id, c.company_name, c.industry, c.website, c.city, c.state,
                (SELECT COUNT(*) FROM jobs where jobs.company_id = c.company_id) AS job_count,
                (SELECT COUNT(*) FROM contacts where contacts.company_id = c.company_id) AS contact_count,
                c.notes, c.created_at
                FROM companies AS c
            ''')
            return cursor.fetchall()

    def get_company(self, id):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT c.company_id, c.company_name, c.industry, c.website, c.city, c.state,
                (SELECT COUNT(*) FROM jobs where jobs.company_id = c.company_id) AS job_count,
                (SELECT COUNT(*) FROM contacts where contacts.company_id = c.company_id) AS contact_count,
                c.created_at, c.notes
                FROM companies AS c
                WHERE c.company_id = %s
            ''', (id,))
            return cursor.fetchone()

    def add_company(self, company):
        with self._cursor() as (conn, cursor):
            cursor.execute('''
                INSERT INTO companies (company_name, industry, website, city, state, notes)
                    VALUES (%s, %s, %s, %s, %s, %s);
            ''', (company['company_name'], company['industry'], company['website'], company['city'], company['state'], company['notes']))
            conn.commit()
            return cursor.lastrowid

    def edit_company(self, company, id):
        with self._cursor() as (conn, cursor):
            cursor.execute('''
                UPDATE companies
                SET company_name = %s, industry = %s, website = %s, city = %s, state = %s, notes = %s
                WHERE company_id = %s
            ''', (company['company_name'], company['industry'], company['website'], company['city'], company['state'], company['notes'], id))
            conn.commit()

    def delete_company(self, id):
        with self._cursor(dictionary=True) as (conn, cursor):
            cursor.execute('SELECT COUNT(*) AS count FROM jobs WHERE company_id = %s', (id,))
            job_count = cursor.fetchone()['count']

            cursor.execute('SELECT COUNT(*) AS count FROM contacts WHERE company_id = %s', (id,))
            contact_count = cursor.fetchone()['count']

            if job_count > 0 or contact_count > 0:
                parts = []
                if job_count > 0:
                    parts.append(f"{job_count} job{'s' if job_count != 1 else ''}")
                if contact_count > 0:
                    parts.append(f"{contact_count} contact{'s' if contact_count != 1 else ''}")
                return {'success': False, 'message': f"Cannot delete: this company has {' and '.join(parts)} linked to it."}

            cursor.execute('DELETE FROM companies WHERE company_id = %s', (id,))
            conn.commit()
            return {'success': True}



    # Extra Query

    def get_companies_count(self):
        with self._cursor() as (_, cursor):
            cursor.execute("SELECT COUNT(*) FROM companies")
            return cursor.fetchone()



    # ============================================================================================
    # Application Queries
    # ============================================================================================


    def get_all_applications(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT a.application_id, a.job_id, j.job_title, c.company_name, a.application_date, a.status, a.resume_version, a.cover_letter_sent, a.response_date, a.interview_date, a.notes, a.created_at, a.interview_data
                FROM applications AS a
                INNER JOIN jobs AS j ON a.job_id = j.job_id
                LEFT JOIN companies AS c ON j.company_id = c.company_id
            ''')
            return cursor.fetchall()

    def get_application(self, id):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT a.application_id, a.job_id, j.job_title, c.company_name, a.application_date, a.status, a.resume_version, a.cover_letter_sent, a.response_date, a.interview_date, a.notes, a.created_at, a.interview_data
                FROM applications AS a
                INNER JOIN jobs AS j ON a.job_id = j.job_id
                LEFT JOIN companies AS c ON j.company_id = c.company_id
                WHERE a.application_id = %s
            ''', (id,))
            return cursor.fetchone()

    def add_application(self, application):
        with self._cursor() as (conn, cursor):
            interview_data = json.dumps(application['interview_data']) if application.get('interview_data') else None
            cursor.execute('''
                INSERT INTO applications (job_id, application_date, status, resume_version, cover_letter_sent, response_date, interview_date, notes, interview_data)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
            ''', (application['job_id'], application['application_date'], application['status'], application['resume_version'], application['cover_letter_sent'], application['response_date'], application['interview_date'], application['notes'], interview_data))
            conn.commit()
            return cursor.lastrowid

    def edit_application(self, application, id):
        with self._cursor() as (conn, cursor):
            interview_data = json.dumps(application['interview_data']) if application.get('interview_data') else None
            cursor.execute('''
                UPDATE applications
                SET job_id = %s, application_date = %s, status = %s, resume_version = %s, cover_letter_sent = %s, response_date = %s, interview_date = %s, notes = %s, interview_data = %s
                WHERE application_id = %s
            ''', (application['job_id'], application['application_date'], application['status'], application['resume_version'], application['cover_letter_sent'], application['response_date'], application['interview_date'], application['notes'], interview_data, id))
            conn.commit()

    def delete_application(self, id):
        with self._cursor() as (conn, cursor):
            cursor.execute('SELECT * FROM applications WHERE application_id = %s', (id,))
            to_delete = cursor.fetchall()
            if to_delete:
                print(f'About to delete: {to_delete}')
                cursor.execute('DELETE FROM applications WHERE application_id = %s', (id,))
                conn.commit()
                print(f'Deleted {cursor.rowcount} application(s)')
            else:
                print('Application not found.')


    # Dashboard Queries

    def get_dashboard_stats(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT
                    COUNT(*) AS total_applications,
                    SUM(CASE WHEN status NOT IN ('Rejected', 'Offer') THEN 1 ELSE 0 END) AS active_applications,
                    (SELECT COUNT(*) FROM companies) AS companies_count,
                    ROUND(SUM(CASE WHEN response_date IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*) * 100) AS response_rate,
                    ROUND(SUM(CASE WHEN cover_letter_sent = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100) AS cover_letter_rate,
                    SUM(CASE WHEN status = 'Offer' THEN 1 ELSE 0 END) AS offers_received
                FROM applications
            ''')
            return cursor.fetchone()

    def get_pipeline_stats(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT status, COUNT(*) AS count
                FROM applications
                GROUP BY status
            ''')
            return cursor.fetchall()

    def get_recent_activity(self, limit=5):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT j.job_title, c.company_name, a.application_date, a.status
                FROM applications AS a
                INNER JOIN jobs AS j ON a.job_id = j.job_id
                LEFT JOIN companies AS c ON j.company_id = c.company_id
                ORDER BY a.application_date DESC, a.created_at DESC
                LIMIT %s
            ''', (limit,))
            return cursor.fetchall()

    def get_upcoming_interviews(self, limit=5):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT j.job_title, c.company_name, a.interview_date
                FROM applications AS a
                INNER JOIN jobs AS j ON a.job_id = j.job_id
                LEFT JOIN companies AS c ON j.company_id = c.company_id
                WHERE a.interview_date >= NOW()
                ORDER BY a.interview_date ASC
                LIMIT %s
            ''', (limit,))
            return cursor.fetchall()


    # Extra Queries
    def get_last_application(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT * FROM applications
                ORDER BY application_id DESC
                LIMIT 1;
            ''')
            return cursor.fetchone()

    def get_applications_count(self):
        with self._cursor() as (_, cursor):
            cursor.execute("SELECT COUNT(*) FROM applications")
            return cursor.fetchone()



    # ============================================================================================
    # Contact Queries
    # ============================================================================================

    def get_all_contacts(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT ct.contact_id, cm.company_id, ct.first_name, ct.last_name, cm.company_name, ct.job_title, ct.email, ct.phone, ct.linkedin_url, ct.notes, ct.created_at
                FROM contacts AS ct
                INNER JOIN companies AS cm ON ct.company_id = cm.company_id
            ''')
            return cursor.fetchall()

    def get_contact(self, id):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT ct.contact_id, ct.company_id, ct.first_name, ct.last_name, cm.company_name, ct.job_title, ct.email, ct.phone, ct.linkedin_url, ct.notes, ct.created_at
                FROM contacts AS ct
                INNER JOIN companies AS cm ON ct.company_id = cm.company_id
                WHERE ct.contact_id = %s
            ''', (id,))
            return cursor.fetchone()

    def add_contact(self, contact):
        with self._cursor() as (conn, cursor):
            cursor.execute('''
                INSERT INTO contacts (company_id, first_name, last_name, email, phone, job_title, linkedin_url, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
            ''', (contact['company_id'], contact['first_name'], contact['last_name'], contact['email'], contact['phone'], contact['job_title'], contact['linkedin_url'], contact['notes']))
            conn.commit()
            return cursor.lastrowid

    def edit_contact(self, contact, id):
        with self._cursor() as (conn, cursor):
            cursor.execute('''
                UPDATE contacts
                SET company_id = %s, first_name = %s, last_name = %s, email = %s, phone = %s, job_title = %s, linkedin_url = %s, notes = %s
                WHERE contact_id = %s
            ''', (contact['company_id'], contact['first_name'], contact['last_name'], contact['email'], contact['phone'], contact['job_title'], contact['linkedin_url'], contact['notes'], id))
            conn.commit()

    def delete_contact(self, id):
        with self._cursor() as (conn, cursor):
            cursor.execute('SELECT * FROM contacts WHERE contact_id = %s', (id,))
            to_delete = cursor.fetchall()
            if to_delete:
                print(f'About to delete: {to_delete}')
                cursor.execute('DELETE FROM contacts WHERE contact_id = %s', (id,))
                conn.commit()
                print(f'Deleted {cursor.rowcount} contact(s)')
            else:
                print('Contact not found.')


    # Extra Queries
    def get_last_contact(self):
        with self._cursor(dictionary=True) as (_, cursor):
            cursor.execute('''
                SELECT * FROM contacts
                ORDER BY contact_id DESC
                LIMIT 1;
            ''')
            return cursor.fetchone()

    def get_contacts_count(self):
        with self._cursor() as (_, cursor):
            cursor.execute("SELECT COUNT(*) FROM contacts")
            return cursor.fetchone()
