import Knex from './knex';
import jwt from 'jsonwebtoken';
import GUID from 'node-uuid';

// The idea here is simple: export an array which can be then iterated over and each route can be attached. 
const routes = [
  {
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
  },

  {
    path: '/birds',
    method: 'POST',
    handler: ( request, reply ) => {
      const { bird } = request.payload;
      const guid = GUID.v4();

      const insertOperation = Knex( 'birds' ).insert( {
        
        name: bird.name,
        species: bird.species,
        picture_url: bird.picture_url,
        guid,
      }).then( ( res ) => {
          reply({
            data: guid,
            message: 'successfully created bird'
          });
      }).catch( ( err ) => {
        reply( 'server-side error' );
      });
    }
  },

  {
    path: '/birds/{birdGuid}',
    method: 'PUT',
    config: {
      pre: [{
        method: ( request, reply ) => {
          const { birdGuid } = request.params;

          const getOperation = Knex( 'birds' ).where( {
            guid: birdGuid,
          } ).select( 'name' ).then( ( [ result ] ) => {
            console.log(result);
            if( !result ) {
              console.log("error!!!");
              reply( {
                error: true,
                errMessage: `the bird with id ${ birdGuid } was not found`
              } ).takeover();
            }
            return reply.continue();
          } )
        }
      }]
    },
    
    handler: ( request, reply ) => {
      const { birdGuid } = request.params
          , { bird }     = request.payload;

      const insertOperation = Knex( 'birds' ).where( {
        guid: birdGuid,
      } ).update( {
        name: bird.name,
        species: bird.species,
        picture_url: bird.picture_url,
        isPublic: bird.isPublic,
      } ).then( ( res ) => {
        reply( {
          message: 'successfully updated bird'
        } );
      } ).catch( ( err ) => {
        reply( 'server-side error' );
      } );
    }
  },

  {
    path:'/birds/{birdGuid}',
    method: 'delete',
    handler: ( request, reply ) => {
      const { birdGuid } = request.params;
      const deleteOperation = Knex( 'birds' ).where( {
        guid: birdGuid,
      } ).delete()
      .then( (res) => {
        reply ({
          message: 'successfuly deleted bird'
        });
      })
      .catch((err) => {
        reply('sever-side error');
      })
    }
  }


]
  
export default routes;