function getDatabaseErrorMessage(error) {
  if (error && error.code === 'P2002') return 'A record with the same unique value already exists';
  if (error && error.code === 'P2003') return 'The related record does not exist';
  return 'Database operation failed';
}

module.exports = { getDatabaseErrorMessage };
