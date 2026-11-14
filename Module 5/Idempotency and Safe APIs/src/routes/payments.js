
'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {

  // Rule 1: Check whether the key is missing
  const key = req.headers['idempotency-key'];

  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Rule 2: Check whether the key already exists
  if (idempotency.has(key)) {
    const stored = idempotency.get(key);

    return res.status(stored.status).json(stored.body);
  }

  // Rule 3: Create a new charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  charges.push(charge);

  // Save the response in the idempotency Map
  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  idempotency.set(key, {
    status: 201,
    body
  });

  return res.status(201).json(body);
});

module.exports = router;
