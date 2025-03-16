import fsPath from "node:path";
import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
import os from "node:os";
import prompts from "prompts";
import { extendObj } from "../../utils/helpers.js";
import { setEnvDataSync, getEnvDataSync } from "../../server/utils/bin/env.js";
import { createAdminUser } from "../../server/utils/bin/admin.js";

let tempOtpMem;
const otpRegex = /^[0-9]{6}$/g;
const userRegex = /^[a-z0-9_]{4,}$/;
const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const questions = [
  {
    type: "text",
    name: "username",
    message: "Login Email",
    validate: (value) => {
      value = value.trim();
      if (!value) return "Login email is required";
      if (!emailRegex.test(value)) {
        return "Login email can only contain lowercase letters (a-z), numbers (0-9) and underscores (_)";
      }

      tempOtpMem = Math.random().toString().substring(2, 8);
      return true;
    },
  },
  {
    type: "text",
    name: "otp",
    message: () => `Login Email OTP [${tempOtpMem}]`,
    validate: (value) => {
      value = value.trim();
      if (!value) return "Login OTP sent to your email (please check spams too)";
      if (value.length !== 6) return "Login OTP must be of 6 characters";
      if (!otpRegex.test(+value)) return "Only numbers are allowed as OTP";
      if (String(value) !== String(tempOtpMem)) return "OTP is wrong.";

      return true;
    },
  },
  {
    type: "password",
    name: "password",
    message: "Login Password",
    validate: (value) => {
      if (!value) return "Login password is required";
      if (value.length < 8) return "Login password must have mininum 8 characters";
      if (!passRegex.test(value)) {
        return "Login password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (e.g., !@#$%^&*).";
      }
      return true;
    },
  },
  {
    type: "confirm",
    name: "agreed",
    message: "Confirm to create/update admin user?",
    initial: true,
  },
];

(async () => {
  const currentEnvObject = getEnvDataSync();
  const currentUserName = os.userInfo().username;
  const vpscapRootPath = fsPath.resolve();
  const vpscapLocalPath = fsPath.resolve(".localdb");
  const accountFilePath = fsPath.resolve(vpscapLocalPath, "account.json");

  // touching dir and files
  await fs.ensureDir(vpscapLocalPath);
  await fs.ensureFile(accountFilePath);

  // setting default .env keys
  currentEnvObject.APP_ENV ||= "production";
  currentEnvObject.NITRO_PORT ||= 3010;
  currentEnvObject.NUXT_LOCAL_DB_DIR ||= vpscapLocalPath;
  setEnvDataSync(currentEnvObject);

  // terminal prints
  console.log("✔", "\x1b[1mLocalDir Path: \x1b[0m", vpscapLocalPath);
  console.log("✔", "\x1b[1mUser Detected: \x1b[0m", currentUserName);

  const accountObj = {};
  accountObj.rootPath = vpscapRootPath;
  accountObj.localDir = vpscapLocalPath;
  accountObj.filePath = accountFilePath;
  accountObj.vpsUser = currentUserName;

  const onCancel = () => {
    console.log("❌ Operation canceled: No changes were made. Bye Bye!");
    process.exit();
  };
  const response = await prompts(questions, { onCancel });
  if (!response?.agreed) return console.log("❌ Action aborted: No changes have been made. Have a good day!");

  const adminUser = createAdminUser(response?.username, response?.password);

  extendObj(accountObj, response, {
    username: adminUser?.NUXT_LOGIN_USERNAME,
    password: adminUser?.NUXT_LOGIN_PASSWORD,
    otp: undefined,
  });

  await fs.writeJson(accountFilePath, accountObj, { spaces: "  " });
})();
