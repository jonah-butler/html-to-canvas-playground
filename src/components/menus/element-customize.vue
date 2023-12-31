<template>
  <section tabindex="0" class="customizer__container">
    <div class="customizer__tool-container">
      <label>Opacity</label>
      <n-slider v-model:value="(settings.opacity as number)" :default-value="1" :step="0.1" :min="0.1" :max="1" />
    </div>
    <div class="customizer__tool-container">
      <label>Border Radius</label>
      <n-slider size="tiny" v-model:value="borderRadius" :min="0" :max="50" @update:value="updateBorderRadius"
        :step="1" />
    </div>
    <div class="customizer__tool-container">
      <label>Position</label>
      <div> <n-button :disabled="isMaxIndex" tertiary type="info" @click="moveUp">
          move up
        </n-button>
        <n-button tertiary type="info" @click="moveBack">
          move back
        </n-button>
        <n-button tertiary type="info" @click="moveToFront">
          front
        </n-button>
        <n-button tertiary type="info" @click="moveToBack">
          back
        </n-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, PropType, watch, computed } from "vue";
import { NSlider, NButton } from "naive-ui";
import { ElementJSON } from "../../types";

const props = defineProps({
  activeElement: {
    type: Object as PropType<ElementJSON>,
    required: true,
  },
  totalElements: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  }
});


const emits = defineEmits<{
  (e: "updateSettings", settings: ElementJSON): void;
  (e: "updateNeighborZIndex", zIndex: number, index: number): void;
}>();

const settings = ref(props.activeElement.styles);

const borderRadius = ref(parseInt(settings.value["border-radius"] as string) ?? 0);

const updateBorderRadius = (): void => {
  settings.value["border-radius"] = borderRadius.value + "%";
};

const isMaxIndex = computed((): boolean => {
  const index = parseInt(settings.value["z-index"] as string);
  return index === props.totalElements;
});

const moveUp = (): void => {
  // lock this down so elements can not be infinitely moved up
  const zIndex = parseInt(settings.value["z-index"] as string);
  settings.value["z-index"] = (zIndex + 1).toString();
  // figure out better way
  if (props.index === zIndex) {
    emits("updateNeighborZIndex", zIndex, zIndex - 1);
  } else {
    emits("updateNeighborZIndex", zIndex, zIndex);
  }
};



const moveBack = (): void => {

};

const moveToFront = (): void => {

};

const moveToBack = (): void => {

};

watch(props.activeElement, (n: ElementJSON) => {
  settings.value = n.styles;
})
</script>

<style scoped>
.customizer__container {
  /* padding: 10px; */
  display: flex;
}

.customizer__tool-container {
  max-width: 300px;
  padding: 0.5rem 1rem;
  border: 1px solid #434242;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  margin-right: 0.5rem;
}

.customizer__tool-container label {
  font-size: 12px;
  text-align: left;
}
</style>
