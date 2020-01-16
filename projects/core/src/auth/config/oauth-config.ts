import { AuthConfig } from 'angular-oauth2-oidc';

export const oauthConfig: AuthConfig = {
  issuer: 'https://storefront.c39j2-walkersde1-d4-public.model-t.cc.commerce.ondemand.com/authorizationserver',

  redirectUri: window.location.origin + '/index.html',
  strictDiscoveryDocumentValidation: false,

  clientId: 'mobile_android',
  dummyClientSecret: 'secret',

  scope: '',
  skipIssuerCheck: true,
};
