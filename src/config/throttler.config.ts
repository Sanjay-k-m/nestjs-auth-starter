/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const throttlerConfig = () => ({
  throttler: [
    {
      name: 'default', // Default throttler set name
      ttl: Number(process.env.THROTTLE_TTL_MS) || 60000, // Time to live in milliseconds (default: 1 minute)
      limit: Number(process.env.THROTTLE_LIMIT) || 10, // Max requests within ttl (default: 10 requests)
      blockDuration: Number(process.env.THROTTLE_BLOCK_DURATION_MS) || 300000, // Block duration in ms (default: 5 minutes)
      ignoreUserAgents: [
        /Googlebot/i, // Example: ignore Googlebot from throttling
        /Bingbot/i, // Example: ignore Bingbot
      ],
      errorMessage: 'Too many requests, please try again later.', // Custom error message when throttled
      skipIf: (context) => {
        // Optionally skip throttling for certain routes or users
        const req = context.switchToHttp().getRequest();
        // Example: skip if user is admin (assuming req.user.role)
        return req.user?.role === 'admin';
      },
    },
  ],
});
