
'use strict';

const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

async function handleWebhook(req, res) {
  // Step 1: Get signature and secret
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.WEBHOOK_SECRET || 'testsecret';

  // Step 2: Check if signature is missing or invalid
  if (!signature || !signature.startsWith('sha256=')) {
    return res.status(401).json({
      error: 'Invalid signature'
    });
  }

  // Step 3: Generate expected HMAC-SHA256 signature
  const expected = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');

  const received = signature.slice(7);

  // Step 4: Validate signature format
  if (!/^[a-f0-9]{64}$/i.test(received)) {
    return res.status(401).json({
      error: 'Invalid signature'
    });
  }

  // Step 5: Compare signatures safely
  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');

  if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return res.status(401).json({
      error: 'Invalid signature'
    });
  }

  // Step 6: Parse the request body
  let event;

  try {
    event = JSON.parse(req.body.toString());
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid JSON'
    });
  }

  // Step 7: Check for duplicate event ID
  if (_processedIds.has(event.id)) {
    return res.status(200).json({
      status: 'already_processed'
    });
  }

  // Step 8: Store the event ID
  _processedIds.add(event.id);

  // Step 9: Send successful response
  res.status(200).json({
    status: 'received'
  });

  // Step 10: Process event asynchronously
  setImmediate(() => {
    handleEvent(event).catch(console.error);
  });
}

module.exports = {
  handleWebhook,
  _processedIds
};
