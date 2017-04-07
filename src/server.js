import Hapi from 'hapi';
import Knex from './knex';
import routes from './routes';

const server = new Hapi.Server();

server.connection( {
  port: 8080
});

// .register(...) registers a module within the instance of the API. The callback is then used to tell that the loaded module will be used as an authentication strategy. 
server.register( require( 'hapi-auth-jwt' ), ( err ) => {
  server.auth.strategy( 'token', 'jwt', {

    key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',

    verifyOptions: {
      algorithms: [ 'HS256' ],
    }
  });

  server.route({
    method: 'GET',
    path: '/hello',
    handler: ( request, reply ) => {
      reply( 'Hello World!' );
    }
  });
});

routes.forEach( ( route ) => {
  console.log( `attaching ${route.method} ${ route.path }` );
  server.route( route );
});


server.start(err => {

  if (err) {

    // Fancy error handling here
    console.error( 'Error was handled!' );
    console.error( err );

  }

  console.log( `Server started at ${ server.info.uri }` );

});