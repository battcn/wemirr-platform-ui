<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <a-alert message="0000=平台; 8888=演示租户" type="success" closable />
    <FormItem name="tenantCode" class="enter-x">
      <Input size="large" v-model:value="formData.tenantCode" placeholder="租户编码" />
    </FormItem>
    <FormItem name="account" class="enter-x">
      <Input size="large" v-model:value="formData.account" :placeholder="t('sys.login.userName')" />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow class="enter-x" v-show="formState.showCaptcha">
      <ACol>
        <FormItem class="code-input" name="code">
          <Input size="large" visibilityToggle v-model:value="formData.code" placeholder="验证码" />
        </FormItem>

        <img
          v-show="true"
          :src="formState.captchaSrc"
          @click="loadCaptcha"
          alt="captcha"
          class="code-image"
        />
      </ACol>
    </ARow>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
    <ARow class="enter-x">
      <ACol :xs="24" :md="8">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24" class="!my-2 md:!my-0 xs:mx-0 md:mx-2">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="7" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </Button>
      </ACol>
    </ARow>

    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>
  </Form>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRaw, unref, computed, onMounted } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';

  import { Checkbox, Form, Input, Row, Col, Button, Divider } from 'ant-design-vue';
  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { buildUUID } from '/@/utils/uuid';
  //import { onKeyStroke } from '@vueuse/core';

  export default defineComponent({
    name: 'LoginForm',
    components: {
      [Col.name]: Col,
      [Row.name]: Row,
      Checkbox,
      Button,
      Form,
      FormItem: Form.Item,
      Input,
      Divider,
      LoginFormTitle,
      InputPassword: Input.Password,
      GithubFilled,
      WechatFilled,
      AlipayCircleFilled,
      GoogleCircleFilled,
      TwitterCircleFilled,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('login');
      const userStore = useUserStore();

      const { setLoginState, getLoginState } = useLoginState();
      const { getFormRules } = useFormRules();

      const globSetting = useGlobSetting();
      const formRef = ref();
      const loading = ref(false);
      const rememberMe = ref(false);
      onMounted(() => {
        loadCaptcha();
      });
      const formData = reactive({
        tenantCode: '8888',
        account: 'admin',
        password: '123456',
        key: buildUUID(),
      });
      const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);
      const formState = reactive({
        loading: false,
        captchaSrc: '',
        showCaptcha: true,
        // isMultiTenant: globSetting.multiTenantType !== 'NONE',
        // showCaptcha: globSetting.showCaptcha === undefined || globSetting.showCaptcha === 'true',
      });
      const { validForm } = useFormValid(formRef);

      //onKeyStroke('Enter', handleLogin);

      // 加载验证码
      async function loadCaptcha() {
        formData.key = buildUUID();
        formState.captchaSrc = '/api/authority/captcha?key=' + formData.key;
      }
      async function handleLogin() {
        const data = await validForm();
        if (!data) return;
        try {
          loading.value = true;
          const userInfo = await userStore.login(
            toRaw({
              username: data.account,
              password: data.password,
              grant_type: 'password',
              client_id: 'client',
              client_secret: 'client',
              scope: 'server',
              tenant_code: data.tenantCode,
              auth_type: 'vc',
              vc_code: data.code,
              vc_token: formData.key,
              mode: 'none', //不要默认的错误提示
            })
          );
          console.log('userInfo', userInfo);
          if (userInfo) {
            notification.success({
              message: t('sys.login.loginSuccessTitle'),
              description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
              duration: 3,
            });
          }
        } catch (error) {
          console.log('error', error);
          createErrorModal({
            title: t('sys.api.errorTip'),
            content:
              error.response?.data.message || error.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
          await loadCaptcha();
        } finally {
          loading.value = false;
        }
      }

      return {
        t,
        prefixCls,
        formRef,
        formData,
        getFormRules,
        rememberMe,
        handleLogin,
        loadCaptcha,
        loading,
        setLoginState,
        LoginStateEnum,
        getShow,
        formState,
      };
    },
  });
</script>
