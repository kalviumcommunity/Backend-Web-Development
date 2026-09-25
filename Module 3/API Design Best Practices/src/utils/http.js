function sendList(res, rows, meta) {
  return res.status(200).json({
    data: rows,
    meta
  });
}

function sendCreated(res, payload) {
  return res.status(201).json({
    data: payload
  });
}

function sendOk(res, payload) {
  return res.status(200).json({
    data: payload
  });
}

function sendError(res, status, code, message, details) {
  const error = {
    code,
    message
  };

  if (details) {
    error.details = details;
  }

  return res.status(status).json({
    error
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};