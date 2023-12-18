<script setup lang="ts">
import Canvas from "./components/canvas.vue";
import Editor from "./components/editor.vue";
import { ref } from "vue";
import { convertToSVG } from "./composables/html-to-canvas";
import { ElementJSON } from "./types";
import { ServiceError } from "./composables/error";
import { NButton } from 'naive-ui'

const ERRORS = {
  NO_DIMENSIONS: "Null on dimension retrieval",
  NO_CONTEXT: "Null context in getting rendering context",
};
type AppVueErrors = keyof typeof ERRORS;
class AppError extends ServiceError<AppVueErrors>{ };

const showCanvas = ref(true);
const canvas = ref<InstanceType<typeof Canvas>>();
const editor = ref<InstanceType<typeof Editor>>();

// const sortByIndex = (elements: ElementJSON[]): ElementJSON[] => {
//   return elements.sort((a, b) => a.styles["z-index"] - b.styles["z-index"]);
// };

const generateCanvas = async (): Promise<AppError | void> => {

  const elements = retrieveElements();

  if (elements) {

    const context = getContext();
    if (!context) return throwError("NO_CONTEXT", ERRORS.NO_CONTEXT);

    const dimensions = retrieveEditorDimensions();
    if (!dimensions) return throwError("NO_DIMENSIONS", ERRORS.NO_DIMENSIONS);

    clearCanvas(context, dimensions);
    setCanvasWidthHeight(context.canvas, dimensions);
    disableCanvasImageSmoothing(context);

    // move this into convertToSVG
    for (const element of elements) {
      console.log("converting element...", element.type);
      await convertToSVG(element, context!);
    }

  }
};

const getContext = (): CanvasRenderingContext2D | null | undefined => {
  return canvas.value!.getContext();
};
const retrieveElements = (): ElementJSON[] => {
  return editor.value!.retrieveElements();
};
const retrieveEditorDimensions = (): {
  height: number;
  width: number;
} | null => {
  return editor.value!.retrieveDimensions();
};

const throwError = (name: AppVueErrors, message: string): AppError => {
  throw new AppError({ name, message });
};

const setCanvasWidthHeight = (c: HTMLCanvasElement, d: { height: number, width: number }): void => {
  c.width = d.width;
  c.height = d.height;
};
const clearCanvas = (ctx: CanvasRenderingContext2D, d: { height: number, width: number }): void => {
  ctx.clearRect(0, 0, d.width, d.height);
};
const disableCanvasImageSmoothing = (ctx: CanvasRenderingContext2D): void => {
  ctx.imageSmoothingEnabled = false;
};
// const disableImageSmoothing = (

</script>

<template>
  <div>
    <n-button type="primary" @click="generateCanvas">build</n-button>
    <Editor ref="editor" />
    <Canvas ref="canvas" v-if="showCanvas"></Canvas>
  </div>
</template>

<style scoped></style>
