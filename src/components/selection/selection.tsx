import React, { RefObject, useEffect, useState, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useMousePress } from '@hooks/use-mouse-press';
import { TPosition, MouseKey, TSize, IElement, IEntity } from '@types';
import { useElements } from '@modules/elements';
import { useScale } from '@modules/scale';
import { contains, cartesianProductOfTwoPoints, wrapperForElements } from '@utils';
import { updatePosition } from '@modules/elements/functions/update-position';
import Draggable from 'react-draggable';

interface Wrapper extends TPosition, TSize {
  active: boolean;
  scale: number;
}

const Wrapper = styled.div.attrs<Wrapper>((props) => ({
  style: {
    width: `${props.width}px`,
    height: `${props.height}px`,
  },
})) <Wrapper>`
  position: absolute;
  background: ${props => props.active ? '#74b9ff' : 'transparent'};
  border: ${props => props.active ? '1px solid #0984e3' : '1px dashed #0984e3'};
  opacity: 0.5;
  left: 0;
  top: 0;
  will-change: transform;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  z-index: 9999;
`;

const InnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Handle = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
`;

const TopLeftHandle = styled(Handle)`
  top: -3px;
  left: -3px;
  border-top: 3px solid black;
  border-left: solid 3px black;
`;

const TopRightHandle = styled(Handle)`
  top: -3px;
  right: -3px;
  border-top: 3px solid black;
  border-right: solid 3px black;
`;

const BottomRightHandle = styled(Handle)`
  bottom: -3px;
  right: -3px;
  border-bottom: 3px solid black;
  border-right: solid 3px black;
`;

const BottomLeftHandle = styled(Handle)`
  bottom: -3px;
  left: -3px;
  border-bottom: 3px solid black;
  border-left: solid 3px black;
`;

const MoveHandle = styled(Handle)`
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: solid 3px black;
`;

interface ISelection {
  workspaceRef: RefObject<HTMLElement>;
}

enum SelectionState {
  None = "None",
  Move = "Move",
  Resize = "Resize",
  Rotate = "Rotate",
}

const getNormalizedPosition = (position: TPosition, wrapper: HTMLElement, scale: number) => {
  const wrapperBounds = wrapper.getBoundingClientRect();
  const yOffset = window.outerHeight - window.innerHeight;
  return {
    x: (position.x - wrapperBounds.left) / scale,
    y: (position.y - wrapperBounds.top - yOffset) / scale,
  };
};

const sortByLayer = (elA: IElement, elB: IElement) => (elB.layer - elA.layer);

export const Selection: React.FC<ISelection> = ({ workspaceRef }) => {
  const [startPosition, setStartPosition] = useState<TPosition>({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState<TPosition>({ x: 0, y: 0 });
  const [state, setState] = useState<SelectionState>(SelectionState.None);
  const [selectionClickCount, setSelectionClickCount] = useState(0);
  const { actions, elements, selectedElements } = useElements();
  const { scale } = useScale();

  const selectionElement = selectedElements.length
    ? wrapperForElements(selectedElements)
    : cartesianProductOfTwoPoints(startPosition, endPosition);

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
      const wrappedElements = elements.sort(sortByLayer).filter(selectionContains);

      if (wrappedElements.length && !selectedElements.length) {
        actions.clearSelection();
        setSelectionClickCount(1);
        wrappedElements.forEach((el) => {
          actions.select(el.id);
        });
      }
    } else {
      const click = { ...startPosition, width: 1, height: 1 };
      const clicked = (el: IEntity) => contains(el, click);
      const clickedOnSelection = clicked(selectionElement);

      if (clickedOnSelection || !selectionClickCount) {
        setSelectionClickCount(oldState => oldState + 1);
      }

      const clickedEl = elements.sort(sortByLayer).find(clicked);
      if (clickedEl && !clickedEl.isSelected && selectedElements.length < 2) {
        actions.clearSelection();
        actions.select(clickedEl.id);
        setSelectionClickCount(1);
      }

      if (!clickedEl && !clickedOnSelection) {
        actions.clearSelection();
        setSelectionClickCount(0);
      }
    }
  }, [isPressed]);

  useEffect(() => {
    switch (selectionClickCount) {
      case 1:
        setState(SelectionState.Move);
        return;
      case 2:
        setState(SelectionState.Resize);
        return;
      case 3:
        setState(SelectionState.Rotate);
        return;
      case 4:
        setState(SelectionState.Move);
        setSelectionClickCount(1);
        return;
    }
  }, [selectionClickCount]);

  const draggableProps = {
    bounds: 'parent',
    position: { x: selectionElement.x, y: selectionElement.y },
    scale,
    disabled: state === SelectionState.None,
    onDrag: (e: any, data: any) => {
      actions.dispatch(updatePosition)({
        x: data.deltaX,
        y: data.deltaY,
      });
    },
  };

  if (state === SelectionState.Move) {
    return (
      <Draggable {...draggableProps}>
        <Wrapper {...selectionElement} active={true} scale={scale}>
          <InnerWrapper>
            <MoveHandle />
          </InnerWrapper>
        </Wrapper>
      </Draggable>
    );
  }
  if (state === SelectionState.Resize) {
    return (
      <Draggable {...draggableProps}>
        <Wrapper {...selectionElement} active={true} scale={scale}>
          <InnerWrapper>
            <TopLeftHandle />
            <TopRightHandle />
            <BottomRightHandle />
            <Draggable><BottomLeftHandle /></Draggable>
          </InnerWrapper>
        </Wrapper>
      </Draggable>
    );
  }

  return <Draggable {...draggableProps}><Wrapper {...selectionElement} active={true} scale={scale} /></Draggable>;

  // switch (state) {
  //   case SelectionState.Move:
  //     return null;
  //   case SelectionState.None:
  //     return (<Wrapper {...selectionElement} active={true} scale={scale} />);
  //   case SelectionState.Resize:
  //     return null;
  //   case SelectionState.Rotate:
  //     return null;
  //   default:
  //     return null;
  // };
};
