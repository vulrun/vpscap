import KvService from "@/server/utils/kvService";

export default class LinkService {
  constructor(options) {
    this.kv = new KvService(options?.kv);
  }

  findByUrl(url) {
    return null;
    // return this.kv.get({ hash: generateUrlHash(url) });
  }

  findBySlug(slug) {
    return this.kv.get(slug);
  }

  getLink(slug) {
    return this.kv.get(slug);
  }

  async addLink(data) {
    if (!data?.url) throw new Error("URL is missing");
    if (!data?.slug) throw new Error("SLUG is missing");

    const parsed = {};
    parsed.url = data?.url;
    parsed.slug = data?.slug;
    parsed.hash = generateUrlHash(data?.url);
    parsed.comment = data?.comment || null;
    parsed.createdAt = sanitizeEpochMs(data?.createdAt || null);
    parsed.updatedAt = sanitizeEpochMs(data?.updatedAt || null);
    parsed.expiration = sanitizeEpochMs(data?.expiration || null);

    await this.kv.put(data?.slug, { ...parsed });

    return await this.kv.get(parsed?.slug);
  }

  async editLink(data) {
    if (!data?.slug) throw new Error("SLUG is missing");

    const existingData = await this.kv.get(data?.slug);
    const toBeUpdated = {};
    if (data?.url) toBeUpdated.url = data?.url;
    if (data?.url) toBeUpdated.hash = generateUrlHash(data?.url);
    // if (data?.slug) toBeUpdated.slug = data?.slug;
    if (data?.comment) toBeUpdated.comment = data?.comment || null;
    if (data?.expiration) toBeUpdated.expiration = sanitizeEpochMs(data?.expiration || null);
    toBeUpdated.updatedAt = sanitizeEpochMs("now");

    await this.kv.put(data?.slug, { ...existingData, ...toBeUpdated });
    return { ...existingData, ...toBeUpdated };
  }

  async deleteLink(slug) {
    if (!slug) throw new Error("SLUG is missing");

    const existingData = await this.kv.get(slug);
    if (!existingData) throw new Error("Link not found");

    await this.kv.delete(slug);
  }
}

// export function useLinkHelper() {
//   const self = {};
//   const kv = useKvHelper();
//   const sql = useSqlHelper();

//   self.findBySlug = (slug) => sql.selectOne({ slug });
//   self.findByUrl = (url) => sql.selectOne({ hash: generateUrlHash(url) });

//   self.getLink = async (slug) => {
//     // check in cloudflare kv and return
//     const data = await kv.get(slug);
//     if (data) return data;

//     // if not look in the mysql and save in kv
//     const mysqlData = await sql.selectOne({ slug });
//     await kv.put(mysqlData);

//     return mysqlData;
//   };

//   self.addLink = async (data) => {
//     if (!data?.url) throw new Error("URL is missing");
//     if (!data?.slug) throw new Error("SLUG is missing");

//     const parsed = {};
//     parsed.url = data?.url;
//     parsed.slug = data?.slug;
//     parsed.hash = generateUrlHash(data?.url);
//     parsed.comment = data?.comment || null;
//     parsed.createdAt = sanitizeEpochMs(data?.createdAt || null);
//     parsed.updatedAt = sanitizeEpochMs(data?.updatedAt || null);
//     parsed.expiration = sanitizeEpochMs(data?.expiration || null);

//     await sql.insertData({ ...parsed });
//     await kv.put({ ...parsed }, { slug: data?.slug });

//     return await kv.get(parsed?.slug);
//   };

//   self.editLink = async (data) => {
//     if (!data?.slug) throw new Error("SLUG is missing");

//     const existingData = await kv.get(data?.slug);
//     const toBeUpdated = {};
//     if (data?.url) toBeUpdated.url = data?.url;
//     if (data?.url) toBeUpdated.hash = generateUrlHash(data?.url);
//     // if (data?.slug) toBeUpdated.slug = data?.slug;
//     if (data?.comment) toBeUpdated.comment = data?.comment || null;
//     if (data?.expiration) toBeUpdated.expiration = sanitizeEpochMs(data?.expiration || null);
//     toBeUpdated.updatedAt = sanitizeEpochMs("now");

//     await sql.updateData({ ...toBeUpdated }, { slug: data?.slug });
//     await kv.put({ ...existingData, ...toBeUpdated }, { slug: data?.slug });
//     return { ...existingData, ...toBeUpdated };
//   };

//   self.deleteLink = async (slug) => {
//     if (!slug) throw new Error("SLUG is missing");

//     await sql.deleteData({ slug });
//     await kv.delete(slug);
//   };

//   return self;
// }
