function sendSuccess(res, status, data, meta) {
  const body = { data };

  if (meta !== undefined) {
    body.meta = meta;
  }

  return res.status(status).json(body);
}

function sendOk(res, data) {
  return sendSuccess(res, 200, data);
}

function sendCreated(res, data) {
  return sendSuccess(res, 201, data);
}

function sendList(res, data, meta) {
  return sendSuccess(res, 200, data, meta);
}

function sendError(res, status, code, message, details) {
  const error = { code, message };

  if (details !== undefined) {
    error.details = details;
  }

  return res.status(status).json({ error });
}

module.exports = {
  sendSuccess,
  sendOk,
  sendCreated,
  sendList,
  sendError
};