---
layout: home
sidebar: false

title: OhMyMN
titleTemplate: MarginNote 插件开发框架

hero:
  name: OhMyMN
  text: MarginNote 插件开发框架
  tagline: 同时也是一个可以自动处理摘录的工具箱
  image:
    src: /logo-shadow.svg
    alt: ohmymn
  actions:
    - theme: brand
      text: 使用指南
      link: /guide/
    - theme: alt
      text: 开发文档
      link: /dev/
    - theme: alt
      text: API 文档
      link: /api/
    - theme: alt
      text: 立即下载
      link: https://bbs.marginnote.cn/t/topic/20501
    - theme: alt
      text: 查看源码
      link: https://github.com/ourongxing/ohmymn
---
<script setup>
import HomePage from "/.vitepress/components/HomePage.vue"
import Feature from "/.vitepress/components/Feature.vue"
</script>
<Feature />
<HomePage />