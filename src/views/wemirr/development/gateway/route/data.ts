export const predicates: any[] = [
  'Path',
  'Host',
  'Cookie',
  'Header',
  'Method',
  'Query',
  'After',
  'Before',
  'Between',
  'RemoteAddr',
];

export const filters: any[] = [
  {
    title: '径截取',
    name: 'StripPrefix',
    args: [{ key: 'parts', value: '1' }],
  },
  {
    title: '熔断器',
    args: [
      { key: 'name', value: 'default' },
      { key: 'fallbackUri', value: 'forward:/fallback' },
    ],
    name: 'Hystrix',
  },
  {
    title: '限流过滤',
    args: [
      { key: 'key-resolver', value: '#{@ipKeyResolver}' },
      { key: 'redis-rate-limiter.replenishRate', value: 20 },
      { key: 'redis-rate-limiter.burstCapacity', value: 20 },
    ],
    name: 'RequestRateLimiter',
  },
  {
    title: '重试',
    name: 'Retry',
    args: [
      { key: 'retries', value: '1' },
      { key: 'statuses', value: 'BAD_GATEWAY' },
      { key: 'backoff.firstBackoff', value: '200ms' },
      { key: 'backoff.maxBackoff', value: '200ms' },
      { key: 'backoff.factor', value: 1 },
      { key: 'backoff.basedOnPreviousValue', value: false },
      { key: 'backoff.exceptions', value: 'TimeoutException' },
    ],
  },
];
