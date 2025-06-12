import path from "node:path";
import fs from "node:fs";
import lo from "lodash";

const errors = {
  blankName: "",
  blankData: "",
  blankNumber: "",
  needArray: "",
};

class ObjectFunctions {
  set(path, value, obj) {
    let schema = obj;
    let pList = path.split(".");
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
    return data.reduce((acc, key) => acc?.[`${key}`], obj);
  }

  remove(obj, path) {
    if (!obj || !path) return;

    if (typeof path === "string") {
      path = path.split(".");
    }

    for (var i = 0; i < path.length - 1; i++) {
      obj = obj[path[`${i}`]];

      if (typeof obj === "undefined") {
        return;
      }
    }

    delete obj[path.pop()];
  }

  removeEmptyData(obj) {
    const remove = function (obj) {
      Object.keys(obj).forEach(function (key) {
        if (obj[`${key}`] && typeof obj[`${key}`] === "object") {
          remove(obj[`${key}`]);
        } else if (obj[`${key}`] === null || obj[`${key}`] === "") {
          delete obj[`${key}`];
        }
        if (typeof obj[`${key}`] === "object" && Object.keys(obj[`${key}`]).length === 0) {
          delete obj[`${key}`];
        }
      });
    };

    remove(obj);
  }
}

class JsonHandler {
  constructor({ cwd, dir, file }) {
    this.cwdPath = cwd ? path.resolve(cwd) : path.resolve(".");
    this.dirPath = path.resolve(`${this.cwdPath}/${dir}/`);
    this.filePath = path.resolve(`${this.dirPath}/${file}.json`);
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

export default class JsonDB {
  constructor(options) {
    this.messages = { errors };
    this.cwd = options?.["cwd"];
    this.dbName = options?.["dbName"];
    this.dbFolder = options?.["dbFolder"];
    this.noBlankData = options?.["noBlankData"] ? (typeof options?.["noBlankData"] === "boolean" ? options?.["noBlankData"] : false) : false;
    this.objFuncs = new ObjectFunctions();
    this.json = new JsonHandler({
      cwd: this.cwd,
      dir: this.dbFolder,
      file: this.dbName,
      readable: options?.["readable"] === true ? true : false,
    });

    this.json.touch();
  }

  set(path, data) {
    this.json.touch();

    if (!path) throw new TypeError(this.message["errors"]["blankName"]);
    if (!data) throw new TypeError(this.message["errors"]["blankData"]);

    const content = this.json.read();
    this.objFuncs.set(path, data, content);

    this.json.write(content);
    return this.get(path);
  }

  get(path) {
    if (!path) return this.json.read();

    return this.objFuncs.get(this.json.read(), ...path.split("."));
  }

  fetch() {
    return this.get(...arguments);
  }

  has(path) {
    if (!path) throw new TypeError(this.message["errors"]["blankName"]);

    try {
      return this.objFuncs.get(this.json.read(), ...path.split(".")) ? true : false;
    } catch (err) {
      return false;
    }
  }

  delete(path) {
    this.json.touch();

    if (!path) throw new TypeError(this.message["errors"]["blankName"]);
    if (!this.get(path)) return false;

    const content = this.json.read();
    this.objFuncs.remove(content, path);

    if (this.noBlankData === true) {
      this.objFuncs.removeEmptyData(content);
    }

    this.json.write(content);
    return true;
  }

  add(path, number) {
    if (!path) throw new TypeError(this.message["errors"]["blankName"]);
    if (!number) throw new TypeError(this.message["errors"]["blankData"]);
    if (isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"]);

    const val = this.get(path);
    const num = isNaN(val) ? Number(number) : val + Number(number);

    this.set(path, Number(val ? num : Number(number)));
    return this.get(db);
  }

  subtract(path, number) {
    if (!path) throw new TypeError(this.message["errors"]["blankName"]);
    if (!number) throw new TypeError(this.message["errors"]["blankData"]);
    if (isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"]);

    if (this.get(path) - number < 1) {
      this.delete(path);
      return this.get(path) || 0;
    }

    if (!this.get(path)) {
      this.delete(path);
      return this.get(path) || 0;
    }

    this.set(path, this.get(path) ? (this.get(path) - Number(number) <= 1 ? 1 : (isNaN(this.get(path)) ? 1 : this.get(path) - Number(number)) || 1) : 1);
    return this.get(path);
  }

  push(path, data) {
    if (!path) throw new TypeError(this.message["errors"]["blankName"]);
    if (!data) throw new TypeError(this.message["errors"]["blankData"]);

    let arr = [];
    const saved = this.get(path);

    if (saved === undefined || saved === null) {
      arr = [];
    } else if (!Array.isArray(saved)) {
      throw new TypeError(this.message["errors"]["needArray"]);
    } else {
      arr = this.get(path);
    }

    arr.push(data);
    this.set(path, arr);
    return this.get(path);
  }

  unpush(path, data) {
    if (!path) throw new TypeError(this.message["errors"]["blankName"]);
    if (!data) throw new TypeError(this.message["errors"]["blankData"]);

    let arr = this.get(path) || [];

    if (!Array.isArray(arr)) return;
    arr = arr.filter((x) => x !== data);

    this.set(path, arr);
    return this.get(path);
  }

  delByPriority(path, number) {
    if (!path) throw new TypeError(this.message["errors"]["blankData"]);
    if (!number) throw new TypeError(this.message["errors"]["blankNumber"]);
    if (isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"]);

    const content = this.get(path);
    if (!content || content.length < 1 || typeof content !== "object") {
      return false;
    }

    const neww = [];
    for (let a = 0; a < content.length; a++) {
      if (a !== number - 1) {
        neww.push(content[`${a}`]);
      }
    }

    this.set(path, neww);
    return this.get(path);
  }

  setByPriority(path, data, number) {
    if (!path) throw new TypeError(this.message["errors"]["blankData"]);
    if (!data) throw new TypeError(this.message["errors"]["blankData"]);
    if (!number) throw new TypeError(this.message["errors"]["blankNumber"]);
    if (isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"]);

    const content = this.get(path);
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

    this.set(path, neww);
    return this.get(path);
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
