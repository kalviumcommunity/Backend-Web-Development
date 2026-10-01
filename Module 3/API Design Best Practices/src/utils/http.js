function sendList(res, data, meta = {}) {
  return res.status(200).json({ data, meta });
}

function sendCreated(res, data) {
  return res.status(201).json({ data });
}

function sendOk(res, payload) {
  return res.status(200).json({ data: payload });
}

function sendError(res, status, code, message, details) {
  const error = { code, message };
  if (details !== undefined) {
    error.details = details;
  }
  return res.status(status).json({ error });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};
