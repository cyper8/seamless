import { SeamlessSync } from "./ssync.js";

export interface SeamlessClient {
  seamless: Function | false;
  deseamless: Function;
  status: Object;
}

export class SeamlessClient {
  constructor(
    element: HTMLElement | Function | Object,
    transmit: Function,
    bufferCache: Promise<Object> | Object
  ) {
    let data: Object;
    function SeamlessDataChangeEventHandler(evt: CustomEvent) {
      evt.stopPropagation();
      transmit(data);
    }

    let seamless: PropertyDescriptor = {
      value: Function,
      enumerable: true,
      configurable: true,
    };

    let deseamless: PropertyDescriptor = {
      value: function deseamless() {
        if (this.seamless !== undefined) {
          delete this.seamless;
          if (this.removeEventListener) {
            this.removeEventListener(
              "seamlessdatachange",
              SeamlessDataChangeEventHandler
            );
          }
        }
        if (this.status) {
          delete this.status;
        }
      }.bind(this),
      enumerable: true,
      configurable: true,
    };

    let status: PropertyDescriptor = {
      get() {
        return data;
      },
      set(v) {
        transmit(v);
      },
      enumerable: true,
      configurable: true,
    };

    if (element instanceof HTMLElement) {
      element.addEventListener(
        "seamlessdatachange",
        SeamlessDataChangeEventHandler
      );
      if (
        element.dataset.sync &&
        typeof window[element.dataset.sync] === "function"
      ) {
        seamless.value = window[element.dataset.sync].bind(element);
      } else {
        seamless.value = SeamlessSync.bind(element);
      }
    } else {
      if (typeof element === "function") {
        seamless.value = element.bind(element);
      } else if (typeof element === "object") {
        seamless.value = false;
      }
    }

    let props: PropertyDescriptorMap = {
      seamless,
      deseamless,
      status,
    };

    Object.defineProperties(this, props);

    Promise.resolve(bufferCache).then((d) => {
      data = d;
      if (this.seamless) {
        this.seamless(data, transmit);
      }
    });
  }
}
