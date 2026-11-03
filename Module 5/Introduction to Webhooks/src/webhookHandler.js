'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

// In-memory store for processed event IDs
const _processedIds = new Set();

function verifySignature(rawBody, sigHeader, secret) {
    if (!sigHeader || !sigHeader.startsWith('sha256=')) {
        return false;
    }

    const received = sigHeader.slice(7);

    if (!/^[a-fA-F0-9]{64}$/.test(received)) {
        return false;
    }

    const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(received, 'hex')
    );
}

async function handleWebhook(req, res) {
    // 1. Verify signature
    const sig = req.headers['x-webhook-signature'];

    if (!verifySignature(req.body, sig, process.env.WEBHOOK_SECRET)) {
        return res.status(401).json({
            error: 'Invalid signature'
        });
    }

    try {
        // 2. Parse body
        const event = JSON.parse(req.body);

        // 3. Check for duplicate events
        if (_processedIds.has(event.id)) {
            return res.status(200).json({
                status: 'already_processed'
            });
        }

        // 4. Mark event as processed
        _processedIds.add(event.id);

        // 5. Acknowledge immediately
        res.status(200).json({
            status: 'received'
        });

        // 6. Process asynchronously
        setImmediate(async () => {
            try {
                await handleEvent(event);
            } catch (err) {
                console.error('Webhook processing failed:', err);
            }
        });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(400).json({
                error: 'Invalid request body'
            });
        }
    }
}

module.exports = {
    handleWebhook,
    _processedIds
};