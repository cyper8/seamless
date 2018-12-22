export function ComplementUrl(url: string): string {
  let proto: string;
  let host: string;
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

  // all elements left are components of path

  return `${proto}//${host}/${p.join('/')}`;
}
