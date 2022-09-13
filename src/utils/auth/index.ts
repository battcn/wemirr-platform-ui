import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import type { TokenInfo, WebSecurityModel } from '/#/store';
import projectSetting from '/@/settings/projectSetting';
import { TOKEN_KEY, SECURITY_KEY } from '/@/enums/cacheEnum';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  const data = getAuthCache<TokenInfo>(TOKEN_KEY);
  return data.access_token;
}

export function getTokenInfo() {
  return getAuthCache<TokenInfo>(TOKEN_KEY);
}

export function setTokenInfo(token: TokenInfo) {
  return setAuthCache(TOKEN_KEY, token);
}

export function getSecurityInfo() {
  return getAuthCache<WebSecurityModel>(SECURITY_KEY);
}

export function setSecurityInfo(token: WebSecurityModel | null) {
  return setAuthCache(SECURITY_KEY, token);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}
