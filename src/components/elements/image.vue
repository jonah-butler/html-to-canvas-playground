<script setup lang="ts">
import { reactive, defineEmits, defineProps, watch } from "vue";
import { ElementJSON, ResizeRecord } from "../../types";

// PROPS
defineProps<{
  index: number;
}>();

// EMITS
const emits = defineEmits<{
  (e: "setActiveElement", settings: ElementJSON): void;
  (e: "setActiveReference", isActive: boolean): void;
  (
    e: "setActiveResize",
    settings: ElementJSON,
    resize: ResizeRecord,
    direction: string
  ): void;
}>();

const type = "image";

const resize = reactive<ResizeRecord>({
  initialX: 0,
  initialY: 0,
  currentX: 0,
  currentY: 0,
  isActive: false,
});

const settings = reactive({
  type,
  data: "https://files.mykcm.com/instagram-v2-20230504-feed-1-Affordability-Multi-1.png?not-from-cache-please",
  reference: null,
  class: "",
  initialX: 0,
  initialY: 0,
  currentX: 0,
  currentY: 0,
  isDragging: false,
  isResizing: false,
  styles: {
    "width": "auto",
    "height": "300px",
    "z-index": "2",
  },
});

//###########
//  METHODS
//###########

const joinStyleProps = (styles: Record<string, string>): string => {
  let inlineStyles = "";
  for (const style in styles) {
    inlineStyles += `${style}:${styles[style]};`;
  }
  return inlineStyles;
};

const handleMouseDown = (e: MouseEvent): void => {
  if (!resize.isActive) {
    settings.isDragging = true;
    settings.initialX = e.clientX - settings.currentX;
    settings.initialY = e.clientY - settings.currentY;

    emits("setActiveElement", settings);
  }
};

const setReference = (element: any): void => {
  settings.reference = element;
};

const moveElement = (): void => {
  (settings.reference! as HTMLElement).style.transform =
    "translate(" + settings.currentX + "px, " + settings.currentY + "px)";
};

const handleResizeMouseDown = (e: MouseEvent, direction: string): void => {
  settings.isDragging = false;
  settings.isResizing = true;
  resize.isActive = true;
  resize.currentY = e.clientY;
  emits("setActiveResize", settings, resize, direction);
};

const removeActiveState = (): void => {
  console.log("blurred");
  settings.isDragging = false;
  resize.isActive = false;
};

const resetResizeState = (): void => {
  resize.isActive = false;
  settings.isResizing = false;
};

// ##########
// WATCHER
// #########
watch(
  () => [settings.currentX, settings.currentY],
  () => {
    moveElement();
  }
);
</script>

<template>
  <!-- will eventually be a tool component -->
  <div
    tabindex="0"
    class="tool"
    @mousedown="handleMouseDown($event)"
    @blur="removeActiveState"
    :ref="(el) => setReference(el)"
    :class="{ active: settings.isDragging }"
  >
    <div
      @mousedown="handleResizeMouseDown($event, 'top')"
      @mouseup="resetResizeState"
      v-if="settings.isDragging"
      class="expand top-left"
    ></div>
    <div
      @mousedown="handleResizeMouseDown($event, 'top')"
      @mouseup="resetResizeState"
      v-if="settings.isDragging"
      class="expand top-right"
    ></div>
    <div
      @mousedown="handleResizeMouseDown($event, 'bottom')"
      @mouseup="resetResizeState"
      v-if="settings.isDragging"
      class="expand bottom-left"
    ></div>
    <div
      @mousedown="handleResizeMouseDown($event, 'bottom')"
      @mouseup="resetResizeState"
      v-if="settings.isDragging"
      class="expand bottom-right"
    ></div>
    <img
      class="drag"
      :class="{ active: settings.isDragging }"
      :src="settings.data"
      :style="joinStyleProps(settings.styles)"
      @blur="settings.isDragging = false"
    />
  </div>
</template>

<style scoped>
img {
  touch-action: none;
  user-select: none;
}
.drag {
  transition: opacity 0.2s ease;
  position: relative;
  top: 0;
  left: 0;
}
.tool {
  position: relative;
  width: fit-content;
  height: fit-content;
  /* padding: 3px; */
}
.tool.active {
  border: 2px solid white;
}

.expand {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  position: absolute;
}
.expand.top-right:hover {
  cursor: ne-resize;
}
.expand.top-left:hover {
  cursor: nw-resize;
}
.expand.bottom-left:hover {
  cursor: sw-resize;
}
.expand.bottom-right:hover {
  cursor: se-resize;
}
.expand.top-left {
  top: -4px;
  left: -4px;
}
.expand.top-right {
  top: -4px;
  right: -4px;
}
.expand.bottom-left {
  bottom: -4px;
  left: -4px;
}
.expand.bottom-right {
  bottom: -4px;
  right: -4px;
}
</style>
