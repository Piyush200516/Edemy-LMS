// backend/config/redis.js
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Publisher client
export const redisPub = new IORedis(redisUrl);
// Subscriber client
export const redisSub = new IORedis(redisUrl);

export default { redisPub, redisSub };
