const bcrypt = require("bcrypt");

export async function hashPassword(password: any) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Verify password
export async function verifyPassword(password: any, hashedPassword: any) {
  return await bcrypt.compare(password, hashedPassword);
}
