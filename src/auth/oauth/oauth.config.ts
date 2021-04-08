import { IOAuthServerOptions } from './providers/oauth2.express';

export const oauth2Options: Omit<IOAuthServerOptions, 'model'> = {
  accessTokenLifetime: 60 * 60 * 24,
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
};
