import { createJiti } from "../../../../../../node_modules/.pnpm/jiti@2.4.1/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "@vben-core/shared": "/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/packages/@core/base/shared"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/packages/@core/base/shared/src/constants/index.js")} */
const _module = await jiti.import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/packages/@core/base/shared/src/constants/index.ts");

export const CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT = _module.CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT;
export const CSS_VARIABLE_LAYOUT_CONTENT_WIDTH = _module.CSS_VARIABLE_LAYOUT_CONTENT_WIDTH;
export const CSS_VARIABLE_LAYOUT_HEADER_HEIGHT = _module.CSS_VARIABLE_LAYOUT_HEADER_HEIGHT;
export const CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT = _module.CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT;
export const DEFAULT_NAMESPACE = _module.DEFAULT_NAMESPACE;
export const VBEN_GITHUB_URL = _module.VBEN_GITHUB_URL;
export const VBEN_DOC_URL = _module.VBEN_DOC_URL;
export const VBEN_LOGO_URL = _module.VBEN_LOGO_URL;
export const VBEN_PREVIEW_URL = _module.VBEN_PREVIEW_URL;