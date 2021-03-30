import { IElement, TPosition } from "@types";
import { wrapperForElements } from "@utils";

const minSize = 50;

export const resize = (elements: IElement[], element: IElement, newPosition: TPosition, scale: number) => {
  const selectedElements = Object.values(elements).filter(el => el.isSelected);
  const selectionBounds = wrapperForElements(selectedElements);

  if (selectionBounds.x < minSize || selectionBounds.y < minSize) {
    return;
  }

  const changeInSize = {
    x: element.width / selectionBounds.width,
    y: element.height / selectionBounds.height,
  };

  const changeInPosition = {
    x: (element.x - selectionBounds.x) / selectionBounds.width,
    y: (element.y - selectionBounds.y) / selectionBounds.height,
  };

  return {
    ...element,
    x: element.x + (newPosition.x * changeInPosition.x),
    y: element.y + (newPosition.y * changeInPosition.y),
    width: element.width + (newPosition.x * changeInSize.x),
    height: element.height + (newPosition.y * changeInSize.y),
  };
};