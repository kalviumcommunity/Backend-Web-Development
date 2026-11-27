
'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

// Store IDs of events that have already been processed
const _processedIds = new Set();

async function handleWebhook(req, res) {
  try {
    // 1. Get the signature from the request header
    const signature = req.headers['x-webhook-signature'];

    // Reject missing or incorrectly formatted signatures
    if (
      typeof signature !== 'string' ||
      !/^sha256=[a-fA-F0-9]{64}$/.test(signature) ||
      !Buffer.isBuffer(req.body)
    ) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 2. Calculate the expected HMAC-SHA256 signature
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    // Extract the received signature
    const received = signature.slice('sha256='.length);

    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(received, 'hex');

    // 3. Compare signatures safely
    if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 4. Parse the body only after signature verification
    const event = JSON.parse(req.body.toString('utf8'));

    // 5. Check whether this event was already processed
    if (_processedIds.has(event.id)) {
      return res.status(200).json({
        status: 'already_processed',
      });
    }

    // 6. Mark the event ID before processing
    _processedIds.add(event.id);

    // 7. Acknowledge the webhook immediately
    res.status(200).json({
      status: 'received',
    });

    // 8. Process the event after sending the response
    setImmediate(() => {
      handleEvent(event).catch((err) => {
        console.error('Webhook processing error:', err);
      });
    });

  } catch (err) {
    console.error('Webhook error:', err);

    if (!res.headersSent) {
      return res.status(400).json({ error: 'Invalid webhook request' });
    }
  }
}

module.exports = {
  handleWebhook,
  _processedIds,
};
