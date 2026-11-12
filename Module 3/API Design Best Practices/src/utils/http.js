function sendList(res, rows) {
  return res.status(200).json({
    data: rows
  });
}

function sendCreated(res, post) {
  return res.status(201).json({
    data: post
  });
}

function sendOk(res, payload) {
  return res.status(200).json({
    data: payload
  });
}

function sendError(res, status, payload) {
  return res.status(status).json({
    error: payload
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};