export const jwtConstants = {
  SECRET: process.env.JWT_SECRET || 'secretKey',
};

export const oauth = {
  STRATEGY_BASIC: 'oauth-basic',
  STRATEGY_CLIENT_PASSWORD: 'oauth2-client-password',
  STRATEGY_BEARER: 'oauth-bearer',
  MODEL_INJECT_TOKEN: 'oauth2-model',
};

export const web = {
  SESSION_SECRET: process.env.SESSION_SECRET || 'secretKey'
};
