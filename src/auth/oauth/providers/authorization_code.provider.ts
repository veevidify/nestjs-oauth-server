import { Injectable, Inject } from "@nestjs/common";
import { OAuth2Model } from "../interfaces";
import { OAuthService } from "../oauth.service";
import { oauth } from "src/config/constants";

import * as OAuth from 'express-oauth-server';
import { oauth2Options } from "../oauth.config";

@Injectable()
export class AuthorizationCodeProvider {
  private oauth: OAuth;
  constructor(
    @Inject(oauth.MODEL_INJECT_TOKEN) private oauthModel: OAuth2Model,
    private oauthService: OAuthService,
  ) {
    this.oauth = new OAuth({
      model: oauthModel,
      ...oauth2Options
    });
  }
}
