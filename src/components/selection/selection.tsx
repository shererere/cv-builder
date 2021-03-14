import React, { RefObject, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useMousePress } from '@hooks/use-mouse-press';
import { TPosition, MouseKey, TSize, IElement, IEntity } from '@types';
import { useElements } from '@modules/elements';

interface Wrapper extends TPosition, TSize {
  active: boolean;
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

const getNormalizedPosition = (position: TPosition, wrapper: HTMLElement) => {
  const wrapperBounds = wrapper.getBoundingClientRect();
  const yOffset = window.outerHeight - window.innerHeight;
  return {
    x: position.x - wrapperBounds.left,
    y: position.y - wrapperBounds.top - yOffset,
  };
};

const contains = (wrapper: IEntity, element: IEntity) => (
  element.x > wrapper.x &&
  element.y > wrapper.y &&
  element.x + element.width <= wrapper.x + wrapper.width &&
  element.y + element.height <= wrapper.y + wrapper.height
);

const shouldStartSelecting = (position: TPosition, elements: IElement[]) => {
  const clickedEl = elements.find(el => contains(el, { ...position, width: 1, height: 1 }));
  return !!clickedEl;
};

export const Selection: React.FC<ISelection> = ({ workspaceRef }) => {
  const [startPosition, setStartPosition] = useState<TPosition>({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState<TPosition>({ x: 0, y: 0 });
  const [state, setState] = useState(SelectionState.None);
  const { actions, elements } = useElements();

  const selectedElements = useMemo(() => Object.values(elements).filter(el => el.isSelected), [elements]);

  const selectionElement = state === SelectionState.Selecting
    ? getBounds(startPosition, endPosition)
    : getBounds2(selectedElements);

  const onHold = () => {
    setState(SelectionState.Selecting);
  };

  const onMove = () => {
  };

  const onRelease = () => {
    setState(SelectionState.Released);
  };

  const { position } = useMousePress({
    targetKey: MouseKey.Left, onHold, onRelease, onMove
  });

  useEffect(() => {
    if (!workspaceRef.current) return;

    const newPosition = getNormalizedPosition(position, workspaceRef.current);

    if (state === SelectionState.Selecting) {
      setEndPosition(newPosition);
    }

    if (state !== SelectionState.Selecting) {
      setStartPosition(newPosition);
    }
  }, [state, position]);

  useEffect(() => {
    if (state === SelectionState.Released) {
      const selectionContains = (el: IEntity) => contains(selectionElement, el);

      Object.values(elements).filter(selectionContains).forEach((el) => {
        actions.select(el.id);
        console.log(el.id);
      });

      setState(SelectionState.Selected);
    }
  }, [state, selectionElement]);

  return (
    <Wrapper {...selectionElement} active={state === SelectionState.Selecting} />
  );
};
