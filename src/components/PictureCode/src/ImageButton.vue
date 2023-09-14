<template>
  <Image
    :fallback="code404"
    :height="'40px'"
    :preview="false"
    :src="imgSrc"
    :width="'130px'"
    @click="getPicture"
  />
</template>
<script lang="ts">
import { getCaptcha } from "@/api/sys/user";
import { defineComponent, onMounted, ref } from "vue";
import { Image } from "ant-design-vue";
import code404 from "@/assets/images/picture_code_404.png";

export default defineComponent({
  name: "ImageButton",
  components: { Image },
  emits: ["captchaId"],
  setup(_props, { emit }) {
    const imgSrc = ref("");
    /**
     * @description: 获取二维码
     */
    async function getPicture() {
      const pictureData = await getCaptcha();
      imgSrc.value = pictureData.imageData;
      emit("captchaId", pictureData.captchaId);
    }
    onMounted(() => {
      getPicture();
    });
    return { getPicture, imgSrc, code404 };
  },
});
</script>
