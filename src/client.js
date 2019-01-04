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
            configurable: true,
        };
        let deseamless = {
            value: function deseamless() {
                if (this.seamless !== undefined) {
                    delete this.seamless;
                    if (this.removeEventListener) {
                        this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                    }
                }
                if (this.status) {
                    delete this.status;
                }
            }.bind(this),
            enumerable: true,
            configurable: true,
        };
        let status = {
            get() {
                return buffer;
            },
            set(v) {
                transmit(v);
            },
            enumerable: true,
            configurable: true,
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
        if (this.seamless)
            this.seamless(buffer, transmit);
    }
}
//# sourceMappingURL=client.js.map