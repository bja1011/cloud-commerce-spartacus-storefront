import { AuthConfig } from './auth-config';
import { defaultOauthConfig } from "./default-oauth-config";

export const defaultAuthConfig: AuthConfig = {
  authentication: {
    client_id: 'mobile_android',
    client_secret: 'secret',
    oAuthConfig: defaultOauthConfig,
    manuallyMode: false,
  },
  backend: {
    occ: {
      endpoints: {
        login: '/authorizationserver/oauth/token',
        revoke: '/authorizationserver/oauth/revoke',
      },
    },
  },
};
