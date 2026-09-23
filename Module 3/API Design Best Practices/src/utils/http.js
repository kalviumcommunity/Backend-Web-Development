function sendList(res, data, meta) {
  return res.status(200).json({ data, meta });
}

function sendCreated(res, data) {
  return res.status(201).json({ data });
}

function sendOk(res, data) {
  return res.status(200).json({ data });
}

function sendError(res, status, code, message, details) {
  const payload = {
    error: {
      code,
      message
    }
  };

  if (details !== undefined) {
    payload.error.details = details;
  }

  return res.status(status).json(payload);
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};
