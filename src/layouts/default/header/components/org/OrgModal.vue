<template>
  <BasicModal
    :canFullscreen="false"
    title="切换机构"
    v-bind="$attrs"
    :class="prefixCls"
    @register="register"
    @ok="handleCheckOrg"
  >
    <div :class="`${prefixCls}__entry`">
      <div :class="`${prefixCls}__header`">
        <img :src="avatar" :class="`${prefixCls}__header-img`" />
        <p :class="`${prefixCls}__header-name`">
          {{ getRealName }}
        </p>
      </div>
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { getAttachmentUrl } from '/@/utils';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '/@/components/Modal/index';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useUserStore } from '/@/store/modules/user';
  import { getUserOrgInfo } from '/@/api/modules/sys/webLoginCenter';
  import headerImg from '/@/assets/images/header.jpg';
  const { prefixCls } = useDesign('header-lock-modal');
  const userStore = useUserStore();
  const [registerForm, { validate, resetFields, setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    schemas: [
      {
        field: 'orgId',
        label: '用户机构',
        component: 'ApiTreeSelect',
        componentProps: {
          allowClear: false,
          fieldNames: {
            label: 'orgName',
            value: 'orgId',
          },
          api: getUserOrgInfo,
        },
        colProps: {
          span: 24,
        },
      },
    ],
  });
  const getRealName = computed(() => userStore.getUserInfo?.realName);
  const [register, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    setFieldsValue({
      orgId: data?.orgId,
    });
  });

  async function handleCheckOrg() {
    const values = await validate();
    userStore.switchOrg(values.orgId);
    // 切换机构
    closeModal();
  }

  const avatar = computed(() => {
    const { avatar } = userStore.getUserInfo;
    return getAttachmentUrl(avatar || headerImg);
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-lock-modal';

  .@{prefix-cls} {
    &__entry {
      position: relative;
      //height: 240px;
      padding: 130px 30px 30px;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: 0;
      left: calc(50% - 45px);
      width: auto;
      text-align: center;

      &-img {
        width: 70px;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
      }
    }

    &__footer {
      text-align: center;
    }
  }
</style>
