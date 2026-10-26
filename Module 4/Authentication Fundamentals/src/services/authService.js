
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const AppError = require('../Errors/AppError');

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

async function registerUser({ name, email, password }) {
    const normalizedName = name.trim();
    const normalizedEmail = normalizeEmail(email);

    // Check for an existing account before hashing the password.
    const existingUser = await userRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new AppError(
            409,
            'EMAIL_ALREADY_EXISTS',
            'Email is already registered'
        );
    }

    const passwordHash = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_COST) || 12
    );

    try {
        return await userRepository.createUser({
            name: normalizedName,
            email: normalizedEmail,
            passwordHash,
        });
    } catch (error) {
        // Handle a duplicate email created by a simultaneous request.
        if (error.code === 'P2002') {
            throw new AppError(
                409,
                'EMAIL_ALREADY_EXISTS',
                'Email is already registered'
            );
        }

        throw error;
    }
}

async function loginUser({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const user = await userRepository.findUserByEmail(normalizedEmail);

    if (!user) {
        throw new AppError(
            401,
            'INVALID_CREDENTIALS',
            'Invalid email or password'
        );
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        throw new AppError(
            401,
            'INVALID_CREDENTIALS',
            'Invalid email or password'
        );
    }

    // Return only safe user fields, never the password hash.
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}

module.exports = {
    registerUser,
    loginUser,
    isNonEmptyString,
};
