<script setup lang="ts">
import { ref, defineExpose } from "vue";
import { ElementJSON } from "../types";

const editor = ref<HTMLElement>();

const activeElement = ref<ElementJSON>();
const elements = ref<ElementJSON[]>([
  {
    type: "div",
    reference: null,
    class: "drag",
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
    styles: {
      "width": "50px",
      "height": "50px",
      "background-color": "blue",
      "border-radius": "50%",
      "z-index": "5",
    },
  },
  {
    type: "image",
    src: "https://dev-blog-resources.s3.amazonaws.com/canvas_1696708967226.png",
    reference: null,
    class: "drag",
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
    styles: {
      "width": "auto",
      "height": "500px",
      "z-index": "1",
    },
  },
  {
    type: "div",
    reference: null,
    class: "drag",
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
    styles: {
      "width": "70px",
      "height": "50px",
      "background-color": "yellow",
      "border-radius": "50%",
      "z-index": "2",
    },
  },
  {
    type: "div",
    reference: null,
    class: "drag",
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
    styles: {
      "width": "50px",
      "height": "50px",
      "background-color": "purple",
      "z-index": "3",
    },
  },
  {
    type: "div",
    reference: null,
    class: "drag",
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
    styles: {
      "width": "50px",
      "height": "50px",
      "background-color": "green",
      "border-radius": "50%",
      "z-index": "4",
    },
  },
]);

const joinStyleProps = (styles: Record<string, string>): string => {
  let inlineStyles = "";
  for (const style in styles) {
    inlineStyles += `${style}:${styles[style]};`;
  }
  return inlineStyles;
};

const handleMouseDown = (e: MouseEvent, element: ElementJSON): void => {
  element.initialX = e.clientX - element.currentX;
  element.initialY = e.clientY - element.currentY;

  element.isActive = true;
  activeElement.value = element;
};

const handleMouseUp = (): void => {
  activeElement.value = undefined;
};

const handleMouseMove = (e: MouseEvent): void => {
  if (activeElement.value!) {
    e.preventDefault();

    activeElement.value!.currentX = e.clientX - activeElement.value!.initialX;
    activeElement.value!.currentY = e.clientY - activeElement.value!.initialY;

    if (activeElement.value !== undefined) {
      moveDraggableItem();
    }
  }
};

const moveDraggableItem = (): void => {
  activeElement.value!.reference!.style.transform =
    "translate(" +
    activeElement.value!.currentX +
    "px, " +
    activeElement.value!.currentY +
    "px)";
};

const retrieveElements = (): ElementJSON[] => {
  return elements.value;
};

const retrieveDimensions = (): {
  height: number;
  width: number;
} | null => {
  const height = editor.value?.clientHeight;
  const width = editor.value?.clientWidth;
  if (!height || !width) return null;
  return {
    height,
    width,
  };
};

defineExpose({
  retrieveElements,
  retrieveDimensions,
});
</script>

<template>
  <div
    id="editor"
    ref="editor"
    @mouseup="handleMouseUp()"
    @mousemove="handleMouseMove($event)"
  >
    <div v-for="(element, i) in elements">
      <img
        v-if="element.type === 'image'"
        :key="i"
        :class="element.class"
        :style="joinStyleProps(element.styles)"
        :src="element.src"
        :ref="(el) => (element.reference = el as HTMLElement)"
        @mousedown="handleMouseDown($event, element)"
      />
      <div
        v-if="element.type === 'div'"
        :key="i"
        :class="element.class"
        :style="joinStyleProps(element.styles)"
        :ref="(el) => (element.reference = el as HTMLElement)"
        @mousedown="handleMouseDown($event, element)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
#editor {
  width: 85vw;
  height: 60vh;
  background-color: #434242;
  border-radius: 10px;
  margin: 0 auto;
  margin-top: 10px;
  overflow: hidden;
  touch-action: none;
  position: relative;
  z-index: 1;
}
.drag-item {
  width: 100px;
  height: 100px;
  background-color: rgb(245, 230, 99);
  border-radius: 50%;
  touch-action: none;
  user-select: none;
}
.drag-item-2 {
  width: 75px;
  height: 75px;
  background-color: rgb(215, 18, 202);
  border-radius: 50%;
  touch-action: none;
  user-select: none;
}
.drag-item-3 {
  width: 85px;
  height: 85px;
  background-color: rgb(123, 26, 233);
  border: 10px solid rgba(136, 136, 136, 0.5);
  border-radius: 50%;
  touch-action: none;
  user-select: none;
}
.drag {
  transition: opacity 0.2s ease;
  position: absolute;
  top: 0;
  left: 0;
}
.drag:active {
  opacity: 0.8;
}
.drag:hover {
  cursor: pointer;
  border-width: 13px;
}
</style>
