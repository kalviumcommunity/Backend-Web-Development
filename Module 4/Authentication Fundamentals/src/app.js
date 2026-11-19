require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');

const { userRepository } = require('./db/prisma');
const createAuthRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

// Consistent error structure.
function createError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

// Validate and normalize email.
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Return only explicitly allowed user fields.
function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

// Authentication workflow.
const authService = {
  async register(body) {
    const { name, email, password } = body || {};

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || !password.trim()
    ) {
      throw createError(
        400,
        'VALIDATION_ERROR',
        'Name, email, and password are required'
      );
    }

    const normalizedEmail = normalizeEmail(email);

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_COST || 12)
    );

    try {
      const user = await userRepository.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      });

      return serializeUser(user);
    } catch (error) {
      if (error.code === 'P2002') {
        throw createError(
          409,
          'EMAIL_ALREADY_EXISTS',
          'An account with this email already exists'
        );
      }

      throw error;
    }
  },

  async login(body) {
    const { email, password } = body || {};

    if (
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || !password.trim()
    ) {
      throw createError(
        400,
        'VALIDATION_ERROR',
        'Email and password are required'
      );
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await userRepository.findByEmail(normalizedEmail);

    // Use the same error for an unknown email and a wrong password.
    const invalidCredentials = () => createError(
      401,
      'INVALID_CREDENTIALS',
      'Invalid email or password'
    );

    if (!user) {
      throw invalidCredentials();
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw invalidCredentials();
    }

    return serializeUser(user);
  },
};

app.use('/auth', createAuthRoutes(authService));

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Centralized error handling.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // Malformed JSON sent to express.json().
  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body must contain valid JSON',
      },
    });
  }

  const status = error.status || 500;

  if (status === 500) {
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }

  return res.status(status).json({
    error: {
      code: error.code,
      message: error.message,
    },
  });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});