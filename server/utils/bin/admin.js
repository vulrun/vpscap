import bcrypt from "bcryptjs";
const BCRYPT_HASH_ROUNDS = 10;

export const hashPassword = (password) => bcrypt.hashSync(password, BCRYPT_HASH_ROUNDS);
export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

export const validateAdminUser = (inps, envs) => {
  if (inps?.user !== envs?.user) throw new Error("Invalid User");

  const isPasswordCorrect = comparePassword(inps?.pass, envs?.pass);
  if (!isPasswordCorrect) throw new Error("Incorrect Password");

  return true;
};
