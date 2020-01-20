import { AuthConfig } from 'angular-oauth2-oidc';

export const defaultOauthConfig: AuthConfig = {
  redirectUri: window.location.origin,
  clientId: 'mobile_android',
  dummyClientSecret: 'secret',
  scope: '',
};
