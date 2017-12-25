'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/todos');
const simDB = require('../db/simdb');

// Using callbacks
let todos;
simDB.initialize(data, (err, result) => {
  if (err) {
    return console.error(err);
  }
  todos = result;
});

/**
 * ADD ENDPOINTS HERE
 */
router.get('/', (req, res, next) => {
  // Using callbacks
  todos.find({}, (err, list) => {
    if (err) {
      return next(); // trigger error handler
    }
    res.json(list);
  });

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

  // Using callbacks
  todos.create(newItem, (err, item) => {
    if (err) {
      return next(); // trigger error handler
    }
    res.location(`/items/${item.id}`).status(201).json(item);
  });
  
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  // Using callbacks
  todos.findById(id, (err, item) => {
    if (err) {
      return next(); // trigger error handler
    }
    if (item) {
      res.json(item);
    } else {
      next(); // 404 handler
    }
  });

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

  // Using callbacks
  todos.findByIdAndUpdate(id, replaceItem, (err, item) => {
    if (err) {
      return next(); // trigger error handler
    }
    if (item) {
      res.json(item);
    } else {
      next(); // 404 handler
    }
  });

});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  // Using callbacks
  todos.findByIdAndRemove(id, (err, count) => {
    if (err) {
      return next(); // trigger error handler
    }
    if (count) {
      res.status(204).end();
    } else {
      next(); // 404 handler
    }
  });

});

module.exports = router;
