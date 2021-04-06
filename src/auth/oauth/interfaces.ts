import * as OAuth from 'oauth2-server';

export type OAuth2Model =
  | OAuth.AuthorizationCodeModel
  | OAuth.ClientCredentialsModel
  | OAuth.RefreshTokenModel
  | OAuth.PasswordModel
  | OAuth.ExtensionModel;
