
'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const processedIds = new Set();

async function handleWebhook(req, res) {
  try {
    // 1. Get the signature from the request header
    const signature = req.headers['x-webhook-signature'];

    // 2. Reject missing signatures
    if (!signature || !signature.startsWith('sha256=')) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 3. Generate HMAC-SHA256 using the raw request body
    const expected = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(req.body)
      .digest();

    // 4. Extract the received hexadecimal signature
    const receivedHex = signature.slice('sha256='.length);

    // 5. Convert received signature into a Buffer
    let received;

    try {
      received = Buffer.from(receivedHex, 'hex');

      // Ensure the received signature is valid hexadecimal
      if (
        received.length !== expected.length ||
        received.toString('hex') !== receivedHex.toLowerCase()
      ) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } catch {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 6. Compare signatures safely
    if (!crypto.timingSafeEqual(expected, received)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 7. Parse the event only after signature verification
    const event = JSON.parse(req.body.toString('utf8'));

    // 8. Check idempotency
    if (processedIds.has(event.id)) {
      return res.status(200).json({
        status: 'already_processed'
      });
    }

    // 9. Mark event as processed before handling it
    processedIds.add(event.id);

    // 10. Acknowledge immediately
    res.status(200).json({
      status: 'received'
    });

    // 11. Process the event after responding
    setImmediate(() => {
      Promise.resolve(handleEvent(event)).catch(console.error);
    });

  } catch (error) {
    console.error('Webhook error:', error);

    if (!res.headersSent) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }
  }
}

module.exports = {
  handleWebhook,
  _processedIds: processedIds
};
