const fsPath = require("node:path");
const fs = require("fs-extra");
const envfile = require("envfile");

const getRaw = (wd) => {
  const ENV_PATH = fsPath.join(wd || process.cwd(), ".env");

  if (!fs.existsSync(ENV_PATH)) {
    fs.closeSync(fs.openSync(ENV_PATH, "w"));
  }

  return fs.readFileSync(envPath, "utf-8");
};

const getData = (wd) => {
  const ENV_PATH = fsPath.join(wd || process.cwd(), ".env");

  if (!fs.existsSync(ENV_PATH)) {
    fs.closeSync(fs.openSync(ENV_PATH, "w"));
  }

  return envfile.parse(fs.readFileSync(ENV_PATH, "utf-8"));
};

const setData = (envData, wd) => {
  const ENV_PATH = fsPath.join(wd || process.cwd(), ".env");

  const parsedData = getData(wd);
  const updatedData = { ...parsedData, ...envData };

  fs.writeFileSync(ENV_PATH, envfile.stringify(updatedData));
  return true;
};

module.exports = {
  getRaw,
  getData,
  setData,
};
