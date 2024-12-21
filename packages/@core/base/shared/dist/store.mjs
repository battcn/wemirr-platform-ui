import { createJiti } from "../../../../../node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.mjs";

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

/** @type {import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/packages/@core/base/shared/src/store.js")} */
const _module = await jiti.import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/packages/@core/base/shared/src/store.ts");

export const shallow = _module.shallow;
export const useStore = _module.useStore;
export const Store = _module.Store;