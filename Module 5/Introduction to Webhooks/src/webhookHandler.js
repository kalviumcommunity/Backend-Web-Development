
'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

function handleWebhook(req, res) {
  // 1. Verify HMAC signature
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  if (!signature || !secret || !Buffer.isBuffer(req.body)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const match = signature.match(/^sha256=([a-fA-F0-9]{64})$/);

  if (!match) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest();

  const received = Buffer.from(match[1], 'hex');

  if (!crypto.timingSafeEqual(expected, received)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Parse body after signature verification
  const event = JSON.parse(req.body.toString());

  // 3. Check duplicate event
  if (_processedIds.has(event.id)) {
    return res.status(200).json({
      status: 'already_processed'
    });
  }

  // 4. Mark event as processed
  _processedIds.add(event.id);

  // 5. Acknowledge immediately
  res.status(200).json({
    status: 'received'
  });

  // 6. Process event after response
  setImmediate(() => {
    handleEvent(event);
  });
}

module.exports = {
  handleWebhook,
  _processedIds
};
