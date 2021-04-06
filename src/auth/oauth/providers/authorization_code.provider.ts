import { Injectable, Inject } from "@nestjs/common";
import { OAuth2Model } from "../interfaces";
import { OAuthService } from "../oauth.service";
import { oauth } from "src/config/constants";

@Injectable()
export class AuthorizationCodeProvider {
  constructor(
    @Inject(oauth.MODEL_INJECT_TOKEN) private oauthModel: OAuth2Model,
    private oauthService: OAuthService,
  ) {}
}
