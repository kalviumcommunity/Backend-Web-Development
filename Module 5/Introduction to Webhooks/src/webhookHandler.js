
const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const processedIds = new Set();

function handleWebhook(req, res) {
  const signature = req.headers['x-webhook-signature'];

  // 1. Verify signature
  if (!signature || !Buffer.isBuffer(req.body)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  const received = signature.replace('sha256=', '');

  let valid = false;

  try {
    const receivedBuffer = Buffer.from(received, 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');

    valid =
      receivedBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (error) {
    valid = false;
  }

  if (!valid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Parse event
  const event = JSON.parse(req.body);

  // 3. Idempotency check
  if (processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // 4. Mark event as processed
  processedIds.add(event.id);

  // 5. Acknowledge immediately
  res.status(200).json({ status: 'received' });

  // 6. Process after response
  setImmediate(() => {
    handleEvent(event);
  });
}

module.exports = {
  handleWebhook,
  _processedIds: processedIds,
};
