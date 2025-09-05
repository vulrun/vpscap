import JsonDb from "./JsonDb";

export default class JsonDbExtended extends JsonDb {
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
