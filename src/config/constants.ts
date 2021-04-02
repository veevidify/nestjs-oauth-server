export const jwtConstants = {
  SECRET: process.env.JWT_SECRET || 'secretKey',
};

export const oauth = {
  STRATEGY_BASIC: 'oauth-basic',
  STRATEGY_CLIENT_PASSWORD: 'oauth-client-password',
  STRATEGY_BEARER: 'oauth-bearer',
};
