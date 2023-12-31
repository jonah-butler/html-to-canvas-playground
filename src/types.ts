export interface ElementJSON {
  type: string;
  data?: string;
  reference: HTMLElement | null;
  class: string;
  initialX: number;
  initialY: number;
  currentX: number;
  currentY: number;
  mouseX: number;
  rotation: number;
  isDragging: boolean;
  isResizing: boolean;
  isSelected: boolean;
  isRotating: boolean;
  styles: Record<string, string | number>;
}

export interface ResizeRecord {
  initialX: number;
  initialY: number;
  currentX: number;
  currentY: number;
  mouseX: number;
  mouseY: number;
  posX: number;
  posY: number;
}

export interface ToolConfig {
  height: number;
  left: number;
  top: number;
  width: number;
  x?: number;
  y?: number;
  initialX?: number;
  initialY?: number;
}
