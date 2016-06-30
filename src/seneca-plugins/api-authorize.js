'use strict';

const Promise = require( 'bluebird' );
const _ = require( 'lodash' );
const jwt = require( 'jsonwebtoken' );
const roles = require( '../roles' );

module.exports = function () {

  // Promisify the seneca .act() method
  let act = Promise.promisify( this.act, { context: this });

  // Get user
  this.add( 'role:api,path:authorize,cmd:userCan', function( msg, done ) {

    if ( _.isEmpty( msg.consumerJWT ) ) {

      done( null, { can: false });

      return;

    }

    jwt.verify( msg.consumerJWT, process.env.JWT_SECRET, ( err, decoded ) => {

      if ( err || _.isEmpty( decoded.role ) ) {

        done( null, { can: false });

        return;

      }

      let role = decoded.role;

      if ( _.isEmpty( roles[ role ] ) ) {

        done( null, { can: false });

        return;

      }

      if ( -1 === roles[ role ].indexOf( msg.what ) ) {

        done( null, { can: false });

        return;

      }

      done( null, { can: true });

    });

  });

  return {
    name: 'api-authorize'
  };

};
