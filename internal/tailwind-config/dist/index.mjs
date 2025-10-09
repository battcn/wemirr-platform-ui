import { createJiti } from "../../../node_modules/.pnpm/jiti@2.6.1/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "@vben/tailwind-config": "/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/internal/tailwind-config"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/internal/tailwind-config/src/index.js")} */
const _module = await jiti.import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/internal/tailwind-config/src/index.ts");

export default _module?.default ?? _module;