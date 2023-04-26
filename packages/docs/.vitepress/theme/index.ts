import Theme from "vitepress/theme"
import { inBrowser } from "vitepress"
import "../style/main.css"
import "../style/vars.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "element-plus/theme-chalk/src/index.scss"
import "uno.css"

if (inBrowser) import("./pwa")

export default {
  ...Theme
}
