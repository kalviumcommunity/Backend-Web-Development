'use strict';

const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

async function handleWebhook(req, res) {
  try {
    // 1. Get the signature
    const signature = req.headers['x-webhook-signature'];

    if (!signature || !signature.startsWith('sha256=')) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 2. Generate the expected HMAC signature
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret || !Buffer.isBuffer(req.body)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    const received = signature.slice(7);

    // 3. Compare signatures safely
    if (!/^[a-fA-F0-9]{64}$/.test(received)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(received, 'hex');

    if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 4. Parse the event
    const event = JSON.parse(req.body.toString());

    // 5. Check duplicate events
    if (_processedIds.has(event.id)) {
      return res.status(200).json({
        status: 'already_processed'
      });
    }

    // 6. Mark event as processed
    _processedIds.add(event.id);

    // 7. Send response immediately
    res.status(200).json({
      status: 'received'
    });

    // 8. Process event after sending response
    setImmediate(() => {
      handleEvent(event).catch((err) => {
        console.error('Webhook processing failed:', err);
      });
    });

  } catch (error) {
    return res.status(400).json({
      error: 'Invalid request body'
    });
  }
}

module.exports = { handleWebhook, _processedIds };
