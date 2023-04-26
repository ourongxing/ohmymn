<script setup lang="ts">
import VPFeatures from './VPFeatures.vue';
const features = {
  "For Developer": [
    {
      title: "Modern Development Framework",
      details: "Developed with TypeScript, bundled with ESbuild. A lot of APIs are encapsulated to help you develop more powerful mnaddon."
    },
    {
      title: "Control Panel & Profile Management",
      details: "Easily create mnaddon with control panels, with powerful profile management."
    },
    {
      title: "Modular Development",
      details: "Develop mnaddon with modular development, just like building blocks."
    },
  ],
  "For Normal User": [
    {
      title: "Custom",
      details: "With the control panel, MarginNote addon can finally be customized."
    },
    {
      title: "Automation",
      details: "No need to manually turn on the addon, everything will be executed automatically according to your requirements."
    },
    {
      title: "Work Together",
      details: "Different modules can work together to get more magical effects"
    },
    {
      title: "Gesture & Shortcut",
      details: "Quickly process the mindmap card through gestures and shortcut, full score efficiency."
    }
  ],
}
</script>

<template>
  <VPFeatures :features="features"></VPFeatures>
</template>
