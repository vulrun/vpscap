import ms from "ms";
import fs from "node:fs";
import path from "node:path";
import JsonDB from "./JsonDB";
import axios from "axios";

export const readFile = (filePath) => {
  const cwd = process.cwd();
  filePath = filePath.replace(/^[@~]/, cwd);
  filePath = path.resolve(filePath);

  if (!fs.existsSync(filePath)) {
    fs.closeSync(fs.openSync(filePath, "w"));
  }

  return fs.readFileSync(filePath, "utf-8");
};

// import { sha256 as SHA256 } from "@noble/hashes/sha256";
// import { bytesToHex as toHex } from "@noble/hashes/utils";

// export function sha256(str) {
//   str = typeof str === "string" ? str : JSON.stringify(str);
//   return toHex(SHA256(str));
// }

export function base64UrlEncode(input, encoding) {
  // input type to buffer
  if (typeof input === "string") {
    input = Buffer.from(input, encoding || "utf8");
  } else if (Array.isArray(input)) {
    input = Buffer.concat(input);
  }

  if (!Buffer.isBuffer(input)) throw new Error("base64UrlEncode: invalid input");

  return input
    .toString("base64")
    .replace(/\+/g, "-") // Replace '+' with '-'
    .replace(/\//g, "_") // Replace '/' with '_'
    .replace(/=+$/, ""); // Remove trailing '='
}

export function base64UrlDecode(input, encoding) {
  if (typeof input !== "string") throw new Error("base64UrlDecode: invalid input");

  let base64 = input
    .replace(/-/g, "+") // Replace '-' with '+'
    .replace(/_/g, "/"); // Replace '_' with '/'

  // Pad with '=' to make the length of the string a multiple of 4
  switch (base64.length % 4) {
    case 1:
      base64 += "===";
      break;
    case 2:
      base64 += "==";
      break;
    case 3:
      base64 += "=";
      break;
  }

  const buffered = Buffer.from(base64, "base64");

  if (encoding === "buffer") return buffered;
  if (encoding === "json") return JSON.stringify(buffered);

  return buffered.toString(encoding || "utf8");
}

export function logRequest(method, url, status, duration) {
  console.log(`[${new Date().toISOString()}] ${method} ${url} ~ ${status} ~ ${duration}ms`);
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

export function cleanUrl(url) {
  // First, create a URL object to handle the URL parsing
  const parsedUrl = new URL(url);

  // Normalize the URL (removing trailing slashes, sorting query params)
  parsedUrl.pathname = parsedUrl.pathname.replace(/\/$/, ""); // Remove trailing slash
  parsedUrl.searchParams.sort(); // Sort query parameters by name

  // Convert the cleaned URL to a string
  return parsedUrl.origin + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
}

export function toMysqlTimestamp(date) {
  if (!date) return null;

  date = date === "now" ? new Date() : new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function sanitizeEpochMs(date) {
  if (!date) return null;

  date = date === "now" ? new Date() : new Date(date);
  return Math.floor(date.valueOf() / 1000) * 1000;
}

function randomBool() {
  const num = Math.floor(Math.random() * 10);
  return num % 2 === 0;
}

class ExtendedJsonDb extends JsonDB {
  constructor(...args) {
    super(...args);
    this.selectDataKey(args?.[0]?.dataKey);
  }

  selectDataKey(dataKey, doHexEncode) {
    this.dataKey = doHexEncode ? hexEncode(dataKey || "data") : dataKey || "data";
    return this;
  }

  setData(data, ttl) {
    const doc = {};

    if (ttl) {
      const ttlMs = ms("" + ttl);
      const expiry = new Date(Date.now() + ttlMs);
      doc.expiration = expiry.valueOf();
      doc.expirationIso = expiry.toISOString();
      doc.expirationRaw = ttl;
    }

    doc.value = data;
    super.set(this.dataKey, doc);
  }

  getData(defaults) {
    const doc = super.get(this.dataKey);
    if (!doc) return defaults || null;

    const now = Date.now();
    const exp = doc?.expiration;

    if (exp && now > exp) {
      this.deleteData();
      return defaults || null;
    }
    return doc?.value || defaults || null;
  }

  deleteData() {
    super.delete(this.dataKey);
  }
}

export function localdb(fileName, dataKey) {
  if (!fileName) throw new Error("DB filename is missing");

  return new ExtendedJsonDb({ dbFolder: ".localdb", dbName: fileName, dataKey });
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

export function hexEncode(str) {
  let hexString = "";
  for (let i = 0; i < str.length; i++) {
    hexString += str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hexString;
}

export function hexDecode(hexString) {
  let str = "";
  for (let i = 0; i < hexString.length; i += 2) {
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return str;
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

export function fetchApi(...args) {
  return axios
    .create()(...args)
    .then((res) => res?.data)
    .catch((err) => err);
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
