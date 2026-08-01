export const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false';

/**
 * Simulates network latency between 300ms and 800ms to trigger loading skeletons and spinners.
 */
export function mockDelay(minMs = 300, maxMs = 800): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
