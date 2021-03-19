import React, { RefObject, useEffect, useState, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useMousePress } from '@hooks/use-mouse-press';
import { TPosition, MouseKey, TSize, IElement, IEntity } from '@types';
import { useElements } from '@modules/elements';
import { start } from 'repl';

interface Wrapper extends TPosition, TSize {
  active: boolean;
  scale: number;
}

const Wrapper = styled.div.attrs<Wrapper>((props) => ({
  style: {
    top: `${props.y}px`,
    left: `${props.x}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
  },
})) <Wrapper>`
  position: absolute;
  pointer-events: none;
  background: ${props => props.active ? '#74b9ff' : 'transparent'};
  border: ${props => props.active ? '1px solid #0984e3' : '1px dashed #0984e3'};
  opacity: 0.5;
`;

interface ISelection {
  workspaceRef: RefObject<HTMLElement>;
}

enum SelectionState {
  None,
  Selecting,
  Released,
  Selected,
}

const getBounds = (startPosition: TPosition, endPosition: TPosition) => {
  const x = Math.min(startPosition.x, endPosition.x);
  const y = Math.min(startPosition.y, endPosition.y);
  const maxX = Math.max(startPosition.x, endPosition.x);
  const maxY = Math.max(startPosition.y, endPosition.y);
  const width = Math.abs(maxX - x);
  const height = Math.abs(maxY - y);
  return { x, y, width, height };
};

const getBounds2 = (selectedElements: IElement[]) => {
  const x = Math.min(...selectedElements.map(el => el.x));
  const y = Math.min(...selectedElements.map(el => el.y));
  const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
  const maxY = Math.max(...selectedElements.map(el => el.y + el.height));
  const width = Math.abs(maxX - x);
  const height = Math.abs(maxY - y);
  return { x, y, width, height };
};

const getNormalizedPosition = (position: TPosition, wrapper: HTMLElement, scale: number) => {
  const wrapperBounds = wrapper.getBoundingClientRect();
  const yOffset = window.outerHeight - window.innerHeight;
  return {
    x: (position.x - wrapperBounds.left) / scale,
    y: (position.y - wrapperBounds.top - yOffset) / scale,
  };
};

const contains = (wrapper: IEntity, element: IEntity) => (
  element.x > wrapper.x &&
  element.y > wrapper.y &&
  element.x + element.width <= wrapper.x + wrapper.width &&
  element.y + element.height <= wrapper.y + wrapper.height
);

const sortByLayer = (elA: IElement, elB: IElement) => (elB.layer - elA.layer);

export const Selection: React.FC<ISelection> = ({ workspaceRef }) => {
  const [startPosition, setStartPosition] = useState<TPosition>({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState<TPosition>({ x: 0, y: 0 });
  const { actions, elements, scale } = useElements();

  const selectedElements = useMemo(() => Object.values(elements).filter(el => el.isSelected), [elements]);

  const selectionElement = selectedElements.length
    ? getBounds2(selectedElements)
    : getBounds(startPosition, endPosition);

  const { position, isPressed } = useMousePress({
    targetKey: MouseKey.Left
  });

  useEffect(() => {
    if (!workspaceRef.current) return;

    const newPos = getNormalizedPosition(position, workspaceRef.current, scale);

    if (!isPressed) {
      setStartPosition(newPos);
    }

    setEndPosition(newPos);
  }, [isPressed, position]);

  useEffect(() => {
    if (!isPressed) {
      const selectionContains = (el: IEntity) => contains(selectionElement, el);
      const wrappedElements = Object.values(elements).sort(sortByLayer).filter(selectionContains);

      if (wrappedElements.length && !selectedElements.length) {
        actions.clearSelection();
        wrappedElements.forEach((el) => {
          actions.select(el.id);
        })
      }
    } else {
      const click = { ...startPosition, width: 1, height: 1 };
      const clicked = (el: IEntity) => contains(el, click);
      const clickedEl = Object.values(elements).sort(sortByLayer).find(clicked);

      if (clickedEl && !clickedEl.isSelected && selectedElements.length < 2) {
        actions.clearSelection();
        actions.select(clickedEl.id);
      }

      if (!clickedEl) {
        actions.clearSelection();
      }
    }
  }, [isPressed]);

  return (
    <Wrapper {...selectionElement} active={true} scale={scale} />
  );
};
