<script setup lang="ts">
import { ref, defineExpose } from "vue";
const canvas = ref<HTMLCanvasElement>();

const getContext = (): CanvasRenderingContext2D | null | undefined => {
  return canvas.value?.getContext("2d");
};

defineExpose({
  getContext,
});
</script>

<template>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 85vw;
  height: 30vh;
  margin-top: 10px;
  margin: 0 auto;
  margin-top: 20px;
}

.canvas-container canvas {
  background-color: #434242;
  border-radius: 10px;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
