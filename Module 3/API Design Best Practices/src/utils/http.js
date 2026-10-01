function sendOk(res, data) {
  return res.status(200).json({
    data
  });
}

function sendCreated(res, data) {
  return res.status(201).json({
    data
  });
}

function sendList(res, data, meta) {
  return res.status(200).json({
    data,
    meta
  });
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
  sendOk,
  sendCreated,
  sendList,
  sendError
};