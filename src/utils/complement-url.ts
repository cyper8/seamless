export interface URLString extends String {

}

export function ComplementUrl(url: string): URLString {
  let proto: string;
  let host: string;
  let validUrl: URLString;
  let p: Array<string> = url.split("/");

  if (p[0].search(/:$/) !== -1) { // schema in 0 element
    proto = p.shift();
  } else { // no schema in 0 element
    proto = window.location.protocol;
    if (p[0] === '') p.shift();
  }

  if (p[0] === '') { //
    p.shift();
    host = p.shift();
  }

  if (!host || (host === '')) {
    host = window.location.host;
  }

  validUrl = encodeURI(`${proto}//${host}/${p.join('/')}`);

  if (new URL(<string>validUrl)) {
    return validUrl;
  }
}
