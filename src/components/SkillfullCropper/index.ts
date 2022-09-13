import { withInstall } from '/@/utils';
import cropperImage from './src/SkillfullCropper.vue';
import avatarCropper from './src/SkillfullCropperAvatar.vue';

export * from './src/typing';
export const SkillfullCropperImage = withInstall(cropperImage);
export const SkillfullCropperAvatar = withInstall(avatarCropper);
