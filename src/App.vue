<script setup lang="ts">
import Canvas from "./components/canvas.vue";
import Editor from "./components/editor.vue";
import { ref } from "vue";
import { convertToSVG } from "./composables/html-to-canvas";
// import { ElementJSON } from "../types";

const showCanvas = ref(true);
const canvas = ref<InstanceType<typeof Canvas>>();
const editor = ref<InstanceType<typeof Editor>>();

// const sortByIndex = (elements: ElementJSON[]): ElementJSON[] => {
//   return elements.sort((a, b) => a.styles["z-index"] - b.styles["z-index"]);
// };

const generateCanvas = (): void => {
  const elements = editor.value!.retrieveElements();
  if (elements) {
    const context = canvas.value!.getContext();
    const dimensions = editor.value!.retrieveDimensions();
    if (dimensions) {
      context!.canvas.width = dimensions.width;
      context!.canvas.height = dimensions.height;
      //makes images smoother
      context!.imageSmoothingEnabled = false;
      context!.clearRect(0, 0, dimensions.width, dimensions.height);
      // console.log(sortByIndex(elements));
      for (const element of elements) {
        convertToSVG(element, context!);
      }
    }
  }
};
</script>

<template>
  <div>
    <button @click="generateCanvas">build</button>
    <Editor ref="editor" />
    <Canvas ref="canvas" v-if="showCanvas"></Canvas>
  </div>
</template>

<style scoped></style>
