import React, { createContext, ReactNode, useMemo, useContext, useState } from 'react';
import { IElement } from '@types';
import { v4 as uuidv4 } from 'uuid';

const uuid = uuidv4();
const uuid2 = uuidv4();
const uuid3 = uuidv4();

interface State {
  elements: {
    [key: string]: IElement;
  };
  scale: number;
}

const mock = {
  [uuid]: {
    id: uuid,
    x: 0,
    y: 0,
    width: 300,
    height: 300,
    background: 'red',
    isSelected: false,
    layer: 3,
  },
  [uuid2]: {
    id: uuid2,
    x: 50,
    y: 50,
    width: 300,
    height: 300,
    background: 'green',
    isSelected: false,
    layer: 2,
  },
  // [uuid3]: {
  //   id: uuid3,
  //   x: 50,
  //   y: 50,
  //   width: 300,
  //   height: 300,
  //   background: 'yellow',
  //   isSelected: false,
  //   layer: 1,
  // },
}

interface Actions {
  dispatch: (fn: Function) => (...args: any) => void;
  select: (id: string) => void;
  deselect: (id: string) => void;
  clearSelection: () => void;
  setScale: (scale: number) => void;
}

interface IElementsModule {
  children: ReactNode;
}

const ElementsContext = createContext<{
  state: State;
  actions: Actions;
} | null>(null);

export const ElementsModule = (props: IElementsModule) => {
  const { children } = props;

  const [state, setState] = useState<State>({ scale: 1, elements: mock });

  const actions = useMemo<Actions>(() => ({
    dispatch: (func) => (...args) => {
      setState((oldState) => ({
        ...oldState,
        elements: {
          ...oldState.elements,
          ...Object.entries(oldState.elements)
            .filter(([key, value]) => value.isSelected)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: func(state.elements, value, ...args) }), {}),
        }
      }));
    },
    select: (id) => {
      setState((oldState) => ({
        ...oldState,
        elements: {
          ...oldState.elements,
          [id]: {
            ...oldState.elements[id],
            isSelected: true,
          }
        }
      }));
    },
    deselect: (id) => {
      setState((oldState) => ({
        ...oldState,
        elements: {
          ...oldState.elements,
          [id]: {
            ...oldState.elements[id],
            isSelected: false,
          }
        }
      }));
    },
    clearSelection: () => {
      setState((oldState) => ({
        ...oldState,
        elements: Object.entries(oldState.elements)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: { ...value, isSelected: false } }), {})
      }));
    },
    setScale: (scale) => {
      setState((oldState) => ({
        ...oldState,
        scale,
      }));
    },
  }), []);

  return (
    <ElementsContext.Provider value={{ state, actions }}>
      {children}
    </ElementsContext.Provider>
  )
};

export const useElements = () => {
  const context = useContext(ElementsContext);

  if (!context) {
    throw new Error('PopupContext is not set');
  }

  return {
    actions: context.actions,
    elements: context.state.elements,
    scale: context.state.scale,
  };
};