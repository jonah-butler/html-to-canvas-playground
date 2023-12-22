<script setup lang="ts">
import { reactive, watch } from "vue";
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
  (e: "clearActiveElement"): void;
}>();

const type = "image";

const resize = reactive<ResizeRecord>({
  initialX: 0,
  initialY: 0,
  currentX: 0,
  currentY: 0,
  mouseX: 0,
  mouseY: 0,
  posX: 0,
  posY: 0,
});

const settings: ElementJSON = reactive({
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
  isSelected: false,
  styles: {
    "width": "auto",
    "height": "300px",
    "opacity": 0.6,
    "z-index": "2",
    "border-radius": "0%",
  },
});

//###########
//  METHODS
//###########

const joinStyleProps = (styles: Record<string, string | number>): string => {
  let inlineStyles = "";
  for (const style in styles) {
    inlineStyles += `${style}:${styles[style]};`;
  }
  return inlineStyles;
};

const handleMouseDown = (e: MouseEvent): void => {
  settings.isSelected = true;
  settings.initialX = e.clientX - settings.currentX;
  settings.initialY = e.clientY - settings.currentY;
  if (!settings.isResizing) {
    settings.isDragging = true;
    emits("setActiveElement", settings);
  } else {
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
  resize.currentY = e.clientY;
  // new stuff
  resize.mouseY = e.pageY;
  if (settings.reference) {
    resize.posX = settings.reference.getBoundingClientRect().left;
    resize.posY = settings.reference.getBoundingClientRect().top;
  }
  // end new stuff
  emits("setActiveResize", settings, resize, direction);
};

const removeActiveState = (e: FocusEvent): void => {
  // this is acting weird after an element is focused
  // then a click occurs in the element customizer
  // then the next click happens inside the editor
  // the active state does not get removed
  const blurTarget = e.relatedTarget;
  if (
    !document
      .querySelector(".customizer__container")
      ?.contains(blurTarget as HTMLElement)
  ) {
    settings.isResizing = false;
    settings.isDragging = false;
    settings.isSelected = false;
    emits("clearActiveElement");
  } else {
    // if using inputs anywhere else
    // this will cause those inputs to not be focusable
    settings.reference?.focus();
  }
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
  {{ settings.isDragging }}
  {{ settings.isResizing }}
  <!-- will eventually be a tool component -->
  <div
    tabindex="0"
    class="tool"
    @mousedown="handleMouseDown($event)"
    @blur="removeActiveState"
    :ref="(el) => setReference(el)"
    :class="{ active: settings.isSelected }"
  >
    <div
      @mousedown="handleResizeMouseDown($event, 'top-left')"
      v-if="settings.isSelected"
      class="expand top-left"
    ></div>
    <div
      @mousedown="handleResizeMouseDown($event, 'top-right')"
      v-if="settings.isSelected"
      class="expand top-right"
    ></div>
    <div
      @mousedown="handleResizeMouseDown($event, 'bottom-left')"
      v-if="settings.isSelected"
      class="expand bottom-left"
    ></div>
    <div
      @mousedown="handleResizeMouseDown($event, 'bottom-right')"
      v-if="settings.isSelected"
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
  display: flex;
  /* padding: 3px; */
}

.tool.active {
  border: 1px solid white;
  margin: -1px;
}

.expand {
  width: 8px;
  height: 8px;
  background: white;
  border: 1px solid white;
  border-radius: 50%;
  position: absolute;
  z-index: 3;
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
  top: -6px;
  left: -6px;
}

.expand.top-right {
  top: -6px;
  right: -6px;
}

.expand.bottom-left {
  bottom: -6px;
  left: -6px;
}

.expand.bottom-right {
  bottom: -6px;
  right: -6px;
}
</style>
