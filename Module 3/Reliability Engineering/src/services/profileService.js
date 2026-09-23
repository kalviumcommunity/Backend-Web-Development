const DEFAULT_AVATAR = {
  url: 'https://cdn.aurora-profiles.dev/avatars/default.png',
  initials: '??',
  source: 'fallback',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error) {
  if (!error) {
    return false;
  }

  // Timeout errors are retryable.
  if (error.name === 'AbortError') {
    return true;
  }

  // Network errors with no HTTP status are retryable.
  if (error.status === undefined || error.status === null) {
    return true;
  }

  // 429 Too Many Requests is retryable.
  if (error.status === 429) {
    return true;
  }

  // All 5xx server errors are retryable.
  if (error.status >= 500 && error.status <= 599) {
    return true;
  }

  // Other 4xx errors, such as 400, are not retryable.
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

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      // Do not retry non-retryable errors.
      if (!isRetryable(error)) {
        throw error;
      }

      // We have reached the maximum number of attempts.
      if (attempt === maxAttempts - 1) {
        throw error;
      }

      // Exponential backoff:
      // attempt 0 -> baseDelayMs
      // attempt 1 -> baseDelayMs * 2
      // attempt 2 -> baseDelayMs * 4
      const delay = baseDelayMs * 2 ** attempt;

      await sleep(delay);
    }
  }

  // This should never normally be reached.
  throw new Error('Retry operation failed');
}

async function getProfileWithAvatar(
  authorId,
  avatarClient,
  options = {}
) {
  const timeoutMs = options.timeoutMs ?? 200;
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;

  try {
    const avatar = await withRetry(
      () =>
        withTimeout(
          (signal) => avatarClient.getAvatar(authorId, { signal }),
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