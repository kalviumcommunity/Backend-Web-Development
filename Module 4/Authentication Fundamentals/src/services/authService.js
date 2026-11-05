const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");

const SALT_ROUNDS = 12;

class AuthError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateFields = (fields) => {
  return Object.values(fields).every(
    (value) => typeof value === "string" && value.trim().length > 0
  );
};

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email
});

// REGISTER
const register = async ({ name, email, password }) => {
  if (!validateFields({ name, email, password })) {
    throw new AuthError(
      "Name, email and password are required",
      400,
      "INVALID_INPUT"
    );
  }

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await userRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    throw new AuthError(
      "Email already exists",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  // Hash password asynchronously
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await userRepository.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    });

    return safeUser(user);
  } catch (error) {
    // Handles duplicate registrations occurring simultaneously
    if (error.code === "P2002") {
      throw new AuthError(
        "Email already exists",
        409,
        "EMAIL_ALREADY_EXISTS"
      );
    }

    throw error;
  }
};

// LOGIN
const login = async ({ email, password }) => {
  if (!validateFields({ email, password })) {
    throw new AuthError(
      "Email and password are required",
      400,
      "INVALID_INPUT"
    );
  }

  const normalizedEmail = normalizeEmail(email);

  const user = await userRepository.findByEmail(normalizedEmail);

  // Same generic error for unknown email and wrong password
  if (!user) {
    throw new AuthError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  // Verify password using bcrypt.compare
  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AuthError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  return safeUser(user);
};

module.exports = {
  register,
  login,
  AuthError
};