const { Transform } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');
class FormateadorCSV extends Transform {
  constructor() { super(); this.decoder = new StringDecoder('utf8'); }
  _transform(chunk, encoding, callback) {
    callback(null, this.decoder.write(chunk).replace(/,/g, '|'));
  }
  _flush(callback) { callback(null, this.decoder.end().replace(/,/g, '|')); }
}
module.exports = FormateadorCSV;
