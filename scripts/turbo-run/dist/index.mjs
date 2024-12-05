import { createJiti } from "../../../node_modules/.pnpm/jiti@2.4.1/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "@vben/turbo-run": "/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/scripts/turbo-run"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/scripts/turbo-run/src/index.js")} */
const _module = await jiti.import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/scripts/turbo-run/src/index.ts");

export default _module;