
function sendList(res, rows, meta) {
  return res.status(200).json({
    data: rows,
    meta
  });
}

function sendCreated(res, post) {
  return res.status(201).json({ data: post });
}

function sendOk(res, payload) {
  return res.status(200).json({ data: payload });
}

function sendError(res, status, payload) {
  const code = payload.code || (
    status === 404 ? 'NOT_FOUND' :
    status === 400 ? 'VALIDATION_ERROR' :
    'INTERNAL_ERROR'
  );

  const message = payload.message || 'Something went wrong';

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
