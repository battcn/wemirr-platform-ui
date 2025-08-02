import { forEach } from 'lodash-es';

export function getEnvValue(key: string) {
  // @ts-ignore
  return import.meta.env[`VITE_APP_${key}`];
}

export class EnvConfig {
  API: string;
  COPYRIGHT: string;
  LOGO_PATH: string;
  MODE: string;
  PM_ENABLED: string;
  SLOGAN: string;
  STORAGE: string;
  TITLE: string;

  constructor() {
    this.init();
  }

  get(key: string, defaultValue: string) {
    // @ts-ignore
    return this[key] ?? defaultValue;
  }

  init() {
    // @ts-ignore
    forEach(import.meta.env, (value, key) => {
      if (key.startsWith('VITE_APP')) {
        key = key.replace('VITE_APP_', '');
        // @ts-ignore
        this[key] = value;
      }
    });
    // @ts-ignore
    this.MODE = import.meta.env.MODE;
  }

  isDev() {
    return this.MODE === 'development' || this.MODE === 'debug';
  }

  isProd() {
    return this.MODE === 'production';
  }
}

export const env = new EnvConfig();
