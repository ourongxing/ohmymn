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
        "https://github.com/marginnoteapp/ohmymn/tree/main/packages/docs/:path",
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
      "/en/dev/": [],
      "/en/api/": [
        {
          text: "API",
          link: "/en/api/"
        },
        {
          text: "Origin API",
          link: "/en/api/origin"
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
          collapsed: true,
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
          collapsed: true,
          items: modules.optional.map(k => ({
            text: k[0],
            link: "/en/guide/modules/" + k[1]
          }))
        }
      ]
    }
  }
}
