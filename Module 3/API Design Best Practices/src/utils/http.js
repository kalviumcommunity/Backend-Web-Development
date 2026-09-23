function sendList(res, result) {
  return res.status(200).json({
    data: result.rows,
    meta: result.meta
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
    error: {
      code: payload.code,
      message: payload.message
    }
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};