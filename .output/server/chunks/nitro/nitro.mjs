import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import fs, { promises, existsSync } from 'node:fs';
import fsPath, { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import nodeCrypto, { createHash } from 'node:crypto';
import * as envfile from 'envfile';
import ms from 'ms';
import axios from 'axios';
import fs$1 from 'fs-extra';
import dns from 'node:dns/promises';
import lo from 'lodash';
import shelljs from 'shelljs';
import acme from 'acme-client';
import forge from 'node-forge';
import { z } from 'zod';
import * as glob from 'glob';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=g(e._destroy,t._destroy);}};function _(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function g(...n){return function(...e){for(const t of n)t(...e);}}const m=_();class A extends m{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function S(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const C=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(C.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function O(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:S(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const defineAppConfig = (config) => config;

const appConfig0 = defineAppConfig({
  title: "VPS Panel",
  email: "dev@apii.in",
  description: "Urlly Link Shortener",
  icon: "/level-slider.svg",
  image: "https://images.unsplash.com/photo-1655196601100-8bfb26cf99e9?q=80&w=1200&h=630&fit=crop",
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: ["dashboard", "admin", "assets", "docs"]
});

const inlineAppConfig = {
  "nuxt": {}
};

const appConfig = defuFn(appConfig0, inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "d60e9893-337f-47e4-b5be-0644a44c6a79",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/": {
        "redirect": {
          "to": "/home",
          "statusCode": 307
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "appEnv": "production"
  },
  "appEnv": "production",
  "loginUsername": "",
  "loginPassword": ""
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  if (!event) {
    return _sharedAppConfig;
  }
  if (event.context.nitro.appConfig) {
    return event.context.nitro.appConfig;
  }
  const appConfig$1 = klona(appConfig);
  event.context.nitro.appConfig = appConfig$1;
  return appConfig$1;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('../_/error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"system\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"-mode\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"-mode\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _yeaThfjQWUj_79Ga5f_PLZVDzrVFrsasBNyIAbbDa0 = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

function defineNitroPlugin(def) {
  return def;
}

const getEnvDataSync = (raw, wd) => {
  const ENV_PATH = fsPath.join(process.cwd(), ".env");
  if (!fs.existsSync(ENV_PATH)) {
    fs.closeSync(fs.openSync(ENV_PATH, "w"));
  }
  return envfile.parse(fs.readFileSync(ENV_PATH, "utf-8"));
};
const setEnvDataSync = (envData, wd) => {
  const ENV_PATH = fsPath.join(process.cwd(), ".env");
  const parsedData = getEnvDataSync();
  const updatedData = { ...parsedData, ...envData };
  fs.writeFileSync(ENV_PATH, envfile.stringify(updatedData));
  return true;
};

const errors = {
  blankName: "",
  blankData: "",
  blankNumber: "",
  needArray: ""
};
class ObjectFunctions {
  set(path2, value, obj) {
    let schema = obj;
    let pList = path2.split(".");
    let len = pList.length;
    for (let i = 0; i < len - 1; i++) {
      let elem = pList[`${i}`];
      if (typeof schema[`${elem}`] !== "object") {
        schema[`${elem}`] = {};
      }
      schema = schema[`${elem}`];
    }
    schema[pList[`${len - 1}`]] = value;
  }
  get(obj, ...data) {
    return data.reduce((acc, key) => acc == null ? void 0 : acc[`${key}`], obj);
  }
  remove(obj, path2) {
    if (!obj || !path2) return;
    if (typeof path2 === "string") {
      path2 = path2.split(".");
    }
    for (var i = 0; i < path2.length - 1; i++) {
      obj = obj[path2[`${i}`]];
      if (typeof obj === "undefined") {
        return;
      }
    }
    delete obj[path2.pop()];
  }
  removeEmptyData(obj) {
    const remove = function(obj2) {
      Object.keys(obj2).forEach(function(key) {
        if (obj2[`${key}`] && typeof obj2[`${key}`] === "object") {
          remove(obj2[`${key}`]);
        } else if (obj2[`${key}`] === null || obj2[`${key}`] === "") {
          delete obj2[`${key}`];
        }
        if (typeof obj2[`${key}`] === "object" && Object.keys(obj2[`${key}`]).length === 0) {
          delete obj2[`${key}`];
        }
      });
    };
    remove(obj);
  }
}
class JsonHandler {
  constructor({ cwd, dir, file }) {
    this.cwdPath = cwd ? fsPath.resolve(cwd) : fsPath.resolve(".");
    this.dirPath = fsPath.resolve(`${this.cwdPath}/${dir}/`);
    this.filePath = fsPath.resolve(`${this.dirPath}/${file}.json`);
  }
  touch() {
    if (fs.existsSync(this.dirPath) === false) {
      fs.mkdirSync(this.dirPath);
    }
    if (fs.existsSync(this.filePath) === false) {
      fs.writeFileSync(this.filePath, "{}");
    }
  }
  write(data) {
    const content = this.readable === true ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    return fs.writeFileSync(this.filePath, content);
  }
  read() {
    try {
      return JSON.parse(fs.readFileSync(this.filePath, "utf8"));
    } catch (error) {
      return null;
    }
  }
}
class JsonDB {
  constructor(options) {
    this.messages = { errors };
    this.cwd = options == null ? void 0 : options["cwd"];
    this.dbName = options == null ? void 0 : options["dbName"];
    this.dbFolder = options == null ? void 0 : options["dbFolder"];
    this.noBlankData = (options == null ? void 0 : options["noBlankData"]) ? typeof (options == null ? void 0 : options["noBlankData"]) === "boolean" ? options == null ? void 0 : options["noBlankData"] : false : false;
    this.objFuncs = new ObjectFunctions();
    this.json = new JsonHandler({
      cwd: this.cwd,
      dir: this.dbFolder,
      file: this.dbName,
      readable: (options == null ? void 0 : options["readable"]) === true ? true : false
    });
    this.json.touch();
  }
  set(path2, data) {
    this.json.touch();
    if (!path2) throw new TypeError(this.message["errors"]["blankName"]);
    if (!data) throw new TypeError(this.message["errors"]["blankData"]);
    const content = this.json.read();
    this.objFuncs.set(path2, data, content);
    this.json.write(content);
    return this.get(path2);
  }
  get(path2) {
    if (!path2) return this.json.read();
    return this.objFuncs.get(this.json.read(), ...path2.split("."));
  }
  fetch() {
    return this.get(...arguments);
  }
  has(path2) {
    if (!path2) throw new TypeError(this.message["errors"]["blankName"]);
    try {
      return this.objFuncs.get(this.json.read(), ...path2.split(".")) ? true : false;
    } catch (err) {
      return false;
    }
  }
  delete(path2) {
    this.json.touch();
    if (!path2) throw new TypeError(this.message["errors"]["blankName"]);
    if (!this.get(path2)) return false;
    const content = this.json.read();
    this.objFuncs.remove(content, path2);
    if (this.noBlankData === true) {
      this.objFuncs.removeEmptyData(content);
    }
    this.json.write(content);
    return true;
  }
  add(path2, number) {
    if (!path2) throw new TypeError(this.message["errors"]["blankName"]);
    if (!number) throw new TypeError(this.message["errors"]["blankData"]);
    if (isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"]);
    const val = this.get(path2);
    const num = isNaN(val) ? Number(number) : val + Number(number);
    this.set(path2, Number(val ? num : Number(number)));
    return this.get(db);
  }
  subtract(path2, number) {
    if (!path2) throw new TypeError(this.message["errors"]["blankName"]);
    if (!number) throw new TypeError(this.message["errors"]["blankData"]);
    if (isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"]);
    if (this.get(path2) - number < 1) {
      this.delete(path2);
      return this.get(path2) || 0;
    }
    if (!this.get(path2)) {
      this.delete(path2);
      return this.get(path2) || 0;
    }
    this.set(path2, this.get(path2) ? this.get(path2) - Number(number) <= 1 ? 1 : (isNaN(this.get(path2)) ? 1 : this.get(path2) - Number(number)) || 1 : 1);
    return this.get(path2);
  }
  push(path2, data) {
    if (!path2) throw new TypeError(this.message["errors"]["blankName"]);
    if (!data) throw new TypeError(this.message["errors"]["blankData"]);
    let arr = [];
    const saved = this.get(path2);
    if (saved === void 0 || saved === null) {
      arr = [];
    } else if (!Array.isArray(saved)) {
      throw new TypeError(this.message["errors"]["needArray"]);
    } else {
      arr = this.get(path2);
    }
    arr.push(data);
    this.set(path2, arr);
    return this.get(path2);
  }
  unpush(path2, data) {
    if (!path2) throw new TypeError(this.message["errors"]["blankName"]);
    if (!data) throw new TypeError(this.message["errors"]["blankData"]);
    let arr = this.get(path2) || [];
    if (!Array.isArray(arr)) return;
    arr = arr.filter((x) => x !== data);
    this.set(path2, arr);
    return this.get(path2);
  }
  delByPriority(path2, number) {
    if (!path2) throw new TypeError(this.message["errors"]["blankData"]);
    if (!number) throw new TypeError(this.message["errors"]["blankNumber"]);
    if (isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"]);
    const content = this.get(path2);
    if (!content || content.length < 1 || typeof content !== "object") {
      return false;
    }
    const neww = [];
    for (let a = 0; a < content.length; a++) {
      if (a !== number - 1) {
        neww.push(content[`${a}`]);
      }
    }
    this.set(path2, neww);
    return this.get(path2);
  }
  setByPriority(path2, data, number) {
    if (!path2) throw new TypeError(this.message["errors"]["blankData"]);
    if (!data) throw new TypeError(this.message["errors"]["blankData"]);
    if (!number) throw new TypeError(this.message["errors"]["blankNumber"]);
    if (isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"]);
    const content = this.get(path2);
    if (!content || content.length < 1 || typeof content !== "object") {
      return false;
    }
    let neww = [];
    for (let a = 0; a < content.length; a++) {
      let val = content[`${a}`];
      if (a === number - 1) {
        neww.push(data);
      } else {
        neww.push(val);
      }
    }
    this.set(path2, neww);
    return this.get(path2);
  }
  all() {
    return this.get();
  }
  deleteAll() {
    this.json.write({});
    return true;
  }
  // findAll() {
  //   let data;
  //   let pipeline;
  //   if (arguments.length === 2) {
  //     data = this.get(arguments[0]);
  //     pipeline = arguments[1];
  //   } else {
  //     data = this.all();
  //     pipeline = arguments[0];
  //   }
  //   pipeline = [].concat(pipeline);
  //   if (!pipeline.length) return data;
  //   for (let operation of pipeline) {
  //     const [todo, ...args] = operation;
  //     switch (todo) {
  //       case "sort":
  //         const keys = Object.keys(args[0]);
  //         if (keys.length) {
  //           const values = Object.values(args[0]).map((i) => (i > 0 ? "asc" : "desc"));
  //           data = lo.orderBy(data, keys, values);
  //         }
  //         break;
  //       case "find":
  //         data = lo.filter(data, args[0]);
  //         break;
  //       case "skip":
  //         data = data.slice(args[0]);
  //         break;
  //       case "limit":
  //         data = data.slice(0, args[0]);
  //         break;
  //     }
  //   }
  //   return data;
  // }
}

function logRequest(method, url, status, duration) {
  console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${method} ${url} ~ ${status} ~ ${duration}ms`);
}
function cleanStatusText(str) {
  if (!str) return str;
  str = str.replace(/[^a-zA-Z0-9 ]/g, "");
  str = str.replace(/\s+/g, " ").trim();
  str = str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  return str;
}
class ExtendedJsonDb extends JsonDB {
  constructor(...args) {
    var _a;
    super(...args);
    this.selectDataKey((_a = args == null ? void 0 : args[0]) == null ? void 0 : _a.dataKey);
  }
  selectDataKey(dataKey, doHexEncode) {
    this.dataKey = doHexEncode ? hexEncode(dataKey || "data") : dataKey || "data";
    return this;
  }
  setData(data, ttl) {
    const doc = {};
    const now = /* @__PURE__ */ new Date();
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
    const exp = doc == null ? void 0 : doc.expiration;
    if (exp && now > exp) {
      this.deleteData();
      return defaults || null;
    }
    if (options == null ? void 0 : options.raw) return doc;
    return (doc == null ? void 0 : doc.value) || defaults || null;
  }
  deleteData() {
    return super.delete(this.dataKey);
  }
  deleteAllData() {
    return super.deleteAll();
  }
}
function localdb(fileName, dataKey) {
  if (!fileName) throw new Error("DB filename is missing");
  return new ExtendedJsonDb({ dbFolder: ".localdb", dbName: fileName, dataKey });
}
function decodeUserPass(str) {
  if (!str) throw new Error("Decoded string is needed");
  try {
    return JSON.parse(hexDecode(str));
  } catch (error) {
    return null;
  }
}
function hexEncode(str) {
  let hexString = "";
  for (let i = 0; i < str.length; i++) {
    hexString += str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hexString;
}
function hexDecode(hexString) {
  let str = "";
  for (let i = 0; i < hexString.length; i += 2) {
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return str;
}
function debounce(fn, delay) {
  let timer;
  return function(...args) {
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
function fetchApi(...args) {
  return axios.create()(...args).then((res) => res == null ? void 0 : res.data).catch((err) => err);
}
function toObject(data, key, val, keyFunc, valFunc) {
  const isStringValid = (tmp) => typeof tmp === "string" && tmp.length > 0;
  if (!Array.isArray(data)) throw new Error("INVALID_DATA");
  if (data.length <= 0) return {};
  if (!isStringValid(key)) throw new Error("INVALID_KEY");
  const newObj = {};
  for (const item of data) {
    let k = String(item[key]);
    let v = isStringValid(val) ? item[val] : item;
    newObj[k] = v;
  }
  return newObj;
}
function extendObj(target, ...sources) {
  const getDeepValue = (obj, path2) => {
    const keys = path2.split(".");
    return keys.reduce((acc, key) => {
      if (acc && acc.hasOwnProperty(key)) {
        return acc[key];
      }
      return void 0;
    }, obj);
  };
  const setDeepValue = (obj, path2, value) => {
    const keys = path2.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    if (value === void 0) {
      delete current[keys[keys.length - 1]];
    } else {
      current[keys[keys.length - 1]] = value;
    }
  };
  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
      const value = source[key];
      if (value === void 0) {
        setDeepValue(target, key, value);
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (!target[key]) setDeepValue(target, key, {});
        extendObj(getDeepValue(target, key), value);
      } else if (key.includes(".")) {
        setDeepValue(target, key, value);
      } else {
        target[key] = value;
      }
    });
  });
  return target;
}

function shellExec(command) {
  return new Promise((resolve, reject) => {
    shelljs.exec(command, { silent: true }, (exitCode, stdout, stderr) => {
      if (exitCode && exitCode !== 1) return reject(new Error(`EXITCODE: ${exitCode}`));
      if (stderr) return reject(stderr);
      return resolve(stdout);
    });
  });
}
function sudoExec(command) {
  var _a, _b;
  command = ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.PASSWD_KEY) ? `echo "${(_b = process == null ? void 0 : process.env) == null ? void 0 : _b.PASSWD_KEY}" | sudo -S ${command}` : `sudo ${command}`;
  return shellExec(command);
}
function isInstalled(pkgName) {
  try {
    return shellExec(`which ${pkgName}`);
  } catch (error) {
    return null;
  }
}

var __typeError$3 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$3 = (obj, member, msg) => member.has(obj) || __typeError$3("Cannot " + msg);
var __privateGet$2 = (obj, member, getter) => (__accessCheck$3(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$3 = (obj, member, value) => member.has(obj) ? __typeError$3("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck$3(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod$3 = (obj, member, method) => (__accessCheck$3(obj, member, "access private method"), method);
var _a$2, _certsRootPath, _certsLivePath, _certsTrashPath, _challengesPath$1, _accountKeyPath, _accountObjPath, _sslDhParamsPath, _sslOptionsNginx, _client, _SslAcme_instances, setupDirectories_fn, generateOptionsSslNginxConf_fn, generateDhParams_fn, getOrCreateAccountKey_fn, generateCsr_fn, saveCertificate_fn, handleHttpChallenge_fn, cleanupHttpChallenge_fn, createPemContent_fn, isCertKeyFile_fn, isCertMainFile_fn;
const cleanArray$3 = (val) => [].concat(val).filter(Boolean);
const LOCAL_DB_DIR$1 = ((_a$2 = process == null ? void 0 : process.env) == null ? void 0 : _a$2.NUXT_LOCAL_DB_DIR) || ".localdb/";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
class SslAcme {
  constructor(args) {
    __privateAdd$3(this, _SslAcme_instances);
    __privateAdd$3(this, _certsRootPath, fsPath.resolve(LOCAL_DB_DIR$1, "acme-ssl"));
    __privateAdd$3(this, _certsLivePath, fsPath.resolve(LOCAL_DB_DIR$1, "acme-ssl", "certs"));
    __privateAdd$3(this, _certsTrashPath, fsPath.resolve(LOCAL_DB_DIR$1, "acme-ssl", "trashed-certs"));
    __privateAdd$3(this, _challengesPath$1, fsPath.resolve(LOCAL_DB_DIR$1, "acme-ssl", "challenges"));
    __privateAdd$3(this, _accountKeyPath, fsPath.resolve(LOCAL_DB_DIR$1, "acme-ssl", "account-key.pem"));
    __privateAdd$3(this, _accountObjPath, fsPath.resolve(LOCAL_DB_DIR$1, "acme-ssl", "account-acme.json"));
    __privateAdd$3(this, _sslDhParamsPath, fsPath.resolve(LOCAL_DB_DIR$1, "acme-ssl", "ssl-dhparams.pem"));
    __privateAdd$3(this, _sslOptionsNginx, fsPath.resolve(LOCAL_DB_DIR$1, "acme-ssl", "options-ssl-nginx.conf"));
    __privateAdd$3(this, _client);
    if (!emailRegex.test(args == null ? void 0 : args.email)) throw new Error("Invalid Email Provided");
    this.email = args == null ? void 0 : args.email;
    __privateMethod$3(this, _SslAcme_instances, setupDirectories_fn).call(this);
  }
  async listCertificates() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    if (!shelljs.test("-d", __privateGet$2(this, _certsLivePath))) throw new Error("Invalid Path");
    const certsDomain = fs$1.readdirSync(__privateGet$2(this, _certsLivePath));
    const data = [];
    for (const domain of certsDomain) {
      const certDir = fsPath.resolve(__privateGet$2(this, _certsLivePath), domain);
      const stat = fs$1.statSync(certDir);
      if (!stat.isDirectory()) continue;
      const certFiles = fs$1.readdirSync(certDir).map((path) => fsPath.resolve(certDir, path));
      const certMainFile = certFiles.find((file) => __privateMethod$3(this, _SslAcme_instances, isCertMainFile_fn).call(this, file));
      const certKeyFile = certFiles.find((file) => __privateMethod$3(this, _SslAcme_instances, isCertKeyFile_fn).call(this, file));
      const certData = fs$1.readFileSync(certMainFile, "utf8");
      const certInfo = forge.pki.certificateFromPem(certData);
      extendObj(certInfo, {
        signature: void 0,
        "_parsed.issuer": toObject(certInfo == null ? void 0 : certInfo.issuer.attributes, "name", "value"),
        "_parsed.subject.commonName": (_a2 = toObject(certInfo == null ? void 0 : certInfo.subject.attributes, "name", "value")) == null ? void 0 : _a2.commonName,
        "_parsed.subject.altNames": (_d = (_c = (_b = certInfo == null ? void 0 : certInfo.extensions) == null ? void 0 : _b.find((i) => i.name === "subjectAltName")) == null ? void 0 : _c.altNames) == null ? void 0 : _d.map((i) => i.value)
      });
      const _parsed = certInfo == null ? void 0 : certInfo._parsed;
      const tmpData = {};
      tmpData.dirName = domain;
      tmpData.certPath = certMainFile || null;
      tmpData.certKeyPath = certKeyFile || null;
      tmpData.serialNo = certInfo == null ? void 0 : certInfo.serialNumber;
      tmpData.certName = (_e = _parsed == null ? void 0 : _parsed.subject) == null ? void 0 : _e.commonName;
      tmpData.altNames = cleanArray$3(typeof ((_f = _parsed == null ? void 0 : _parsed.subject) == null ? void 0 : _f.altNames) === "string" ? (_h = (_g = _parsed == null ? void 0 : _parsed.subject) == null ? void 0 : _g.altNames) == null ? void 0 : _h.split(" ") : (_i = _parsed == null ? void 0 : _parsed.subject) == null ? void 0 : _i.altNames);
      tmpData.issuedBy = _parsed == null ? void 0 : _parsed.issuer;
      tmpData.issuedAt = new Date((_j = certInfo == null ? void 0 : certInfo.validity) == null ? void 0 : _j.notBefore).valueOf();
      tmpData.issuedAtIso = (_k = certInfo == null ? void 0 : certInfo.validity) == null ? void 0 : _k.notBefore;
      tmpData.expiresAt = new Date((_l = certInfo == null ? void 0 : certInfo.validity) == null ? void 0 : _l.notAfter).valueOf();
      tmpData.expiresAtIso = (_m = certInfo == null ? void 0 : certInfo.validity) == null ? void 0 : _m.notAfter;
      data.push(tmpData);
    }
    return data;
  }
  getPaths() {
    return {
      certsRootPath: __privateGet$2(this, _certsRootPath),
      certsLivePath: __privateGet$2(this, _certsLivePath),
      certsTrashPath: __privateGet$2(this, _certsTrashPath),
      challengesPath: __privateGet$2(this, _challengesPath$1),
      accountKeyPath: __privateGet$2(this, _accountKeyPath),
      accountObjPath: __privateGet$2(this, _accountObjPath),
      sslDhParamsPath: __privateGet$2(this, _sslDhParamsPath),
      sslOptionsNginx: __privateGet$2(this, _sslOptionsNginx)
    };
  }
  async initialize() {
    const accountKey = await __privateMethod$3(this, _SslAcme_instances, getOrCreateAccountKey_fn).call(this);
    __privateSet(this, _client, new acme.Client({
      accountKey,
      // accountUrl: "https://acme-v02.api.letsencrypt.org/acme/acct/12345678",
      // directoryUrl: acme.directory.letsencrypt.staging,
      directoryUrl: acme.directory.letsencrypt.production
    }));
  }
  async issueCertificate(domain) {
    try {
      if (!domain) throw new Error("SSLManager: Domain is missing");
      const csrData = await __privateMethod$3(this, _SslAcme_instances, generateCsr_fn).call(this, domain);
      console.log("\u{1F50F} Requesting CA for certificates...");
      const cert = await __privateGet$2(this, _client).auto({
        csr: csrData == null ? void 0 : csrData.csr,
        email: this.email,
        termsOfServiceAgreed: true,
        challengeCreateFn: __privateMethod$3(this, _SslAcme_instances, handleHttpChallenge_fn).bind(this),
        challengeRemoveFn: __privateMethod$3(this, _SslAcme_instances, cleanupHttpChallenge_fn).bind(this)
      });
      await __privateMethod$3(this, _SslAcme_instances, saveCertificate_fn).call(this, domain, cert, csrData == null ? void 0 : csrData.csr, csrData == null ? void 0 : csrData.key);
      console.log("\u2705 SSL Certificate issued successfully!");
    } catch (error) {
      console.error("\u274C Error issuing certificate:", error);
    }
  }
  async trashCertificate(domain) {
    const certLiveDomainPath = fsPath.resolve(__privateGet$2(this, _certsLivePath), domain);
    const certTrashDomainPath = fsPath.resolve(__privateGet$2(this, _certsTrashPath), domain);
    const dirExists = await fs$1.access(certLiveDomainPath, fs$1.constants.R_OK | fs$1.constants.W_OK).then(() => true).catch(() => false);
    if (!dirExists) throw new Error(`Certifcate not found for [${domain}]`);
    await fs$1.move(certLiveDomainPath, certTrashDomainPath);
  }
}
_certsRootPath = new WeakMap();
_certsLivePath = new WeakMap();
_certsTrashPath = new WeakMap();
_challengesPath$1 = new WeakMap();
_accountKeyPath = new WeakMap();
_accountObjPath = new WeakMap();
_sslDhParamsPath = new WeakMap();
_sslOptionsNginx = new WeakMap();
_client = new WeakMap();
_SslAcme_instances = new WeakSet();
// ====================== Private Methods ====================== //
setupDirectories_fn = function() {
  fs$1.ensureDirSync(__privateGet$2(this, _certsLivePath));
  fs$1.ensureDirSync(__privateGet$2(this, _certsTrashPath));
  fs$1.ensureDirSync(__privateGet$2(this, _challengesPath$1));
  __privateMethod$3(this, _SslAcme_instances, generateOptionsSslNginxConf_fn).call(this);
  __privateMethod$3(this, _SslAcme_instances, generateDhParams_fn).call(this);
};
generateOptionsSslNginxConf_fn = async function() {
  const optionsSslNginxConf = `IyBUaGlzIGZpbGUgY29udGFpbnMgaW1wb3J0YW50IHNlY3VyaXR5IHBhcmFtZXRlcnMuIElmIHlvdSBtb2RpZnkgdGhpcyBmaWxlCiMgbWFudWFsbHksIFdlIHdvdWxkIGJlIHVuYWJsZSB0byBhdXRvbWF0aWNhbGx5IHByb3ZpZGUgZnV0dXJlIHNlY3VyaXR5CiMgdXBkYXRlcy4gSW5zdGVhZCwgd2lsbCBwcmludCBhbmQgbG9nIGFuIGVycm9yIG1lc3NhZ2Ugd2l0aCBhIHBhdGggdG8KIyB0aGUgdXAtdG8tZGF0ZSBmaWxlIHRoYXQgeW91IHdpbGwgbmVlZCB0byByZWZlciB0byB3aGVuIG1hbnVhbGx5IHVwZGF0aW5nCiMgdGhpcyBmaWxlLgoKc3NsX3Nlc3Npb25fY2FjaGUgc2hhcmVkOmxlX25naW54X1NTTDoxMG07CnNzbF9zZXNzaW9uX3RpbWVvdXQgMTQ0MG07CnNzbF9zZXNzaW9uX3RpY2tldHMgb2ZmOwoKc3NsX3Byb3RvY29scyBUTFN2MS4yIFRMU3YxLjM7CnNzbF9wcmVmZXJfc2VydmVyX2NpcGhlcnMgb2ZmOwoKc3NsX2NpcGhlcnMgIkVDREhFLUVDRFNBLUFFUzEyOC1HQ00tU0hBMjU2OkVDREhFLVJTQS1BRVMxMjgtR0NNLVNIQTI1NjpFQ0RIRS1FQ0RTQS1BRVMyNTYtR0NNLVNIQTM4NDpFQ0RIRS1SU0EtQUVTMjU2LUdDTS1TSEEzODQ6RUNESEUtRUNEU0EtQ0hBQ0hBMjAtUE9MWTEzMDU6RUNESEUtUlNBLUNIQUNIQTIwLVBPTFkxMzA1OkRIRS1SU0EtQUVTMTI4LUdDTS1TSEEyNTY6REhFLVJTQS1BRVMyNTYtR0NNLVNIQTM4NCI7Cg==`;
  fs$1.writeFileSync(__privateGet$2(this, _sslOptionsNginx), Buffer.from(optionsSslNginxConf, "base64"));
};
generateDhParams_fn = async function() {
  if (fs$1.existsSync(__privateGet$2(this, _sslDhParamsPath))) return;
  console.log("\u{1F50F} Generating SSL DH Params...");
  const dh = nodeCrypto.createDiffieHellman(2048);
  const prime = dh.getPrime();
  const generator = dh.getGenerator();
  fs$1.writeFileSync(__privateGet$2(this, _sslDhParamsPath), __privateMethod$3(this, _SslAcme_instances, createPemContent_fn).call(this, prime, "DH PARAMETERS"));
  console.log("DH Parameters saved to dhparam.pem", "Generator:", generator.toString());
};
getOrCreateAccountKey_fn = async function() {
  if (!fs$1.existsSync(__privateGet$2(this, _accountKeyPath))) {
    console.log("\u{1F511} Generating new account key...");
    const accountKey = await acme.crypto.createPrivateEcdsaKey();
    await fs$1.outputFile(__privateGet$2(this, _accountKeyPath), accountKey);
  }
  return fs$1.readFileSync(__privateGet$2(this, _accountKeyPath), "utf8");
};
generateCsr_fn = async function(domain) {
  if (!domain) throw new Error("SSLManager: Domain is missing");
  console.log("\u{1F50F} Generating CSR and key...");
  const [key, csr] = await acme.crypto.createCsr({ altNames: domain });
  return { key, csr };
};
saveCertificate_fn = async function(domain, cert, csr, key) {
  var _a2;
  if (!domain) throw new Error("SSLManager: Domain is missing");
  const certPath = fsPath.resolve(__privateGet$2(this, _certsLivePath), String((_a2 = cleanArray$3(domain)) == null ? void 0 : _a2[0]));
  await fs$1.ensureDir(certPath);
  await fs$1.outputFile(`${certPath}/cert.pem`, cert);
  await fs$1.outputFile(`${certPath}/cert.crt`, cert);
  await fs$1.outputFile(`${certPath}/priv.pem`, key);
  await fs$1.outputFile(`${certPath}/priv.key`, key);
  await fs$1.outputFile(`${certPath}/sign.pem`, csr);
  await fs$1.outputFile(`${certPath}/sign.csr`, csr);
  console.log(`\u{1F4DC} [${domain}] certificate and key saved!`);
};
handleHttpChallenge_fn = async function(authz, challenge, keyAuthorization) {
  const challengeFilePath = fsPath.join(__privateGet$2(this, _challengesPath$1), challenge == null ? void 0 : challenge.token);
  await fs$1.outputFile(challengeFilePath, keyAuthorization || "");
  console.log(`\u{1F4C2} Challenge file created: ${challengeFilePath}`);
  return challengeFilePath;
};
cleanupHttpChallenge_fn = async function(authz, challenge, keyAuthorization) {
  const challengeFilePath = fsPath.join(__privateGet$2(this, _challengesPath$1), challenge == null ? void 0 : challenge.token);
  await fs$1.remove(challengeFilePath);
  console.log(`\u{1F9F9} Challenge file removed: ${challengeFilePath}`);
};
createPemContent_fn = function(base64Str, boundaryName) {
  base64Str = Buffer.isBuffer(base64Str) ? base64Str.toString("base64") : base64Str.toString();
  boundaryName = (boundaryName || "DATA").toUpperCase();
  const maxLineLength = 64;
  let result = `-----BEGIN ${boundaryName}-----
`;
  for (let i = 0; i < base64Str.length; i += maxLineLength) {
    result += base64Str.slice(i, i + maxLineLength) + "\n";
  }
  result += `-----END ${boundaryName}-----
`;
  return result;
};
isCertKeyFile_fn = function(filePath) {
  if (!filePath) return false;
  const pathInfo = fsPath.parse("" + filePath);
  const fileData = fs$1.readFileSync("" + filePath, "utf8");
  const isValid = !!~fileData.indexOf(`PRIVATE KEY--`);
  const fileNameLowerCased = ((pathInfo == null ? void 0 : pathInfo.base) || "").toLowerCase();
  if (isValid && fileNameLowerCased.endsWith(".key")) return true;
  if (isValid && fileNameLowerCased.endsWith(".pem") && fileNameLowerCased.startsWith("priv")) return true;
  return false;
};
isCertMainFile_fn = function(filePath) {
  if (!filePath) return false;
  const pathInfo = fsPath.parse("" + filePath);
  const fileData = fs$1.readFileSync("" + filePath, "utf8");
  const isValid = !!~fileData.indexOf(`--BEGIN CERTIFICATE--`);
  const fileNameLowerCased = ((pathInfo == null ? void 0 : pathInfo.base) || "").toLowerCase();
  if (isValid && (fileNameLowerCased == null ? void 0 : fileNameLowerCased.endsWith(".crt"))) return true;
  if (isValid && (fileNameLowerCased == null ? void 0 : fileNameLowerCased.endsWith(".cer"))) return true;
  if (isValid && (fileNameLowerCased == null ? void 0 : fileNameLowerCased.endsWith(".pem")) && (fileNameLowerCased == null ? void 0 : fileNameLowerCased.startsWith("cert"))) return true;
  return false;
};

var __typeError$2 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$2 = (obj, member, msg) => member.has(obj) || __typeError$2("Cannot " + msg);
var __privateAdd$2 = (obj, member, value) => member.has(obj) ? __typeError$2("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod$2 = (obj, member, method) => (__accessCheck$2(obj, member, "access private method"), method);
var _SslMeta_instances, daysLeft_fn$1, remarks_fn, httpsRequest_fn, isWildcardMatch_fn;
const cleanArray$2 = (...val) => [].concat(...val).filter(Boolean);
class SslMeta {
  constructor() {
    __privateAdd$2(this, _SslMeta_instances);
    this.db = localdb("certs-monitored");
    this.deletedDb = localdb("certs-monitored", "deletedData");
    this.cacheDb = localdb("certs-monitored-cache");
  }
  async fetch(domain) {
    var _a, _b, _c, _d, _e;
    try {
      if (!domain) throw new Error("Domain is missing");
      const cached = this.cacheDb.selectDataKey(domain, true).getData(null, { raw: true });
      if (cached == null ? void 0 : cached.value) return { ...cached.value, cachedAt: cached.addedAtIso };
      const options = {
        host: domain,
        port: 443,
        method: "GET",
        timeout: 1e4,
        rejectUnauthorized: false,
        // Allow self-signed certificates
        agent: new https.Agent({ maxCachedSessions: 0 })
        // Disable session caching
      };
      const resp = await __privateMethod$2(this, _SslMeta_instances, httpsRequest_fn).call(this, options);
      const peerCert = resp == null ? void 0 : resp.socket.getPeerCertificate();
      if (!peerCert || Object.keys(peerCert).length === 0) {
        throw new Error("INVALID_PEER_CERTIFICATE");
      }
      if ((peerCert == null ? void 0 : peerCert.issuer) && (peerCert == null ? void 0 : peerCert.subject) && JSON.stringify(peerCert == null ? void 0 : peerCert.issuer) === JSON.stringify(peerCert == null ? void 0 : peerCert.subject)) {
        throw new Error("SELF_SIGNED_SSL_CERTIFCATE");
      }
      const cert = {};
      cert.domain = domain;
      cert.error = null;
      cert.isCertAuth = peerCert == null ? void 0 : peerCert.ca;
      cert.subject_name = (_a = peerCert == null ? void 0 : peerCert.subject) == null ? void 0 : _a.CN;
      cert.subject_names = lo([]).concat((_b = peerCert == null ? void 0 : peerCert.subject) == null ? void 0 : _b.CN, peerCert == null ? void 0 : peerCert.subjectaltname.replaceAll("DNS:", "").split(",")).map(lo.trim).uniq().value();
      cert.subject_alt_name = peerCert == null ? void 0 : peerCert.subjectaltname.replaceAll("DNS:", "").split(",");
      cert.validNames = cert.subject_names.filter((n) => __privateMethod$2(this, _SslMeta_instances, isWildcardMatch_fn).call(this, domain, n));
      cert.issuer_name = (_c = peerCert == null ? void 0 : peerCert.issuer) == null ? void 0 : _c.CN;
      cert.issuer_org = (_d = peerCert == null ? void 0 : peerCert.issuer) == null ? void 0 : _d.O;
      cert.issuer_loc = (_e = peerCert == null ? void 0 : peerCert.issuer) == null ? void 0 : _e.C;
      cert.issuer = !cert.issuer_org ? "" : `(${cert.issuer_name}) ${cert.issuer_org}, ${cert.issuer_loc}`;
      cert.serial_number = peerCert == null ? void 0 : peerCert.serialNumber;
      cert.fingerprint = peerCert == null ? void 0 : peerCert.fingerprint;
      cert.valid_from = new Date(peerCert == null ? void 0 : peerCert.valid_from).toISOString();
      cert.valid_to = new Date(peerCert == null ? void 0 : peerCert.valid_to).toISOString();
      cert.expiry = new Date(peerCert == null ? void 0 : peerCert.valid_to).toISOString();
      cert.days_left = __privateMethod$2(this, _SslMeta_instances, daysLeft_fn$1).call(this, peerCert == null ? void 0 : peerCert.valid_to);
      cert.isExpired = cert.days_left <= 0;
      cert.isValid = (cert == null ? void 0 : cert.validNames.length) > 0 && cert.days_left > 0;
      cert.remarks = __privateMethod$2(this, _SslMeta_instances, remarks_fn).call(this, cert);
      if (!(cert == null ? void 0 : cert.isValid)) throw new Error("INVALID_SSL");
      if (cert == null ? void 0 : cert.isExpired) throw new Error("EXPIRED_SSL");
      this.cacheDb.selectDataKey(domain, true).setData(cert, "1d");
      return cert;
    } catch (err) {
      const cert = {};
      cert.domain = domain || "";
      cert.error = (err == null ? void 0 : err.message) || err;
      cert.remarks = __privateMethod$2(this, _SslMeta_instances, remarks_fn).call(this, cert);
      {
        this.cacheDb.selectDataKey(domain, true).setData(cert, "1d");
      }
      return cert;
    }
  }
  fetchInBulk(domains) {
    if (domains && Array.isArray(domains)) {
      domains = domains.map((domain) => domain.toLowerCase());
    }
    domains = cleanArray$2(this.db.getData(), domains);
    if (!Array.isArray(domains) && domains.length <= 0) return [];
    return Promise.all(domains.map((domain) => this.fetch(domain)));
  }
  list() {
    return cleanArray$2(this.db.getData());
  }
  insert(domains) {
    if (!Array.isArray(domains)) {
      throw new Error("Input must be an array");
    }
    domains = domains.map((domain) => domain.toLowerCase());
    const savedDomains = this.db.getData([]);
    domains = savedDomains.concat(domains);
    const uniqueDomains = lo(domains).uniq().sortBy().value();
    this.db.setData(uniqueDomains);
  }
  delete(domains) {
    if (!Array.isArray(domains)) {
      throw new Error("Input must be an array");
    }
    domains = domains.map((domain) => domain.toLowerCase());
    let savedDomains = this.db.getData([]);
    let deletedDomains = this.deletedDb.getData([]);
    savedDomains = savedDomains.filter((domain) => !domains.includes(domain));
    deletedDomains = deletedDomains.concat(domains);
    savedDomains = lo(savedDomains).uniq().sortBy().value();
    deletedDomains = lo(deletedDomains).uniq().sortBy().value();
    this.db.setData(savedDomains);
    this.deletedDb.setData(deletedDomains);
    domains.map((domain) => this.cacheDb.selectDataKey(domain, true).deleteData());
  }
  refresh(domains) {
    if (!Array.isArray(domains)) {
      throw new Error("Input must be an array");
    }
    domains = domains.map((domain) => domain.toLowerCase());
    domains.map((domain) => this.cacheDb.selectDataKey(domain, true).deleteData());
    return Promise.all(domains.map((domain) => this.fetch(domain)));
  }
  purgeCache() {
    this.cacheDb.deleteAllData();
  }
}
_SslMeta_instances = new WeakSet();
daysLeft_fn$1 = function(validTo) {
  const currentDate = /* @__PURE__ */ new Date();
  const validToDate = new Date(validTo);
  const DAY_IN_MS = 1e3 * 60 * 60 * 24;
  const diff_in_ms = validToDate - currentDate;
  return Math.floor(diff_in_ms / DAY_IN_MS);
};
remarks_fn = function(cert) {
  var _a;
  cert.error = String(((_a = cert == null ? void 0 : cert.error) == null ? void 0 : _a.message) || (cert == null ? void 0 : cert.error) || "");
  if (/EPROTO/.test(cert == null ? void 0 : cert.error)) return "SSL not active";
  if (/EAI_AGAIN/.test(cert == null ? void 0 : cert.error)) return "Domain not found";
  if (/ENOTFOUND/.test(cert == null ? void 0 : cert.error)) return "Domain not found";
  if (/TIMEDOUT/.test(cert == null ? void 0 : cert.error)) return "Domain server is down";
  if (/ECONNREFUSED/.test(cert == null ? void 0 : cert.error)) return "Domain server is down";
  if (/INVALID_SSL/.test(cert == null ? void 0 : cert.error)) return `SSL certificate is invalid`;
  if (/INVALID_PEER_CERTIFICATE/.test(cert == null ? void 0 : cert.error)) return `Peer certificate is invalid`;
  if (/SELF_SIGNED_SSL_CERTIFCATE/.test(cert == null ? void 0 : cert.error)) return `SSL certificate is self signed`;
  if (cert == null ? void 0 : cert.isExpired) return `SSL certifcate expired`;
  if (cert == null ? void 0 : cert.isValid) return `${cert == null ? void 0 : cert.days_left} days left`;
  return (cert == null ? void 0 : cert.error) || `UNKNOWN ERROR`;
};
httpsRequest_fn = function(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => resolve(res));
    if (options == null ? void 0 : options.timeout) req.setTimeout(options == null ? void 0 : options.timeout, () => req.destroy([new Error("REQUEST_TIMEDOUT")]));
    req.on("error", (err) => reject(err));
    req.end();
  });
};
isWildcardMatch_fn = function(domain, wildcard) {
  if (domain === wildcard) return true;
  if (!wildcard.startsWith("*.")) return false;
  if (wildcard.split(".").length < 3) return false;
  const baseDomain = wildcard.slice(2);
  return domain.endsWith(baseDomain) && domain.split(".").length === baseDomain.split(".").length + 1;
};

const safeKey = (key) => String(key).replace(new RegExp("(\\.)", "g"), "!");
const unsafeKey = (key) => String(key).replace(new RegExp("(!)", "g"), ".");
class NginxParser {
  constructor() {
    this.fileName = null;
    this.serverRoot = null;
  }
  /**
   * To support including sub-configs, we need to get server root
   * @param fileName
   */
  setFileName(fileName) {
    this.fileName = fileName;
    if (this.serverRoot === null) {
      this.serverRoot = dirname$1(fileName);
    }
  }
  /**
   * @method resolve
   * @summary Retrieves a value from within an object using a dot-notation path
   * @param obj {Object} The object to search
   * @param path {String} The path to the value
   * @returns The found value, or `undefined`
   * @example
   *
   *    const myObject = {
   *      foo: {
   *        bar: 'baz'
   *      }
   *    };
   *    resolve(myObject, 'foo.bar') // returns 'baz'
   *
   */
  resolve(obj, path) {
    return path.split(".").reduce((prev, curr) => {
      return typeof prev === "object" && prev ? prev[unsafeKey(curr)] : void 0;
    }, obj);
  }
  /**
   * @method resolveSet
   * @summary Sets a value within an object using a dot-notation path
   * @param obj {Object} The object to store/update the value in
   * @param path {String} The path to the value
   * @param val {Mixed} The value to store
   * @returns {Boolean} Whether the operation was successful
   * @example
   *
   *     const myObject = {
   *       foo: {
   *         bar: 'baz'
   *       }
   *     };
   *     resolveSet(myObject, 'foo.bar', 999) // myObject.foo.bar === 999
   *
   */
  resolveSet(obj, path, val) {
    let components = path.split(".");
    while (components.length > 0) {
      if (typeof obj !== "object") break;
      if (components.length === 1) {
        obj[unsafeKey(components[0])] = val;
        return true;
      } else {
        obj = obj[unsafeKey(components.shift())];
      }
    }
    return false;
  }
  /**
   * Read and parse a file from the filesystem
   *
   * @param {string} fileName the path to the file
   * @param {function} [cb] a callback function. invoked with an error or a parsed config
   * @param {Object} [options] optional parse options
   * @param {boolean} [options.parseIncludes] If `true`, will resolve and include
   * referenced files' contents in the output
   * @returns {object} a parsed config if no callback is provided
   */
  readConfigFile(fileName, cb, options) {
    this.setFileName(fileName);
    if (!options && cb != null && typeof cb === "object") {
      options = cb;
      cb = void 0;
    }
    if (!options) {
      options = {
        parseIncludes: true
      };
    }
    if (cb) {
      fs.stat(fileName, (statsErr, stats) => {
        if (statsErr) return cb(statsErr, null);
        else if (!stats.isFile()) return cb(new ReferenceError("File does not exist"), null);
        fs.readFile(fileName, (readErr, configString) => {
          if (readErr) return cb(readErr, null);
          cb(null, this.parse(configString, options));
        });
      });
    } else {
      if (!fs.statSync(fileName).isFile()) throw new ReferenceError("File does not exist");
      const configString = fs.readFileSync(fileName);
      return this.parse(configString, options);
    }
  }
  /**
   * Write a config object to a file on the filesystem
   *
   * @param {string} fileName a file on the filesystem
   * @param {any} data the config object
   * @param {boolean} [overwrite=false] whether to overwrite an existing file
   * @param {any} [cb] a callback to be called after writing
   * @returns
   */
  writeConfigFile(fileName, data, overwrite = false, cb = null) {
    this.setFileName(fileName);
    if (cb) {
      fs.stat(fileName, (statsErr, stats) => {
        if (statsErr) return cb(statsErr, null);
        else if (!stats.isFile() && !overwrite) return cb(new Error("File already exists, to overwrite, set `overwrite = true`"), null);
        if (typeof data === "object") data = this.toConf(data);
        fs.writeFile(fileName, data, (writeErr) => {
          if (writeErr) return cb(writeErr, null);
          cb(null, true);
        });
      });
    } else {
      if (fs.statSync(fileName).isFile() && !overwrite) throw new Error("File already exists, to overwrite, set `overwrite = true`");
      if (typeof data === "object") data = this.toConf(data);
      return fs.writeFileSync(fileName, data) === void 0;
    }
  }
  /**
   * @method parse
   * @summary Wrapper function which determines the input type and calls
   * the relevant parsing function
   * @param {Object | string} mixed The input source to be converted
   * @param {Object} [options] optional parse options
   * @param {boolean} [options.parseIncludes] If `true`, will resolve and include
   * referenced files' contents in the output
   * @param {string} [options.includesRoot] An optional root path to resolve includes from
   * @returns {Object | string} The converted input
   * @throws {TypeError} If type of `mixed` isn't either Object or String
   * @example
   *
   *     const myObject = require('./sampleJSON')
   *     parse(myObject) // returns config string
   *
   */
  parse(mixed, options) {
    if (Buffer.isBuffer(mixed)) {
      mixed = mixed.toString("utf8");
    }
    if (typeof mixed === "object") return this.toConf(mixed);
    else if (typeof mixed === "string") return this.toJSON(mixed, options);
    else throw new TypeError(`Expected an Object or String, but got "${typeof mixed}"`);
  }
  /**
   * @method toJSON
   * @summary Converts a config string into a JS object
   * @param conf {String} The nginx config string
   * @param {Object} [options] optional parse options
   * @param {boolean} [options.parseIncludes] If `true`, will resolve and include
   * referenced files' contents in the output
   * @param {string} [options.includesRoot] An optional root path to resolve includes from
   * @returns {Object} The converted input
   * @example
   *
   *     const myConfString = require('./sampleconf')
   *     toJSON(myConfString) // returns JS object
   *
   */
  toJSON(conf, options = {}) {
    const lines = conf.replace("	", "").split("\n");
    let json = {};
    let parent = "";
    let countOfParentsThatAreArrays = 0;
    let isInLuaBlock = false;
    let luaBlockValue = [];
    lines.forEach((line) => {
      line = line.trim();
      if (isInLuaBlock && !line.endsWith("}")) {
        luaBlockValue.push(line);
        return;
      }
      if (!line || line.startsWith("#")) return;
      line = line.split("#")[0].trim();
      if (line.endsWith("{")) {
        const key = safeKey(line.slice(0, line.length - 1).trim());
        if (key.endsWith("by_lua_block")) {
          isInLuaBlock = true;
        }
        if (parent) parent += "." + key;
        else parent = key;
        if (this.appendValue(json, parent, {})) {
          parent += "." + (this.resolve(json, parent).length - 1);
          countOfParentsThatAreArrays += 1;
        }
      } else if (line.startsWith("include") && options.parseIncludes) {
        const findFiles = resolve$1(this.serverRoot || options.includesRoot || "", line.replace("include ", "").replace(";", "").trim());
        const files = glob.sync(findFiles);
        files.forEach((file) => {
          const parser = new Parser();
          parser.serverRoot = this.serverRoot;
          const config = parser.readConfigFile(file);
          for (let key in config) {
            const val = config[key];
            this.appendValue(json, key, val, parent);
          }
        });
        if (!files.length) {
          throw new ReferenceError(`Unable to resolve include statement: "${line}".
Searched in ${this.serverRoot || options.includesRoot || process.cwd()}`);
        }
      } else if (line.endsWith(";")) {
        line = line.split(" ");
        let key = line.shift();
        let val = line.join(" ").trim();
        if (key.endsWith(";")) key = key.slice(0, key.length - 1);
        val = val.slice(0, val.length - 1);
        this.appendValue(json, key, val, parent);
      } else if (line.endsWith("}")) {
        if (isInLuaBlock) {
          this.appendValue(json, "_lua", luaBlockValue, parent);
          luaBlockValue = [];
          isInLuaBlock = false;
        }
        parent = parent.split(".");
        if (countOfParentsThatAreArrays > 0 && !isNaN(parseInt(parent[parent.length - 1], 10))) {
          parent.pop();
          countOfParentsThatAreArrays -= 1;
        }
        parent.pop();
        parent = parent.join(".");
      }
    });
    return json;
  }
  /**
   * Resolve setting value with merging existing value and converting it
   * to array. When true is returned, an array was used
   * @return bool
   */
  resolveAppendSet(json, key, val) {
    let isInArray = false;
    const existingVal = this.resolve(json, key);
    if (existingVal) {
      var mergedValues = [];
      if (Array.isArray(existingVal)) {
        mergedValues = existingVal;
      } else if (typeof existingVal !== "undefined") {
        mergedValues.push(existingVal);
      }
      if (Array.isArray(val)) {
        val.forEach(function(value) {
          mergedValues.push(value);
        });
      } else {
        mergedValues.push(val);
      }
      val = mergedValues;
      isInArray = true;
    }
    this.resolveSet(json, key, val);
    return isInArray;
  }
  /**
   * Appends given value into json with parent detection -> resolveSet or resolve
   *
   * @param {Object} json
   * @param {string} key
   * @param val
   * @param {string} parent
   */
  appendValue(json, key, val, parent = void 0) {
    if (parent) {
      return this.resolveAppendSet(json, parent + "." + key, val);
    } else {
      return this.resolveAppendSet(json, key, val);
    }
  }
  /**
   * @method toConf
   * @summary Converts a JS object into a config string
   * @param json {Object} The nginx config represented as a JS object
   * @returns {String} The converted input
   * @example
   *
   *     const myJSObject = require('./samplejson')
   *     toConf(myJSObject) // returns a config string
   *
   */
  toConf(json) {
    const recurse = (obj, depth) => {
      let retVal = "";
      let longestKeyLen = 1;
      const indent = "    ".repeat(depth);
      for (let key in obj) {
        longestKeyLen = Math.max(longestKeyLen, key.length);
      }
      for (let key in obj) {
        const val = obj[key];
        const keyValSpacing = longestKeyLen - key.length + 4;
        const keyValIndent = " ".repeat(keyValSpacing);
        if (Array.isArray(val)) {
          if (key === "_lua") {
            retVal += val.length > 0 ? indent : "";
            retVal += val.join("\n" + indent);
            retVal += "\n";
          } else {
            val.forEach((subVal) => {
              let block = false;
              if (typeof subVal === "object") {
                block = true;
                subVal = " {\n" + recurse(subVal, depth + 1) + indent + "}\n\n";
              }
              let spacing = block ? " " : keyValIndent;
              retVal += indent + (key + spacing + subVal).trim();
              block ? retVal += "\n" : retVal += ";\n";
            });
          }
        } else if (typeof val === "object") {
          retVal += indent + key + " {\n";
          retVal += recurse(val, depth + 1);
          retVal += indent + "}\n\n";
        } else {
          retVal += indent + (key + keyValIndent + val).trim() + ";\n";
        }
      }
      return retVal;
    };
    return recurse(json, 0);
  }
}

var __typeError$1 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$1 = (obj, member, msg) => member.has(obj) || __typeError$1("Cannot " + msg);
var __privateGet$1 = (obj, member, getter) => (__accessCheck$1(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$1 = (obj, member, value) => member.has(obj) ? __typeError$1("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod$1 = (obj, member, method) => (__accessCheck$1(obj, member, "access private method"), method);
var _a$1, _challengesPath, _allowedKeys, _NginxHandler_instances, buildConfRootLocation_fn, fetchConfMeta_fn;
const cleanArray$1 = (...val) => [].concat(...val).filter(Boolean);
const NUXT_LOCAL_DB_DIR = ((_a$1 = process == null ? void 0 : process.env) == null ? void 0 : _a$1.NUXT_LOCAL_DB_DIR) || ".localdb/";
class NginxHandler {
  constructor(args) {
    __privateAdd$1(this, _NginxHandler_instances);
    __privateAdd$1(this, _challengesPath, fsPath.resolve(NUXT_LOCAL_DB_DIR, "acme-ssl", "challenges"));
    __privateAdd$1(this, _allowedKeys, ["enableIndexing", "enableSSL", "forceSSL", "confType", "domain", "target"]);
    this.nginx = new NginxParser();
    this.webSites = args == null ? void 0 : args.webSites;
  }
  sanitizeDomains(val) {
    if (!val) return [];
    val = String(val || "").replace(/[^a-z0-9\-\.]/gi, " ").replace(/\s+/g, " ").split(" ");
    const validDomainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    val = Array.from(new Set(val)).filter((site) => validDomainRegex.test(site));
    val.sort();
    return cleanArray$1(val);
  }
  validateTarget({ enableIndexing, enableSSL, forceSSL, confType, domain, target }) {
    const isHttpStr = /^(https?\:\/\/)/i.test(target);
    const isBindStr = /^(https?\:\/\/)?(0\.0\.0\.0)(\:\d{2,5})/i.test(target);
    const isValidUrl = /^(https?\:\/\/)?([a-zA-Z0-9\-\.]+)(\:\d{2,5})?(\/[^\s]*)?/i.test(target);
    const isLocalIP = /^(https?\:\/\/)?(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3})/i.test(target);
    if (confType !== "serve" && !isHttpStr) throw new Error("Invalid protocol. Only HTTP and HTTPS URL(s) are allowed.");
    switch (confType) {
      case "serve": {
        const isDirPath = target.startsWith("/");
        if (!isDirPath) throw new Error(`Invalid serve target for [${domain}]`);
        return true;
      }
      case "proxy": {
        if (isLocalIP) throw new Error("Localhost or Internal IP not allowed.");
        if (!isBindStr && !isValidUrl) throw new Error(`Invalid proxy target`);
        return true;
      }
      case "redirect": {
        if (isLocalIP) throw new Error("Localhost or Internal IP not allowed.");
        if (isBindStr) throw new Error("Localhost or Internal IP not allowed.");
        if (!isValidUrl) throw new Error("Invalid URL format.");
        return true;
      }
    }
    throw new Error(`Invalid Target for ${confType}`);
  }
  async validateAndSanitize(input) {
    var _a2, _b, _c;
    if (!input) throw new Error("INVALID_INPUT_PAYLOAD");
    input.domain = this.sanitizeDomains(input == null ? void 0 : input.domain);
    const ConfSchema = z.object({
      //
      enableIndexing: z.boolean().default(false),
      enableSSL: z.boolean().default(false),
      forceSSL: z.boolean().default(false),
      confType: z.string().refine((val) => ["serve", "proxy", "redirect"].includes(val), { message: "Invalid Conf Type" }),
      domain: z.string().trim().array().nonempty().refine((val) => val.length > 0, { message: "Invalid Domains" }),
      target: z.string().trim().min(10).transform((val) => lo.trimEnd(val, "/"))
    }).strict().refine(this.validateTarget);
    const result = await ConfSchema.safeParseAsync(lo.pick(input, __privateGet$1(this, _allowedKeys)));
    if (result == null ? void 0 : result.success) return result == null ? void 0 : result.data;
    const firstError = (_b = (_a2 = result == null ? void 0 : result.error) == null ? void 0 : _a2.issues) == null ? void 0 : _b[0];
    throw new Error(`${input == null ? void 0 : input.domain} ~ ${firstError == null ? void 0 : firstError.path} ERROR: ${(_c = firstError == null ? void 0 : firstError.message) == null ? void 0 : _c.toLowerCase()}`);
  }
  async touchConf(path) {
    if (fs$1.existsSync(path) === false) {
      fs$1.writeFileSync(path, "");
    }
  }
  async readConf(path) {
    var _a2, _b, _c;
    const raw = shelljs.cat(path);
    try {
      if (!raw) return {};
      const match = String(raw).match(/\#\#\#\s*(.+)\s*\#\#\#/);
      if (!match) throw "oops";
      const jsonData = JSON.parse(match == null ? void 0 : match[1]);
      if (jsonData == null ? void 0 : jsonData.sites) {
        jsonData.domain = jsonData == null ? void 0 : jsonData.sites;
        delete jsonData.sites;
      }
      jsonData.domain = cleanArray$1(jsonData == null ? void 0 : jsonData.domain).join(" ");
      return JSON.parse(JSON.stringify(jsonData));
    } catch (e) {
      const config = this.nginx.toJSON(raw);
      if (!(config == null ? void 0 : config.server)) return null;
      const domain = this.sanitizeDomains(((_a2 = config == null ? void 0 : config.server) == null ? void 0 : _a2.server_name) || "").join(" ");
      const sslCert = ((_c = String((_b = config == null ? void 0 : config.server) == null ? void 0 : _b.ssl_certificate).match(/letsencrypt\/live\/([^\/]+)\//i)) == null ? void 0 : _c[1]) || null;
      const confMeta = await __privateMethod$1(this, _NginxHandler_instances, fetchConfMeta_fn).call(this, config == null ? void 0 : config.server);
      return { ...confMeta, domain, sslCert };
    }
  }
  async writeConf(path, obj) {
    var _a2, _b, _c;
    obj = lo.pick(obj, __privateGet$1(this, _allowedKeys));
    const isDefaultConf = path.endsWith("_default.conf");
    const portSuffix = isDefaultConf ? "default_server" : "";
    obj = JSON.parse(JSON.stringify(obj));
    obj.domain = this.sanitizeDomains(obj == null ? void 0 : obj.domain);
    if (((_a2 = obj == null ? void 0 : obj.domain) == null ? void 0 : _a2.length) <= 0) throw new Error("Domain is missing");
    if (((_b = obj == null ? void 0 : obj.domain) == null ? void 0 : _b.length) !== 1) throw new Error("Multiple domains are not supported anymore");
    obj.domain = (_c = obj == null ? void 0 : obj.domain) == null ? void 0 : _c.join();
    const locations = {};
    locations.root = { "location /": await __privateMethod$1(this, _NginxHandler_instances, buildConfRootLocation_fn).call(this, obj) };
    if (!(locations == null ? void 0 : locations.root)) throw new Error("Error generting configuration file");
    locations.acmeChallenges = {
      "location /.well-known/acme-challenge/": {
        alias: __privateGet$1(this, _challengesPath) + "/"
      }
    };
    locations.forceSSL = { "location /": { return: "301 https://$host$request_uri" } };
    locations.htaccessDeny = { "location ~ /.ht": { deny: "all" } };
    locations.phpPlain = {
      "location ~ .php$": {
        default_type: "text/plain",
        try_files: "$uri $uri/ =404",
        root: obj == null ? void 0 : obj.target
      }
    };
    locations.phpFpm = {
      "location ~ .php$": {
        include: ["snippets/fastcgi-php.conf", "fastcgi_params"],
        fastcgi_pass: "unix:/var/run/php/php7.4-fpm.sock",
        fastcgi_param: "SCRIPT_FILENAME $document_root$fastcgi_script_name"
      }
    };
    const server80 = {};
    server80.listen = [`80 ${portSuffix}`.trim(), `[::]:80 ${portSuffix}`.trim()];
    server80.server_name = isDefaultConf ? "_" : obj == null ? void 0 : obj.domain;
    server80.error_page = ["404 /404.html", "500 502 503 504 /50x.html"];
    Object.assign(server80, locations == null ? void 0 : locations.acmeChallenges);
    if ((obj == null ? void 0 : obj.forceSSL) && (obj == null ? void 0 : obj.enableSSL)) {
      Object.assign(server80, locations == null ? void 0 : locations.forceSSL);
    } else {
      Object.assign(server80, locations == null ? void 0 : locations.root);
      if ((obj == null ? void 0 : obj.confType) === "serve") Object.assign(server80, locations == null ? void 0 : locations.htaccessDeny);
    }
    const server443 = {};
    if (obj == null ? void 0 : obj.enableSSL) {
      let sslCert = await this.webSites.findOneCert(obj == null ? void 0 : obj.domain);
      if (!sslCert) {
        await this.webSites.installCert(obj == null ? void 0 : obj.domain);
        sslCert = await this.webSites.findOneCert(obj == null ? void 0 : obj.domain);
      }
      if (!sslCert) throw new Error("Sorry, we tried to install certificate but failed. Please contact administrator");
      server443.listen = [`443 ssl ${portSuffix}`.trim(), `[::]:443 ssl ${portSuffix}`.trim()];
      server443.server_name = isDefaultConf ? "_" : obj == null ? void 0 : obj.domain;
      server443.error_page = ["404 /404.html", "500 502 503 504 /50x.html"];
      Object.assign(server80, locations == null ? void 0 : locations.acmeChallenges);
      Object.assign(server443, locations == null ? void 0 : locations.root);
      if ((obj == null ? void 0 : obj.confType) === "serve") Object.assign(server443, locations == null ? void 0 : locations.htaccessDeny);
      if ((sslCert == null ? void 0 : sslCert.certName) && (sslCert == null ? void 0 : sslCert.certPath) && (sslCert == null ? void 0 : sslCert.certKeyPath)) {
        const sslPaths = this.webSites.getCertDirPaths();
        Object.assign(server443, {
          include: sslPaths == null ? void 0 : sslPaths.sslOptionsNginx,
          // ssl_dhparam: sslPaths?.sslDhParamsPath,
          ssl_certificate: sslCert == null ? void 0 : sslCert.certPath,
          ssl_certificate_key: sslCert == null ? void 0 : sslCert.certKeyPath
        });
      }
    }
    const confContent = [
      //
      `###${JSON.stringify(obj)}###`,
      // !isDefaultConf ? null : this.nginx.toConf({ types: { "text/html": "php" }, default_type: "application/octet-stream12" }).trim(),
      this.nginx.toConf(!(obj == null ? void 0 : obj.enableSSL) ? null : { server: server443 }).trim(),
      this.nginx.toConf({ server: server80 }).trim()
    ].filter(Boolean).join("\n\n");
    fs$1.writeFileSync(path, confContent);
    return await this.readConf(path);
  }
  async testConfs() {
    const returned = await sudoExec("nginx -t 2>&1");
    if (!/ok/i.test(returned || "")) throw new Error(`Error in nginx conf, ${returned}`);
    console.log(`\u2705 nginx configuration test passed`);
    return "OK";
  }
  async reload() {
    try {
      await this.testConfs();
      const reloaded = await sudoExec("systemctl reload nginx");
      console.log(`\u2705 nginx configuration reloaded`, reloaded);
    } catch (err) {
      console.log("\u274C nginx configuration reloaded:", (err == null ? void 0 : err.message) || err);
      return null;
    }
  }
}
_challengesPath = new WeakMap();
_allowedKeys = new WeakMap();
_NginxHandler_instances = new WeakSet();
buildConfRootLocation_fn = async function(obj) {
  if ((obj == null ? void 0 : obj.confType) === "serve") {
    return {
      root: obj == null ? void 0 : obj.target,
      index: "index.html index.htm index.php index.nginx-debian.html",
      try_files: "$uri $uri/ =404",
      autoindex: (obj == null ? void 0 : obj.enableIndexing) ? "on" : "off"
    };
  }
  if ((obj == null ? void 0 : obj.confType) === "redirect") {
    return { rewrite: `^(.*)$ ${obj == null ? void 0 : obj.target}$1 redirect` };
  }
  if ((obj == null ? void 0 : obj.confType) === "proxy") {
    return {
      proxy_pass: obj == null ? void 0 : obj.target,
      proxy_set_header: [
        // proxy headers
        "X-Real-IP $remote_addr",
        "X-Forwarded-For $proxy_add_x_forwarded_for",
        "X-Forwarded-Proto $scheme"
      ]
    };
  }
  return null;
};
fetchConfMeta_fn = async function(server) {
  const location = server == null ? void 0 : server["location /"];
  if (location == null ? void 0 : location.proxy_pass) return { confType: "proxy", target: location == null ? void 0 : location.proxy_pass };
  if (location == null ? void 0 : location.rewrite) return { confType: "redirect", target: location == null ? void 0 : location.rewrite };
  if ((location == null ? void 0 : location.root) || (server == null ? void 0 : server.root)) return { confType: "serve", target: (location == null ? void 0 : location.root) || (server == null ? void 0 : server.root) };
  return null;
};

var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _a, _accountFilePath, _confDirPath, _WebSites_instances, parseHexaId_fn, generateFilename_fn, setConfData_fn, setDefaultConf_fn, dnsIpLookup_fn, checkDomainsInUse_fn, filterCerts_fn, unwindCerts_fn, daysLeft_fn;
const cleanArray = (val) => [].concat(val).filter(Boolean);
const LOCAL_DB_DIR = ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.NUXT_LOCAL_DB_DIR) || ".localdb/";
class WebSites {
  constructor() {
    __privateAdd(this, _WebSites_instances);
    __privateAdd(this, _accountFilePath, fsPath.resolve(LOCAL_DB_DIR, "account.json"));
    __privateAdd(this, _confDirPath, fsPath.resolve(LOCAL_DB_DIR, "sites.conf.d"));
    const accountObj = fs$1.readJsonSync(__privateGet(this, _accountFilePath));
    if (!(accountObj == null ? void 0 : accountObj.vpsUser)) throw new Error("Please setup admin user first");
    this.sslMeta = new SslMeta();
    this.sslAcme = new SslAcme({ webSites: this, email: accountObj == null ? void 0 : accountObj.username });
    this.nginx = new NginxHandler({ webSites: this });
    this.nginxReload = debounce(() => this.nginx.reload(), 1e3);
    this.touch();
  }
  touch() {
    if (fs$1.existsSync(__privateGet(this, _confDirPath)) === false) {
      fs$1.mkdirSync(__privateGet(this, _confDirPath));
    }
  }
  async list() {
    var _a2;
    if (!shelljs.test("-d", __privateGet(this, _confDirPath))) throw new Error("Invalid Path");
    const confFiles = shelljs.find(__privateGet(this, _confDirPath));
    const sslDomains = await this.findSslDomains();
    const sslMonitors = await this.sslMeta.list();
    const data = [];
    for (const confPath of confFiles) {
      if (!/\.(conf|dump)$/i.test(confPath)) {
        continue;
      }
      const confId = hexEncode(confPath);
      const confName = confPath.split("/").pop();
      const confData = await this.nginx.readConf(confPath);
      const isActive = confName.split(".").pop() === "conf";
      const isDefault = confPath.endsWith("_default.conf");
      if (!((_a2 = confData == null ? void 0 : confData.domain) == null ? void 0 : _a2.length)) continue;
      data.push({
        confId,
        confPath,
        confName,
        confType: (confData == null ? void 0 : confData.confType) || null,
        certName: (confData == null ? void 0 : confData.sslCert) || null,
        domain: confData == null ? void 0 : confData.domain,
        target: confData == null ? void 0 : confData.target,
        enableIndexing: (confData == null ? void 0 : confData.enableIndexing) || false,
        hasSSLMonitor: sslMonitors.includes(confData == null ? void 0 : confData.domain),
        hasSSL: sslDomains.includes(confData == null ? void 0 : confData.domain),
        enableSSL: confData == null ? void 0 : confData.enableSSL,
        forceSSL: confData == null ? void 0 : confData.forceSSL,
        isDefault,
        isActive
      });
    }
    return data;
  }
  async create(args) {
    const validated = await this.nginx.validateAndSanitize(args);
    await __privateMethod(this, _WebSites_instances, checkDomainsInUse_fn).call(this, validated == null ? void 0 : validated.domain);
    for (const _domain of validated == null ? void 0 : validated.domain) {
      await __privateMethod(this, _WebSites_instances, setConfData_fn).call(this, { ...validated, domain: _domain });
    }
  }
  async update(confId, options) {
    var _a2;
    const { path, file } = __privateMethod(this, _WebSites_instances, parseHexaId_fn).call(this, confId);
    const isDumped = path.endsWith(".dump");
    const isDefault = path.endsWith("_default.conf");
    if (isDefault) return await __privateMethod(this, _WebSites_instances, setDefaultConf_fn).call(this, options);
    const validated = await this.nginx.validateAndSanitize(options);
    const siteConf = await this.nginx.readConf(path);
    await __privateMethod(this, _WebSites_instances, checkDomainsInUse_fn).call(this, validated == null ? void 0 : validated.domain, { exclude: (_a2 = siteConf == null ? void 0 : siteConf.domain) == null ? void 0 : _a2.split(" ") });
    if ((validated == null ? void 0 : validated.domain.length) === 1 && (siteConf == null ? void 0 : siteConf.confType)) {
      return await __privateMethod(this, _WebSites_instances, setConfData_fn).call(this, { ...validated, confPath: path });
    }
    for (const _domain of validated == null ? void 0 : validated.domain) {
      await __privateMethod(this, _WebSites_instances, setConfData_fn).call(this, { ...validated, isDumped, domain: _domain });
    }
    await this.delete(confId);
  }
  async delete(confId) {
    const { path, file } = __privateMethod(this, _WebSites_instances, parseHexaId_fn).call(this, confId);
    const isDefaultConf = path.endsWith("_default.conf");
    if (isDefaultConf) throw new Error("Action not allowed");
    await shelljs.mv(path, (file == null ? void 0 : file.dir) + "/.trashed-" + (file == null ? void 0 : file.name) + ".trash");
    await this.nginxReload();
  }
  async enable(confId) {
    const { path, file } = __privateMethod(this, _WebSites_instances, parseHexaId_fn).call(this, confId);
    const isDefaultConf = path.endsWith("_default.conf");
    if (isDefaultConf) throw new Error("Action not allowed");
    await shelljs.mv(path, file.dir + "/" + file.name + ".conf");
    await this.nginxReload();
  }
  async disable(confId) {
    const { path, file } = __privateMethod(this, _WebSites_instances, parseHexaId_fn).call(this, confId);
    const isDefaultConf = path.endsWith("_default.conf");
    if (isDefaultConf) throw new Error("Action not allowed");
    await shelljs.mv(path, file.dir + "/" + file.name + ".dump");
    await this.nginxReload();
  }
  async rebuild(confId) {
    const { path, file } = __privateMethod(this, _WebSites_instances, parseHexaId_fn).call(this, confId);
    const isDefault = path.endsWith("_default.conf");
    const siteConf = await this.nginx.readConf(path);
    if (isDefault) {
      return await __privateMethod(this, _WebSites_instances, setDefaultConf_fn).call(this, siteConf);
    }
    const validated = await this.nginx.validateAndSanitize(siteConf);
    await this.update(confId, validated);
  }
  async rebuildAll() {
    const sites = await this.list();
    const promises = sites.map((site) => this.rebuild(site == null ? void 0 : site.confId));
    await Promise.all(promises);
    await this.nginxReload();
  }
  async rebuildDefaultConf() {
    const defaultConfPath = fsPath.resolve(__privateGet(this, _confDirPath), "_default.conf");
    if (!shelljs.test("-f", defaultConfPath)) {
      return await __privateMethod(this, _WebSites_instances, setDefaultConf_fn).call(this);
    }
    const defaultConfId = hexEncode(defaultConfPath);
    await this.rebuild(defaultConfId);
  }
  // =========== certificate methods ===========   //
  async installCert(domain) {
    var _a2, _b;
    if ((_b = (_a2 = process == null ? void 0 : process.env) == null ? void 0 : _a2.APP_ENV) == null ? void 0 : _b.startsWith("dev")) {
      console.log(`\u{1F5FF} Skipping, certificate installation on development server is not possible`);
      return;
    }
    domain = this.nginx.sanitizeDomains(domain);
    if (domain.length < 1) throw new Error("Domain is missing");
    if (domain.length !== 1) throw new Error("Mulitple domains are not allowed");
    await this.sslAcme.initialize();
    await this.sslAcme.issueCertificate(domain);
  }
  async deleteCert(domain) {
    domain = this.nginx.sanitizeDomains(domain);
    if (domain.length < 1) throw new Error("Domain is missing");
    if (domain.length !== 1) throw new Error("Mulitple domains are not allowed");
    await this.sslAcme.initialize();
    await this.sslAcme.trashCertificate(domain == null ? void 0 : domain[0]);
    const sites = await this.list();
    const site = sites.find((s) => (s == null ? void 0 : s.domain) === (domain == null ? void 0 : domain[0]));
    this.update(site == null ? void 0 : site.confId, {
      enableIndexing: site == null ? void 0 : site.enableIndexing,
      enableSSL: false,
      forceSSL: site == null ? void 0 : site.forceSSL,
      confType: site == null ? void 0 : site.confType,
      domain: site == null ? void 0 : site.domain,
      target: site == null ? void 0 : site.target
    }).then();
  }
  async renewCerts() {
    var _a2, _b;
    if ((_b = (_a2 = process == null ? void 0 : process.env) == null ? void 0 : _a2.APP_ENV) == null ? void 0 : _b.startsWith("dev")) {
      console.log(`\u{1F5FF} Skipping, certificate installation on development server is not possible`);
      throw new Error(`\u{1F5FF} Skipping, certificate installation on development server is not possible`);
    }
    const installed = await this.findAllCert();
    const expiring = installed.filter((itm) => (itm == null ? void 0 : itm.daysLeft) <= 1);
    const sanitized = expiring.filter((itm) => itm.domains.length);
    const promises = sanitized.map((itm) => {
      if ((itm == null ? void 0 : itm.domains.length) < 1) throw new Error("Domain is missing");
      if ((itm == null ? void 0 : itm.domains.length) !== 1) throw new Error("Mulitple domains are not allowed");
      return this.sslAcme.issueCertificate(itm == null ? void 0 : itm.domains);
    });
    console.log("\u{1F504} Renewing SSL certificate...");
    await this.sslAcme.initialize();
    return await Promise.allSettled(promises);
  }
  async findAllCert() {
    try {
      const installed = await this.sslAcme.listCertificates();
      return __privateMethod(this, _WebSites_instances, unwindCerts_fn).call(this, installed);
    } catch (error) {
      return [];
    }
  }
  async findCert(domain) {
    const certs = await this.findAllCert();
    return __privateMethod(this, _WebSites_instances, filterCerts_fn).call(this, certs, domain);
  }
  async findOneCert(domain) {
    var _a2;
    const certs = await this.findCert(domain);
    return (_a2 = [].concat(certs)) == null ? void 0 : _a2[0];
  }
  async findSslDomains() {
    const certs = await this.findCert();
    return lo([]).concat(certs).map((itm) => itm == null ? void 0 : itm.altNames).flattenDeep().uniq().sort().value();
  }
  async listSslMappings(domain) {
    const result = await this.findCert(domain);
    return Object.fromEntries(result.map((c) => [c.domain, c.subject]));
  }
  getCertDirPaths() {
    return this.sslAcme.getPaths();
  }
}
_accountFilePath = new WeakMap();
_confDirPath = new WeakMap();
_WebSites_instances = new WeakSet();
// ====================== Private Site Methods ====================== //
parseHexaId_fn = function(id) {
  const path = hexDecode(id);
  if (!shelljs.test("-f", path)) throw new Error("Invalid Path");
  const file = fsPath.parse(path);
  return { path, file };
};
generateFilename_fn = function(domain) {
  domain = domain.replace(/^www\./, "").toLowerCase();
  domain = domain.replace(/[^0-9a-z]/g, " ");
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${lo.snakeCase(domain)}_${randomStr}`;
};
setConfData_fn = async function(args) {
  var _a2, _b;
  if (!(args == null ? void 0 : args.confPath)) {
    args.confPath = `${__privateGet(this, _confDirPath)}/${__privateMethod(this, _WebSites_instances, generateFilename_fn).call(this, args == null ? void 0 : args.domain)}${(args == null ? void 0 : args.isDumped) ? ".dump" : ".conf"}`;
  }
  if (!((_b = (_a2 = process == null ? void 0 : process.env) == null ? void 0 : _a2.APP_ENV) == null ? void 0 : _b.startsWith("dev"))) {
    const dnsData = await __privateMethod(this, _WebSites_instances, dnsIpLookup_fn).call(this, args == null ? void 0 : args.domain);
    if (!(dnsData == null ? void 0 : dnsData.status)) throw new Error(`DNS A record for \`__**${args == null ? void 0 : args.domain}**__\` must be pointed to \`**${dnsData == null ? void 0 : dnsData.vpsIp}**\` instead of \`**${dnsData == null ? void 0 : dnsData.dnsIp}\`**.`);
  }
  const result = await this.nginx.writeConf(args == null ? void 0 : args.confPath, args);
  await this.nginxReload();
  return result;
};
setDefaultConf_fn = async function(args) {
  const confPath = __privateGet(this, _confDirPath) + "/_default.conf";
  const result = await this.nginx.writeConf(confPath, {
    confType: "serve",
    domain: (args == null ? void 0 : args.domain) || "example.com",
    target: (args == null ? void 0 : args.target) || "/var/www/html",
    enableIndexing: (args == null ? void 0 : args.enableIndexing) || false,
    enableSSL: (args == null ? void 0 : args.enableSSL) || false,
    forceSSL: (args == null ? void 0 : args.forceSSL) || true
  });
  console.log(`\u2705 nginx default configuration are set`);
  await this.nginxReload();
  return result;
};
dnsIpLookup_fn = async function(domain) {
  var _a2;
  domain = (_a2 = this.nginx.sanitizeDomains(domain)) == null ? void 0 : _a2[0];
  const [vpsIp, dnsIp] = await Promise.all([
    //
    fetchApi(`https://api.ipify.org`),
    dns.resolve4(domain).then((res) => cleanArray(res)).catch((err) => [])
  ]);
  return {
    vpsIp,
    dnsIp,
    status: dnsIp.includes(vpsIp),
    domain
  };
};
checkDomainsInUse_fn = async function(domains, options) {
  domains = this.nginx.sanitizeDomains(domains);
  if (domains.length <= 0) throw new Error("Domains are missing");
  const availableSites = await this.list();
  const domainsInUse = lo([]).concat(availableSites).map((v) => this.nginx.sanitizeDomains(v == null ? void 0 : v.domain)).flattenDeep().uniq().sort().pull(...cleanArray(options == null ? void 0 : options.exclude)).value();
  const conflicts = domains.filter((d) => domainsInUse.includes(d));
  if (conflicts.length > 0) throw new Error(`Domain(s) already in use: ${conflicts.join(", ")}`);
};
// ====================== Private Cert Methods ====================== //
filterCerts_fn = function(certs, domain) {
  domain = this.nginx.sanitizeDomains(domain);
  if (!lo.isArray(domain) || lo.isEmpty(domain)) {
    return lo.filter(certs, (c) => !(c == null ? void 0 : c.isExpired));
  }
  return lo.filter(certs, (c) => !(c == null ? void 0 : c.isExpired) && domain.includes(c == null ? void 0 : c.domain));
};
unwindCerts_fn = function(certs) {
  const domainsMap = [];
  for (const cert of certs) {
    for (const domain of cert == null ? void 0 : cert.altNames) {
      const daysLeft = __privateMethod(this, _WebSites_instances, daysLeft_fn).call(this, cert == null ? void 0 : cert.expiresAt);
      domainsMap.push({
        ...cert,
        // validNames,
        isValid: daysLeft > 0,
        isExpired: daysLeft <= 0,
        daysLeft,
        remarks: daysLeft > 0 ? `${daysLeft} days left` : "EXPIRED",
        domain,
        domains: this.nginx.sanitizeDomains(domain)
      });
    }
  }
  return domainsMap;
};
daysLeft_fn = function(validTo) {
  const currentDate = /* @__PURE__ */ new Date();
  const validToDate = new Date(validTo);
  const DAY_IN_MS = 1e3 * 60 * 60 * 24;
  const diff_in_ms = validToDate - currentDate;
  return Math.floor(diff_in_ms / DAY_IN_MS);
};

const _0PGvmBrk9mq9JHYyQVYrSCzcOc4oVhuR35SGjKY4_M = defineNitroPlugin(async () => {
  var _a;
  if (!((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.NUXT_LOCAL_DB_DIR)) {
    setEnvDataSync({ NUXT_LOCAL_DB_DIR: ".localdb/" });
    console.log(`\u2705 default env variables are set`);
  }
  const sites = new WebSites();
  await sites.rebuildDefaultConf(null, true);
});

const plugins = [
  _yeaThfjQWUj_79Ga5f_PLZVDzrVFrsasBNyIAbbDa0,
_0PGvmBrk9mq9JHYyQVYrSCzcOc4oVhuR35SGjKY4_M
];

const assets = {
  "/CPanel_logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"1292-tUHZwBD7b8hIR/Q1Jb5JRBHiocw\"",
    "mtime": "2025-06-12T21:02:03.938Z",
    "size": 4754,
    "path": "../public/CPanel_logo.svg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2025-06-12T21:02:03.938Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/level-slider.svg": {
    "type": "image/svg+xml",
    "etag": "\"494-XaQe8rGeZZXsdE/bHfMms0ky7hM\"",
    "mtime": "2025-06-12T21:02:03.939Z",
    "size": 1172,
    "path": "../public/level-slider.svg"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1-rcg7GeeTSRscbqD9i0bNnzLlkvw\"",
    "mtime": "2025-06-12T21:02:03.939Z",
    "size": 1,
    "path": "../public/robots.txt"
  },
  "/vps-logo.psd": {
    "type": "image/vnd.adobe.photoshop",
    "etag": "\"4e3a9-9d63d2a8nCGvXAv/6Mdv/jr6u8g\"",
    "mtime": "2025-06-12T21:02:03.939Z",
    "size": 320425,
    "path": "../public/vps-logo.psd"
  },
  "/vps-logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"e908-dPk3avp20Ii8eNIRhnY5aj3Rycw\"",
    "mtime": "2025-06-12T21:02:03.939Z",
    "size": 59656,
    "path": "../public/vps-logo.svg"
  },
  "/vps-logo1.svg": {
    "type": "image/svg+xml",
    "etag": "\"e908-dPk3avp20Ii8eNIRhnY5aj3Rycw\"",
    "mtime": "2025-06-12T21:02:03.939Z",
    "size": 59656,
    "path": "../public/vps-logo1.svg"
  },
  "/_nuxt/B8NiJcRH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11d-OeI7E8znKvwRI0wpeCAn0+f0SRw\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 285,
    "path": "../public/_nuxt/B8NiJcRH.js"
  },
  "/_nuxt/BLTCwxt5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"182-3fA2KR2750hwbwXTzkh/+/XZhnY\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 386,
    "path": "../public/_nuxt/BLTCwxt5.js"
  },
  "/_nuxt/BMKm_R5-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"36a3-yo2Yc9SahQWcxEAjvTMOP9BldAU\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 13987,
    "path": "../public/_nuxt/BMKm_R5-.js"
  },
  "/_nuxt/BeBx2VTB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6592-Mf4bd1DxLsGZe0XzuozE6kA3ztY\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 26002,
    "path": "../public/_nuxt/BeBx2VTB.js"
  },
  "/_nuxt/BkNBrZT-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15f-bKh61JJDmXDxxl4lMAQ4QgXMpZs\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 351,
    "path": "../public/_nuxt/BkNBrZT-.js"
  },
  "/_nuxt/BmZ2LAh1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d25-0VzEawfP1RierAcJ1K3/Nj+EF9U\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 3365,
    "path": "../public/_nuxt/BmZ2LAh1.js"
  },
  "/_nuxt/BvUkXoQN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"41d-ni/H1qtO+hzw1CKaKB+0O0A6ZxU\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 1053,
    "path": "../public/_nuxt/BvUkXoQN.js"
  },
  "/_nuxt/C45a0SJ1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"674-xXdx4+eHEvMaGjzTHfzgfVBAh7g\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 1652,
    "path": "../public/_nuxt/C45a0SJ1.js"
  },
  "/_nuxt/CFHj_Oi1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ed8-HdmgCk3XD1PnhnIZajrxQZtv6Q0\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 7896,
    "path": "../public/_nuxt/CFHj_Oi1.js"
  },
  "/_nuxt/CK6m6hm2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e6-ciO+c2Vk6UdqqBrXZ0lyOhMc9+I\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 486,
    "path": "../public/_nuxt/CK6m6hm2.js"
  },
  "/_nuxt/CQzfIEGG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d437-pkSXT77MwrtQd8A+FhnDyLj7T5g\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 250935,
    "path": "../public/_nuxt/CQzfIEGG.js"
  },
  "/_nuxt/CVLgalrC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1feb4-zmEddd2v3AK1e7but/5n27jFing\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 130740,
    "path": "../public/_nuxt/CVLgalrC.js"
  },
  "/_nuxt/Cqh65oVF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"265-DcOLlSAmq33PQDohyvaUIzqVMxQ\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 613,
    "path": "../public/_nuxt/Cqh65oVF.js"
  },
  "/_nuxt/CuFgoU1O.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"578-4HXiPs8DlT8RWJIHpoZkbRK5xco\"",
    "mtime": "2025-06-12T21:02:03.931Z",
    "size": 1400,
    "path": "../public/_nuxt/CuFgoU1O.js"
  },
  "/_nuxt/CxB6FwA-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a1f-lWv10Fyoze0vGedYN6N/kX9rlOE\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 6687,
    "path": "../public/_nuxt/CxB6FwA-.js"
  },
  "/_nuxt/CzZvajHs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18f-D9QVKseNgO/K5cACoLmDqFCjKY8\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 399,
    "path": "../public/_nuxt/CzZvajHs.js"
  },
  "/_nuxt/D327vOd8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"181-5GMqzYc0tEa5O017gOCXH44U4fY\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 385,
    "path": "../public/_nuxt/D327vOd8.js"
  },
  "/_nuxt/DFV8-BXw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d8c-EZiSa7TakDja3GEKsNP6DjncagM\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 11660,
    "path": "../public/_nuxt/DFV8-BXw.js"
  },
  "/_nuxt/Dd8-9PBm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14a5-ju/q33geN82SZt9HP2CJGoPmqpc\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 5285,
    "path": "../public/_nuxt/Dd8-9PBm.js"
  },
  "/_nuxt/DdvUTlcu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"254-Z4FNMoCLVjFIy3XMd9DGkxtkTEg\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 596,
    "path": "../public/_nuxt/DdvUTlcu.js"
  },
  "/_nuxt/DikSbjVC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"893-Xna9C4VZU2ndtiSqIcVYkfqwR8k\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 2195,
    "path": "../public/_nuxt/DikSbjVC.js"
  },
  "/_nuxt/DuHPYbfw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12827-SIVxRPPrJR5ndhPMEVszB7DsHF4\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 75815,
    "path": "../public/_nuxt/DuHPYbfw.js"
  },
  "/_nuxt/Dv9JQljI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ea-uzScwH9gAJkPis+BqfVU9KYjhN0\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 234,
    "path": "../public/_nuxt/Dv9JQljI.js"
  },
  "/_nuxt/DzupHNbd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"401-++S822KAvim/osjZ0DF0CgFhcZo\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 1025,
    "path": "../public/_nuxt/DzupHNbd.js"
  },
  "/_nuxt/entry.eOcd7Ikk.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"374d-DercaJhFuuaQloz6AOYX7Adk49k\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 14157,
    "path": "../public/_nuxt/entry.eOcd7Ikk.css"
  },
  "/_nuxt/iuYvQazl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cbf-hhMXvWhTNMf0t1Ijbaztw1SGk4U\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 3263,
    "path": "../public/_nuxt/iuYvQazl.js"
  },
  "/_nuxt/j7e5iNrP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5624-tOOWnG3z+thhbyW8gnfcftVYnaE\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 22052,
    "path": "../public/_nuxt/j7e5iNrP.js"
  },
  "/_nuxt/ujrmovv1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"33b7b-AMQotG49czVLVmLBxh9FJt9gFYI\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 211835,
    "path": "../public/_nuxt/ujrmovv1.js"
  },
  "/_nuxt/ycHczuaS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"421-c4dnahORy+x4Iji54v7iR+ZHbiQ\"",
    "mtime": "2025-06-12T21:02:03.932Z",
    "size": 1057,
    "path": "../public/_nuxt/ycHczuaS.js"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-IMfkLdr+Y+KyBk10L+zyrIe2vhs\"",
    "mtime": "2025-06-12T21:02:03.920Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/d60e9893-337f-47e4-b5be-0644a44c6a79.json": {
    "type": "application/json",
    "etag": "\"a3-bZhhozvBFrdiH+KnMD6jh1HI8to\"",
    "mtime": "2025-06-12T21:02:03.916Z",
    "size": 163,
    "path": "../public/_nuxt/builds/meta/d60e9893-337f-47e4-b5be-0644a44c6a79.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _ziJxl0 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _acHVEW = eventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event);
  event.sendResponse = (data, statusCode, statusText) => {
    setResponseStatus(event, statusCode || 200, cleanStatusText(statusText));
    return JSON.parse(JSON.stringify(data));
  };
  event.errorResponse = (err, statusCode, statusText) => {
    console.error(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${event.node.req.method || "GET"} ${getRequestURL(event).pathname}`, "\u{1F680}", err);
    const errorMessage = (err == null ? void 0 : err.message) || (err == null ? void 0 : err.statusMessage) || (err == null ? void 0 : err.statusText) || statusText || "oops, something went wrong";
    const statusMessage = (err == null ? void 0 : err.statusMessage) || (err == null ? void 0 : err.statusText) || statusText || "OOPS";
    setResponseStatus(event, (err == null ? void 0 : err.statusCode) || statusCode || 500, cleanStatusText(statusMessage));
    if (runtimeConfig == null ? void 0 : runtimeConfig.appEnv.startsWith("dev")) {
      return {
        error: errorMessage,
        stack: extractStackTrace(err)
      };
    }
    return { error: errorMessage };
  };
});
function extractStackTrace(error) {
  if (!(error instanceof Error)) {
    throw new Error("Input must be an instance of Error");
  }
  if (!(error == null ? void 0 : error.stack)) return ["Error: No stack trace available"];
  const stackLines = error.stack.split("\n");
  const cleanedStack = stackLines.map((line) => line.trim()).filter((line) => line !== "");
  if (cleanedStack.length === 0) {
    return ["Error: No valid stack trace available"];
  }
  return cleanedStack;
}

const _XSPJuA = defineEventHandler(async (event) => {
  const startTime = Date.now();
  const url = getRequestURL(event).pathname;
  const method = event.node.req.method || "GET";
  await event.node.res.on("finish", () => {
    const status = event.node.res.statusCode || 200;
    const duration = Date.now() - startTime;
    logRequest(method, url, status, duration);
  });
  setResponseHeader(event, "X-Response-Time", `${Date.now() - startTime}ms`);
});

const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

const validateAdminUser = (inps, envs) => {
  if ((inps == null ? void 0 : inps.username) !== (envs == null ? void 0 : envs.username)) throw new Error("User is invalid");
  const isPasswordCorrect = comparePassword(inps == null ? void 0 : inps.password, envs == null ? void 0 : envs.password);
  if (!isPasswordCorrect) throw new Error("Password is incorrect");
  return true;
};

const _kruZWt = eventHandler((event) => {
  var _a;
  if (event.path === "/api/ping") return;
  if (event.path.startsWith("/api/public")) return;
  if (!event.path.startsWith("/api")) return;
  try {
    const token = (_a = getHeader(event, "Authorization")) == null ? void 0 : _a.replace("Bearer ", "");
    if (!token) return event.errorResponse(new Error("Token is missing"), 401);
    const { loginUsername, loginPassword } = useRuntimeConfig(event);
    const isValidToken = validateAdminUser(decodeUserPass(token), { username: loginUsername, password: loginPassword });
    if (event.path.startsWith("/api/") && !event.path.startsWith("/api/_") && !isValidToken) ;
  } catch (err) {
    if (/password|user/i.test(err == null ? void 0 : err.message)) {
      return event.errorResponse(err, 401);
    }
    return event.errorResponse(err, 400);
  }
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_gOFXfe = () => import('../routes/api/action/_slug_.post.mjs');
const _lazy_2iFeQh = () => import('../routes/api/fetch/_slug_.get.mjs');
const _lazy_m9vDob = () => import('../routes/api/ping.mjs');
const _lazy_ISzxSg = () => import('../routes/api/public/renew-certs.get.mjs');
const _lazy_kMkE9V = () => import('../routes/api/verify.mjs');
const _lazy_6vwT16 = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _ziJxl0, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _acHVEW, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _XSPJuA, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _kruZWt, lazy: false, middleware: true, method: undefined },
  { route: '/api/action/:slug', handler: _lazy_gOFXfe, lazy: true, middleware: false, method: "post" },
  { route: '/api/fetch/:slug', handler: _lazy_2iFeQh, lazy: true, middleware: false, method: "get" },
  { route: '/api/ping', handler: _lazy_m9vDob, lazy: true, middleware: false, method: undefined },
  { route: '/api/public/renew-certs', handler: _lazy_ISzxSg, lazy: true, middleware: false, method: "get" },
  { route: '/api/verify', handler: _lazy_kMkE9V, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_6vwT16, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_6vwT16, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return O(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $fetch as $, defu as A, parseQuery as B, withTrailingSlash as C, withoutTrailingSlash as D, nodeServer as E, SslMeta as S, WebSites as W, useAppConfig as a, getResponseStatus as b, getQuery as c, defineRenderHandler as d, eventHandler as e, createError$1 as f, getResponseStatusText as g, getRouteRules as h, isInstalled as i, joinRelativeURL as j, useNitroApp as k, klona as l, defuFn as m, hasProtocol as n, isScriptProtocol as o, joinURL as p, sanitizeStatusCode as q, readBody as r, sudoExec as s, getContext as t, useRuntimeConfig as u, createHooks as v, withQuery as w, executeAsync as x, toRouteMatcher as y, createRouter$1 as z };
//# sourceMappingURL=nitro.mjs.map
