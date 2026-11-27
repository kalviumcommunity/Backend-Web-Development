'use strict';

const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

// Store processed event IDs to prevent duplicate processing
const _processedIds = new Set();

async function handleWebhook(req, res) {
  // Step 1: Verify HMAC-SHA256 signature
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  if (!signature || !secret || !signature.startsWith('sha256=')) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const receivedSignature = signature.slice(7);

  // Validate hexadecimal signature format and length
  if (!/^[a-fA-F0-9]{64}$/.test(receivedSignature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const receivedBuffer = Buffer.from(receivedSignature, 'hex');

  if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Step 2: Parse the request body after signature verification
  let event;

  try {
    event = JSON.parse(req.body.toString('utf8'));
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Step 3: Check whether the event was already processed
  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // Step 4: Mark event ID before processing
  _processedIds.add(event.id);

  // Step 5: Acknowledge immediately
  res.status(200).json({ status: 'received' });

  // Process the event asynchronously after responding
  setImmediate(() => {
    try {
      handleEvent(event);
    } catch (error) {
      console.error('Webhook processing failed:', error);
    }
  });
}

module.exports = { handleWebhook, _processedIds };