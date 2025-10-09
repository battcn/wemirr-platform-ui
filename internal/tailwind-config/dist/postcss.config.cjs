const { createJiti } = require("../../../node_modules/.pnpm/jiti@2.6.1/node_modules/jiti/lib/jiti.cjs")

const jiti = createJiti(__filename, {
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

/** @type {import("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/internal/tailwind-config/src/postcss.config.js")} */
module.exports = jiti("/Users/battcn/Work/Company/WEMIRR/webstorm-workspace/wemirr-platform-ui/internal/tailwind-config/src/postcss.config.ts")