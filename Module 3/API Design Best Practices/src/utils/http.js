function sendList(res, rows, meta) {
  return res.status(200).json({
    ok: true,
    data: rows,
    meta
  });
}

function sendCreated(res, post) {
  return res.status(201).json({
    ok: true,
    data: post
  });
}

function sendOk(res, payload) {
  return res.status(200).json({
    ok: true,
    data: payload
  });
}

function sendError(res, status, payload = {}) {
  return res.status(status).json({
    ok: false,
    error: {
      code: payload.code || 'INTERNAL_SERVER_ERROR',
      message: payload.message || 'Something went wrong'
    }
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};