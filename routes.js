const handlers = require('./handlers');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: handlers.sayHello
  }
];

module.exports = routes;