import { IElement, TPosition } from "@types";
import { wrapperForElements } from "@utils";

export const resize = (elements: IElement[], element: IElement, newPosition: TPosition, scale: number) => {
  const selectedElements = Object.values(elements).filter(el => el.isSelected);
  const selectionBounds = wrapperForElements(selectedElements);

  const changeInSize = {
    x: (Math.abs(selectionBounds.x - newPosition.x)) / selectionBounds.x,
    y: (Math.abs(selectionBounds.y - newPosition.y)) / selectionBounds.y,
  };

  return {
    ...element,
    x: element.x,
    y: element.y,
    width: element.width + (newPosition.x * changeInSize.x),
    height: element.height + (newPosition.y * changeInSize.y),
  };
};