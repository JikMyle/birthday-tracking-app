import bcrypt from "bcryptjs";

const SALT = 10;

export async function encryptPassword(password: string) {
    return bcrypt.hash(password, SALT);
}

export async function comparePassword(password: string, hashed: string) {
    const result = await bcrypt.compare(password, hashed);
    return result;
}
