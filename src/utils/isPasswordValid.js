import bcrypt from "bcrypt";

const isPasswordValid = async(password, hash) => {
  return await bcrypt.compare(password, hash);
}

export { isPasswordValid };
