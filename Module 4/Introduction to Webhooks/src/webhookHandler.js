// 'use strict';

// // ─── YOUR FILE — implement this ───────────────────────────────────────────────
// // Export handleWebhook(req, res), used by POST /webhooks in app.js.
// // Also export _processedIds (your Set or Map) for test inspection/reset.
// //
// // Steps (in order):
// //  1. Verify HMAC-SHA256 signature
// //     - Signature header: req.headers['x-webhook-signature'] → 'sha256=<hex>'
// //     - Compute: crypto.createHmac('sha256', WEBHOOK_SECRET).update(req.body).digest('hex')
// //     - Compare: crypto.timingSafeEqual(Buffer.from(expected,'hex'), Buffer.from(received,'hex'))
// //     - Mismatch or missing → res.status(401).json({ error: 'Invalid signature' })
// //
// //  2. Parse body: const event = JSON.parse(req.body)
// //
// //  3. Idempotency: if _processedIds.has(event.id) → res.status(200).json({ status: 'already_processed' })
// //
// //  4. Mark: _processedIds.add(event.id)
// //
// //  5. Acknowledge: res.status(200).json({ status: 'received' })
// //     Then call handleEvent(event) inside setImmediate(() => { ... })

// const { handleEvent } = require('./eventHandlers');

// // TODO: implement

// const _processedIds = new Set();

// async function handleWebhook(req, res) {
//   res.status(501).json({ error: 'not implemented' });
// }

// module.exports = { handleWebhook, _processedIds };
const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

// Store processed event IDs
const _processedIds = new Set();

async function handleWebhook(req, res) {
  try {
    // 1. Get the signature from request headers
    const signature = req.headers['x-webhook-signature'];

    // 2. Reject missing signature
    if (!signature || !signature.startsWith('sha256=')) {
      return res.status(401).json({
        error: 'Invalid signature'
      });
    }

    // 3. Extract the received signature
    const received = signature.slice(7);

    // 4. Calculate HMAC-SHA256 using the raw body
    const expected = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(req.body)
      .digest('hex');

    // 5. Compare signatures safely
    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(received, 'hex');

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(401).json({
        error: 'Invalid signature'
      });
    }

    // 6. Parse the event after verification
    const event = JSON.parse(req.body.toString());

    // 7. Check for duplicate events
    if (_processedIds.has(event.id)) {
      return res.status(200).json({
        status: 'already_processed'
      });
    }

    // 8. Mark event as processed
    _processedIds.add(event.id);

    // 9. Acknowledge immediately
    res.status(200).json({
      status: 'received'
    });

    // 10. Process event after sending response
    setImmediate(() => {
      handleEvent(event);
    });

  } catch (error) {
    if (!res.headersSent) {
      return res.status(400).json({
        error: 'Invalid webhook'
      });
    }
  }
}

// Export handler and processed IDs
module.exports = {
  handleWebhook,
  _processedIds
};