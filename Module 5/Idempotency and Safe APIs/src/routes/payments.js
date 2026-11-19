
'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  const key = req.headers['idempotency-key'];

  // Validate idempotency key
  if (typeof key !== 'string' || key.trim() === '') {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required',
      },
    });
  }

  // Check for an existing request
  if (idempotency.has(key)) {
    const cachedResponse = idempotency.get(key);
    return res.status(cachedResponse.status).json(cachedResponse.body);
  }

  // Create a new charge with a unique ID
  const charge = {
    id: nextChargeId(),
  };

  charges.push(charge);

  // IMPORTANT: Tests expect the property name to be "id"
  const responseBody = {
    id: charge.id,
  };

  const responseStatus = 201;

  // Cache the complete response
  idempotency.set(key, {
    status: responseStatus,
    body: responseBody,
  });

  return res.status(responseStatus).json(responseBody);
});

module.exports = router;
