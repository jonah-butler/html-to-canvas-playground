<template>
  <section tabindex="0" class="customizer__container">
    <div class="customizer__tool-container">
      <label>Opacity</label>
      <n-slider
        v-model:value="(settings.opacity as number)"
        :default-value="1"
        :step="0.1"
        :min="0.1"
        :max="1"
      />
    </div>
    <div class="customizer__tool-container">
      <label>Border Radius</label>
      <n-slider
        size="tiny"
        v-model:value="borderRadius"
        :min="0"
        :max="50"
        @update:value="updateBorderRadius"
        :step="1"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, PropType } from "vue";
import { NSlider } from "naive-ui";
import { ElementJSON } from "../../types";

const props = defineProps({
  activeElement: {
    type: Object as PropType<ElementJSON>,
    required: true,
  },
  test: {
    type: String,
  },
});

const emits = defineEmits<{
  (e: "updateSettings", settings: ElementJSON): void;
}>();

const settings = reactive(props.activeElement.styles);

const borderRadius = ref(parseInt(settings["border-radius"] as string) ?? 0);
const updateBorderRadius = (): void => {
  settings["border-radius"] = borderRadius.value + "%";
};
</script>

<style scoped>
.customizer__container {
  padding: 10px;
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
