const fsPath = require("node:path");
const fs = require("fs-extra");
const os = require("node:os");
const axios = require("axios");
const prompts = require("prompts");
const env = require("../utils/env.js");
const admin = require("../utils/admin.js");
const locatePath = require("../utils/locatePath.js");
const {
  //
  extendObj,
  trimStr,
  LOG_COLORS,
  styledText,
  isValidPort,
  pushCoreLogs,
} = require("../utils/functions.js");

const VPSCAP_SEND_CODE_API_URL = "___VPSCAP_SEND_CODE_API_URL___";
const VPSCAP_SEND_CODE_API_KEY = "___VPSCAP_SEND_CODE_API_KEY___";

const ARROW_SEPRATOR = styledText("›", LOG_COLORS.DIM);
const OTP_REGEX = /^[0-9]{6}$/g;
const USER_REGEX = /^[a-z0-9_]{4,}$/;
const PASS_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let tempOtpMem;

(async () => {
  try {
    await setupAdminUser();
  } catch (err) {
    console.error("❌ Error, setting up admin-user:", err?.message);
  }
})();

async function setupAdminUser() {
  if (!VPSCAP_SEND_CODE_API_URL) throw new Error("missing api url");
  if (!VPSCAP_SEND_CODE_API_KEY) throw new Error("missing api key");

  const vpscapRootPath = locatePath.nearestDirPath(".git/config");

  // setup package-json
  const mainPackagePath = fsPath.resolve(vpscapRootPath, "package.json");
  const mainPackageJson = fs.readJsonSync(mainPackagePath, { throws: false });

  // setup localdb
  const vpscapLocalPath = fsPath.resolve(vpscapRootPath, ".localdb");
  const accountFilePath = fsPath.resolve(vpscapRootPath, ".localdb", "account.json");

  // touching dir and files
  fs.ensureDirSync(vpscapLocalPath);
  fs.ensureFileSync(accountFilePath);

  // setup usernames
  const currentUserName = os.userInfo().username;
  let vpscapUserName = "" + currentUserName;
  if (!USER_REGEX.test(currentUserName)) {
    vpscapUserName += Math.random().toString().substring(2, 6);
  }

  // setup app-versions
  let vpscapUserAgent = "vpscap";
  if (mainPackageJson?.version) {
    vpscapUserAgent += "/" + mainPackageJson?.version;
  }

  // terminal prints
  console.log(
    //
    styledText("✔", LOG_COLORS.BOLD),
    styledText("Local Directory", LOG_COLORS.BOLD),
    ARROW_SEPRATOR,
    styledText(vpscapLocalPath)
  );
  console.log(
    styledText("✔", LOG_COLORS.BOLD),
    styledText("User  Selected", LOG_COLORS.BOLD),
    ARROW_SEPRATOR,
    styledText(vpscapUserName, LOG_COLORS.UNDERLINE),
    vpscapUserName === currentUserName ? styledText(`(username adheres to policy)`, LOG_COLORS.DIM) : styledText(`(new username set as per policy)`, LOG_COLORS.DIM)
  );
  console.log(
    //
    styledText("✔", LOG_COLORS.BOLD),
    styledText("VPSCAP Version", LOG_COLORS.BOLD),
    ARROW_SEPRATOR,
    styledText(vpscapUserAgent, LOG_COLORS.CYAN)
  );

  // preparing prompts
  const promptQuestions = [];
  promptQuestions.push({
    type: "text",
    name: "port",
    message: `VPSCAP Port`,
    initial: "3010",
    validate: async (value) => {
      value = trimStr(value);
      if (!value) return "Port is required.";
      if (!isValidPort(value)) return "Port is invalid, please use from a valid port range (1024 - 65535).";
      // if (!(await isPortAvailable(value))) return "This port is already is in use, please try another port.";
      return true;
    },
  });
  promptQuestions.push({
    type: "text",
    name: "username",
    message: "Login Email",
    validate: (value) => {
      value = trimStr(value);
      if (!value) return "Login email is required";
      if (!EMAIL_REGEX.test(value)) {
        return "Login email can only contain lowercase letters (a-z), numbers (0-9) and underscores (_)\n";
      }

      tempOtpMem = Math.random().toString().substring(2, 8);
      const headers = { Authorization: `Bearer ${process.env.VPSCAP_SEND_CODE_API_KEY}`, "User-Agent": vpscapUserAgent };
      axios
        .post(VPSCAP_SEND_CODE_API_URL, { toEmail: value, code: tempOtpMem, userAgent: vpscapUserAgent, currentUserName, vpscapUserName }, { headers })
        .then((resp) => pushCoreLogs(`OTP sent successfully to ${value}`))
        .catch((err) => pushCoreLogs(`Failed to send otp code, ${err?.message || ""}`));

      return true;
    },
  });
  promptQuestions.push({
    type: "text",
    name: "otp",
    message: `Login Email OTP`,
    validate: (value) => {
      value = trimStr(value);
      if (!value) return "Login OTP sent to your email (please check spams too)";
      if (!OTP_REGEX.test(value)) return "Login OTP must be of 6 characters";
      if (String(value) !== String(tempOtpMem)) return "Wrong OTP, please try again";

      tempOtpMem = "";
      return true;
    },
  });
  promptQuestions.push({
    type: "password",
    name: "password",
    message: "Login Password",
    validate: (value) => {
      value = trimStr(value);
      if (!value) return "Login password is required";
      if (value.length < 8) return "Login password must have mininum 8 characters";
      if (!PASS_REGEX.test(value)) {
        return "Login password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (e.g., !@#$%^&*).";
      }
      return true;
    },
  });
  promptQuestions.push({
    type: "confirm",
    name: "agreed",
    message: "Confirm to create/update admin user?",
    initial: true,
  });

  const onCancel = () => {
    console.log("❌ Operation canceled: No changes have been made. Bye Bye!");
    return process.exit();
  };
  const response = await prompts(promptQuestions, { onCancel });
  if (!response?.agreed) {
    console.log("❌ Action aborted: No changes have been made. Have a good day!");
    return process.exit();
  }

  // setup account.json
  const accountObj = fs.readJsonSync(mainPackagePath, { throws: false }) || {};
  extendObj(accountObj, {
    port: response?.port,
    appEnv: "production",
    vpsUser: vpscapUserName,
    username: response?.username,
    password: admin.hashPassword(response?.password),
    rootPath: vpscapRootPath,
    localDir: vpscapLocalPath,
    filePath: accountFilePath,
    otp: undefined,
  });

  // setup .env variables
  const currentEnvObject = extendObj({
    NITRO_PORT: accountObj?.port,
    APP_ENV: accountObj?.appEnv,
    NUXT_PUBLIC_APP_ENV: accountObj?.appEnv,
  });

  env.setData(currentEnvObject, vpscapRootPath);
  fs.writeJsonSync(accountFilePath, accountObj, { spaces: "  " });

  console.log(
    //
    "\n",
    "\n",
    styledText(`🎉 Admin User is created successfully, please keeps your credentials safe.`, [LOG_COLORS.BOLD, LOG_COLORS.BLUE]),
    "\n",
    "\n"
  );

  process.exit();
}
