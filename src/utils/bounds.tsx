import { IEntity, TPosition } from "@types";

export const contains = (wrapper: IEntity, element: IEntity) => (
  element.x > wrapper.x &&
  element.y > wrapper.y &&
  element.x + element.width <= wrapper.x + wrapper.width &&
  element.y + element.height <= wrapper.y + wrapper.height
);

export const wrapperForElements = (elements: IEntity[]) => {
  const x = Math.min(...elements.map(el => el.x));
  const y = Math.min(...elements.map(el => el.y));
  const maxX = Math.max(...elements.map(el => el.x + el.width));
  const maxY = Math.max(...elements.map(el => el.y + el.height));
  const width = Math.abs(maxX - x);
  const height = Math.abs(maxY - y);
  return { x, y, width, height };
};

export const cartesianProductOfTwoPoints = (firstPoint: TPosition, secondPoint: TPosition) => {
  const x = Math.min(firstPoint.x, secondPoint.x);
  const y = Math.min(firstPoint.y, secondPoint.y);
  const maxX = Math.max(firstPoint.x, secondPoint.x);
  const maxY = Math.max(firstPoint.y, secondPoint.y);
  const width = Math.abs(maxX - x);
  const height = Math.abs(maxY - y);
  return { x, y, width, height };
};