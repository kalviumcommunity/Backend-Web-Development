
const prisma = require('../db/prisma');

async function findUserByEmail(email) {
    return prisma.user.findUnique({
        where: { email },
    });
}

async function findPublicById(id) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}

module.exports = {
    findUserByEmail,
    findPublicById,
};
