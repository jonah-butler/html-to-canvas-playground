const ZOOM = {
  scale: 1,
  speed: 0.05,
};

export const zoom = (
  e: WheelEvent,
  transformCB: (scale: number) => void
): void => {
  if (e.deltaY > 0) {
    const scale = (ZOOM.scale += ZOOM.speed);
    if (scale < 8) {
      // editor.value!.style.transform = `scale(${scale})`;
      transformCB(scale);
    }
  } else {
    const scale = (ZOOM.scale -= ZOOM.speed);
    if (scale > 0.2) {
      // editor.value!.style.transform = `scale(${zoom -= ZOOM_SPEED})`;
      transformCB(scale);
    }
  }
};
