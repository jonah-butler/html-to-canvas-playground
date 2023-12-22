<script setup lang="ts">
import { ref, defineExpose } from "vue";
import IMAGE from "./elements/image.vue";
import { ElementJSON, ResizeRecord } from "../types";
import ElementCustomize from "./menus/element-customize.vue";

const editor = ref<HTMLElement>();
const resizeOrientation = ref("");
const resizeSide = ref("");
const activeElement = ref<ElementJSON>();
const activeResize = ref<ResizeRecord>();
const elements = ref<ElementJSON[]>([
  {
    type: "IMAGE",
    data: "https://files.mykcm.com/instagram-v2-20230504-feed-1-Affordability-Multi-1.png?not-from-cache-please",
    reference: null,
    class: "drag",
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    isResizing: false,
    isSelected: false,
    styles: {
      "width": "auto",
      "height": "600px",
      "z-index": "2",
    },
  },
  // {
  //   type: "div",
  //   reference: null,
  //   class: "drag",
  //   initialX: 0,
  //   initialY: 0,
  //   currentX: 0,
  //   currentY: 0,
  //   isActive: false,
  //   styles: {
  //     "width": "50px",
  //     "height": "50px",
  //     "background-color": "purple",
  //     "z-index": "4",
  //   },
  // },
]);

const handleMouseUp = (): void => {
  if (activeElement.value) {
    if (!activeElement.value.isResizing) {
      // mouse up on drag
      console.log("not resizing...");
      activeElement.value!.isDragging = false;
      // activeElement.value = undefined;
      // activeResize.value = undefined;
    } else {
      // mouse up on resize
      console.log("was resizing");
      activeElement.value!.isDragging = false;
      activeElement.value!.isResizing = false;
      // activeElement.value = undefined;
    }
  }
};

const handleMouseMove = (e: MouseEvent): void => {
  if (
    activeElement.value?.isDragging &&
    !activeElement.value?.isResizing &&
    activeElement.value.isSelected
  ) {
    handleMove(e);
  } else if (
    activeElement.value?.isResizing &&
    !activeElement.value?.isDragging &&
    activeElement.value.isSelected
  ) {
    handleResize(e);
  }
};

const handleMove = (e: MouseEvent): void => {
  if (activeElement.value?.isDragging) {
    e.preventDefault();

    activeElement.value!.currentX = e.clientX - activeElement.value!.initialX;
    activeElement.value!.currentY = e.clientY - activeElement.value!.initialY;
  }
};

const SIZE_MIN = 20;

const handleResize = (e: MouseEvent): void => {
  if (activeElement.value && activeResize.value) {
    const height = parseInt(activeElement.value.styles.height as string);

    const y = activeResize.value.currentY - e.clientY;
    // set new currentY
    activeResize.value.currentY = e.clientY;

    if (resizeOrientation.value === "top") {
      const updated = height + y;
      if (updated >= SIZE_MIN) {
        // update height
        activeElement.value.styles.height = `${updated}px`;
        // update y position
        activeElement.value.currentY =
          activeElement.value.currentY - (updated - height);
        // if resizing from top left also update x position
        if (resizeSide.value === "left") {
          activeElement.value.currentX =
            activeElement.value.currentX - (updated - height);
        }
      }
    } else if ((resizeOrientation.value = "bottom")) {
      const updated = height + -y;
      if (updated >= SIZE_MIN) {
        // update height
        activeElement.value.styles.height = `${updated}px`;

        // resizing default works best on bottom right when
        // scaling, so just account for bottom left
        if (resizeSide.value === "left") {
          activeElement.value.currentX =
            activeElement.value.currentX - (updated - height);
        }
      }
    }
  }
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

const setActiveElement = (element: ElementJSON): void => {
  activeElement.value = element;
};

const evaluateComponent = (type: string): typeof IMAGE => {
  let component;
  switch (type) {
    case "IMAGE":
      component = IMAGE;
      break;
    default:
      component = IMAGE;
  }
  return component;
};

const setActiveResize = (
  element: ElementJSON,
  resize: ResizeRecord,
  direction: string
): void => {
  const splitDir = direction.split("-");
  // eg. top || bottom
  resizeOrientation.value = splitDir[0];
  // eg left || right
  resizeSide.value = splitDir[1];

  activeElement.value = element;
  activeResize.value = resize;
};

const clearActiveElement = (): void => {
  activeElement.value = undefined;
  activeResize.value = undefined;
};

defineExpose({
  retrieveElements,
  retrieveDimensions,
});
</script>

<template>
  <section style="min-height: 75px">
    <ElementCustomize
      v-if="activeElement"
      test="1"
      :activeElement="activeElement"
    />
  </section>
  <div
    tabindex="0"
    id="editor"
    ref="editor"
    @mouseup="handleMouseUp()"
    @mousemove="handleMouseMove($event)"
  >
    <component
      v-for="(element, i) in elements"
      :is="evaluateComponent(element.type)"
      :index="i"
      @setActiveElement="setActiveElement"
      @setActiveResize="setActiveResize"
      @clearActiveElement="clearActiveElement"
    />
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
