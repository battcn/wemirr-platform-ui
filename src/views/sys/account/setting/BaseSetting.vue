<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <a-row :gutter="24">
      <a-col :span="14">
        <BasicForm @register="register" />
      </a-col>
      <a-col :span="10">
        <div class="change-avatar">
          <div class="mb-2">头像</div>
          <CropperAvatar
            :uploadApi="uploadApi"
            :value="avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
          />
        </div>
      </a-col>
    </a-row>
    <Button type="primary" @click="handleSubmit"> 更新基本信息 </Button>
  </CollapseContainer>
</template>
<script lang="ts">
import { Button, Row, Col } from "ant-design-vue";
import { computed, defineComponent, onMounted } from "vue";
import { BasicForm, useForm } from "@/components/Form/index";
import { CollapseContainer } from "@/components/Container";
import { CropperAvatar } from "@/components/Cropper";

import { useMessage } from "@/hooks/web/useMessage";

import headerImg from "@/assets/images/header.jpg";
import { baseSetSchemas } from "./data";
import { useUserStore } from "@/store/modules/user";
import { uploadApi } from "@/api/sys/upload";
import { UserInfo } from "#/store";
import { changeUserInfo } from "@/api/sys/user";

export default defineComponent({
  components: {
    BasicForm,
    CollapseContainer,
    Button,
    ARow: Row,
    ACol: Col,
    CropperAvatar,
  },
  setup() {
    const { createMessage } = useMessage();
    const userStore = useUserStore();

    const [register, { getFieldsValue, setFieldsValue, validate }] = useForm({
      labelWidth: 120,
      schemas: baseSetSchemas,
      showActionButtonGroup: false,
    });

    onMounted(async () => {
      const data = await userStore.getUserInfo;
      setFieldsValue(data);
    });

    const avatar = computed(() => {
      const { avatar } = userStore.getUserInfo;
      return avatar || headerImg;
    });

    function updateAvatar({ src, data }) {
      console.log("data", data, src);
      createMessage.error("暂未实现！");
      // const userinfo = userStore.getUserInfo as UserInfo;
      // userinfo.avatar = src;
      // userStore.setUserInfo(userinfo);
    }

    async function handleSubmit() {
      await validate();
      let data = getFieldsValue();
      await changeUserInfo(data).then(() => {
        const userinfo = userStore.getUserInfo as UserInfo;
        userinfo.email = data.email;
        userinfo.mobile = data.mobile;
        userinfo.nickName = data.nickName;
        userinfo.birthday = data.birthday;
        userinfo.description = data.description;
        userStore.setUserInfo(userinfo);
        createMessage.success("更新成功！");
      });
    }

    return {
      avatar,
      register,
      uploadApi: uploadApi as any,
      updateAvatar,
      handleSubmit,
    };
  },
});
</script>

<style lang="less" scoped>
.change-avatar {
  img {
    display: block;
    margin-bottom: 15px;
    border-radius: 50%;
  }
}
</style>
