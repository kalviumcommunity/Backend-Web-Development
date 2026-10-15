
'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // Rule 1: Reject a missing or empty idempotency key.
  const key = req.headers['idempotency-key'];

  if (typeof key !== 'string' || key.trim() === '') {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required',
      },
    });
  }

  // Rule 2: Return the saved response for a repeated key.
  if (idempotency.has(key)) {
    const savedResponse = idempotency.get(key);

    return res
      .status(savedResponse.status)
      .json(savedResponse.body);
  }

  // Rule 3: Create one charge for a new key.
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged',
  };

  charges.push(charge);

  // Preserve the exact response so retries receive the same body.
  const response = {
    status: 201,
    body: {
      id: charge.id,
      amount: charge.amount,
      status: charge.status,
    },
  };

  idempotency.set(key, response);

  return res.status(response.status).json(response.body);
});

module.exports = router;
