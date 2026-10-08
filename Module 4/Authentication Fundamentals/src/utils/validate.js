const { AppError } = require('./errors');

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

function requireStrings(body, fields) {
  for (const field of fields) {
    if (!body || !isNonEmptyString(body[field])) {
      throw new AppError(400, 'INVALID_INPUT', `${field} must be a non-empty string`);
    }
  }
}

const normalizeEmail = (email) => email.trim().toLowerCase();

module.exports = { requireStrings, normalizeEmail };
