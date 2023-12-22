export interface ElementJSON {
  type: string;
  data?: string;
  reference: HTMLElement | null;
  class: string;
  initialX: number;
  initialY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  isResizing: boolean;
  isSelected: boolean;
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
