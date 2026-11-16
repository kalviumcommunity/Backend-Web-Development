'use strict';

// ─── YOUR FILE — implement this ───────────────────────────────────────────────
// Export handleWebhook(req, res), used by POST /webhooks in app.js.
// Also export _processedIds (your Set or Map) for test inspection/reset.

const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

async function handleWebhook(req, res) {
  try {
    const signatureHeader = req.headers['x-webhook-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret || !signatureHeader || typeof signatureHeader !== 'string') {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const prefix = 'sha256=';
    if (!signatureHeader.startsWith(prefix)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const receivedHex = signatureHeader.slice(prefix.length);
    // SHA256 hex string must be exactly 64 hex characters (32 bytes)
    if (!/^[0-9a-fA-F]{64}$/.test(receivedHex)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || ''));

    const expectedHex = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedHex, 'hex');
    const receivedBuffer = Buffer.from(receivedHex, 'hex');

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Parse the body safely after successful signature verification
    let event;
    try {
      event = JSON.parse(rawBody.toString('utf8'));
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    if (!event || typeof event !== 'object' || !event.id) {
      return res.status(400).json({ error: 'Missing or invalid event id' });
    }

    // Idempotency check
    if (_processedIds.has(event.id)) {
      return res.status(200).json({ status: 'already_processed' });
    }

    // Mark as processed before scheduling handler
    _processedIds.add(event.id);

    // Fast acknowledgement
    res.status(200).json({ status: 'received' });

    // Asynchronously handle the event after sending the response
    setImmediate(() => {
      handleEvent(event);
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { handleWebhook, _processedIds };
