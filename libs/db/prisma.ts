import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

const adapterProps = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
    ssl:
        process.env.MYSQL_SSL === "true"
            ? { rejectUnauthorized: false }
            : false,
    connectionLimit: 5,
    allowPublicKeyRetrieval: process.env.NODE_ENV === "production",
};

const adapter = new PrismaMariaDb(adapterProps);
const prisma = new PrismaClient({ adapter });

export { prisma };
