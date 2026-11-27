
'use strict';
// routes/payments.js

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {

  // Rule 1: Check whether Idempotency-Key is provided
  const key = req.headers['idempotency-key'];

  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Rule 2: Check whether this key was already used
  if (idempotency.has(key)) {
    const storedResponse = idempotency.get(key);

    return res
      .status(storedResponse.status)
      .json(storedResponse.body);
  }

  // Rule 3: New key - create a new charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  // Add the real charge to the charges array
  charges.push(charge);

  // Prepare the response body
  const responseBody = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  // Store the complete response in the idempotency Map
  idempotency.set(key, {
    status: 201,
    body: responseBody
  });

  // Return the newly created charge
  return res.status(201).json(responseBody);
});

module.exports = router;
