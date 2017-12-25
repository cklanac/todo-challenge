ToDo List Challenge
===================

This application is based on [TodoMVC](http://todomvc.com/) project and inspired by [Todo-Backend](https://www.todobackend.com/). The original TodoMVC project is a frontend project which provides a baseline for comparing frontend frameworks. And the Todo-Backend is a project to demonstrate and compare backend frameworks by developing server-side solutions to drive the TodoMVC. As a well-rounded developer, you should familiarize yourself with these projects.

### Challenge #1

As a professional developer you will not ordinarily be given step-by-step instructions so interpreting errors and debugging is an critical skill to be successful. This challenge is intended to give you experience reading and understanding the output of failing tests and provide practice programming the solutions to make them pass. 

To complete this challenge you should run the Mocha/Chai tests and use the output as a guide for implementing the endpoints in the `routers/todo.router.js` file. Note, several of the tests will fail so remember to use Mocha's `.only` and `.skip` [exclusivity features](https://mochajs.org/#exclusive-tests) to help you focus on individual tests.

The `simDB` supports both callbacks and promises. Initially, you should use the callback style.

```js
router.get('/', (req, res, next) => {
  todos.find({}, (err, list) => {
    if (err) {
      next(); // trigger error handler
    }
    res.json(list);
  });
});
```

Along the way you can should view the GUI by navigating to `http://localhost:8080`. Check the code and inspect Chrome Dev Tools console for errors, they may help inform what you need to build.

Once all the endpoints have been implemented properly and the tests all pass then GUI should with no errors.

### Challenge #2

Convert the `simDB` calls to promises. If provided a callback, the `simDB` will invode it, if no callback is provided then it will return a promise. Below is an example of using `simDB` with promises.

```js
router.get('/', (req, res, next) => {
  todos.find({})
    .then(list => res.json(list))
    .catch(next); // error handler
});
```

As you work thru the challenge, notice how the tests continually confirm if the application is working correctly.

### Bonus Challenge

Convert the `$.AJAX` calls in the GUI to use the Fetch API. Below is the `read()` function as refresher.

```js
read: function() {
  return fetch(this.baseUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  }).then(res => res.json());
}  
```

### Solutions

Check the git branches for solutions.
