import { URLString } from './utils/complement-url.js';
import { AbortableRequest } from './poller';

export function AbortableFetch(url:URLString, options: RequestInit): AbortableRequest<Object> {
  let abortController = new AbortController();
  let abortSignal = abortController.signal;
  options.signal = abortSignal;
  return {
    request: Promise.race([
      fetch(<string>url, options).then((res)=>{
        if (res.status === 200) {
          return res.json();
        }
        else {
          throw new Error(res.status.toString());
        }
      }),
      new Promise((_, reject)=>setTimeout(()=>{
        abortController.abort();
        reject(new Error('Fetch timeout reached. Request aborted.'));
      }, 30000)),
    ]),
    abort() {
      abortController.abort();
    }
  }
}
