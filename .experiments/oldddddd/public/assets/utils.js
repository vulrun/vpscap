const style_SnackBar = `
<style>
.hstack {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: stretch;
}
.vstack {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-self: stretch;
}
.snackbar {
    position: fixed;
    top: 5rem;
    z-index: 10000;
    opacity: 0;
    width: auto;
    height: auto;
    min-height: 3rem;
    line-height: 1.5;
    margin: 1rem;
    padding: 0.5rem 1rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;
    color: #FFF;
    background-color: #222;
    border-radius: 2px;
    font-size: 0.9rem;
    font-weight: 400;
    letter-spacing: 0.2px;
    -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    -webkit-transition: 0.5s;
    -o-transition: 0.5s;
    transition: 0.5s;
}
@media (min-width: 18rem) {
    .snackbar {
        min-width: 18rem;
        max-width: 30rem;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
`;

function snackbar(message, color = "", time = 5000) {
  const domHead = document.querySelector("head");
  domHead.innerHTML += style_SnackBar;

  const snackbars = document.querySelectorAll(".snackbar");
  for (let i = 0; i < snackbars.length; i++) {
    snackbars[i].dismiss();
  }

  const snackbar = document.createElement("div");
  snackbar.className = "snackbar";

  // treat as a class instead of delay
  typeof time !== "number" && snackbar.classList.add(time);

  snackbar.dismiss = function () {
    this.style.top = "-10rem";
    this.style.opacity = 0;
  };

  const text = document.createTextNode(message);
  snackbar.appendChild(text);

  document.body.appendChild(snackbar);
  getComputedStyle(snackbar).bottom;
  getComputedStyle(snackbar).opacity;
  snackbar.style.backgroundColor = color;
  snackbar.style.top = 0;
  snackbar.style.opacity = 1;

  if (typeof time === "number") {
    setTimeout(function () {
      snackbar.dismiss();
    }, time);
  }

  snackbar.addEventListener(
    "transitionend",
    function (event, elapsed) {
      if (event.propertyName === "opacity" && this.style.opacity == 0) {
        this.parentElement.removeChild(this);
      }
    }.bind(snackbar)
  );
}

function $_GET(name, uri = window.location.href) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(uri);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function X_GET(name, uri = window.location.href) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("(" + name + ")=([^&#]*)", "g");
  const results = uri
    .replace(regex, "")
    .replace(/([\\?&]$)/g, "")
    .replace(/(\?[\\?&#])/g, "?")
    .replace(/([\\?&]#)/g, "#");
  return results;
}

function strTruncate(str, max, add) {
  add = add || "...";
  return typeof str === "string" && str.length > max ? str.substring(0, max) + add : str;
}

function changeHref(path) {
  if (window.history.pushState) {
    window.history.pushState({}, "", path);
  }
  return;
}

function classNames() {
  const hasOwn = {}.hasOwnProperty;
  const _appendClass = (value, newClass) => {
    if (!newClass) return value;
    if (value) return value + " " + newClass;

    return value + newClass;
  };
  const _parseValue = (arg) => {
    if (typeof arg === "string" || typeof arg === "number") return arg;
    if (typeof arg !== "object") return "";

    if (Array.isArray(arg)) return classNames.apply(null, arg);

    if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) return arg.toString();

    let classes = "";

    for (const key in arg) {
      if (hasOwn.call(arg, key) && arg[key]) {
        classes = _appendClass(classes, key);
      }
    }

    return classes;
  };

  let classes = "";

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (arg) {
      classes = _appendClass(classes, _parseValue(arg));
    }
  }

  return classes;
}

async function fetch2({ url, method, headers, body, searchParams }) {
  if (!url) throw new Error("URL is required");

  method = method || "GET";
  headers = { ...headers };
  headers["Content-Type"] = "application/json";

  body = body || "";
  body = typeof body === "string" ? body : JSON.stringify(body);

  if (searchParams && Object.keys(searchParams || {}).length > 0) {
    url += url.indexOf("?") !== -1 ? "&" : "?";
    url += new URLSearchParams(searchParams || {}).toString();
  }

  if (method === "GET" || method === "HEAD") {
    body = undefined;
  }

  const resp = await fetch(url, { method, headers, body });
  const contentType = resp.headers.get("Content-Type") || "";
  if (contentType.indexOf("application/json") !== -1) {
    return await resp.json();
  }
  return await resp.text();
}

String.prototype.format = function (...args) {
  let str = this.toString();
  if (!str) throw new Error("1st argument must be a string");
  if (args.length <= 0) return str;

  return String(str).replace(/{(\d+)}/g, function (match, num) {
    return typeof args[num] !== "undefined" ? args[num] : match;
  });
};

JSON.isJSON = function (data) {
  try {
    JSON.parse(data);
    return true;
  } catch (e) {
    return false;
  }
};
