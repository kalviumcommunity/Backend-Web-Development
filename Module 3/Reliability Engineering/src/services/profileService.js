const DEFAULT_AVATAR = {
  url: 'https://cdn.aurora-profiles.dev/avatars/default.png',
  initials: '?',
  source: 'fallback',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryable(error) {
  // TODO: retry transient errors only: AbortError, 429, 5xx, or network errors.
  // Never retry 4xx client errors other than 429.
  return (
    error?.name === 'AbortError' ||
    error?.status === 429 ||
    (typeof error?.status === 'number' && error.status >= 500 && error.status < 600) ||
    (typeof error?.message === 'string' && error.message.toLowerCase().includes('network error'))
  );
}

async function withTimeout(operation, timeoutMs) {
  // TODO: create AbortController, abort after timeoutMs,
  // call operation(controller.signal), always clear timer in finally.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await operation(controller.signal);
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function withRetry(operation, options = {}) {
  // TODO: maxAttempts defaults to 3.
  // Run operation, retry only isRetryable errors.
  // Between attempts await sleep(baseDelayMs * 2 ** attempt).
  // Throw final error after max attempts or non-retryable error.
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const shouldRetry = attempt < maxAttempts && isRetryable(error);
      if (!shouldRetry) {
        throw error;
      }

      const delayMs = baseDelayMs * 2 ** (attempt - 1);
      await sleep(delayMs);
    }
  }

  throw lastError;
}

async function getProfileWithAvatar(authorId, avatarClient, options = {}) {
  const timeoutMs = options.timeoutMs ?? 200;
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;

  try {
    // TODO: compose retry around timeout around avatarClient.getAvatar.
    // Return { authorId, avatar, degraded: false } on success.
    const avatar = await withRetry(
      () => withTimeout((signal) => avatarClient.getAvatar(authorId, { signal }), timeoutMs),
      { maxAttempts, baseDelayMs }
    );

    return { authorId, avatar, degraded: false };
  } catch (error) {
    // TODO: return { authorId, avatar: DEFAULT_AVATAR, degraded: true }.
    // Keep fallback local; do not throw for avatar failure.
    return { authorId, avatar: DEFAULT_AVATAR, degraded: true };
  }
}

module.exports = {
  DEFAULT_AVATAR,
  sleep,
  isRetryable,
  withTimeout,
  withRetry,
  getProfileWithAvatar,
};
