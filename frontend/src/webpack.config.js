
const path = require('path');

module.exports = {
  // Other webpack configuration options...
  resolve: {
    fallback: {
      "zlib": false
    }
  }
};