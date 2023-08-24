import type { DefaultTheme, LocaleSpecificConfig } from "vitepress"
import { version, unsignedVersion } from "../../package.json"
import modules from "../../modules"
import { releases } from ".vitepress/meta"

export const META_DESCRIPTION = "MarginNote Addon Development Framework"

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: META_DESCRIPTION,
  head: [
    ["meta", { property: "og:description", content: META_DESCRIPTION }],
    ["meta", { name: "twitter:description", content: META_DESCRIPTION }]
  ],

  themeConfig: {
    editLink: {
      pattern:
        "https://github.com/ourongxing/ohmymn/tree/main/packages/docs/:path",
      text: "Edit this page on GitHub"
    },

    outline: {
      label: "TOC"
    },
    nav: [
      {
        text: "User Guide",
        link: "/en/guide/",
        activeMatch: "^/en/guide/"
      },
      { text: "Dev", link: "/en/dev/", activeMatch: "^/en/dev/" },
      { text: "API", link: "/en/api/", activeMatch: "^/en/api/" },
      {
        text: `v${version}`,
        items: [
          {
            text: `Signed Version (v${version})`,
            link: "https://forum.marginnote.com/t/5883"
          },
          {
            text: `Unsigned Version (v${unsignedVersion})`,
            link: releases
          }
        ]
      }
    ],
    sidebar: {
      "/en/dev/": [
        {
          items: [
            {
              text: "基础",
              link: "/en/dev/",
              items: [
                {
                  text: "插件结构",
                  link: "/en/dev/structure"
                },
                {
                  text: "插件对象",
                  link: "/en/dev/jsextension"
                },
                {
                  text: "生命周期",
                  link: "/en/dev/lifecycle"
                },
                {
                  text: "事件监听",
                  link: "/en/dev/events"
                },
                {
                  text: "数据存储",
                  link: "/en/dev/store"
                }
              ]
            },
            {
              text: "MN 插件（Lite）",
              link: "/en/dev/lite"
            },
            {
              text: "MN 插件（OhMyMN）",
              link: "/en/dev/ohmymn/",
              items: [
                {
                  text: "描述清单",
                  link: "/en/dev/ohmymn/manifest"
                },
                {
                  text: "打包插件",
                  link: "/en/dev/ohmymn/esbuild"
                },
                {
                  text: "项目结构",
                  link: "/en/dev/ohmymn/structure"
                },
                {
                  text: "默认配置",
                  link: "/en/dev/ohmymn/profile"
                },
                {
                  text: "国际化",
                  link: "/en/dev/ohmymn/i18n"
                }
              ]
            },
            {
              text: "OhMyMN 模块",
              link: "/en/dev/module/",
              items: [
                {
                  text: "如何开发",
                  link: "/en/dev/module/how"
                }
              ]
            }
          ]
        }
      ],
      "/en/api/": [
        {
          text: "简介",
          link: "/api/"
        },
        {
          text: "Objective-C API 转换",
          link: "/api/transform"
        },
        {
          text: "MarginNote",
          items: [
            {
              text: "MN",
              link: "/api/marginnote/"
            },
            {
              text: "开发相关",
              link: "/api/marginnote/dev"
            },
            {
              text: "笔记相关",
              link: "/api/marginnote/note"
            },
            {
              text: "NodeNote",
              link: "/api/marginnote/nodenote"
            },
            {
              text: "弹窗",
              link: "/api/marginnote/popup"
            },
            {
              text: "网络请求",
              link: "/api/marginnote/fetch"
            },
            {
              text: "等待/间隔",
              link: "/api/marginnote/delay"
            },
            {
              text: "文件操作",
              link: "/api/marginnote/file"
            },
            {
              text: "其它",
              link: "/api/marginnote/other"
            },
            {
              text: "Low-Level API",
              items: [
                {
                  text: "Application",
                  link: "/api/marginnote/application"
                },
                {
                  text: "Database",
                  link: "/api/marginnote/database"
                },
                {
                  text: "StudyController",
                  link: "/api/marginnote/studycontroller"
                },
                {
                  text: "MbBookNote",
                  link: "/api/marginnote/mbbooknote"
                },
                {
                  text: "MbBook/MbTopic",
                  link: "/api/marginnote/mbbooktopic"
                },
                {
                  text: "Utility",
                  link: "/api/marginnote/utility"
                },
                {
                  text: "Foundation",
                  link: "/api/foundation"
                },
                {
                  text: "UIKit",
                  link: "/api/uikit"
                }
              ]
            }
          ]
        },
        {
          text: "OhMyMN",
          items: [
            {
              text: "模块",
              link: "/api/ohmymn/module"
            },
            {
              text: "输入处理",
              link: "/api/ohmymn/input"
            },
            {
              text: "文字相关",
              link: "/api/ohmymn/text"
            }
          ]
        }
      ],
      "/en/": [
        {
          text: "Foundation",
          items: [
            {
              text: "Introduction",
              link: "/en/guide/"
            },
            {
              text: "Points to Note",
              link: "/en/guide/attention"
            },
            {
              text: "Basic Concepts",
              link: "/en/guide/concept"
            },
            {
              text: "Profile Management",
              link: "/en/guide/profile"
            }
          ]
        },
        {
          text: "Advanced",
          items: [
            {
              text: "Regular Expressions",
              link: "/en/guide/regex"
            },
            {
              text: "Replace() Method",
              link: "/en/guide/replace"
            },
            {
              text: "Split() Method",
              link: "/en/guide/split"
            },
            {
              text: "Template Syntax",
              link: "/en/guide/mustache"
            },
            {
              text: "Template Variable",
              link: "/en/guide/vars"
            },
            {
              text: "Custom Input Format",
              link: "/en/guide/custom"
            },
            {
              text: "Auto Numbering",
              link: "/en/guide/serial"
            }
          ]
        },
        {
          text: "Required Module",
          items: modules.required.map(k => ({
            text: k[0],
            link: "/en/guide/modules/" + k[1]
          }))
        },
        {
          text: "Optional Module",
          items: modules.optional.map(k => ({
            text: k[0],
            link: "/en/guide/modules/" + k[1]
          }))
        }
      ]
    }
  }
}
