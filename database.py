from mysql.connector import Error, pooling
import os
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

    def disconnect(self):
        pass  # pool manages its own connections



    # ============================================================================================
    # Job Queries
    # ============================================================================================

    def get_all_jobs(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT j.job_id, j.job_title, c.company_name, j.salary_min, j.salary_max, j.job_type, j.date_posted, j.is_active, j.posting_url, j.job_description, j.created_at, j.company_id
            FROM jobs AS j
            INNER JOIN companies AS c ON j.company_id = c.company_id
        '''

        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result

    def get_job(self, id):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT j.job_id, j.job_title, c.company_name, j.salary_min, j.salary_max, j.job_type, j.date_posted, j.is_active, j.posting_url, j.company_id
            FROM jobs AS j
            INNER JOIN companies AS c ON j.company_id = c.company_id
            WHERE j.job_id = %s
        '''

        cursor.execute(query, (id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result

    def add_job(self, job):
        conn = self._get_connection()
        cursor = conn.cursor()

        query = '''
            INSERT INTO jobs (company_id, job_title, job_description, salary_min, salary_max, job_type, posting_url, date_posted, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
        '''

        values = (job['company_id'], job['job_title'], job['job_description'], job['salary_min'], job['salary_max'], job['job_type'], job['posting_url'], job['date_posted'], job['is_active'])

        cursor.execute(query, values)

        conn.commit()
        cursor.close()
        conn.close()


    def edit_job(self, job, id):
        conn = self._get_connection()
        cursor = conn.cursor()

        query = '''
            UPDATE jobs
            SET company_id = %s, job_title = %s, job_description = %s, salary_min = %s, salary_max = %s, job_type = %s, posting_url = %s, date_posted = %s, is_active = %s
            WHERE job_id = %s
        '''

        values = (job['company_id'], job['job_title'], job['job_description'], job['salary_min'], job['salary_max'], job['job_type'], job['posting_url'], job['date_posted'], job['is_active'], id)

        cursor.execute(query, values)

        conn.commit()
        cursor.close()
        conn.close()


    def delete_job(self, id):
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM jobs WHERE job_id = %s', (id,))
        to_delete = cursor.fetchall()

        if to_delete:
            print(f'About to delete: {to_delete}')

            delete_query = 'DELETE FROM jobs WHERE job_id = %s'
            cursor.execute(delete_query, (id,))
            conn.commit()
            print(f'Deleted {cursor.rowcount} job')
        else:
            print('Job not found.')

        cursor.close()
        conn.close()



    # Extra Job Queries

    def get_jobs_by_salary(self, min_salary):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM jobs WHERE salary_min >= %s"
        cursor.execute(query, (min_salary,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result

    def get_last_job(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        get_last_row = '''
            SELECT * FROM jobs
            ORDER BY job_id DESC
            LIMIT 1;
        '''

        cursor.execute(get_last_row)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result


    def get_jobs_count(self):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM jobs")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result

    # ============================================================================================
    # Company Queries
    # ============================================================================================


    def get_companies_for_select(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT company_id, company_name FROM companies ORDER BY company_name')
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result

    def get_all_companies(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT c.company_id, c.company_name, c.industry, c.website, c.city, c.state,
            (SELECT COUNT(*) FROM jobs where jobs.company_id = c.company_id) AS job_count,
            (SELECT COUNT(*) FROM contacts where contacts.company_id = c.company_id) AS contact_count,
            c.notes, c.created_at
            FROM companies AS c
        '''

        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result


    def get_company(self, id):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT c.company_name, c.industry, c.website, c.city, c.state,
            (SELECT COUNT(*) FROM jobs where jobs.company_id = c.company_id) AS job_count,
            (SELECT COUNT(*) FROM contacts where contacts.company_id = c.company_id) AS contact_count,
            c.created_at, c.notes
            FROM companies AS c
            WHERE c.company_id = %s
        '''

        cursor.execute(query, (id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result



    def add_company(self, company):
        conn = self._get_connection()
        cursor = conn.cursor()

        query = '''
            INSERT INTO companies (company_name, industry, website, city, state, notes)
                VALUES (%s, %s, %s, %s, %s, %s);
        '''

        values = (company['company_name'], company['industry'], company['website'], company['city'], company['state'], company['notes'])

        cursor.execute(query, values)

        conn.commit()
        cursor.close()
        conn.close()


    def edit_company(self, company, id):
        conn = self._get_connection()
        cursor = conn.cursor()

        query = '''
            UPDATE companies
            SET company_name = %s, industry = %s, website = %s, city = %s, state = %s, notes = %s
            WHERE company_id = %s
        '''

        values = (company['company_name'], company['industry'], company['website'], company['city'], company['state'], company['notes'], id)

        cursor.execute(query, values)

        conn.commit()
        cursor.close()
        conn.close()



    def delete_company(self, id):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('SELECT COUNT(*) AS count FROM jobs WHERE company_id = %s', (id,))
        job_count = cursor.fetchone()['count']

        cursor.execute('SELECT COUNT(*) AS count FROM contacts WHERE company_id = %s', (id,))
        contact_count = cursor.fetchone()['count']

        if job_count > 0 or contact_count > 0:
            cursor.close()
            conn.close()
            parts = []
            if job_count > 0:
                parts.append(f"{job_count} job{'s' if job_count != 1 else ''}")
            if contact_count > 0:
                parts.append(f"{contact_count} contact{'s' if contact_count != 1 else ''}")
            return {'success': False, 'message': f"Cannot delete: this company has {' and '.join(parts)} linked to it."}

        cursor.execute('DELETE FROM companies WHERE company_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {'success': True}



    # Extra Query

    def get_last_company(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        get_last_row = '''
            SELECT * FROM companies
            ORDER BY company_id DESC
            LIMIT 1;
        '''

        cursor.execute(get_last_row)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result

    def get_companies_count(self):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM companies")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result



    # ============================================================================================
    # Application Queries
    # ============================================================================================


    def get_all_applications(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT a.application_id, j.job_title, c.company_name, a.application_date, a.status, a.resume_version, a.cover_letter_sent, a.response_date, a.interview_date, a.notes, a.created_at
            FROM applications AS a
            INNER JOIN jobs AS j ON a.job_id = j.job_id
            LEFT JOIN companies AS c ON j.company_id = c.company_id
        '''

        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result


    def get_application(self, id):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT j.job_title, c.company_name, a.application_date, a.status, a.resume_version, a.cover_letter_sent, a.response_date, a.interview_date, a.notes
            FROM applications AS a
            INNER JOIN jobs AS j ON a.job_id = j.job_id
            LEFT JOIN companies AS c ON j.company_id = c.company_id
            WHERE a.application_id = %s
        '''

        cursor.execute(query, (id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result


    def add_application(self, application):
        conn = self._get_connection()
        cursor = conn.cursor()

        query = '''
            INSERT INTO applications (job_id, application_date, status, resume_version, cover_letter_sent, response_date, interview_date, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        '''

        values = (application['job_id'], application['application_date'], application['status'], application['resume_version'], application['cover_letter_sent'], application['response_date'], application['interview_date'], application['notes'])

        cursor.execute(query, values)

        conn.commit()
        cursor.close()
        conn.close()


    def edit_application(self, application, id):
        conn = self._get_connection()
        cursor = conn.cursor()

        query = '''
            UPDATE applications
            SET job_id = %s, application_date = %s, status = %s, resume_version = %s, cover_letter_sent = %s, response_date = %s, interview_date = %s, notes = %s
            WHERE application_id = %s
        '''

        values = (application['job_id'], application['application_date'], application['status'], application['resume_version'], application['cover_letter_sent'], application['response_date'], application['interview_date'], application['notes'], id)

        cursor.execute(query, values)

        conn.commit()
        cursor.close()
        conn.close()



    def delete_application(self, id):
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM applications WHERE application_id = %s', (id,))
        to_delete = cursor.fetchall()

        if to_delete:
            print(f'About to delete: {to_delete}')

            delete_query = 'DELETE FROM applications WHERE application_id = %s'
            cursor.execute(delete_query, (id,))
            conn.commit()
            print(f'Deleted {cursor.rowcount} application(s)')
        else:
            print('Application not found.')

        cursor.close()
        conn.close()


    # Extra Queries
    def get_last_application(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        get_last_row = '''
            SELECT * FROM applications
            ORDER BY application_id DESC
            LIMIT 1;
        '''

        cursor.execute(get_last_row)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result

    def get_applications_count(self):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM applications")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result



    # ============================================================================================
    # Contact Queries
    # ============================================================================================

    def get_all_contacts(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT ct.contact_id, cm.company_id, ct.first_name, ct.last_name, cm.company_name, ct.job_title, ct.email, ct.phone, ct.linkedin_url, ct.notes, ct.created_at
            FROM contacts AS ct
            INNER JOIN companies AS cm ON ct.company_id = cm.company_id
        '''

        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result


    def get_contact(self, id):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT ct.first_name, ct.last_name, cm.company_name, ct.job_title, ct.email, ct.phone, ct.linkedin_url, ct.notes
            FROM contacts AS ct
            INNER JOIN companies AS cm ON ct.company_id = cm.company_id
            WHERE ct.contact_id = %s
        '''

        cursor.execute(query, (id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result



    def add_contact(self, contact):
        conn = self._get_connection()
        cursor = conn.cursor()

        query = '''
            INSERT INTO contacts (company_id, first_name, last_name, email, phone, job_title, linkedin_url, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        '''

        values = (contact['company_id'], contact['first_name'], contact['last_name'], contact['email'], contact['phone'], contact['job_title'], contact['linkedin_url'], contact['notes'])

        cursor.execute(query, values)

        conn.commit()
        cursor.close()
        conn.close()


    def edit_contact(self, contact, id):
        conn = self._get_connection()
        cursor = conn.cursor()

        query = '''
            UPDATE contacts
            SET company_id = %s, first_name = %s, last_name = %s, email = %s, phone = %s, job_title = %s, linkedin_url = %s, notes = %s
            WHERE contact_id = %s
        '''

        values = (contact['company_id'], contact['first_name'], contact['last_name'], contact['email'], contact['phone'], contact['job_title'], contact['linkedin_url'], contact['notes'], id)

        cursor.execute(query, values)

        conn.commit()
        cursor.close()
        conn.close()



    def delete_contact(self, id):
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM contacts WHERE contact_id = %s', (id,))
        to_delete = cursor.fetchall()

        if to_delete:
            print(f'About to delete: {to_delete}')

            delete_query = 'DELETE FROM contacts WHERE contact_id = %s'
            cursor.execute(delete_query, (id,))
            conn.commit()
            print(f'Deleted {cursor.rowcount} contact(s)')
        else:
            print('Contact not found.')

        cursor.close()
        conn.close()


    # Extra Queries
    def get_last_contact(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)

        get_last_row = '''
            SELECT * FROM contacts
            ORDER BY contact_id DESC
            LIMIT 1;
        '''

        cursor.execute(get_last_row)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result

    def get_contacts_count(self):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM contacts")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result


if __name__ == '__main__':
    db = JobTrackerDB()
    if db.connect():
        print("\n===========================================")
        print("Get All Jobs")
        print("===========================================\n")
        jobs = db.get_all_jobs()
        print(f'Found {len(jobs)} jobs')
        for job in jobs:
            for key, val in job.items():
                print(f"{key}: {val}", end=",  ")
            print()

        print("\n===========================================")
        print("Add Job")
        print("===========================================\n")

        new_job = {
            'company_id': '1',
            'job_title': 'API Engineer',
            'job_description': None,
            'salary_min': 100000,
            'salary_max': 120000,
            'job_type': 'Full-Time',
            'posting_url': None,
            'date_posted': '2025-01-13',
            'is_active': 0
        }

        job = db.add_job(new_job)
        print(job)



        print("\n===========================================")
        print("Delete Job")
        print("===========================================\n")

        db.delete_job(21)




        print("\n===========================================")
        print("Edit Job")
        print("===========================================\n")

        job_id = 26

        print("Unedited Version: ")
        print(db.get_job(job_id), "\n")

        job = {
            'company_id': '2',
            'job_title': 'Full Stack Software Engineer',
            'job_description': 'This is a job description',
            'salary_min': None,
            'salary_max': None,
            'job_type': 'Part-Time',
            'posting_url': None,
            'date_posted': '2025-02-19',
            'is_active': 1
        }

        db.edit_job(job, job_id)

        print("Edited Version: ")
        edited_job = db.get_job(job_id)

        for key, val in edited_job.items():
            print(f"{key}: {val}", end=",  ")
        print()

        db.disconnect()
