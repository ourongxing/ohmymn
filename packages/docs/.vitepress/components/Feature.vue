<script setup lang="ts">
import VPFeatures from './VPFeatures.vue';
const features = {
  "给插件开发者带来": [
    {
      title: "现代化的开发框架",
      details: "使用 TypeScript 开发，ESbuild 打包。封装大量 API，助力你开发更加强大的插件。"
    },
    {
      title: "控制面板及配置管理",
      details: "轻松创建具有控制面板的插件，拥有强大的配置管理功能。"
    },
    {
      title: "模块化开发",
      details: "像搭积木一样不断累加模块，最终开发出强大的插件。"
    },
  ],
  "给普通用户带来": [
    {
      title: "自定义",
      details: "有了控制面板之后，MarginNote 插件终于可以自定义了。"
    },
    {
      title: "自动化",
      details: "无需手动开关插件，一切都将按照你的要求自动执行。"
    },
    {
      title: "相互协作",
      details: "不同模块之间可以相互协作来实现更神奇的作用。"
    },
    {
      title: "手势和快捷键",
      details: "通过手势或者快捷键快速对脑图卡片进行处理，效率满分。"
    }
  ],
}
</script>

<template>
  <VPFeatures :features="features"></VPFeatures>
</template>
