import fsPath from "node:path";
import fs from "fs-extra";
import locatePath from "@@/server/utils/locatePath";

export default class AccountJson {
  constructor() {
    if (AccountJson.instance) {
      return AccountJson.instance;
    }

    const vpscapRootPath = locatePath.nearestDirPath(".git/config");
    this.dirPath = fsPath.resolve(vpscapRootPath, ".localdb");
    this.filePath = fsPath.resolve(vpscapRootPath, ".localdb", "account.json");

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}, null, 2), "utf8");
    }

    AccountJson.instance = this;
  }

  readJson() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  writeJson(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
  }

  // Accepts (key, value) or ({ key1: val1, key2: val2 })
  setData(keyOrObj, value) {
    const data = this.readJson();

    if (typeof keyOrObj === "object" && keyOrObj !== null) {
      Object.assign(data, keyOrObj);

      this.writeJson(data);
      return keyOrObj;
    }

    if (typeof keyOrObj === "string") {
      data[keyOrObj] = value;

      this.writeJson(data);
      return { [keyOrObj]: value };
    }

    throw new Error("Invalid arguments for setData");
  }

  // Accepts single key or list of keys
  getData(keys) {
    const data = this.readJson();

    // fetch all keys
    if (keys === "*") {
      return data;
    }

    // fetch single key
    if (typeof keys === "string") {
      return data[keys];
    }

    // fetch array of keys
    if (Array.isArray(keys)) {
      const result = {};
      for (const key of keys) {
        result[key] = data?.[key] ?? null;
      }
      return result;
    }

    throw new Error("Invalid argument for getData");
  }

  // Accepts single key or list of keys, returns deleted keys
  delProp(keys) {
    const data = this.readJson();
    const deletedKeys = [];

    if (typeof keys === "string") {
      // delete single key
      if (keys in data) {
        delete data[keys];
        deletedKeys.push(keys);
      }
    } else if (Array.isArray(keys)) {
      // delete array of keys
      for (const key of keys) {
        if (key in data) {
          delete data[key];
          deletedKeys.push(key);
        }
      }
    } else {
      throw new Error("Invalid argument for deleteProp");
    }

    if (deletedKeys.length > 0) {
      this.writeJson(data);
    }

    return deletedKeys;
  }
}
