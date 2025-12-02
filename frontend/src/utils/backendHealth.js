const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

/**
 * Checks if the backend is ready and shows a notification if it's cold starting
 * @returns {Promise<{ready: boolean, responseTime: number, error?: string}>} 
 */
export async function checkBackendHealth() {
  const startTime = Date.now();
  const timeout = 5000; // 5 second timeout
  const slowThreshold = 2000; // 2 seconds = slow response (likely cold start)

  try {
    // Try to hit the lightweight health endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      signal: controller.signal,
      // Add a cache-busting header to ensure fresh request
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return { ready: true, responseTime };
    } else {
      return { ready: false, responseTime };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return { ready: false, responseTime, error: error.message };
  }
}

