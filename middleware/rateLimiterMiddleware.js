const { RateLimiterMemory } = require('rate-limiter-flexible');

const opts = {
  points: 5, // 5 points
  duration: 5, // Per second
  blockDuration: 300, // block for 5 minutes if more than points consumed
};

const rateLimiter = new RateLimiterMemory(opts);

module.exports  = (req, res, next) => {

    // Consume 1 point for each request
  rateLimiter.consume(req.connection.remoteAddress, 2)
    .then((rateLimiterRes) => {
      next();
    })
    .catch((rateLimiterRes) => {
      return res.status(429).json({ error: 'Too Many Requests' });
    });
};
