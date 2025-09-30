const { TextEncoder, TextDecoder } = require('util');

module.exports = async () => {
  process.env.TZ = 'UTC';
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
};