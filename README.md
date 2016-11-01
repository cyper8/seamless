# seamless

## Seamlessly (and asyncronously) work with remote objects

Module returns a Promise, which resolves with object:

    {
        data: _object_of_data_,
        post: _function_to_post_data_in_case_of_changes_
    }