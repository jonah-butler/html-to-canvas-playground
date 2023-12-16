import { ElementJSON } from "../types";
import { ServiceError } from "../composables/error";

const ERRORS = {
  LOAD_IMAGE_FAILURE: "Failed to load and draw image to canvas",
  ELEMENT_REFERENCE: "Reference to element is null",
};
type RenderingErrors = keyof typeof ERRORS;
class RenderingError extends ServiceError<RenderingErrors>{};

// i hate this - will find a better way eventually
const removeTransformProperty = (htmlString: string): string => {
  const dp = new DOMParser();
  const element = dp
    .parseFromString(htmlString, "text/html")
    .querySelector("body")?.firstChild as HTMLElement;
  element!.style.transform = "";
  return element.outerHTML;
};

const setXMLNS = (e: HTMLElement): void => {
  e.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
};

const prepareSVG = (w: number, h: number, e: HTMLElement): string => {
  const data = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    ${removeTransformProperty(e.outerHTML)}
  </foreignObject>
</svg>`;

const svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });

return window.URL.createObjectURL(svg);
};

const convertToSVG = (
  e: ElementJSON,
  canvasContext: CanvasRenderingContext2D
): void => {

  if(!e.reference) throw new RenderingError({name: "ELEMENT_REFERENCE", message: ERRORS.LOAD_IMAGE_FAILURE});
  setXMLNS(e.reference);

  const height = e.reference.clientHeight;
  const width = e.reference.clientWidth;

  let url = "";
  let image = new Image();

  if (e.type === "image") {
    // set size attributes for image
    image.width = width;
    image.height = height;

    url = e.src as string;

  } else {

    url = prepareSVG(width, height, e.reference);

  }

  loadImage(image, url)
    .then(() => {
      canvasContext.drawImage(image, e.currentX, e.currentY, width, height);
      window.URL.revokeObjectURL(url);
    })
    .catch(() => {
      throw new RenderingError(
        {
          name: "LOAD_IMAGE_FAILURE",
          message: ERRORS.LOAD_IMAGE_FAILURE,
        }
      );
    });
};

// image onload helper
const loadImage = (i: HTMLImageElement, src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject): void => {
    i.onload = ():void => resolve(i);
    i.onerror = reject
    i.src = src
  })
}

export { convertToSVG };
