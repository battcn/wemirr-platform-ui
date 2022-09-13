// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import type { RequestOptions, Result } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import projectSetting from '/@/settings/projectSetting';
import { VAxios } from './Axios';
import { buildShortUUID } from '/@/utils/uuid';
import { checkStatus } from './checkStatus';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { isString, isArray } from '/@/utils/is';
import { getTokenInfo } from '/@/utils/auth';
import { setObjToUrlParams, deepMerge } from '/@/utils';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useI18n } from '/@/hooks/web/useI18n';
import { useLocale } from '/@/locales/useLocale';
import { joinTimestamp, formatRequestDate } from './helper';
const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { getLocale } = useLocale();
const { createMessage, createErrorModal, createSuccessModal, notification } = useMessage();
/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse, successMessageMode } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    // 错误的时候返回

    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(t('sys.api.apiRequestFailed'));
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, message } = data;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      if (successMessageMode === 'modal') {
        createSuccessModal({ title: t('sys.api.infoTip'), content: message });
      } else if (successMessageMode === 'message') {
        createMessage.success(message);
      } else if (successMessageMode === 'notification') {
        notification.success({ message: t('sys.api.infoTip'), description: message });
      }
      return data.data;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = t('sys.api.timeoutMessage');
        break;
      default:
        if (message) {
          timeoutMsg = message;
        }
    }

    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示

    if (options.errorMessageMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: message });
    } else if (options.errorMessageMode === 'message') {
      createMessage.error(message);
    } else if (options.errorMessageMode === 'notification') {
      notification.error({ message: t('sys.api.errorTip'), description: message });
    }
    throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'));
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }
    const url = config.url;
    if (
      apiUrl &&
      isString(apiUrl) &&
      url &&
      url.indexOf('http://') < 0 &&
      url.indexOf('https://') < 0
    ) {
      config.url = `${apiUrl}${config.url}`;
    }
    // 处理restfull风格传参
    config = setRestfullParam(config);
    // 其他处理
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    // 如果是get获取delete只有params参数
    if (
      config.method?.toUpperCase() === RequestEnum.GET ||
      config.method?.toUpperCase() === RequestEnum.DELETE
    ) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
      config = setQueryParam(config);
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        }
        // else {
        //   // 非GET请求如果没有提供data，则将params视为data
        //   config.data = params;
        //   config.params = undefined;
        // }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },
  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config: any) => {
    // 请求之前处理config
    const token = getTokenInfo();
    if (
      token &&
      Object.keys(token).length > 0 &&
      (config as Recordable)?.requestOptions?.withToken !== false
    ) {
      // jwt token
      config.headers['Authorization'] = 'Bearer ' + token.access_token;
    }
    config.headers['X-Request-Id'] = buildShortUUID();
    // 多语言后端支持
    config.headers['Accept-Language'] = getLocale.value;
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'message';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }
      if (!errMessage && err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }
      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        } else if (errorMessageMode === 'notification') {
          notification.error({ message: message });
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as string);
    }
    if (config.responseType == 'blob') {
      const blob = new Blob([response.data], {
        type: 'text/plain',
      });
      //将Blob 对象转换成字符串
      const reader = new FileReader();
      reader.readAsText(blob, 'utf-8');
      reader.onload = function (_e) {
        const data = JSON.parse(reader.result as string);
        checkStatus(error?.response?.status, data.message ?? '', errorMessageMode);
      };
    } else {
      checkStatus(error?.response?.status, response?.data?.message ?? '', errorMessageMode);
    }
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: globSetting.timeout || 30 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        urlPrefix: urlPrefix,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 错误消息提示类型
          errorMessageMode: 'message',
          // 成功消息提示类型
          successMessageMode: 'none',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      opt || {},
    ),
  );
}

/**
 *
 * 重置get或delete地址中的参数到axios的params中方便一起加密
 */
function setQueryParam(config: AxiosRequestConfig) {
  const newQueryParam = Object.assign({}, config.params);
  const url = config.url;
  if (url && url.indexOf('?') >= 0) {
    let urlParams = url.split('?');
    if (urlParams && urlParams.length == 2) {
      const newUrl = urlParams[0];
      config.url = newUrl;
      urlParams = urlParams[1].split('&');
      const len = urlParams.length;
      for (let i = 0; i < len; i++) {
        const urlParam = urlParams[i].split('=');
        if (urlParam) {
          if (urlParam.length == 2) {
            newQueryParam[urlParam[0]] = urlParam[1];
          } else {
            newQueryParam[urlParam[0]] = '';
          }
        }
      }
    }
  }
  config.params = newQueryParam;
  return config;
}

/**
 *  获取url地址中的参数并转为json
 * @param url 地址
 * @returns 解析后参数
 */
function urlParamToJson(url: string) {
  const index = url.indexOf('?');
  const obj = {};
  if (url.indexOf('?') >= 0) {
    const datas = url.substring(index + 1, url.length).split('&');
    for (const item of datas) {
      const data = item.split('=');
      obj[data[0]] = data[1];
    }
  }
  return obj;
}

/**
 *
 * 处理restfull风格参数
 */
function setRestfullParam(config: AxiosRequestConfig) {
  // 先处理params参数
  const params = config.params;
  let url: string = config?.url || '';
  if (url) {
    if (params && !isString(params)) {
      Object.keys(params).forEach((key) => {
        const regexp = new RegExp(`\{${key}\}`);
        if (regexp.test(url!)) {
          url = url.replace(regexp, params[key]);
          Reflect.deleteProperty(params, key);
        }
      });
      config.params = params;
    }
    // 在处理data中的参数
    const data = config.data || false;
    if (Reflect.has(config, 'data') && data && !isString(data) && !isArray(data)) {
      if (!isArray(data)) {
        Object.keys(data).forEach((key) => {
          const regexp = new RegExp(`\{${key}\}`);
          if (regexp.test(url!)) {
            url = url.replace(regexp, data[key]);
            Reflect.deleteProperty(data, key);
          }
        });
      }
      config.data = data;
    }
  }
  config.url = url;
  return config;
}

export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//   },
// });
