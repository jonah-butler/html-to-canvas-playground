import { ElementJSON } from "../types";

const removeTransformProperty = (htmlString: string): string => {
  const dp = new DOMParser();
  const element = dp
    .parseFromString(htmlString, "text/html")
    .querySelector("body")?.firstChild as HTMLElement;
  element!.style.transform = "";
  return element.outerHTML;
};

const convertToSVG = (
  e: ElementJSON,
  canvasContext: CanvasRenderingContext2D
): void => {
  console.log(e.reference!);
  e.reference!.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  const height = e.reference!.clientHeight;
  const width = e.reference!.clientWidth;
  let data = "";
  let url = "";
  let image = new Image();
  if (e.type === "image") {
    image.width = width;
    image.height = height;
    url = e.src as string;
  } else {
    data = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
      ${removeTransformProperty(e.reference!.outerHTML)}
    </foreignObject>
  </svg>`;
    const svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    url = window.URL.createObjectURL(svg);
  }

  image.onload = () => {
    canvasContext.drawImage(image, e.currentX, e.currentY, width, height);
    window.URL.revokeObjectURL(url);
  };

  image.src = url;
};

export { convertToSVG };
