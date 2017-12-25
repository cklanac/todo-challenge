'use strict';

const express = require('express');
const morgan = require('morgan');

const cors = require('cors');
const util = require('util');

const { PORT } = require('./config');
const todoRouter = require('./routers/todo.router');

const app = express();

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

app.use(express.static('public')); // Serve static files
app.use(cors()); // CORS headers
app.use(express.json()); // Parse JSON body

app.use('/v1/todos', todoRouter);

// 404 catch-all
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
// Only show stacktrace if 'env' is 'development'
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: (process.env.NODE_ENV === 'development') ? err : {}
  });
});

// Promisify .listen() and .close()
app.listenAsync = function (port) {
  return new Promise((resolve, reject) => {
    this.listen(port, function () {
      this.closeAsync = util.promisify(this.close);
      resolve(this);
    }).on('error', reject);
  });
};

/** NOTE:
 * if (require.main === module) ...
 * Block only executes if `server.js` is executed using `npm start` or `node server.js`
 * Block does not execute when required like `require('./server');`
 * Prevents error: "Trying to open unclosed connection." when running mocha tests
 */
if (require.main === module) {
  app.listenAsync(PORT)
    .then(server => {
      console.info(`Server listening on port ${server.address().port}`);
    })
    .catch(console.error);
}

module.exports = app; // Export for testing
