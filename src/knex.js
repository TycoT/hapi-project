export default require( 'knex' )( {

  client: 'mysql',
  connection: {

    host: 'localhost',

    user: 'birdbase',
    password: 'password',

    database: 'birdbase',
    charset: 'utf8',

  }

} );