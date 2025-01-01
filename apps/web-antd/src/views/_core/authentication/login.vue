<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { loadTenantSetting } from '#/api';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '租户编码 0000 或 8888 账号 admin 密码 123456 ',
      },
      dependencies: {
        disabled: true,
        triggerFields: [''],
      },
      fieldName: 'desc',
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '租户编码',
      },
      dependencies: {
        show: true,
        triggerFields: [''],
      },
      fieldName: 'tenantCode',
      label: '租户编码',
      rules: z
        .string()
        .max(6, { message: '租户编码不能为空' })
        .min(4, { message: '租户编码不能为空' }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});
const loginRef = ref();
const loginPropsRef = ref();
// const route = useRoute();
onMounted(async () => {
  const formApi = loginRef.value.getFormApi();
  // TODO formApi 应该在提供一个显示或者隐藏某个字段
  await loadTenantSetting({}).then((ret) => {
    loginPropsRef.value = ret;
    if (ret.tenantCode) {
      formApi.updateSchema([
        {
          fieldName: 'tenantCode',
          dependencies: {
            show: false,
          },
        },
      ]);
      formApi.setFieldValue('tenantCode', ret.tenantCode);
    }
  });
});
</script>

<template>
  <AuthenticationLogin
    ref="loginRef"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :show-code-login="loginPropsRef?.showCodeLogin"
    :show-forget-password="loginPropsRef?.showForgetPassword"
    :show-qrcode-login="loginPropsRef?.showQrcodeLogin"
    :show-register="loginPropsRef?.showRegister"
    :show-remember-me="loginPropsRef?.showRememberMe"
    :show-third-party-login="loginPropsRef?.showThirdPartyLogin"
    :sub-title="loginPropsRef?.subTitle"
    :title="loginPropsRef?.title"
    @submit="authStore.authLogin"
  />
</template>
