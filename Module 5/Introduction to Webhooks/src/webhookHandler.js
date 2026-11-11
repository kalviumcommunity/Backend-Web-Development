'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

async function handleWebhook(req, res) {
  const signature = req.headers['x-webhook-signature'];
  const match = typeof signature === 'string'
    ? signature.match(/^sha256=([a-f0-9]{64})$/i)
    : null;

  if (!match || !Buffer.isBuffer(req.body) || !process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.body)
    .digest();
  const received = Buffer.from(match[1], 'hex');

  if (!crypto.timingSafeEqual(expected, received)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(req.body);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (!event.id) {
    return res.status(400).json({ error: 'Missing event id' });
  }

  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  _processedIds.add(event.id);
  res.status(200).json({ status: 'received' });

  setImmediate(() => {
    Promise.resolve(handleEvent(event)).catch((error) => {
      console.error('Webhook event processing failed:', error);
    });
  });
}

module.exports = { handleWebhook, _processedIds };
