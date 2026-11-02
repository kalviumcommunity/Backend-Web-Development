const express = require("express");
const router = express.Router();
const store = require("../store");

router.post("/", (req, res) => {
  const key = req.headers["idempotency-key"];

  // Rule 1: Missing key -> Return 400 Validation Error
  if (!key) {
    return res.status(400).json({
      error: {
        code: "IDEMPOTENCY_KEY_REQUIRED",
        message: "Idempotency-Key header is required",
      },
    });
  }

  // Rule 2: Repeat key -> Return cached response (no duplicate charge)
  if (store.idempotency.has(key)) {
    const saved = store.idempotency.get(key);
    return res.status(saved.status).json(saved.body);
  }

  // Rules 3 & 4: New key -> Execute charge once, store result, return 201
  const chargeId = store.nextChargeId();
  const body = { id: chargeId, status: "charged" };

  store.charges.push({ id: chargeId, ...req.body });
  store.idempotency.set(key, { status: 201, body });

  return res.status(201).json(body);
});

module.exports = router;
