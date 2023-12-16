export interface ElementJSON {
  type: string;
  src?: string;
  reference: HTMLElement | null;
  class: string;
  initialX: number;
  initialY: number;
  currentX: number;
  currentY: number;
  isActive: boolean;
  styles: Record<string, string>;
}
