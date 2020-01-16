import { AuthConfig } from './auth-config';

export const defaultAuthConfig: AuthConfig = {
  authentication: {
    client_id: 'mobile_android',
    client_secret: 'secret',
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
