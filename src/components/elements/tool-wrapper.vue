<script setup lang="ts">
import { PropType, StyleValue, computed, watch } from "vue";
import { ToolConfig } from "../../types";

const props = defineProps({
  totalElements: {
    type: Number,
    required: true,
  },
  toolConfig: {
    type: Object as PropType<ToolConfig>,
    required: true,
  },
});

const cssVars = computed((): StyleValue => {
  return {
    '--z-index': (props.totalElements + 1).toString(),
    '--height': `${props.toolConfig.height}px`,
    '--left': `${props.toolConfig.left}px`,
    '--top': `${props.toolConfig.top}px`,
    'transform': `translate(${props.toolConfig.x}px, ${props.toolConfig.y}px)`,
    '--width': `${props.toolConfig.width}px`,
  };
});


</script>

<template>
  <div :style="cssVars" class="tool active" tabindex="0">
    <div class="expand top-left"></div>
    <div class="expand top-right">
    </div>
    <div class="expand bottom-left">
    </div>
    <div class="expand bottom-right"></div>
    <div class="rotate"></div>
  </div>
</template>

<style scoped>
.tool {
  position: absolute;
  /* width: fit-content; */
  height: var(--height);
  left: var(--left);
  top: var(--top);
  width: var(--width);
  display: flex;
  min-width: 20px;
  min-height: 20px;
  z-index: var(--z-index);
  pointer-events: none;
}

.tool.active {
  border: 1px solid white;
  margin: -1px;
}

.rotate {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  z-index: var(--z-index);
  pointer-events: auto;
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
  z-index: var(--z-index);
  pointer-events: auto;
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