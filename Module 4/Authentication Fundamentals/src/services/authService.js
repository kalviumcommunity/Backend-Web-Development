
const bcrypt = require("bcryptjs");
const AppError = require("../errors/AppError");
const userRepository = require("../repositories/userRepository");

const cost = Number(process.env.BCRYPT_COST || 12);

const dummyHashPromise = bcrypt.hash("not a real password", cost);

function requiredString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}

function invalidCredentials() {
    throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password"
    );
}

async function register(input = {}) {
    if (
        !requiredString(input.name) ||
        !requiredString(input.email) ||
        !requiredString(input.password)
    ) {
        throw new AppError(
            400,
            "VALIDATION_ERROR",
            "Name, email and password are required"
        );
    }

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new AppError(
            409,
            "EMAIL_EXISTS",
            "An account with this email already exists"
        );
    }

    const passwordHash = await bcrypt.hash(input.password, cost);

    const user = await userRepository.create({
        name,
        email,
        passwordHash
    });

    return publicUser(user);
}

async function login(input = {}) {
    if (
        !requiredString(input.email) ||
        !requiredString(input.password)
    ) {
        throw new AppError(
            400,
            "VALIDATION_ERROR",
            "Email and password are required"
        );
    }

    const email = input.email.trim().toLowerCase();

    const user = await userRepository.findByEmail(email);

    const passwordHash = user
        ? user.passwordHash
        : await dummyHashPromise;

    const valid = await bcrypt.compare(input.password, passwordHash);

    if (!user || !valid) {
        invalidCredentials();
    }

    return publicUser(user);
}

module.exports = {
    register,
    login
};
