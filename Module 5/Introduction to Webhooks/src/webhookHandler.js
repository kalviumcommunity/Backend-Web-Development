'use strict';

require('dotenv').config();

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');
const _processedIds = new Set();

async function handleWebhook(req, res) {
    // 1. Verify HMAC-SHA256 signature
    const signature = req.headers['x-webhook-signature'];

    if (!signature || !signature.startsWith('sha256=')) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const secret = process.env.WEBHOOK_SECRET;

    const expected = crypto
        .createHmac('sha256', secret)
        .update(req.body)
        .digest('hex');

    const received = signature.slice(7);

    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(received, 'hex');

    if (
        receivedBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    // 2. Parse body
    const event = JSON.parse(req.body);

    // 3. Idempotency check
    if (_processedIds.has(event.id)) {
        return res.status(200).json({ status: 'already_processed' });
    }

    // 4. Mark event as processed
    _processedIds.add(event.id);

    // 5. Acknowledge request
    res.status(200).json({ status: 'received' });

    // Process event asynchronously
    setImmediate(() => {
        handleEvent(event).catch(console.error);
    });
}

module.exports = { handleWebhook, _processedIds };

