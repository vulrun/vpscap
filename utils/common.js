export function ms(str) {
  str = String(str);
  if (str.length > 100) return 0;

  const match = /^([\+\-]?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
  if (!match) return 0;

  const unit = (match[2] || "ms").toLowerCase();
  const n = parseFloat(match[1]);
  const s = 1000;
  const m = s * 60;
  const h = m * 60;
  const d = h * 24;
  const w = d * 7;
  const y = d * 365.25;
  switch (unit) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "weeks":
    case "week":
    case "w":
      return n * w;
    case "days":
    case "day":
    case "d":
      return n * d;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      return 0;
  }
}

export function cleanStatusText(str) {
  if (!str) return str;

  str = str.replace(/[^a-zA-Z0-9 ]/g, "");
  str = str.replace(/\s+/g, " ").trim();
  str = str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return str;
}

export function isDate(date) {
  date = new Date(date);
  return date instanceof Date && !isNaN(date);
}

export function mathjs(str) {
  return Function(`'use strict'; return (${str})`)();
}

export function sortObj(obj) {
  if (Object.keys(obj).length) {
    obj = Object.entries(obj).sort();
    obj = Object.fromEntries(obj);
  }
  return obj;
}

export function sortBy(key, order) {
  if (!key) return;

  order = order === -1 ? -1 : 1;
  this.items.sort((a, b) => {
    if (a[key] > b[key]) return 1 * order;
    if (a[key] < b[key]) return -1 * order;
    return 0;
  });
}

export function nonce(val) {
  if (typeof val === "string" && val.length > 1) return val;
  val = val || Date.now();
  return Number(val).toString(36);
}

export function randomNum(max) {
  max = max || Date.now();
  return Math.floor(Math.random() * max);
}

export function stringify(str) {
  if (!str) return "";
  return typeof str === "string" ? str : JSON.stringify(str);
}

export function deep_copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 0));
}

export function createAvatarInitials(name) {
  const words = `${name || ""}`.trim().split(" ").slice(0, 2);
  const initials = words.map((word) => word.charAt(0)).join("");
  return initials.toUpperCase();
}

export function encodeUserPass(user, pass) {
  if (!user) throw new Error("User is needed");
  if (!pass) throw new Error("Pass is needed");

  return hexEncode(JSON.stringify({ username: user, password: pass }));
}

export function decodeUserPass(str) {
  if (!str) throw new Error("Decoded string is needed");

  try {
    return JSON.parse(hexDecode(str));
  } catch (error) {
    return null;
  }
}

export function isValidHex(str) {
  return /^[0-9a-fA-F]*$/.test(str) && str.length % 2 === 0;
}

export function hexEncode(inputData) {
  const inputStr = String(inputData ?? "").replace(/\r|\n/g, "");
  if (!inputStr) return "";

  const byteArray = Array.prototype.map.call(inputStr, (c) => c.charCodeAt(0).toString(16).padStart(2, "0"));
  return byteArray.join("");
}

export function hexDecode(hexString) {
  const hexInput = String(hexString ?? "").replace(/\r|\n/g, "");

  if (!hexInput) return "";
  if (!isValidHex(hexInput)) {
    throw new Error(`Invalid hex string: ${hexInput}`);
  }

  const byteArray = hexInput.match(/.{1,2}/g).map((c) => parseInt(c, 16));
  return String.fromCharCode.apply(null, byteArray);
}

export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(async () => {
      try {
        const result = fn.apply(this, args);
        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        console.error("Error executing debounced function:", err);
      }
    }, delay);
  };
}

export function cleanArray() {
  return [].concat(...arguments).filter(Boolean);
}

export function toObject(data, key, val, keyFunc, valFunc) {
  const isStringValid = (tmp) => typeof tmp === "string" && tmp.length > 0;

  if (!Array.isArray(data)) throw new Error("INVALID_DATA");
  if (data.length <= 0) return {};
  if (!isStringValid(key)) throw new Error("INVALID_KEY");

  const newObj = {};
  for (const item of data) {
    let k = String(item[key]);
    let v = isStringValid(val) ? item[val] : item;
    if (typeof keyFunc === "function") k = keyFunc(k);
    if (typeof valFunc === "function") v = valFunc(v);
    newObj[k] = v;
  }
  return newObj;
}

export function extendObj(target, ...sources) {
  // Function to handle values in nested objects using dot notation
  const getDeepValue = (obj, path) => {
    const keys = path.split(".");

    return keys.reduce((acc, key) => {
      if (acc && acc.hasOwnProperty(key)) {
        return acc[key];
      }
      return undefined;
    }, obj);
  };

  const setDeepValue = (obj, path, value) => {
    const keys = path.split(".");
    let current = obj;

    // Traverse the path and create nested objects if needed
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    if (value === undefined) {
      // If the value is undefined, remove the property
      delete current[keys[keys.length - 1]];
    } else {
      current[keys[keys.length - 1]] = value;
    }
  };

  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
      const value = source[key];

      if (value === undefined) {
        // If the value is undefined, remove the property from the target path
        setDeepValue(target, key, value);
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // If the value is an object, recurse and extend it
        // Initialize the key if it doesn't exist in target
        if (!target[key]) setDeepValue(target, key, {});
        extendObj(getDeepValue(target, key), value);
      } else if (key.includes(".")) {
        // If the key is a dot notation, set the value using setDeepValue
        setDeepValue(target, key, value);
      } else {
        // Regular assignment for non-nested keys
        target[key] = value;
      }
    });
  });

  return target;
}

export function markdownToHtmlLite(text) {
  let html = text;

  // Underline: __text__
  html = html.replace(/__(.*?)__/g, "<u>$1</u>");

  // Strikethrough: ~~text~~
  html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Inline Code: `code`
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  return html;
}

export function sanitizeDomains(val) {
  if (!val) return [];

  val = String(val || "")
    // domain with spaces separated
    .replace(/[^a-z0-9\-\.]/gi, " ")
    // remove multiple spaces
    .replace(/\s+/g, " ")
    // to array
    .split(" ");

  // remove duplicates, filter valid domains, then sorting
  const validDomainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  val = Array.from(new Set(val)).filter((site) => validDomainRegex.test(site));
  val.sort();
  return cleanArray(val);
}
