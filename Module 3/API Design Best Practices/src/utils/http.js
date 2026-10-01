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

function sendError(res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};
