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
  const errorObj = {
    code: code || (status >= 500 ? 'INTERNAL_ERROR' : 'ERROR'),
    message: message || (status >= 500 ? 'Something went wrong' : 'An error occurred')
  };
  if (details && Array.isArray(details) && details.length > 0) {
    errorObj.details = details;
  }
  return res.status(status).json({ error: errorObj });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};

