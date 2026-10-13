function isRetryable(error) {
  if (error?.name === 'AbortError') {
    return true;
  }

  if (error?.status === undefined) {
    return true;
  }

  if (error.status === 429) {
    return true;
  }

  if (error.status >= 500 && error.status <= 599) {
    return true;
  }

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
  const {
    maxAttempts = 3,
    baseDelayMs = 50,
  } = options;

  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempt += 1;

      if (attempt >= maxAttempts || !isRetryable(error)) {
        throw error;
      }

      const delay = baseDelayMs * 2 ** (attempt - 1);

      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
  }
}

async function getProfileWithAvatar(authorId, avatarClient) {
  const fallbackAvatar = {
    url: '/default-avatar.png',
    initials: '?',
  };

  try {
    const avatar = await withRetry(
      () =>
        withTimeout(
          (signal) => avatarClient.getAvatar(authorId, { signal }),
          100
        ),
      {
        maxAttempts: 3,
        baseDelayMs: 50,
      }
    );

    return {
      avatar,
      degraded: false,
    };
  } catch (error) {
    return {
      avatar: fallbackAvatar,
      degraded: true,
    };
  }
}

module.exports = {
  isRetryable,
  withTimeout,
  withRetry,
  getProfileWithAvatar,
};