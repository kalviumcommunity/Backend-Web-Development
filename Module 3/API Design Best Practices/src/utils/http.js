function sendList(res, data, meta) {
  return res.status(200).json({ data, meta });
}

function sendCreated(res, data) {
  return res.status(201).json({ data });
}

function sendOk(res, data) {
  return res.status(200).json({ data });
}

function sendError(res, status, payload = {}) {
  let code = payload.code;
  let message = payload.message;
  let details = payload.details;

  if (!code) {
    if (status === 404) code = 'NOT_FOUND';
    else if (status === 400) code = 'VALIDATION_ERROR';
    else if (status >= 500) code = 'INTERNAL_ERROR';
    else code = 'ERROR';
  }

  if (!message) {
    if (status === 404) message = 'Post not found';
    else if (status >= 500) message = 'Something went wrong';
    else message = 'Request failed';
  }

  const error = { code, message };
  if (details !== undefined) {
    error.details = details;
  }
  return res.status(status).json({ error });
}

function sendNotFound(res, message = 'Post not found') {
  return sendError(res, 404, { code: 'NOT_FOUND', message });
}

function sendInternalError(res, message = 'Something went wrong') {
  return sendError(res, 500, { code: 'INTERNAL_ERROR', message });
}

function sendBadRequest(res, message = 'Invalid input', details) {
  return sendError(res, 400, { code: 'VALIDATION_ERROR', message, details });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError,
  sendNotFound,
  sendInternalError,
  sendBadRequest
};
