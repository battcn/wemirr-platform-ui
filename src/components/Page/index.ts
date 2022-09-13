import { withInstall } from '/@/utils';

import pageFooter from './src/PageFooter.vue';
import pageWrapper from './src/PageWrapper.vue';
import pageBlackFooter from './src/PageBlackFooter.vue';

export const PageWrapper = withInstall(pageWrapper);
export const PageFooter = withInstall(pageFooter);
export const PageBlackFooter = withInstall(pageBlackFooter);

export const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight';
