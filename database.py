import mysql.connector
from mysql.connector import Error
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
        self.connection = None
    
    def connect(self):
        try:
            self.connection = mysql.connector.connect(**self.config)
            return True
        except Error as e:
            print(f'Connection error: {e}')
            return False
        
    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
    
    def get_all_companies(self):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM companies")
        return cursor.fetchall()

    def get_jobs_by_salary(self, min_salary):
        cursor = self.connection.cursor(dictionary=True)
        query = "SELECT * FROM jobs WHERE salary_min >= %s"
        cursor.execute(query, (min_salary,))
        return cursor.fetchall()
    
    def add_application(self, job_id, status="Applied"):
        cursor = self.connection.cursor()
        query = '''INSERT INTO applications (job_id, application_date, status)
            VALUES (%s, CURDATE(), %s)
        '''
        cursor.execute(query (job_id, status))
        self.connection.commit()
        return cursor.lastrowid
    
if __name__ == '__main__':
    db = JobTrackerDB()
    if db.connect():
        companies = db.get_all_companies()
        print(f'Found {len(companies)} companies')
        for c in companies:
            print(f" - {c['company_name']}")
        db.disconnect()