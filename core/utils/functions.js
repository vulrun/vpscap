const net = require("node:net");
const fsPath = require("node:path");
const fs = require("fs-extra");
const env = require("../utils/env.js");
const locatePath = require("../utils/locatePath.js");

const LOG_COLORS = {
  RESET: "\x1b[0m",

  // Styles
  BOLD: "\x1b[1m",
  DIM: "\x1b[2m",
  UNDERLINE: "\x1b[4m",
  INVERSE: "\x1b[7m",
  HIDDEN: "\x1b[8m",

  // Text colors
  BLACK: "\x1b[30m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",

  // Background colors
  BG_BLACK: "\x1b[40m",
  BG_RED: "\x1b[41m",
  BG_GREEN: "\x1b[42m",
  BG_YELLOW: "\x1b[43m",
  BG_BLUE: "\x1b[44m",
  BG_MAGENTA: "\x1b[45m",
  BG_CYAN: "\x1b[46m",
  BG_WHITE: "\x1b[47m",
};

const styledText = (text, styled) => `${[].concat(styled).join("") || LOG_COLORS.RESET}${text}${LOG_COLORS.RESET}`;

module.exports = {
  LOG_COLORS,
  styledText,
  extendObj,
  trimStr,
  isValidPort,
  isPortAvailable,
  lookupAccountJs,
  pushCoreLogs,
};

function extendObj(target, ...sources) {
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

function trimStr(str) {
  return String(str || "").replace(/^\s+|\s+$/g, "");
}

function isValidPort(port) {
  const portNumber = Number(port);
  return Number.isInteger(portNumber) && portNumber >= 1024 && portNumber <= 65535;
}

function isPortAvailable(port, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    const server = net
      .createServer()
      .once("error", (err) => {
        if (err?.code === "EADDRINUSE") return resolve(false);
        else return reject(err);
      })
      .once("listening", () => {
        server.close();
        return resolve(true);
      })
      .listen(port, host);
  });
}

function lookupAccountJs() {
  const vpscapRootPath = locatePath.nearestDirPath(".git/config");
  const vpscapLocalPath = fsPath.resolve(vpscapRootPath, ".localdb");
  const accountFilePath = fsPath.resolve(vpscapRootPath, ".localdb", "account.json");

  // touching dir and files
  fs.ensureDirSync(vpscapLocalPath);
  fs.ensureFileSync(accountFilePath);

  let accountObj = fs.readJsonSync(accountFilePath, { throws: false }) || {};
  let currEnvObj = env.getData(vpscapRootPath);

  // fix-dotenv
  extendObj(currEnvObj, {
    NITRO_PORT: accountObj?.appPort,
    APP_ENV: accountObj?.appEnv,
    NUXT_PUBLIC_APP_ENV: accountObj?.appEnv,
  });
  // fix-account-json-dir-paths
  extendObj(accountObj, {
    rootPath: vpscapRootPath,
    localDir: vpscapLocalPath,
  });

  env.setData(currEnvObj, vpscapRootPath);
  fs.writeJsonSync(accountFilePath, accountObj, { spaces: "  " });

  // read-account-json
  accountObj = fs.readJsonSync(accountFilePath, { throws: false });
  // console.log("🚀 ~ lookupAccountJs ~ accountObj:", accountObj);
  // if (
  //   !(
  //     accountObj?.appVersion &&
  //     accountObj?.systemUser &&
  //     accountObj?.systemHost &&
  //     accountObj?.loginMail &&
  //     accountObj?.loginPass &&
  //     //
  //     accountObj?.appEnv
  //   )
  // ) {
  //   throw new Error("Account configuration are missing, please setup admin user first");
  // }

  return {
    accountObj,
    vpscapRootPath,
    vpscapLocalPath,
    accountFilePath,
  };
}

function pushCoreLogs(msg) {
  if (!msg) return;

  const { vpscapLocalPath } = lookupAccountJs();
  const appCoreLogFilePath = fsPath.resolve(vpscapLocalPath, "logs", "app-core.log");
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];

  return require("node:fs").appendFileSync(appCoreLogFilePath, `[${timestamp}] ${msg}\n`);
}
