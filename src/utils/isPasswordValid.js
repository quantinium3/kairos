import bcrypt from "bcrypt";

const isPasswordValid = (password, hash) => {
  return bcrypt.compareSync(password, hash);
}

export { isPasswordValid };
