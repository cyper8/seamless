var fs = require("fs");

if (process.argv[2]) {
  var serverpath = `./${process.argv[2]}/server.js`;
} else {
  return console.log("possible options after \"npm run example -- \": ", fs.readdirSync("./examples").filter(function(p) {
    return p.search(/\./g) == -1
  }));
}
module.exports = require(serverpath);