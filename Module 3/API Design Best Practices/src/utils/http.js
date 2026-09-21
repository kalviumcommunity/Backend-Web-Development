
function sendList(res, result) {
  return res.status(200).json({
    ok: true,
    data: result.posts,
    pagination: result.pagination,
  });
}

function sendCreated(res, payload) {
  return res.status(201).json({
    ok: true,
    data: payload,
  });
}

function sendOk(res, payload) {
  return res.status(200).json({
    ok: true,
    data: payload,
  });
}

function sendError(res, status, payload) {
  return res.status(status).json({
    ok: false,
    error: {
      code: payload.code || 'ERROR',
      message: payload.message || 'Something went wrong',
    },
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError,
};