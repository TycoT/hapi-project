import Hapi from 'hapi';
import Knex from './knex';

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
  } );
} );

server.route({

  method: 'GET',
  path: '/hello',
  handler: ( request, reply ) => {
    reply( 'Hello World!' );
  }

});

server.route( {

  path: '/birds',
  method: 'GET',
  handler: ( request, reply ) => {
    // In general, the Knex operation is like Knex('TABLE_NAME').where(...).chainable(...).then(...)
    const getOperation = Knex( 'birds' ).where( {

      isPublic: true

    } ).select( 'name', 'species', 'picture_url' ).then( ( results ) => {

      if( !results || results.length === 0 ) {
        reply( {
          error: true,
          errMessage: 'no public bird found',
        } );
      }

      reply( {
        dataCount: results.length,
        data: results,
      } );

    } ).catch( ( err ) => {
      reply( 'server-side error' );
    } );
  }

} );


server.start(err => {

  if (err) {

    // Fancy error handling here
    console.error( 'Error was handled!' );
    console.error( err );

  }

  console.log( `Server started at ${ server.info.uri }` );

});