/*

#Todo API w/ Database using model validation and for testing on Postman.
#Can be deployed for production with Heroku.

## Has Search and Filtering capabilities for a Todo item.

### Objective of API:

####1. POST/GET/DELETE/UPDATE a new Todo item.
####2. Has input validation so only a description/completed input can be made
####3. Delete a Todo item by :id
####4. Filter a Todo Completed item with the GET /todos?completed=true or false input.
####5. Search by a Todo Description with the (eg:) GET /todos?q=work or with GET /todos?q=work&completed=false.

##### Getting Started: First run: npm install for all node modules needed.

##### The npm installs for Heroku (included, just run npm install once)
    1. heroku addons - heroku-postgressql
    2. npm install pg
    3. npm install pg-hstore

*/

var express = require('express');
var bodyParser = require('body-parser');
var underScore = require('underscore');
var db = require('./db.js');


var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());

// GET /todos and/or GET/todos?completed=true and/or by GET/todos?q=work
app.get('/todos', function(req, res) {
    // Filter for a completed Todo item
    var query = req.query;
    var where = {};

    if(query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    }else if(query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if(query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function(todos) {
        res.json(todos);
    }, function(e) {
        res.status(500).send();
    });

});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo) {
        if(!!todo) {
            res.json(todo.toJSON());
        }else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send();
    });
});


// add todos through the Api
// POST REQUEST /todos - api route
app.post('/todos', function(req, res) {
    var body = underScore.pick(req.body, 'description', 'completed');

    // Call create on db.todo
    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
});

// DELETE /todos/:id
// Delete a todo by its id
app.delete('/todos/:id', function(req,res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        // Find the todo item
        where: {
            id: todoId
        }
    }).then(function(rowsDeleted) {
        if(rowsDeleted === 0) {
            res.status(404).json({
                // Error:
                error: 'No Todo item with that ID found!'
            });
        }else {
            // Success: found a todo item to delete
            res.status(204).send();
        }

    }, function() {
        res.status(500).send();
    });
});

// PUT /todos/:id
// Update/Create a Todo item
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = underScore.pick(req.body, 'description', 'completed');
    // store the values of the todos in the todos array
    var attributes = {};


    // check if 'completed' attribute exist and if so validate it
    if(body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    // check if 'description' attribute exist and if so validate it
    if(body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findById(todoId).then(function(todo) {
        // If findById goes well
        if(todo) {
            // Find id with success
            todo.update(attributes).then(function(todo) {
                // Success for the todo Update
                res.json(todo.toJSON());
                console.log('Succes: Your Todo item has been updated!');
            }, function(e) {
                //If todo update fails
                res.status(400).json(e);
            });

        }else {
            res.status(404).send();
            console.log('Todo item to be updated, not found!');
        }
    }, function() {
        // If findById fails/ goes wrong
        res.status(500).send();
    });

});

// Sync the db
db.sequelize.sync().then(function() {
    // DB & Server listening on port 3000
    app.listen(PORT, function() {
        console.log('DB Synced and Server Running on http://localhost' + ':' + PORT);
    });
});
