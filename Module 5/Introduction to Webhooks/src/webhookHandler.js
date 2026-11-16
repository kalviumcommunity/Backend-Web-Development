'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'testsecret';
const _processedIds = new Set();

function handleWebhook(req, res) {
  const signature = req.headers['x-webhook-signature'];
  const prefix = 'sha256=';

  if (typeof signature !== 'string' || !signature.startsWith(prefix)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const receivedHex = signature.slice(prefix.length);

  // A SHA-256 HMAC is exactly 32 bytes (64 hexadecimal characters).
  if (!/^[a-f0-9]{64}$/i.test(receivedHex)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // The signature must be calculated from the original request bytes.
  const rawBody = Buffer.isBuffer(req.body)
    ? req.body
    : typeof req.body === 'string'
      ? Buffer.from(req.body, 'utf8')
      : null;

  if (!rawBody) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest();

  const received = Buffer.from(receivedHex, 'hex');

  if (!crypto.timingSafeEqual(expected, received)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  _processedIds.add(event.id);

  res.status(200).json({ status: 'received' });

  setImmediate(() => {
    handleEvent(event);
  });
}

module.exports = { handleWebhook, _processedIds };