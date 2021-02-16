import { IElement, TPosition } from "@types";

export const updatePosition = (elements: IElement[], element: IElement, newPosition: TPosition) => {
  return { ...element, ...newPosition };
};