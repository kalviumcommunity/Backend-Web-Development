'use strict';

// ─── YOUR FILE — implement this ───────────────────────────────────────────────
// Export handleWebhook(req, res), used by POST /webhooks in app.js.
// Also export _processedIds (your Set or Map) for test inspection/reset.
//
// Steps (in order):
//  1. Verify HMAC-SHA256 signature
//     - Signature header: req.headers['x-webhook-signature'] → 'sha256=<hex>'
//     - Compute: crypto.createHmac('sha256', WEBHOOK_SECRET).update(req.body).digest('hex')
//     - Compare: crypto.timingSafeEqual(Buffer.from(expected,'hex'), Buffer.from(received,'hex'))
//     - Mismatch or missing → res.status(401).json({ error: 'Invalid signature' })
//
//  2. Parse body: const event = JSON.parse(req.body)
//
//  3. Idempotency: if _processedIds.has(event.id) → res.status(200).json({ status: 'already_processed' })
//
//  4. Mark: _processedIds.add(event.id)
//
//  5. Acknowledge: res.status(200).json({ status: 'received' })
//     Then call handleEvent(event) inside setImmediate(() => { ... })

const { handleEvent } = require('./eventHandlers');
const crypto = require('node:crypto');

const _processedIds = new Set();

function handleWebhook(req, res) {
  const signature = req.headers['x-webhook-signature'];
  const body = req.body;

  if (
    typeof signature !== 'string' ||
    !/^sha256=[a-f\d]{64}$/i.test(signature) ||
    !Buffer.isBuffer(body)
  ) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('WEBHOOK_SECRET must be configured');
  }

  const expected = crypto.createHmac('sha256', secret).update(body).digest();
  const received = Buffer.from(signature.slice('sha256='.length), 'hex');

  if (!crypto.timingSafeEqual(expected, received)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(body.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (!event || typeof event !== 'object' || event.id === undefined || event.id === null) {
    return res.status(400).json({ error: 'Invalid event' });
  }

  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  _processedIds.add(event.id);
  res.status(200).json({ status: 'received' });

  setImmediate(async () => {
    try {
      await handleEvent(event);
    } catch (error) {
      console.error('Failed to process webhook event:', error);
    }
  });
}

module.exports = { handleWebhook, _processedIds };
