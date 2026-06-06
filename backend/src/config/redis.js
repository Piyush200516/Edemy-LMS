// src/config/redis.js
// Redis connection and BullMQ utilities for the LMS backend
import IORedis from "ioredis";
import { Queue, Worker, QueueScheduler } from "bullmq";

// Load REDIS_URL from .env (default to localhost)
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Create a ioredis client (shared instance)
export const redisClient = new IORedis(redisUrl);

/**
 * Helper to create a BullMQ queue with a given name.
 * @param {string} name Queue name
 * @param {object} [options] Optional BullMQ options
 */
export function createQueue(name, options = {}) {
  // Ensure a QueueScheduler is created for delayed/repeating jobs
  const scheduler = new QueueScheduler(name, { connection: redisClient });
  const queue = new Queue(name, { connection: redisClient, ...options });
  return { queue, scheduler };
}

/**
 * Helper to create a BullMQ worker for a specific queue.
 * @param {string} name Queue name
 * @param {function} processor Function that processes each job
 * @param {object} [options] Optional worker options
 */
export function createWorker(name, processor, options = {}) {
  return new Worker(name, processor, { connection: redisClient, ...options });
}

export default redisClient;
