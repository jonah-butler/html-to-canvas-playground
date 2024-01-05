<script setup lang="ts">
import { ref, defineExpose, onMounted, computed } from "vue";
import IMAGE from "./elements/image.vue";
import { ElementJSON, ResizeRecord, ResizeEmit, ToolConfig } from "../types";
import ElementCustomize from "./menus/element-customize.vue";
import ToolWrapper from "./elements/tool-wrapper.vue";

const editor = ref<HTMLElement>();
const resizeOrientation = ref("");
const resizeSide = ref("");
const activeElement = ref<ElementJSON>();
const activeResize = ref<ResizeRecord>();
// default values to avoid non-null checking
const toolConfig = ref<ToolConfig>({
  height: 0,
  left: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  initialX: 0,
  initialY: 0,
});
const elements = ref<ElementJSON[]>([
  {
    type: "IMAGE",
    data: "https://files.mykcm.com/instagram-v2-20230504-feed-1-Affordability-Multi-1.png?not-from-cache-please",
    reference: null,
    class: "",
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    mouseX: 0,
    rotation: 0,
    isDragging: false,
    isResizing: false,
    isRotating: false,
    isSelected: false,
    styles: {
      "width": "300px",
      "height": "300px",
      "opacity": 1,
      "z-index": "1",
      "border-radius": "0%",
      "transform": `rotate(0deg)`,
    },
  },
  {
    type: "IMAGE",
    data: "https://dev-blog-resources.s3.amazonaws.com/canvas_1696708967226.png",
    reference: null,
    class: "",
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    mouseX: 0,
    rotation: 0,
    isDragging: false,
    isResizing: false,
    isRotating: false,
    isSelected: false,
    styles: {
      "width": "666px",
      "height": "304px",
      "opacity": 1,
      "z-index": "2",
      "border-radius": "0%",
      "transform": `rotate(0deg)`,
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

const ratioDiff = ref(0);

onMounted((): void => {
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mousemove", handleMouseMove);
});

const findActiveElementIndex = computed((): number => {
  return elements.value.findIndex((ele) => ele === activeElement.value);
});

const handleMouseUp = (): void => {
  ratioDiff.value = 0;
  if (activeElement.value) {
    if (!activeElement.value.isResizing) {
      // mouse up on drag
      activeElement.value!.isDragging = false;
      activeElement.value!.isRotating = false;
      // activeElement.value = undefined;
      // activeResize.value = undefined;
    } else {
      // mouse up on resize
      activeElement.value!.isDragging = false;
      activeElement.value!.isResizing = false;
      activeElement.value!.isRotating = false;
      // activeElement.value = undefined;
    }
  }
};

const handleMouseMove = (e: MouseEvent): void => {
  e.preventDefault();
  if (!activeElement.value) return;
  // remove type annotations
  // simplify conditionals
  if (
    activeElement.value?.isDragging &&
    !activeElement.value?.isResizing &&
    !activeElement.value?.isRotating &&
    activeElement.value.isSelected
  ) {
    handleMove(e);
  } else if (
    activeElement.value?.isResizing &&
    !activeElement.value?.isDragging &&
    activeElement.value.isSelected
  ) {
    handleResize(e);
  } else if (
    activeElement.value?.isRotating &&
    activeElement.value?.isSelected
  ) {
    handleRotate(e);
  }
};

const FULL_ROTATION = 360;

const handleRotate = (e: MouseEvent): void => {
  e.preventDefault();
  let rotationDegrees = e.clientX - activeElement.value?.mouseX!;

  if (rotationDegrees === FULL_ROTATION || rotationDegrees === -FULL_ROTATION) {
    rotationDegrees = 0;
    activeElement.value!.rotation = rotationDegrees;
    activeElement.value!.mouseX = e.clientX;
  }
  // flip rotation so it matches mouse X direction
  rotationDegrees = FULL_ROTATION - (FULL_ROTATION + rotationDegrees);

  activeElement.value!.rotation += rotationDegrees;

  // rotate with transform
  activeElement.value!.styles.transform = `rotate(${
    activeElement.value!.rotation
  }deg)`;
  // reset mouseX
  activeElement.value!.mouseX = e.clientX;
};

const handleMove = (e: MouseEvent): void => {
  if (activeElement.value?.isDragging) {
    e.preventDefault();

    activeElement.value!.currentX = e.clientX - activeElement.value!.initialX;
    activeElement.value!.currentY = e.clientY - activeElement.value!.initialY;

    toolConfig.value.x =
      activeElement.value.currentX - toolConfig.value.initialX!;
    toolConfig.value.y =
      activeElement.value.currentY - toolConfig.value.initialY!;
  }
};

const SIZE_MIN = 20;

const aspectRatio = computed((): number => {
  const height =
    activeElement.value!.reference?.getBoundingClientRect().height!;
  const width = parseInt(activeElement.value!.styles.width as string);

  return width / height;
});

const handleResize = (e: MouseEvent): void => {
  if (activeElement.value && activeResize.value) {
    const height =
      activeElement.value.reference?.getBoundingClientRect().height!;
    const width = parseInt(activeElement.value.styles.width as string);

    activeElement.value.styles.height = "auto";

    const y = activeResize.value.currentY - e.clientY;
    activeResize.value.currentY = e.clientY;

    if (resizeOrientation.value === "top") {
      const updatedHeight = height + y;
      const updatedWidth = Math.round(updatedHeight * aspectRatio.value);

      if (updatedHeight >= SIZE_MIN) {
        activeElement.value.styles.height = `${updatedHeight}px`;
        activeElement.value.styles.width = `${updatedWidth}px`;

        // update tool config width/height
        toolConfig.value.height = updatedHeight;
        toolConfig.value.width = updatedWidth;

        const updatedY =
          activeElement.value.currentY - (updatedHeight - height);

        activeElement.value.currentY = updatedY;

        toolConfig.value.y! =
          activeElement.value.currentY - toolConfig.value.initialY!;

        if (resizeSide.value === "left") {
          const updatedX =
            activeElement.value.currentX - (updatedWidth - width);

          activeElement.value.currentX = updatedX;

          // update tool config x position
          toolConfig.value.x =
            activeElement.value.currentX - toolConfig.value.initialX!;
        }
      }
    } else if ((resizeOrientation.value = "bottom")) {
      const updatedHeight = height + -y;
      const updatedWidth = Math.round(updatedHeight * aspectRatio.value);

      if (updatedHeight >= SIZE_MIN) {
        activeElement.value.styles.height = `${updatedHeight}px`;

        activeElement.value.styles.width = `${updatedWidth}px`;

        // update tool config width/height
        toolConfig.value.height = updatedHeight;
        toolConfig.value.width = updatedWidth;

        if (resizeSide.value === "left") {
          const updatedX =
            activeElement.value.currentX - (updatedWidth - width);

          activeElement.value.currentX = updatedX;

          toolConfig.value.x =
            activeElement.value.currentX - toolConfig.value.initialX!;
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

const setActiveElement = (element: ElementJSON, resize: ResizeRecord): void => {
  // set active data
  activeElement.value = element;
  activeResize.value = resize;

  // set up dimensions for ToolElement Wrapper
  if (activeElement.value && activeElement.value.reference) {
    const config = activeElement.value.reference.getBoundingClientRect();
    const { width, height, top, left } = config;

    toolConfig.value = {
      height,
      left,
      top,
      width,
      x: 0,
      y: 0,
      initialX: activeElement.value.currentX,
      initialY: activeElement.value.currentY,
    };
  }
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

const setActiveResize = (direction: string, data: ResizeEmit): void => {
  if (!activeElement.value || !activeResize.value) return;
  // set state
  activeElement.value.isDragging = false;
  activeElement.value.isResizing = true;

  activeResize.value.currentY = data.clientY;
  activeResize.value.mouseY = data.mouseY;

  const { top, left } = activeElement.value.reference!.getBoundingClientRect();

  activeResize.value.posX = left;
  activeResize.value.posY = top;

  const splitDir = direction.split("-");
  // eg. top || bottom
  resizeOrientation.value = splitDir[0];
  // eg left || right
  resizeSide.value = splitDir[1];

  // activeElement.value = element;
  // activeResize.value = resize;
};

const clearActiveElement = (): void => {
  activeElement.value = undefined;
  activeResize.value = undefined;
};

const setActiveRotate = (settings: ElementJSON): void => {
  // may not need this at all...
  activeElement.value = settings;
};

const updateNeighborZIndex = (zIndex: number, index: number): void => {
  // may get rid of this in favor of updating z-index in element-customize.vue
  elements.value[index].styles["z-index"] = zIndex;
};

defineExpose({
  retrieveElements,
  retrieveDimensions,
});
</script>

<template>
  <ToolWrapper
    @setActiveResize="setActiveResize"
    v-if="activeElement"
    :totalElements="elements.length"
    :toolConfig="toolConfig"
  />

  <section style="min-height: 75px">
    <ElementCustomize
      v-if="activeElement"
      :totalElements="elements.length"
      :activeElement="activeElement"
      :index="findActiveElementIndex"
      @updateNeighborZIndex="updateNeighborZIndex"
    />
  </section>
  <div tabindex="0" id="editor" ref="editor">
    <component
      v-for="(element, i) in elements"
      :totalElements="elements.length"
      :is="evaluateComponent(element.type)"
      :element="element"
      :index="i"
      :src="element.data ?? ''"
      @setActiveRotate="setActiveRotate"
      @setActiveElement="setActiveElement"
      @clearActiveElement="clearActiveElement"
    />
  </div>
  {{ activeElement ? activeElement.data : null }}
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
