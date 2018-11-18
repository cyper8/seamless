"use strict";
exports.__esModule = true;
function ComplementUrl(url) {
    var proto;
    var host;
    var p = url.split("/");
    if (p[0].search(/:$/) == -1) {
        proto = window.location.protocol + "//";
    }
    else {
        proto = p[0] + "//";
        p = p.slice(2);
    }
    if ((p.length == 1) || (p[0].search(/^[a-z][a-z0-9]*\./i) == -1)) {
        host = window.location.host;
        if (p[0] == "")
            p.shift();
    }
    else {
        host = p.shift();
    }
    return proto + host + "/" + p.join("/");
}
exports.ComplementUrl = ComplementUrl;
