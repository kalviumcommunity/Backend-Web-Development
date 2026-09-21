function sendSuccess(res, data, status = 200, meta) {
  const response = { data };

  if (meta) {
    response.meta = meta;
  }

  return res.status(status).json(response);
}

function sendError(res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendSuccess,
  sendError
};