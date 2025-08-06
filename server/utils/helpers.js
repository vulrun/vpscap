import fs from "node:fs";
import fsPath from "node:path";
import JsonDB from "./JsonDB";
import { findWorkspaceDir } from "pkg-types";
// import { sha256 as SHA256 } from "@noble/hashes/sha256";

// export function sha256(str) {
//   str = typeof str === "string" ? str : JSON.stringify(str);
//   return toHex(SHA256(str));
// }

// export const readFile = (filePath) => {
//   const cwd = process.cwd();
//   filePath = filePath.replace(/^[@~]/, cwd);
//   filePath = fsPath.resolve(filePath);

//   if (!fs.existsSync(filePath)) {
//     fs.closeSync(fs.openSync(filePath, "w"));
//   }

//   return fs.readFileSync(filePath, "utf-8");
// };

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
    const now = new Date();
    doc.addedAtMs = now.valueOf();
    doc.addedAtIso = now.toISOString();

    if (ttl) {
      const ttlMs = ms("" + ttl);
      const expiry = new Date(Date.now() + ttlMs);
      doc.expiration = expiry.valueOf();
      doc.expirationIso = expiry.toISOString();
      doc.expirationRaw = ttl;
    }

    doc.value = data;
    return super.set(this.dataKey, doc);
  }

  getData(defaults, options) {
    const doc = super.get(this.dataKey);
    if (!doc) return defaults || null;

    const now = Date.now();
    const exp = doc?.expiration;

    if (exp && now > exp) {
      this.deleteData();
      return defaults || null;
    }

    if (options?.raw) return doc;
    return doc?.value || defaults || null;
  }

  deleteData() {
    return super.delete(this.dataKey);
  }

  deleteAllData() {
    return super.deleteAll();
  }
}

export function localdb(fileName, dataKey) {
  if (!fileName) throw new Error("DB filename is missing");

  return new ExtendedJsonDb({ dbFolder: ".localdb", dbName: fileName, dataKey });
}

export async function getLocalDbDirPath(addPath) {
  const workspaceDir = await findWorkspaceDir();
  return fsPath.resolve(workspaceDir, addPath ?? ".localdb");
}
