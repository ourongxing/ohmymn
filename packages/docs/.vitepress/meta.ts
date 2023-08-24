/* CDN fonts and styles */
export const googleapis = "https://fonts.googleapis.com"
export const gstatic = "https://fonts.gstatic.com"
export const font = `${googleapis}/css2?family=Readex+Pro:wght@200;400;600&display=swap`

export const title = "OhMyMN"
/* vitepress head */
export const ogUrl = "https://ohmymn.marginnote.cn/"
export const ogImage = `${ogUrl}og.jpg`

/* GitHub and social links */
export const github = "https://github.com/ourongxing/ohmymn"
export const releases = "https://github.com/ourongxing/ohmymn/releases"

/* Avatar/Image/Sponsors servers */
export const preconnectLinks = [googleapis, gstatic]
export const preconnectHomeLinks = [googleapis, gstatic]

/* PWA runtime caching urlPattern regular expressions */
export const pwaFontsRegex = new RegExp(`^${googleapis}/.*`, "i")
export const pwaFontStylesRegex = new RegExp(`^${gstatic}/.*`, "i")
// eslint-disable-next-line prefer-regex-literals
export const githubusercontentRegex = new RegExp(
  "^https://((i.ibb.co)|((raw|user-images).githubusercontent.com))/.*",
  "i"
)
