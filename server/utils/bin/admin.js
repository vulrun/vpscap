import { setEnvDataSync } from "./env.js";
import { hashPassword, comparePassword } from "./bcrypt.js";

export const createAdminUser = (username, password) => {
  const adminUser = {
    NUXT_LOGIN_USERNAME: username,
    NUXT_LOGIN_PASSWORD: hashPassword(password),
  };

  setEnvDataSync(adminUser);
  return adminUser;
};

export const validateAdminUser = (inps, envs) => {
  if (inps?.username !== envs?.username) throw new Error("User is invalid");

  const isPasswordCorrect = comparePassword(inps?.password, envs?.password);
  if (!isPasswordCorrect) throw new Error("Password is incorrect");

  return true;
};
