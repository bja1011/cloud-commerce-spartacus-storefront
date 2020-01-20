import { OccConfig } from '../../occ';
import { AuthConfig as OAuthConfig } from 'angular-oauth2-oidc';

export abstract class AuthConfig extends OccConfig {
  authentication?: {
    client_id?: string;
    client_secret?: string;
    oAuthConfig?: OAuthConfig;
    manuallyMode?: boolean;
  }
}
