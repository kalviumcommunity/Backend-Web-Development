import bcrypt from "bcryptjs";
import {
    createUser,
    findUserByEmail
} from "../repositories/user.repository.js";

export function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

export async function registerUser({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email);

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
        const error = new Error("Email already exists");
        error.code = "EMAIL_EXISTS";
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUser({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
    });

    return user;
}

export async function loginUser({ email, password }) {
    const normalizedEmail = normalizeEmail(email);

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        const error = new Error("Invalid email or password");
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        const error = new Error("Invalid email or password");
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    return user;
}
