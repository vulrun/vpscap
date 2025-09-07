import bcrypt from "bcryptjs";
const BCRYPT_HASH_ROUNDS = 10;

export const hashPassword = (password) => bcrypt.hashSync(password, BCRYPT_HASH_ROUNDS);
export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

export const validateAdminUser = (inps, envs) => {
  if (inps?.username !== envs?.username) throw new Error("User is invalid");

  const isPasswordCorrect = comparePassword(inps?.password, envs?.password);
  if (!isPasswordCorrect) throw new Error("Password is incorrect");

  return true;
};
