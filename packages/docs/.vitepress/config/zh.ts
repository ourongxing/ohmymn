import type { DefaultTheme, LocaleSpecificConfig } from "vitepress"
import { version, unsignedVersion } from "../../package.json"
import modules from "../../modules"

export const META_DESCRIPTION = "MarginNote 插件开发框架"

export const zhConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: META_DESCRIPTION,
  head: [
    ["meta", { property: "og:description", content: META_DESCRIPTION }],
    ["meta", { name: "twitter:description", content: META_DESCRIPTION }]
  ],

  themeConfig: {
    editLink: {
      pattern: "https://github.com/marginnoteapp/ohmymn-docs/tree/main/:path",
      text: "为此页提供修改建议"
    },
    outline: {
      label: "目录"
    },

    docFooter: {
      prev: "上一篇",
      next: "下一篇"
    },

    nav: [
      {
        text: "使用指南",
        link: "/guide/",
        activeMatch: "^/guide/"
      },
      { text: "开发", link: "/dev/", activeMatch: "^/dev/" },
      { text: "API", link: "/api/", activeMatch: "^/api/" },
      {
        text: `v${version}`,
        items: [
          {
            text: `签名版本（v${version}）`,
            link: "https://bbs.marginnote.cn/t/topic/20501"
          },
          {
            text: `未签名版本（v${unsignedVersion}）`,
            link: "/update"
          }
        ]
      }
    ],
    sidebar: {
      "/dev/": [
        {
          text: "基础",
          items: [
            {
              text: "开始",
              link: "/dev/"
            },
            {
              text: "插件实例",
              link: "/dev/jsextension"
            },
            {
              text: "生命周期",
              link: "/dev/lifecycle"
            },
            {
              text: "事件监听",
              link: "/dev/events"
            }
          ]
        },
        {
          text: "MN 插件（Lite）",
          link: "/dev/lite"
        },
        {
          text: "OhMyMN 模块",
          link: "/dev/module/"
        },
        {
          text: "MN 插件（OhMyMN）",
          link: "/dev/ohmymn"
        }
      ],
      "/api/": [
        {
          text: "API",
          link: "/api/"
        },
        {
          text: "Origin API",
          link: "/api/origin"
        }
      ],
      "/": [
        {
          text: "基础",
          items: [
            {
              text: "简介",
              link: "/guide/"
            },
            {
              text: "注意事项",
              link: "/guide/attention"
            },
            {
              text: "基本概念",
              link: "/guide/concept"
            },
            {
              text: "配置管理",
              link: "/guide/profile"
            }
          ]
        },
        {
          text: "进阶",
          collapsed: true,
          items: [
            {
              text: "正则表达式",
              link: "/guide/regex"
            },
            {
              text: "Replace() 函数",
              link: "/guide/replace"
            },
            {
              text: "Split() 函数",
              link: "/guide/split"
            },
            {
              text: "模版语法",
              link: "/guide/mustache"
            },
            {
              text: "模版变量",
              link: "/guide/vars"
            },
            {
              text: "自定义输入格式",
              link: "/guide/custom"
            },
            {
              text: "自动编号",
              link: "/guide/serial"
            }
          ]
        },
        {
          text: "必选模块",
          items: modules.required.map(k => ({
            text: k[0],
            link: "/guide/modules/" + k[1]
          }))
        },
        {
          text: "可选模块",
          collapsed: true,
          items: modules.optional.map(k => ({
            text: k[0],
            link: "/guide/modules/" + k[1]
          }))
        }
      ]
    }
  }
}
