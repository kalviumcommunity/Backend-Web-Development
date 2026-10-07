function sendData(res, data, status = 200) {
  return res.status(status).json({ data });
}

function sendList(res, rows, meta) {
  return res.status(200).json({ data: rows, meta });
}

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

module.exports = {
  sendData,
  sendList,
  sendError
};
