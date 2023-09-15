<template>
  <Image
    :fallback="code404"
    :height="'40px'"
    :preview="false"
    :src="imgData.src"
    :captchaId="imgData.captchaId"
    :width="'130px'"
    @click="getPicture"
  />
</template>
<script lang="ts">
import { getCaptcha } from "@/api/sys/user";
import { defineComponent, onMounted, reactive } from "vue";
import { Image } from "ant-design-vue";
import code404 from "@/assets/images/picture_code_404.png";

export default defineComponent({
  name: "ImageButton",
  components: { Image },
  setup(_props, { emit }) {
    const imgData = reactive({
      src: "",
      captchaId: "",
    });
    /**
     * @description: 获取二维码
     */
    async function getPicture() {
      const pictureData = await getCaptcha();
      imgData.src = pictureData.imageData;
      imgData.captchaId = pictureData.captchaId;
    }
    onMounted(() => {
      getPicture();
    });
    return { getPicture, imgData, code404 };
  },
});
</script>
