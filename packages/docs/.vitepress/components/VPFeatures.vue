<script setup lang="ts">
import { computed } from 'vue'
import VPFeature from './VPFeature.vue'

export interface Feature {
  icon?: string
  title: string
  details: string
}

const props = defineProps<{
  features: Record<string, Feature[]>
}>()

const grid = computed(() => {
  const ret: Record<string, string> = {}
  Object.entries(props.features).forEach(([key, value]) => {
    const length = value.length
    ret[key] = (() => {
      if (!length) {
        return ""
      } else if (length === 2) {
        return 'grid-2'
      } else if (length === 3) {
        return 'grid-3'
      } else if (length % 3 === 0) {
        return 'grid-6'
      } else if (length % 2 === 0) {
        return 'grid-4'
      } else return ""
    })()
  })
  return ret
})

</script>

<template>
  <div v-if="features" class="VPFeatures">
    <div class="VPContainer">
      <div v-for="(value,key,index) in features">
        <div :class="[ index?' mt-1.5em':'', 'mb-0.5em details' ]"><span class="arrow">>>></span> {{key}}</div>
        <div class="items">
          <div v-for="feature in value" :key="feature.title" class="item" :class="[grid[key]]">
            <VPFeature :icon="feature.icon" :title="feature.title" :details="feature.details" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPFeatures {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .VPFeatures {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .VPFeatures {
    padding: 0 64px;
  }
}

.VPContainer {
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {

  .item.grid-2,
  .item.grid-4,
  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {

  .item.grid-2,
  .item.grid-4 {
    width: calc(100% / 2);
  }

  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 960px) {
  .item.grid-4 {
    width: calc(100% / 4);
  }
}


.details {
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.arrow {
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: var(--vp-home-hero-name-color);
}
</style>
