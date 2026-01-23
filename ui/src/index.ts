import { definePlugin } from "@halo-dev/ui-shared"
import "./style/index.css"

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "default:editor:extension:create": async () => {
      const { ExtensionTikZ } = await import("./views")
      return [ExtensionTikZ]
    },
  },
})
