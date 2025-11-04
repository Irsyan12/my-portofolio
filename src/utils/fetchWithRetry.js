/**
 * Fetch with retry logic
 * @param {Function} fetchFunction - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum retry attempts (default: unlimited within timeout)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 3000)
 * @param {number} options.timeout - Total timeout in ms (default: 60000 - 1 minute)
 * @returns {Promise} - Result from fetchFunction or throws last error
 */
export const fetchWithRetry = async (fetchFunction, options = {}) => {
  const {
    maxRetries = Infinity,
    retryDelay = 3000, // 3 seconds between retries
    timeout = 60000, // 1 minute total timeout
  } = options;

  const startTime = Date.now();
  let lastError = null;
  let attempt = 0;

  while (Date.now() - startTime < timeout && attempt < maxRetries) {
    try {
      attempt++;
      console.log(`🔄 Attempt ${attempt} to fetch data...`);

      const result = await fetchFunction();

      console.log(`✅ Fetch successful on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      const elapsedTime = Date.now() - startTime;
      const remainingTime = timeout - elapsedTime;

      console.warn(
        `❌ Attempt ${attempt} failed:`,
        error.message,
        `- Retrying in ${retryDelay / 1000}s... (${Math.floor(
          remainingTime / 1000
        )}s remaining)`
      );

      // If we still have time, wait before retry
      if (remainingTime > retryDelay) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        // Not enough time for another retry
        break;
      }
    }
  }

  // All retries failed
  console.error(
    `💥 All retry attempts failed after ${attempt} tries in ${
      (Date.now() - startTime) / 1000
    }s`
  );
  throw lastError || new Error("Fetch failed after maximum retries");
};

/**
 * Fetch multiple resources with retry logic in parallel
 * @param {Array} fetchFunctions - Array of async functions to execute
 * @param {Object} options - Retry options (same as fetchWithRetry)
 * @returns {Promise<Array>} - Array of results or throws if any fails
 */
export const fetchMultipleWithRetry = async (fetchFunctions, options = {}) => {
  const promises = fetchFunctions.map((fn) => fetchWithRetry(fn, options));
  return Promise.all(promises);
};
