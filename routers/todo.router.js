'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/todos');
const simDB = require('../db/simdb');

// Using promises
let todos;
simDB.initialize(data).then(data => todos = data);

/**
 * ADD ENDPOINTS HERE
 */
router.get('/', (req, res, next) => {

  // Using promises
  todos.find({})
    .then(list => res.json(list))
    .catch(next); // error handler

});

router.post('/', (req, res, next) => {
  const { title } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err); // error handler
  }
  const newItem = { title };
  newItem.completed = false;
  
  // Using promises
  todos.create(newItem)
    .then(item => res.location(`/items/${item.id}`).status(201).json(item))
    .catch(next); // error handler

});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  // Using promises
  todos.findById(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next(); // 404 handler
      }
    })
    .catch(next); // error handler

});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const replaceItem = {};
  const updateableFields = ['title', 'completed'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      replaceItem[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!replaceItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err); // error handler
  }

  // Using promises
  todos.findByIdAndUpdate(id, replaceItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next(); // 404 handler
      }
    })
    .catch(next); // error handler

});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  // Using promises
  todos.findByIdAndRemove(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next(); // 404 handler
      }
    })
    .catch(next); // error handler
    
});


module.exports = router;
