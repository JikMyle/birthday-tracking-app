import { EmailPreference, Role, User } from "@/generated/prisma/client";
import createUsers from "@/libs/db/factories/createUsers";
import { prisma } from "@/libs/db/prisma";
import bcrypt from "bcryptjs";

async function main() {
    await seedUserTable();
}

async function seedUserTable() {
    try {
        await prisma.user.deleteMany({});

        const users = createUsers(365);
        const admin: User = {
            id: 0,
            username: "admin",
            email: "admin123@gmail.com",
            password: bcrypt.hashSync("admin123", 10),
            birthdate: new Date(),
            role: Role.ADMIN,
            emailPreference: EmailPreference.NONE,
            emailVerified: true,
            verificationToken: null,
            tokenExpiresAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        }

        users.unshift(admin);
        await prisma.user.createMany({ data: users, skipDuplicates: true })
        
        console.log(`✅ Successfully seeded Users Table with ${users.length} rows...`)
    } catch(error) {
        console.error('❌ An error occured while seeding Users Table...\n', error);
    }
}

prisma.$connect()
    .then(async () => {  await main() })
    .then(async () => { 
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async () => {
        await prisma.$disconnect();
        process.exit(1);
    })