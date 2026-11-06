'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // Check for Idempotency-Key
  const key = req.headers['idempotency-key'];

  // Rule 1: Reject missing key
  if (!key || !key.trim()) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Rule 2: Return cached response for repeated key
  if (idempotency.has(key)) {
    const cachedResponse = idempotency.get(key);

    return res
      .status(cachedResponse.status)
      .json(cachedResponse.body);
  }

  // Rule 3: Create a new charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  // Record the real charge
  charges.push(charge);

  // Prepare response
  const response = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  // Store response in idempotency Map
  idempotency.set(key, {
    status: 201,
    body: response
  });

  return res.status(201).json(response);
});

module.exports = router;