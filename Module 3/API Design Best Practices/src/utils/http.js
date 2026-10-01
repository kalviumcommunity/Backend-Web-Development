function sendSuccess(res, data, status = 200, meta) {
  const response = { data };

  if (meta) {
    response.meta = meta;
  }

  return res.status(status).json(response);
}

function sendList(res, rows, meta) {
  return sendSuccess(res, rows, 200, meta);
}

function sendCreated(res, post) {
  return sendSuccess(res, post, 201);
}

function sendOk(res, data) {
  return sendSuccess(res, data, 200);
}

function sendError(res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message,
    },
  });
}

module.exports = {
  sendSuccess,
  sendList,
  sendCreated,
  sendOk,
  sendError,
};