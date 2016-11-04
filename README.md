# seamless

## Seamlessly (and asyncronously) work with remote objects

Module creates singleton at `window.Seamless`, which has `connect` method,
to be called with `url` and `callback` arguments. When connection is created
the `callback` is called with following argument (which also being saved
to `Seamless.[uri_hash]`):

    {
        route: _url_hash_,          // endpoint url processed with md5
        hash: _data_hash_,          // JSON string which represents data object,
                                    // hashed with md5
                                    
        data: _object_of_data_,     // localStorage buffered custom getter
                                    // setter sends data to a server, Storage
                                    // is to be updated upon response
                                    
        connection: {
            disconnect: _function_  // disconnect and destroy networking subsystem
            reconnect: _function_   // disconnect and create connection again
    }