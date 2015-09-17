#Todo API w/ Database using model validation and for testing on Postman.
#Can be deployed for production with Heroku.

## Has Search and Filtering capabilities for a Todo item.

### Objective of API:

####1. POST/GET/DELETE/UPDATE a new Todo item.
####2. Has input validation so only a description/completed input can be made
####3. Delete a Todo item by :id
####4. Filter a Todo Completed item with the GET /todos?completed=true or false input.
####5. Search by a Todo Description with the (eg:) GET /todos?q=work or with GET /todos?q=work&completed=false.

#####Getting Started: First run: 
    1. npm install (for all node modules needed)
    2. Then to run app from command line/terminal: node server.js
    3. Open up Postman and add new Todo items etc. 

#####The npm installs for Heroku (included, just run npm install once)
    1. heroku addons - heroku-postgressql
    2. npm install pg
    3. npm install pg-hstore
