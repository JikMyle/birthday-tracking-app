import bcrypt from "bcryptjs";

const SALT = 10;

export async function encryptPassword(password: string) {
    return bcrypt.hash(password, SALT);
}
