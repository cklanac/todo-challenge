'use strict';

/**
 * NOTICE:
 * The tests below are not full fledged integration tests. They only assert the
 * API responses, they do not cross-check the data against the database.
 */

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');

chai.should();
chai.use(chaiHttp);
chai.use(chaiSpies);

/**
 * Hint: Use `.only` or `.skip` to focus on a specific `describe` or `it` block
 *  - https://mochajs.org/#exclusive-tests
 */

describe('sanity check and setup', function () {

  it('true should be true', function () {
    true.should.be.true;
  });

  it('2 + 2 should equal 4', function () {
    (2 + 2).should.equal(4);
  });

  it('NODE_ENV should be "test"', function () {
    (process.env.NODE_ENV).should.equal('test');
  });

});

describe('Todo API:', () => {
  let server;

  before(function () {
    return app.listenAsync()
      .then(instance => server = instance); // set server instance
  });

  after(function () {
    return server.closeAsync();
  });

  describe('Basic Express setup', function () {

    describe('Express static', function () {

      it('GET request "/" should return the index page', function () {
        return chai.request(server)
          .get('/')
          .then(function (res) {
            res.should.exist;
            res.should.have.status(200);
            res.should.be.html;
          });
      });

    });

    describe('404 handler', function () {

      it('should respond with 404 when given a bad path', function () {
        const spy = chai.spy();
        return chai.request(server)
          .get('/bad/path')
          .then(spy)
          .then(() => {
            spy.should.not.have.been.called();
          })
          .catch(err => {
            err.response.should.have.status(404);
            err.response.body.message.should.equal('Not Found');
          });
      });

    });

  });

  describe('GET /v1/todos', function () {

    it('should respond to GET `/v1/todos` with an array of todos and status 200', function () {
      return chai.request(server)
        .get('/v1/todos')
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(5);
          res.body.forEach(function (item) {
            item.should.be.a('object');
            item.should.include.keys('id', 'title', 'completed');
          });
        });
    });

  });

  describe('GET /v1/todos/:id', function () {

    it('should return correct todo when given an id', function () {
      return chai.request(server)
        .get('/v1/todos/1002')
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.include.keys('id', 'title', 'completed');
          res.body.id.should.equal(1002);
          res.body.title.should.equal('Vacuum');
          res.body.completed.should.be.false;
        });
    });

    it('should respond with a 404 when given an invalid id', function () {
      const spy = chai.spy();
      return chai.request(server)
        .get('/v1/todos/9999')
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(404);
        });
    });

  });

  describe('POST /v1/todos', function () {

    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'Do Dishes'
      };
      return chai.request(server)
        .post('/v1/todos')
        .send(newItem)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'completed');
          res.body.id.should.equal(1005);
          res.body.title.should.equal(newItem.title);
          res.body.completed.should.equal(false);
          res.should.have.header('location');
        });
    });

    it('should respond ', function () {
      const badItem = {
        foobar: 'broken item'
      };
      const spy = chai.spy();
      return chai.request(server)
        .post('/v1/todos')
        .send(badItem)
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(400);
        });
    });

  });

  describe('PUT /v1/todos/:id', function () {

    it('should update item', function () {
      const item = {
        'title': 'Buy New Dishes'
      };
      return chai.request(server)
        .put('/v1/todos/1005')
        .send(item)
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'completed');
          res.body.id.should.equal(1005);
          res.body.title.should.equal(item.title);
        });
    });

    it('should respond', function () {
      const badItem = {
        foobar: 'broken item'
      };
      const spy = chai.spy();
      return chai.request(server)
        .put('/v1/todos/9999')
        .send(badItem)
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(400);
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      const item = {
        'title': 'Buy New Dishes'
      };
      const spy = chai.spy();
      return chai.request(server)
        .put('/v1/todos/9999')
        .send(item)
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(404);
        });
    });

  });

  describe('DELETE /v1/todos/:id', function () {

    it('should delete an item by id', function () {
      return chai.request(server)
        .delete('/v1/todos/1005')
        .then(function (res) {
          res.should.have.status(204);
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      const spy = chai.spy();
      return chai.request(server)
        .delete('/v1/todos/9999')
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(404);
        });
    });

  });

  describe('Setup CORS', function () {

    it('should respond with CORS headers', function () {
      return chai.request(server)
        .get('/v1/todos')
        .then(function (result) {
          result.should.have.header('Access-Control-Allow-Origin', '*');
        });
    });

  });

});

