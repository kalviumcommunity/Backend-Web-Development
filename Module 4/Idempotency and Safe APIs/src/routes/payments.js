'use strict';

// routes/payments.js

const router = require('express').Router();

const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {

  // Get Idempotency-Key from request headers
  const key = req.headers['idempotency-key'];

  // Rule 1: Missing key
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Rule 2: Repeat key -> replay stored response
  if (idempotency.has(key)) {
    const stored = idempotency.get(key);

    return res.status(stored.status).json(stored.body);
  }

  // Rule 3: New key -> create exactly one charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'succeeded'
  };

  // Save the real charge
  charges.push(charge);

  // Create response body
  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  // Store response for future requests
  idempotency.set(key, {
    status: 201,
    body
  });

  // Return successful response
  return res.status(201).json(body);

});

module.exports = router;