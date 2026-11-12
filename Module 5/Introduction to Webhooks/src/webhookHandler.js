
'use strict';

const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const _processedIds = new Set();

async function handleWebhook(req, res) {
  // Step 1: Verify HMAC-SHA256 signature
  const received = req.headers['x-webhook-signature'];

  if (!received || !received.startsWith('sha256=')) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const signature = received.slice(7);

  // Validate hexadecimal signature
  if (!/^[a-fA-F0-9]{64}$/.test(signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(signature, 'hex');

  if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Step 2: Parse request body
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Step 3: Check idempotency
  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // Step 4: Mark event as processed
  _processedIds.add(event.id);

  // Step 5: Acknowledge and process asynchronously
  res.status(200).json({ status: 'received' });

  setImmediate(() => {
    handleEvent(event);
  });
}

module.exports = { handleWebhook, _processedIds };
