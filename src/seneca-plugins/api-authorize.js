'use strict';

const Promise = require( 'bluebird' );
const _ = require( 'lodash' );
const jwt = require( 'jsonwebtoken' );
const roles = require( '../roles' );

module.exports = function () {

  // Promisify the seneca .act() method
  const act = Promise.promisify( this.act, { context: this });

  // Get user
  this.add( 'role:api,path:authorize,cmd:userCan', function( msg, done ) {

    if ( ! msg.context ) {

      msg.context = {};

    }

    if ( _.isEmpty( msg.consumerJWT ) ) {

      done( null, { can: false });

      return;

    }

    jwt.verify( msg.consumerJWT, process.env.JWT_SECRET, ( err, decoded ) => {

      if ( err || _.isEmpty( decoded.role ) ) {

        done( null, { can: false });

        return;

      }

      const role = decoded.role;

      if ( _.isEmpty( roles[ role ] ) ) {

        done( null, { can: false });

        return;

      }

      if (
        ( 'users:edit' === msg.what && msg.context.id && decoded.id === msg.context.id ) ||
        ( 'attachments:edit' === msg.what && msg.context.owner && decoded.id === msg.context.owner )
      ) {

        msg.what = 'self:edit';

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
