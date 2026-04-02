# Job Application Tracker

A web application to help track job applications during the job search process.

## Features

- Track companies and job listings
- Record application submissions
- Manage interview schedules
- Store contact information
- Job match scoring

## Technologies

- **Backend:** Python 3 with Flask
- **Database:** MySQL 8
- **Frontend:** HTML, CSS, vanilla JavaScript

# Project Structure

```
job-app-tracker/
├── blueprints/         # Flask Blueprints
│   └── applications.py
│   └── companies.py
│   └── contacts.py
│   └── dashboard.py
│   └── job_match.py
│   └── jobs.py
├── static/             # Javascript, CSS
│   └── js/
│   └── styles/          
├── templates/          # HTML templates
│   └── base.html
│   └── dashboard.py
│   └── companies.html
│   └── jobs.html
│   └── applications.html
│   └── contacts.html
│   └── job_match.html
├── app.py              # Main Flask application
├── dashboard.py        # Database connection functions
├── schema.sql          # Database creation script
├── AI_USAGE.md         # GenAI documentation
└── requirements.txt    # Python dependencies

```

## Visual Demo

[Watch the demo](https://www.youtube.com/watch?v=yqkpz0sAmEE)



## Setup

### Prerequisites

- Python 3.10+
- MySQL 8.0+

### 1. Clone the repository

```bash
git clone https://github.com/kylegutierrez51/job-application-tracker.git
cd job-application-tracker
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it:

- **Windows:** `.venv\Scripts\activate`
- **Mac/Linux:** `source .venv/bin/activate`

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up the database

Create the database and import the schema in MySQL:

```sql
CREATE DATABASE job_tracker;
```

```bash
mysql -u root -p job_tracker < schema.sql
```

### 5. Configure environment variables

Create a `.env` file in the project root:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=job_tracker
```

### 6. Run the app

```bash
python app.py
```

The app will be available at [http://localhost:5000](http://localhost:5000).
