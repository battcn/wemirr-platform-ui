<template>
  <div ref="editor" style="height: 100%"></div>
</template>

<script lang="ts" setup>
  import { getTokenInfo, getSecurityInfo } from '/@/utils/auth';
  import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
  import WangEditor from 'wangeditor';
  import { useGlobSetting } from '/@/hooks/setting';
  import { SysUrlPrefix } from '/@/api/sysPrefix';
  import { buildLongUUID } from '/@/utils/uuid';
  let instance: WangEditor | null;
  const globSetting = useGlobSetting();
  const props = defineProps({
    isClear: {
      type: Boolean,
      default: false,
    },
    // 设置该值会返回结果去掉VITE_GLOB_API_URL值，同时显示时会自动加上(只针对上传图片与视频)
    clearGlobApiUrl: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: String,
    },
  });
  const emit = defineEmits(['update:modelValue', 'change']);
  const editor = ref();
  watch(
    () => props.isClear,
    (val) => {
      if (val) {
        if (instance) {
          instance.txt.clear();
        }
      }
    }
  );
  watch(
    () => props.modelValue,
    (val) => {
      if (instance) {
        if (val !== instance.txt.html()) {
          instance.txt.html(props.modelValue);
        }
      }
    }
  );
  onMounted(() => {
    initEdit();
    if (instance) {
      instance.txt.html(props.modelValue);
    }
  });

  function initEdit() {
    instance = new WangEditor(editor.value);
    // 图片上传设置
    instance.config.uploadImgServer =
      globSetting.apiUrl + SysUrlPrefix.STORAGE + '/local/file/upload';
    instance.config.uploadImgHeaders = getUploadHeaders();
    instance.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    instance.config.uploadFileName = 'file';
    instance.config.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 2M
    instance.config.uploadImgMaxLength = 3; // 限制一次最多上传 3 张图片
    instance.config.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
    instance.config.uploadImgHooks = {
      fail: (_xhr: any, _editor: any, _result: any) => {
        // 插入图片失败回调
      },
      success: (_xhr: any, _editor: any, _result: any) => {
        // 图片上传成功回调
      },
      timeout: (_xhr: any, _editor: any) => {
        // 网络超时的回调
      },
      error: (_xhr: any, _editor: any) => {
        // 图片上传错误的回调
      },
      customInsert: (inserImg: (this: any, src: string) => void, result: any, _editor: any) => {
        let url = globSetting.apiUrl + result.data.previewPath;
        inserImg(url);
      },
    };
    // 视频上传设置
    instance.config.uploadImgTimeout = 180000;
    instance.config.uploadVideoAccept = ['mp4'];
    instance.config.uploadVideoHeaders = getUploadHeaders();
    instance.config.uploadVideoMaxSize = 500 * 1024 * 1024; // 将图片大小限制为 500M
    instance.config.uploadVideoName = 'file';
    instance.config.uploadVideoServer =
      globSetting.apiUrl + SysUrlPrefix.STORAGE + '/local/file/upload';
    instance.config.uploadVideoHooks = {
      fail: (_xhr: any, _editor: any, _result: any) => {
        // 插入视频失败回调
      },
      success: (_xhr: any, _editor: any, _result: any) => {
        // 视频上传成功回调
      },
      timeout: (_xhr: any, _editor: any) => {
        // 网络超时的回调
      },
      error: (_xhr: any, _editor: any) => {
        // 视频上传错误的回调
      },
      customInsert: (inserVideo: (this: any, src: string) => void, result: any, _editor: any) => {
        let url = globSetting.apiUrl + result.data.previewPath;
        inserVideo(url);
      },
    };
    instance.config.onchange = (html: any) => {
      let value = html;
      // 将内容同步到父组件中
      emit('change', value);
      // 将内容同步到父组件中
      emit('update:modelValue', value);
    };
    instance.create();
  }
  function getUploadHeaders() {
    const token = getTokenInfo();
    const headers = {
      'X-Request-Id': buildLongUUID() + '-' + new Date().getTime(),
    };
    if (token && Object.keys(token).length > 0) {
      // jwt token
      headers[token.tokenHeaderKey] = token.tokenHeaderStartWith + token.token;
    }
    // 处理添加请求序列
    const securityInfo = getSecurityInfo();
    if (securityInfo && Object.keys(securityInfo).length > 0) {
      headers[securityInfo.serialNumberKey] = securityInfo.serialNumber;
    }
    return headers;
  }
  onBeforeUnmount(() => {
    if (instance) {
      instance.destroy();
    }
    instance = null;
  });
</script>
