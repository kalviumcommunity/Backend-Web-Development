
'use strict';

// routes/payments.js


'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  const key = req.headers['idempotency-key'];

  // Reject requests without an idempotency key
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Return the saved response if this key was already used
  if (idempotency.has(key)) {
    const saved = idempotency.get(key);
    return res.status(saved.status).json(saved.body);
  }

  // Create a charge only for a new key
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount: amount,
    status: 'charged'
  };

  charges.push(charge);

  // Save the complete response
  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  idempotency.set(key, {
    status: 201,
    body: body
  });

  return res.status(201).json(body);
});

module.exports = router;
