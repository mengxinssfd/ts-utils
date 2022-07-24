'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/dom.cjs.prod.js');
} else {
  module.exports = require('./dist/dom.cjs.js');
}
