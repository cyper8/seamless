export function ComplementUrl(url) {
    let proto;
    let host;
    let p = url.split("/");
    if (p[0].search(/:$/) !== -1) { // schema in 0 element
        proto = p.shift();
    }
    else { // no schema in 0 element
        proto = window.location.protocol;
    }
    if (p[0] === '') { // schema followed by //
        p.shift();
        host = p.shift();
        if (host === '') {
            host = window.location.host;
        }
    }
    // all elements left are components of path
    return `${proto}//${host}/${p.join('/')}`;
}
//# sourceMappingURL=complement-url.js.map