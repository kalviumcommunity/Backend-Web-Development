const DEFAULT_AVATAR = {
  url: 'https://cdn.aurora-profiles.dev/avatars/default.png',
  initials: '?',
  source: 'fallback',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryable(error) {
  // Retry timeout errors
  if (error?.name === 'AbortError') {
    return true;
  }

  // Retry network errors with no status
  if (error?.status === undefined || error?.status === null) {
    return true;
  }

  // Retry 429
  if (error.status === 429) {
    return true;
  }

  // Retry 5xx
  if (error.status >= 500 && error.status <= 599) {
    return true;
  }

  // Do not retry other 4xx errors
  return false;
}

async function withTimeout(operation, timeoutMs) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await operation(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(operation, options = {}) {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;

  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempt++;

      // Stop on non-retryable error
      // or after the final attempt.
      if (!isRetryable(error) || attempt >= maxAttempts) {
        throw error;
      }

      // Exponential backoff
      await sleep(baseDelayMs * 2 ** attempt);
    }
  }
}

async function getProfileWithAvatar(authorId, avatarClient, options = {}) {
  const timeoutMs = options.timeoutMs || 200;
  const maxAttempts = options.maxAttempts || 3;
  const baseDelayMs = options.baseDelayMs || 25;

  try {
    const avatar = await withRetry(
      () =>
        withTimeout(
          signal => avatarClient.getAvatar(authorId, { signal }),
          timeoutMs
        ),
      {
        maxAttempts,
        baseDelayMs,
      }
    );

    return {
      authorId,
      avatar,
      degraded: false,
    };
  } catch (error) {
    return {
      authorId,
      avatar: DEFAULT_AVATAR,
      degraded: true,
    };
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