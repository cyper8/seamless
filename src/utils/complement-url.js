export function ComplementUrl(url) {
    let proto;
    let host;
    let validUrl;
    let p = url.split("/");
    if (p[0].search(/:$/) !== -1) { // schema in 0 element
        proto = p.shift();
    }
    else { // no schema in 0 element
        proto = window.location.protocol;
        if (p[0] === '')
            p.shift();
    }
    if (p[0] === '') { //
        p.shift();
        host = p.shift();
    }
    if (!host || (host === '')) {
        host = window.location.host;
    }
    validUrl = encodeURI(`${proto}//${host}/${p.join('/')}`);
    if (new URL(validUrl)) {
        return validUrl;
    }
}
//# sourceMappingURL=complement-url.js.map