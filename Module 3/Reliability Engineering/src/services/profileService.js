const DEFAULT_AVATAR = {
  url: 'https://cdn.aurora-profiles.dev/avatars/default.png',
  initials: '?',
  source: 'fallback',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const NETWORK_ERROR_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'ENOTFOUND',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'EPIPE',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_SOCKET',
]);

function isRetryable(error) {
  if (!error) return false;
  if (error.name === 'AbortError' || error.name === 'NetworkError') return true;

  const status = error.status ?? error.statusCode;
  if (status === 429) return true;
  if (typeof status === 'number' && status >= 500 && status <= 599) return true;
  if (typeof status === 'number' && status >= 400 && status <= 499) return false;

  const code = error.code ?? error.cause?.code;
  return typeof code === 'string' && NETWORK_ERROR_CODES.has(code);
}

async function withTimeout(operation, timeoutMs) {
  const controller = new AbortController();
  let timer;

  try {
    const operationPromise = Promise.resolve().then(() => operation(controller.signal));
    const timeoutPromise = new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        const error = new Error(`operation timed out after ${timeoutMs}ms`);
        error.name = 'AbortError';
        reject(error);
      }, timeoutMs);
    });

    return await Promise.race([operationPromise, timeoutPromise]);
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
      attempt += 1;
      if (attempt >= maxAttempts || !isRetryable(error)) throw error;
      await sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }
}

async function getProfileWithAvatar(authorId, avatarClient, options = {}) {
  const timeoutMs = options.timeoutMs ?? 200;
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;

  try {
    const avatar = await withRetry(
      () => withTimeout(
        signal => avatarClient.getAvatar(authorId, { signal }),
        timeoutMs,
      ),
      { maxAttempts, baseDelayMs },
    );
    return { authorId, avatar, degraded: false };
  } catch (error) {
    return { authorId, avatar: { ...DEFAULT_AVATAR }, degraded: true };
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
