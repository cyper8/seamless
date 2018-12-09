import { SeamlessSync } from './ssync.js';
export class SeamlessClient {
    constructor(element, transmit, buffer) {
        function SeamlessDataChangeEventHandler(evt) {
            transmit(buffer);
            evt.stopPropagation();
        }
        let seamless = {
            value: Function,
            enumerable: true,
        };
        let deseamless = {
            value: function deseamless() {
                delete this.seamless;
                if (this.removeEventListener) {
                    this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                }
            }.bind(element),
            enumerable: true,
        };
        let status = {
            get() {
                return buffer;
            },
            set(v) {
                transmit(v);
            },
            enumerable: true,
        };
        if (element instanceof HTMLElement) {
            element.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
            if (element.dataset.sync &&
                (typeof window[element.dataset.sync] === "function")) {
                seamless.value = window[element.dataset.sync].bind(element);
            }
            else {
                seamless.value = SeamlessSync.bind(element);
            }
        }
        else {
            if (typeof element === "function") {
                seamless.value = element.bind(element);
            }
            else if (typeof element === "object") {
                seamless.value = false;
            }
        }
        let props = {
            seamless,
            deseamless,
            status,
        };
        Object.defineProperties(this, props);
        if (seamless.value)
            seamless.value(buffer);
    }
}
//# sourceMappingURL=client.js.map