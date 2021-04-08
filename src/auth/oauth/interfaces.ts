import * as OAuth2 from 'oauth2-server';

export type OAuth2Model =
  | OAuth2.AuthorizationCodeModel
  | OAuth2.ClientCredentialsModel
  | OAuth2.RefreshTokenModel
  | OAuth2.PasswordModel
  | OAuth2.ExtensionModel;
