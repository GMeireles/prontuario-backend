import rateLimit from 'express-rate-limit';

// Limite específico para login
export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // máximo de 5 tentativas
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 1 minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
