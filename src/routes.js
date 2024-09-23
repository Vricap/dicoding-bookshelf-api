const handlers = require('./handlers');

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: handlers.readAllBooks
  },
  {
  	method: 'GET',
  	path: '/books/{bookId}',
  	handler: handlers.readBook
  },
  {
  	method: 'POST',
  	path: '/books',
  	handler: handlers.writeBook
  },
  {
  	method: 'PUT',
  	path: '/books/{bookId}',
  	handler: handlers.updateBook
  },
  {
  	method: 'DELETE',
  	path: '/books/{bookId}',
  	handler: handlers.deleteBook
  }
];

module.exports = routes;
