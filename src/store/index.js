import { createPinia, defineStore } from 'pinia';
import Keycloak from 'keycloak-js';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const useAppStore = defineStore('app', {
  state: () => ({
    keycloak: null,
    token: null,
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
