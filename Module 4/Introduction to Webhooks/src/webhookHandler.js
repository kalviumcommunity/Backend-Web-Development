
'use strict';

const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

async function handleWebhook(req, res) {
  // Step 1: Verify HMAC-SHA256 signature
  const secret = process.env.WEBHOOK_SECRET;
  const signature = req.headers['x-webhook-signature'];

  if (!secret || !signature || !signature.startsWith('sha256=')) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const received = signature.slice(7);

  if (!/^[a-fA-F0-9]{64}$/.test(received)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');

  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
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

module.exports = {
  handleWebhook,
  _processedIds
};
