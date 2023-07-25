import { createPinia, defineStore } from 'pinia';
import Keycloak from 'keycloak-js';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export const useAppStore = defineStore('app', {
  state: () => ({
    keycloak: null,
    token: null,
    encodedToken: null,
    access: ['customer.management', 'item.management'],
  }),
  getters: {},
  actions: {
    async auth() {
      let initOptions = {
        url: 'https://keycloak.on-dev.info/',
        realm: 'merkle',
        clientId: 'pos',
      };

      let keycloak = new Keycloak(initOptions);
      this.keycloak = keycloak;

      try {
        const auth = await keycloak.init({
          onLoad: 'login-required', // 'check-sso' throw this error: Timeout when waiting for 3rd party check iframe message.
          silentCheckSsoRedirectUri:
            window.location.origin + 'silence-check-sso.html',
          pkceMethod: 'S256',
          redirectUri: window.location.origin,
        });

        if (auth) {
          this.token = keycloak.token;
          this.encodedToken = parseJwt(this.token);

          if (
            this.encodedToken.resource_access.pos.roles.includes(
              'superadmin'
            )
          ) {
            this.access = this.access.concat([
              'inventory.management',
              'employee.management',
              'settings',
            ]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  persist: {
    key: 'theme',
    storage: localStorage,
    paths: ['theme'],
  },
});

export default pinia;
