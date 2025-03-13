export default class KvService {
  constructor(kvNamespace, options) {
    this.kv = kvNamespace;
    // if (!this.kv) throw new Error("No kv namespace specified");

    // todo: should check defaults
    options = options || {};
    this.saveInMeta = options?.saveInMeta || true;
    this.cacheTtl = options?.cacheTtl || undefined || 60;
    this.prefix = String(options?.prefix || "link::::::")
      .replace(/\:\:+/, "")
      .concat(":");
  }

  async fetchAll(limit, cursor) {
    const final = {};
    final.cursor = cursor || null;

    const items = [];
    while (true) {
      const { keys, ...rest } = await this.kv.list({ prefix: this.prefix, limit: limit || 1000, cursor: final.cursor });

      Object.assign(final, rest);
      if (!Array.isArray(keys)) break;

      for (const key of keys) {
        try {
          items.push(await this.#getCached(key, "slug"));
        } catch (err) {
          console.error(`Error processing key ${key?.name}:`, err);
          continue; // Skip this key and continue with the next one
        }
      }

      if (!keys || rest?.list_complete) break;
    }

    final.items = items.filter(Boolean).map((itm) => makeJsCompatible(itm));
    final.listComplete = final.list_complete;
    delete final.list_complete;
    return JSON.parse(JSON.stringify(final));
  }

  async #getCached(keyObj, mustKey) {
    if (this.saveInMeta !== true) {
      return await this.kv.get(keyObj?.name, { type: "json" });
    }

    const isThere = mustKey ? keyObj?.metadata?.[mustKey] : keyObj?.metadata;
    if (isThere) return keyObj?.metadata;

    // forward compatible without metadata
    const data = await this.kv.get(keyObj?.name, { type: "json" });
    if (!data) return;

    await this.kv.put(keyObj?.name, JSON.stringify(data), {
      expiration: data?.expiration,
      metadata: data,
    });

    return data;
  }

  get(slug) {
    return this.kv
      .get(this.prefix + slug, {
        type: "json",
        cacheTtl: this.cacheTtl,
      })
      .then((val) => makeJsCompatible(val));
  }

  put(slug, data) {
    data = makeKvCompatible({ ...data });
    return this.kv.put(this.prefix + slug, JSON.stringify(data), {
      expiration: data?.expiration || undefined,
    });
  }

  delete(slug) {
    return this.kv.delete(this.prefix + slug);
  }
}

function makeKvCompatible(data) {
  if (!data) return null;
  if (data?.createdAt) data.createdAt = Math.floor(data.createdAt / 1000);
  if (data?.updatedAt) data.updatedAt = Math.floor(data.updatedAt / 1000);
  if (data?.expiration) data.expiration = Math.floor(data.expiration / 1000);
  else data.expiration = undefined;

  return data;
}

function makeJsCompatible(data) {
  if (!data) return null;
  if (data?.createdAt) data.createdAt = Number(data.createdAt * 1000);
  if (data?.updatedAt) data.updatedAt = Number(data.updatedAt * 1000);
  if (data?.expiration) data.expiration = Number(data.expiration * 1000);
  else data.expiration = null;

  return data;
}
