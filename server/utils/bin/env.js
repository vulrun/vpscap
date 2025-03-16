import * as envfile from "envfile";
import fs from "node:fs";
import path from "node:path";

export const getEnvDataSync = (raw, wd) => {
  const ENV_PATH = path.join(wd || process.cwd(), ".env");

  if (!fs.existsSync(ENV_PATH)) {
    fs.closeSync(fs.openSync(ENV_PATH, "w"));
  }

  if (raw) return fs.readFileSync(envPath, "utf-8");
  return envfile.parse(fs.readFileSync(ENV_PATH, "utf-8"));
};

export const setEnvDataSync = (envData, wd) => {
  const ENV_PATH = path.join(wd || process.cwd(), ".env");

  const parsedData = getEnvDataSync();
  const updatedData = { ...parsedData, ...envData };

  fs.writeFileSync(ENV_PATH, envfile.stringify(updatedData));
  return true;
};
