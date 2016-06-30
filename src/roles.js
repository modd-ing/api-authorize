'use strict';

const _ = require( 'lodash' );

const roles = {};

// Basic
roles.basic = [];

// Administrator
roles.administrator = [
  'users:edit',
  'users:delete',
  'roles:assign'
];

roles.administrator = _.uniq( _.concat(
  roles.basic,
  roles.administrator
));

module.exports = roles;
