import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OccEndpointsService } from '../../../occ/services/occ-endpoints.service';
import {
  InterceptorUtil,
  TOKEN_REVOCATION_HEADER,
} from '../../../occ/utils/interceptor-util';
import { AuthConfig } from '../../config/auth-config';
import { UserToken } from '../../models/token-types.model';
import { fromPromise } from "rxjs/internal-compatibility";
import { OAuthService } from "angular-oauth2-oidc";
import { oauthConfig } from "../../config/oauth-config";

@Injectable()
export class UserAuthenticationTokenService {
  constructor(
    http: HttpClient,
    config: AuthConfig,
    oAuthService: OAuthService,
    // tslint:disable-next-line:unified-signatures
    occEndpointsService: OccEndpointsService
  );

  /**
   * @deprecated since version 1.1
   * Use constructor(http: HttpClient, config: AuthConfig, occEndpointsService: OccEndpointsService) instead
   */
  constructor(http: HttpClient, config: AuthConfig, oAuthService: OAuthService);
  constructor(
    protected http: HttpClient,
    protected config: AuthConfig,
    protected oAuthService: OAuthService,
    protected occEndpointsService?: OccEndpointsService
  ) {
    this.prepareOauthLogin();
  }

  async prepareOauthLogin() {
    this.oAuthService.configure(oauthConfig);
    this.oAuthService.setStorage(sessionStorage);
    return await this.oAuthService.loadDiscoveryDocument();
  }

  loadToken(userId: string, password: string): Observable<UserToken> {
    return this.config.authentication.manuallyMode ?
      this.loadTokenManually(userId, password) : this.loadTokenWithLib(userId, password);
  }

  loadTokenWithLib(userId: string, password: string): Observable<UserToken> {
    return fromPromise(
      this.oAuthService.fetchTokenUsingPasswordFlow(userId, password)
    ) as Observable<UserToken>;
  }

  loadTokenManually(userId: string, password: string): Observable<UserToken> {
    const url = this.occEndpointsService.getRawEndpoint('login');
    const params = new HttpParams()
      .set('client_id', this.config.authentication.client_id)
      .set('client_secret', this.config.authentication.client_secret)
      .set('grant_type', 'password')
      .set('username', userId)
      .set('password', password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<UserToken>(url, params, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  refreshToken(refreshToken: string): Observable<UserToken> {
    const url = this.occEndpointsService.getRawEndpoint('login');
    const params = new HttpParams()
      .set(
        'client_id',
        encodeURIComponent(this.config.authentication.client_id)
      )
      .set(
        'client_secret',
        encodeURIComponent(this.config.authentication.client_secret)
      )
      .set('refresh_token', encodeURI(refreshToken))
      .set('grant_type', 'refresh_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<UserToken>(url, params, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  revoke(userToken: UserToken): Observable<{}> {
    const url = this.occEndpointsService.getRawEndpoint('revoke');
    const headers = InterceptorUtil.createHeader(
      TOKEN_REVOCATION_HEADER,
      true,
      new HttpHeaders({
        Authorization: `${userToken.token_type} ${userToken.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    );
    const params = new HttpParams().set('token', userToken.access_token);
    return this.http
      .post<{}>(url, params, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
