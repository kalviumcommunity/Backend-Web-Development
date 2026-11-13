
"use strict";

const crypto = require("node:crypto");
const { handleEvent } = require("./eventHandlers");

// Store processed event IDs
const _processedIds = new Set();

function handleWebhook(req, res) {

  // 1. Get signature from request headers
  const signature = req.headers["x-webhook-signature"];

  // 2. Check if signature exists
  if (!signature || !signature.startsWith("sha256=")) {
    return res.status(401).json({
      error: "Invalid signature",
    });
  }

  // 3. Get webhook secret (fallback for tests)
  const secret = process.env.WEBHOOK_SECRET || "testsecret";

  // 4. Generate expected HMAC signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest();

  // 5. Extract received signature
  const receivedSignature = Buffer.from(
    signature.slice(7),
    "hex"
  );

  // 6. Compare signatures safely
  if (
    receivedSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(
      expectedSignature,
      receivedSignature
    )
  ) {
    return res.status(401).json({
      error: "Invalid signature",
    });
  }

  // 7. Parse the request body
  let event;

  try {
    event = JSON.parse(req.body.toString());
  } catch (error) {
    return res.status(400).json({
      error: "Invalid JSON payload",
    });
  }

  // 8. Check for duplicate event ID
  if (_processedIds.has(event.id)) {
    return res.status(200).json({
      status: "already_processed",
    });
  }

  // 9. Store event ID
  _processedIds.add(event.id);

  // 10. Send response
  res.status(200).json({
    status: "received",
  });

  // 11. Process event asynchronously
  setImmediate(() => {
    handleEvent(event);
  });
}

module.exports = {
  handleWebhook,
  _processedIds,
};
