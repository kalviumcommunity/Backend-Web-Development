
'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

// Store processed event IDs
const processedIds = new Set();

async function handleWebhook(req, res) {
  try {
    // 1. Get signature from request header
    const signature = req.headers['x-webhook-signature'];

    // Reject missing signature
    if (!signature || !signature.startsWith('sha256=')) {
      return res.status(401).json({
        error: 'Invalid signature'
      });
    }

    // 2. Generate expected HMAC-SHA256 signature
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret || !Buffer.isBuffer(req.body)) {
      return res.status(401).json({
        error: 'Invalid signature'
      });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest();

    // Extract received signature
    const receivedHex = signature.slice('sha256='.length);

    // Validate hexadecimal signature length
    if (!/^[0-9a-fA-F]{64}$/.test(receivedHex)) {
      return res.status(401).json({
        error: 'Invalid signature'
      });
    }

    const received = Buffer.from(receivedHex, 'hex');

    // 3. Compare signatures safely
    if (!crypto.timingSafeEqual(expected, received)) {
      return res.status(401).json({
        error: 'Invalid signature'
      });
    }

    // 4. Parse JSON after signature verification
    const event = JSON.parse(req.body.toString('utf8'));

    // 5. Check idempotency
    if (processedIds.has(event.id)) {
      return res.status(200).json({
        status: 'already_processed'
      });
    }

    // 6. Mark event as processed
    processedIds.add(event.id);

    // 7. Respond immediately
    res.status(200).json({
      status: 'received'
    });

    // 8. Process event after sending response
    setImmediate(() => {
      handleEvent(event);
    });

  } catch (error) {
    if (!res.headersSent) {
      return res.status(400).json({
        error: 'Invalid webhook payload'
      });
    }
  }
}

// Export handler and processed IDs
module.exports = {
  handleWebhook,
  _processedIds: processedIds
};
