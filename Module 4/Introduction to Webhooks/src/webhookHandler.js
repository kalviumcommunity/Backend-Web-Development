const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const processedIds = new Set();

async function handleWebhook(req, res) {

    // 1. Get the signature
    const signature = req.headers['x-webhook-signature'];

    // 2. Reject missing or invalid signatures
    if (
        typeof signature !== 'string' ||
        !/^sha256=[a-fA-F0-9]{64}$/.test(signature)
    ) {
        return res.status(401).json({
            error: 'Invalid signature'
        });
    }

    // 3. Calculate HMAC-SHA256
    const expected = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(req.body)
        .digest();

    // 4. Extract received signature
    const received = Buffer.from(
        signature.slice(7),
        'hex'
    );

    // 5. Compare signatures safely
    if (!crypto.timingSafeEqual(expected, received)) {
        return res.status(401).json({
            error: 'Invalid signature'
        });
    }

    // 6. Parse the body after verification
    const event = JSON.parse(req.body.toString('utf8'));

    // 7. Check duplicate event
    if (processedIds.has(event.id)) {
        return res.status(200).json({
            status: 'already_processed'
        });
    }

    // 8. Mark event as processed
    processedIds.add(event.id);

    // 9. Respond immediately
    res.status(200).json({
        status: 'received'
    });

    // 10. Process event after responding
    setImmediate(() => {
        handleEvent(event);
    });
}

module.exports = {
    handleWebhook,
    _processedIds: processedIds
};
