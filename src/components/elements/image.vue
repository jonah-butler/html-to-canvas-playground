<script setup lang="ts">
import { reactive, PropType, computed } from "vue";
import { ElementJSON, ResizeRecord } from "../../types";

// PROPS
const props = defineProps({
  index: Number,
  src: String, // eventually lose this
  element: {
    type: Object as PropType<ElementJSON>,
    required: true,
  },
  totalElements: {
    type: Number,
    required: true,
  },
});

// EMITS
const emits = defineEmits<{
  (e: "setActiveElement", settings: ElementJSON, resize: ResizeRecord): void;
  (e: "setActiveReference", isActive: boolean): void;
  (
    e: "setActiveResize",
    settings: ElementJSON,
    resize: ResizeRecord,
    direction: string
  ): void;
  (e: "clearActiveElement"): void;
  (e: "setActiveRotate", settings: ElementJSON): void;
}>();


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

const settings: ElementJSON = reactive(props.element);

//###########
//  METHODS
//###########

const joinCotainerStyleProps = computed((): Record<string, string | number> => {
  return {
    "z-index": settings.styles['z-index'],
    "transform": `translate(${settings.currentX}px, ${settings.currentY}px)`
  }
});

// const highestPossibleZIndex = (): number => {
//   return props.totalElements + 1;
// };

const joinStyleProps = (styles: Record<string, string | number>): string => {
  let inlineStyles = "";
  for (const style in styles) {
    inlineStyles += `${style}:${styles[style]};`;
  }
  return inlineStyles;
};

const setInitialPosition = (x: number, y: number): void => {
  settings.initialX = x - settings.currentX;
  settings.initialY = y - settings.currentY;
};

const handleMouseDown = (e: MouseEvent): void => {
  setTimeout(() => {

    settings.isSelected = true;
    setInitialPosition(e.clientX, e.clientY);
    if (!settings.isResizing) {
      settings.isDragging = true;
      emits("setActiveElement", settings, resize);
    } else {
      emits("setActiveElement", settings, resize);
    }

  }, 1);
  // emits("clearActiveElement");
  // settings.isSelected = true;
  // setInitialPosition(e.clientX, e.clientY);
  // if (!settings.isResizing) {
  //   settings.isDragging = true;
  //   emits("setActiveElement", settings);
  // } else {
  //   emits("setActiveElement", settings);
  // }
};


const setReference = (element: any): void => {
  settings.reference = element;
};

// const moveElement = (): void => {
// (settings.reference! as HTMLElement).style.transform =
//   "translate(" + settings.currentX + "px, " + settings.currentY + "px)";
// console.log("moving ele")
// };

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

const handleRotateMouseDown = (e: MouseEvent): void => {
  settings.mouseX = e.clientX;
  settings.isRotating = true;
  emits("setActiveRotate", settings)
};

const removeActiveState = (e: FocusEvent): void => {
  // this is acting weird after an element is focused
  // then a click occurs in the element customizer
  // then the next click happens inside the editor
  // the active state does not get removed
  const blurTarget = e.relatedTarget;
  if (
    document
      .querySelector(".customizer__container")
      ?.contains(blurTarget as HTMLElement)
  ) {
    // if using inputs anywhere else
    // this will cause those inputs to not be focusable
    settings.reference?.focus();
  } else if (
    document
      .querySelector(".tool")
      ?.contains(blurTarget as HTMLElement)
  ) {
    settings.reference?.focus();
  } else {
    console.log("removing active state")
    settings.isResizing = false;
    settings.isDragging = false;
    settings.isSelected = false;
    // do not need this - MAYBE
    emits("clearActiveElement");
  }
};



// ##########
// WATCHER
// #########
// watch(
//   () => [settings.currentX, settings.currentY],
//   () => {
//     moveElement();
//   }
// );
</script>

<template>
  <!-- {{ settings.isDragging }}
  {{ settings.isResizing }} -->
  <!-- will eventually be a tool component -->
  <div :style="joinCotainerStyleProps" tabindex="0" class="element image" @mousedown="handleMouseDown($event)"
    @blur="removeActiveState" :ref="(el) => setReference(el)"
    :class="{ active: settings.isSelected, noRotate: !settings.rotation || settings.rotation === 360 }">
    <!-- <div @mousedown="handleResizeMouseDown($event, 'top-left')" v-if="settings.isSelected" class="expand top-left"></div>
    <div @mousedown="handleResizeMouseDown($event, 'top-right')" v-if="settings.isSelected" class="expand top-right">
    </div>
    <div @mousedown="handleResizeMouseDown($event, 'bottom-left')" v-if="settings.isSelected" class="expand bottom-left">
    </div>
    <div @mousedown="handleResizeMouseDown($event, 'bottom-right')" v-if="settings.isSelected"
      class="expand bottom-right"></div>
    <div @mousedown="handleRotateMouseDown($event)" class="rotate" v-if="settings.isSelected"></div> -->
    <img class="drag" :class="{ active: settings.isDragging }" :src="settings.data"
      :style="joinStyleProps(settings.styles)" @blur="settings.isDragging = false" />
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

.element {
  position: absolute;
  width: fit-content;
  display: flex;
  /* padding: 3px; */
}

/* .tool.active {
  border: 1px solid white;
  margin: -1px;
} */

/* .tool.active.noRotate {
  border: 2px solid rgb(236, 24, 236);
  margin: -2px;
} */

.rotate {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  /* z-index: 3; */
  touch-action: none;
}

.rotate:hover {
  cursor: ew-resize;
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
