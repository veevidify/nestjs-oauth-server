import * as OAuth2Server from 'express-oauth-server';

export const oauth2Options: Omit<OAuth2Server.Options, 'model'> = {
  accessTokenLifetime: 60 * 60 * 24,
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
};
