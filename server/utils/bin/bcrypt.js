import bcrypt from "bcryptjs";
const BCRYPT_HASH_ROUNDS = 10;

export const hashPassword = (password) => bcrypt.hashSync(password, BCRYPT_HASH_ROUNDS);
export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
