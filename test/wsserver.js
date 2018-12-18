// const Urlparse = require('url').parse;
const store = require('./testDataStore.js');

function isLocal(origin) {
  return (origin.match(/^https?:\/\/localhost/) != null);
}

module.exports = function(server) {
  server.on('request', (req)=>{
    console.log(`karma-websocket-server: Connection to ${req.resource} from ${req.origin}...`);
    let route = req.resourceURL.pathname.split('/').slice(1).shift();
    if (isLocal(req.origin) && (route === 'gtest')) {
      let connection = req.accept(null, req.origin);
      let id = req.resourceURL.pathname.split('/').pop();
      connection.on('message', function(message) {
        if (message.type !== 'binary') {
          // need to get body data from message
          let data;
          try {
            data = JSON.parse(message.utf8Data);
          } catch(error) {
            throw error;
          }
          if (data) {
            connection.sendUTF(store.serialize(store.setData(id, data)));
          }
        }
      });
      connection.sendUTF(store.serialize(store.getData(id)));
    } else {
      req.reject();
    }
  });
};
