import prisma from "../prisma.js";

export async function findUserByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
}

export async function createUser({ name, email, passwordHash }) {
    return prisma.user.create({
        data: {
            name,
            email,
            passwordHash
        }
    });
}
