const bcrypt = require("bcryptjs");
const BCRYPT_HASH_ROUNDS = 10;
const { setEnvDataSync } = require("./env.js");

const hashPassword = (password) => bcrypt.hashSync(password, BCRYPT_HASH_ROUNDS);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = {
  createAdminUser,
  validateAdminUser,
};

function createAdminUser(username, password) {
  const adminUser = {
    NUXT_LOGIN_USERNAME: username,
    NUXT_LOGIN_PASSWORD: hashPassword(password),
  };

  setEnvDataSync(adminUser);
  return adminUser;
}

function validateAdminUser(inps, envs) {
  if (inps?.username !== envs?.username) throw new Error("User is invalid");

  const isPasswordCorrect = comparePassword(inps?.password, envs?.password);
  if (!isPasswordCorrect) throw new Error("Password is incorrect");

  return true;
}
