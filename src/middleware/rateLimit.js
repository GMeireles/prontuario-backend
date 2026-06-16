import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas de login. Tente novamente em 1 minuto.' },
  standardHeaders: true,
  legacyHeaders: false
});
