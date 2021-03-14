
import { IElement, TPosition } from "@types";

export const updatePosition = (elements: IElement[], element: IElement, newPosition: TPosition) => {
  return {
    ...element,
    x: element.x + newPosition.x,
    y: element.y + newPosition.y,
  };
};