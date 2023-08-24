---
layout: home
sidebar: false

title: OhMyMN
titleTemplate: MarginNote Addon Development Framework

hero:
  name: OhMyMN
  text: MarginNote Addon Development Framework
  tagline: Also a toolbox that can process excerpts automatically
  image:
    src: /logo-shadow.svg
    alt: ohmymn
  actions:
    - theme: brand
      text: Guide
      link: /en/guide/
    - theme: alt
      text: Development
      link: /en/dev/
    - theme: alt
      text: API
      link: /en/api/
    - theme: alt
      text: Download
      link: https://forum.marginnote.com/t/5883
    - theme: alt
      text: View on GitHub
      link: https://github.com/ourongxing/ohmymn
---
<script setup>
import HomePage from "/.vitepress/components/HomePage-en.vue"
import Feature from "/.vitepress/components/Feature-en.vue"
</script>
<Feature />
<HomePage />