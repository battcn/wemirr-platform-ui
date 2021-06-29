import type {
  // LoginParams,
  // LogoutParams,
  // GetUserInfoByUserIdModel,
  // GetUserInfoByUserIdParams,
  // GetAuthorityResourceByUserIdParams,
  GetCaptchaByKeyParams,
} from '/@/api/sys/model/userModel';
import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
// import { getUserInfo, loginApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';

import {
  loginApi,
  // logout,
  getUserInfo,
  loadCaptcha,
  // getPermCodeByUserId,
} from '/@/api/sys/user';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info;
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        // debugger;
        const { access_token } = data;

        // save token
        this.setToken(access_token);
        // get user info
        const userInfo = await this.getUserInfoAction();

        const sessionTimeout = this.sessionTimeout;
        sessionTimeout && this.setSessionTimeout(false);
        !sessionTimeout && goHome && (await router.replace(PageEnum.BASE_HOME));
        return userInfo;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: 加载验证码
     */
    async loadCaptcha({ key }: GetCaptchaByKeyParams): Promise<string | ''> {
      try {
        const res = await loadCaptcha(key).catch((e) => {
          console.log(e);
          const { createMessage } = useMessage();
          if (e.toString().indexOf('429') !== -1) {
            createMessage.error('获取验证码过于频繁，请1分钟后再试');
          } else {
            createMessage.error('加载验证码失败');
          }
        });
        // if (res.byteLength <= 100) {
        //   const { createMessage } = useMessage();
        //   createMessage.error('系统维护中，请稍微再试~');
        //   return '';
        // }
        return (
          'data:image/png;base64,' +
          btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        );
      } catch (error) {
        console.error(error);
        return '';
      }
    },

    async getUserInfoAction() {
      const userInfo = await getUserInfo();
      // const { roles } = userInfo;
      // const roleList = roles.map((item) => item.value) as RoleEnum[];
      this.setUserInfo(userInfo);
      // this.setRoleList(roleList);
      return userInfo;
    },
    /**
     * @description: logout
     */
    logout(goLogin = false) {
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.app.logoutMessage'),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
