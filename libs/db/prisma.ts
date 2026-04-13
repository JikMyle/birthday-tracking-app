import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaMariaDb({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
    ssl:
        process.env.MYSQL_SSL === "true"
            ? { rejectUnauthorized: false }
            : undefined,
    connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });
export { prisma };
