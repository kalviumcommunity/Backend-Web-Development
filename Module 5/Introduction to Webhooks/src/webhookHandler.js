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


// TODO: implement
const crypto = require('node:crypto');

const { handleEvent } = require('./eventHandlers');


const _processedIds = new Set();

function verifySignature(rawBody, signature, secret) {
  if (!signature) return false;

  if (!signature.startsWith('sha256=')) return false;

  const received = signature.slice("sha256=".length); // Remove 'sha256=' prefix

  if (!/^[0-9a-f]{64}$/.test(received)) return false; // Validate hex format

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');

  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

async function handleWebhook(req, res) {

  const sig = req.headers['x-webhook-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  if(typeof secret !== 'string' || secret.trim().length === 0) {

    return res.status(500).json({ error: 'Webhook service unavailable' });
  }
    if (!verifySignature(req.body, sig, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body);
    if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }
  _processedIds.add(event.id);
  res.status(200).json({ status: 'received' });
  setImmediate(async () => {
    try {

   await handleEvent(event);
}
catch (err) {
      console.error(`[webhook] handleEvent failed for ${event.id}:`, err.message);
    } 
});
}

module.exports = { handleWebhook, _processedIds };
