export interface IEntity {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IElement extends IEntity {
  id: string;
  isSelected: boolean;
  background: string;
  updatePosition: Function;
  scale: number;
}