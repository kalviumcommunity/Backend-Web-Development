
'use strict';

// routes/payments.js

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {

  // RULE 1: Check if Idempotency-Key exists
  const key = req.headers['idempotency-key'];

  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // RULE 2: If key already exists, return saved response
  if (idempotency.has(key)) {
    const saved = idempotency.get(key);

    return res.status(saved.status).json(saved.body);
  }

  // RULE 3: New key - create exactly one charge
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  charges.push(charge);

  // Store the response in the idempotency Map
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
