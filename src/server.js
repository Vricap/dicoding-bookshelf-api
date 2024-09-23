const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const srv = Hapi.server({
    port: process.env.PORT,
    host: 'localhost'
  });
  srv.route(routes);

  await srv.start();
  console.log(`Server berjalan di ${srv.info.uri}`);
};

init();
