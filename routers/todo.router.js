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


module.exports = router;
