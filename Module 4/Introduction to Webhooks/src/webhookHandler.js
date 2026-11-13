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
require('dotenv').config();
const crypto = require('crypto');

const { handleEvent } = require('./eventHandlers');

// TODO: implement
function verifySignature(rawBody, sigHeader) {
  if (!sigHeader) return false;                           // missing header
  if (!sigHeader.startsWith('sha256=')) return false;     // wrong format

  const received = sigHeader.slice('sha256='.length);
  if (!/^[0-9a-f]{64}$/i.test(received)) return false;    // must be 64 hex chars

  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(rawBody)                                      // raw Buffer, NOT parsed JSON
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'hex');
  const receivedBuf = Buffer.from(received, 'hex');
  if (expectedBuf.length !== receivedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

const _processedIds = new Set();

async function handleWebhook(req, res) {
  // Step 1: Verify HMAC-SHA256 signature
  const isValid = verifySignature(req.body, req.headers['x-webhook-signature']);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Step 2: Parse body
  const event = JSON.parse(req.body);

  // Step 3: Idempotency
  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // Step 4: Mark as processed
  _processedIds.add(event.id);

  // Step 5: Acknowledge
  res.status(200).json({ status: 'received' });

  // Call handleEvent in the next tick
  setImmediate(() => {
    handleEvent(event);
  });

}

module.exports = { handleWebhook, _processedIds };
