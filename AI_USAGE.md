# AI Usage Documentation

## Tools Used
- Claude for debugging, code review, SQL queries, HTML, CSS, JavaScript logic, and Flask routes

## Key Prompts
1. "When the user clicks on a table row, views the details, and clicks on the "Edit" button, each field should turn into an input, exactly like how the modal-overlay is when you click "Add Job", except that the "created-at" attribute still shows."

2. "Implement the deleteRow() function. This function deletes the row when you click the delete confirmation button in jobs.html."

3. "Do not code anything, but provide me samples if necessary. If I wanted to query data from a database and place it into a template, how could I successfully loop through table rows to do this? Is it possible to put in my table.js file a template so that it can handle real data, or would I just have to create for loops in the templates?"

4. "How do I implement the addRow() function? When the user submits the form data, it should add the new data to the table."

5. "When the user edits a job, make it so that the table successfully updates the edited row."

6. ""If a user tries to delete a company but that company has a job or contact that references it, I get a foreign key constraint error. Address this error by ensuring a company cannot be deleted if it has jobs or contacts."

7. "Dashboard has the following statistics: Total Applications, Active Applications, Number of Companies, Response Rate (via Applications), Cover Letter Rate, and Offers Received (if Applications Status = Offer). Implement any database queries needed, URL endpoints, updates to the dashboard template, and any other files as needed. Dashboard.js holds all of the rendered dashboard data. If possible, let that JS file alone fetch the data and display it."

8. "The MySQL pool exhausted after I tried submitting multiple POST requests that didn't have all data entered yet. How can I fix this? Should I add more connections?"

9. "Job Match is a page that needs to be implemented. It allows users to enter in skills, then queries through each job's 'requirements' JSON data in the database, and matches the user-entered skills with the 'required_skills' that the user enters. 

Create HTML for the Job Match."

## What Worked Well
- AI helped both make and debug CSS and HTML.
- AI greatly helped display the Dashboard statistics
- AI greatly helped creating the HTML, CSS, and JavaScript logic of the Job Match feature
- AI helped greatly with the logic behind manipulating the DOM--adding, editing, updating table rows to show newly added or edited data, remove deleted data from the table.
- AI was extremely helpful at debugging errors, particularly concerning the DOM, but also the database, including a pool exhaustion error and errors involving input validation.

## What I Modified
- Wrote all HTML and CSS except for the Job Match feature
- Extended subheader.js (originally scoped to Jobs) to handle all pages, including the filter(Boolean) fix for Flask's trailing slash behavior
- Applied the Jobs table/DOM pattern to Companies by adapting the blueprint routes and serializer

## Lessons Learned

- If you understand exactly how to design your system, asking AI the right questions becomes more easy. It's extremely important that you try to understand what your application wants and why it wants it before you ask AI to actually write any code. 

- When you understand what your application wants, understanding the code AI writes becomes a lot easier. If you don't understand the code it wrote, you can always ask it to explain line by line what the code does, why it was added, and (in some scenarios) tradeoffs between using one option over another (ex. server-side pagination or client-side pagination)