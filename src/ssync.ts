import { Debounced } from "debounced";

function elementfactory(desc) {
  if (!desc) {
    throw new Error("Wrong argument");
  }
  var type = desc.match(/^[a-z][a-z0-9-]*/i);
  var classes = desc.match(/\.([a-z][a-z0-9_-]*)/gi) || [];
  var id = desc.match(/\#([a-z][a-z0-9_-]*)/i) || [];
  var element = document.createElement(type[0]);
  element.className = (classes.length > 0 ? classes.join(" ") : "").replace(
    /\./g,
    ""
  );
  element.id = id.length > 0 ? id[0].replace(/\#/, "") : "";
  return element;
}

function getElements(id: string, el: Array<HTMLElement>): Array<HTMLElement> {
  var r: Array<HTMLElement> = [];
  for (var i: number = 0; i < el.length; i++) {
    var e: Array<HTMLElement> | NodeListOf<HTMLElement> = el[
      i
    ].querySelectorAll("#" + id);
    if (e.length == 0) {
      (e = []).push(el[i].appendChild(elementfactory("div#" + id)));
    }
    for (var j = 0; j < e.length; j++) {
      r.push(e[j]);
    }
  }
  return r;
}

export function SeamlessSync(data: Object): void {
  var key;
  for (key in data) {
    if (key == "_id" || typeof data[key] === "boolean") {
      this.setAttribute(key, data[key]);
    } else {
      switch (typeof data[key]) {
        case "number":
        case "string":
          getElements(key, [this]).forEach(function (e) {
            if (e instanceof HTMLInputElement) {
              e.value = data[key];
              if (!e.onchange) {
                e.onchange = Debounced(function () {
                  data[this.id] = this.value;
                  this.dispatchEvent(
                    new CustomEvent("seamlessdatachange", { bubbles: true })
                  );
                }, 1000);
              }
            } else e.innerText = data[key];
          });
          break;
        case "object":
          getElements(key, [this]).forEach(function (e) {
            SeamlessSync.apply(e, data[key]);
          });
      }
    }
  }
}
