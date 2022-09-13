import type { GlobConfig } from '/#/config';

import { warn } from '/@/utils/log';
import { getAppEnvConfig } from '/@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    // 打开websocket
    VITE_GLOB_OPEN_SOCKET,
    // socket地址
    VITE_GLOB_SOCKET_URL,
    // 系统编码
    VITE_GLOB_SYSTEM_CODE,
  } = getAppEnvConfig();

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    // 打开websocket
    openSocket: (VITE_GLOB_OPEN_SOCKET as unknown as string) == 'true' ? true : false,
    // socket地址
    socketApi: VITE_GLOB_SOCKET_URL,
    // 系统编码
    systemCode: VITE_GLOB_SYSTEM_CODE,
  };
  return glob as Readonly<GlobConfig>;
};
