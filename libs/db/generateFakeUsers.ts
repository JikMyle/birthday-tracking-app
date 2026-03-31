import { EmailPreference, Role, User } from "@/generated/prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

export default function generateFakeUsers(num: number): User[] {
    return Array.from({ length: num }, () => {
        return createUser();
    });
}

function createUser(): User {
    const firstName = faker.person.firstName();

    const plainPassword = faker.internet.password();
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    const createdAtDate = faker.date.past();
    const updatedOrDeletedAtDate = faker.date.between({
        from: createdAtDate,
        to: new Date(),
    });

    return {
        id: 0,
        username: faker.internet.username({ firstName: firstName }),
        email: faker.internet.email({ firstName: firstName }),
        password: hashedPassword,
        birthdate: faker.date.birthdate(),
        role: Role.USER,
        emailPreference: faker.helpers.enumValue(EmailPreference),
        emailVerified: faker.datatype.boolean(),
        verificationToken: null,
        tokenExpiresAt: null,
        createdAt: faker.date.anytime(),
        updatedAt: updatedOrDeletedAtDate,
        deletedAt: faker.helpers.arrayElement([
            updatedOrDeletedAtDate,
            null,
            null,
        ]),
    };
}
