import bcrypt from "bcryptjs";
import logger from "./logger";

const SALT = 10;

export async function encryptPassword(password: string) {
    const child = logger.child({
        function: encryptPassword.name,
    });

    child.trace({ passwordPresent: !!password }, "Encrypting password");
    const hashed = bcrypt.hash(password, SALT);
    child.trace({ hashPresent: !!hashed }, "Password encrypted");

    return hashed;
}

export async function comparePassword(password: string, hashed: string) {
    const child = logger.child({
        function: comparePassword.name,
    });

    child.trace(
        { passwordPresent: !!password, hashPresent: !!hashed },
        "Comparing passwords",
    );

    const isMatch = await bcrypt.compare(password, hashed);
    child.trace(isMatch ? "Passwords matched" : "Passwords did not match");
    return isMatch;
}
