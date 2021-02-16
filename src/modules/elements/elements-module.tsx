import React, { createContext, ReactNode, useMemo, useContext } from 'react';
import { IElement } from '@types';
import { useImmer } from 'use-immer';
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
    x: 50,
    y: 50,
    width: 300,
    height: 300,
    background: 'red',
    isSelected: true,
  },
  [uuid2]: {
    id: uuid2,
    x: 50,
    y: 50,
    width: 300,
    height: 300,
    background: 'green',
    isSelected: false,
  },
  [uuid3]: {
    id: uuid3,
    x: 50,
    y: 50,
    width: 300,
    height: 300,
    background: 'yellow',
    isSelected: false,
  },
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

  const [state, setState] = useImmer<State>({ scale: 0.75, elements: mock });

  const actions = useMemo<Actions>(() => ({
    dispatch: (func) => (...args) => {
      setState((state) => {
        state.elements = Object.entries(state.elements)
          .reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value.isSelected
              ? func(state.elements, value, ...args)
              : value,
          }), {});
      });
    },
    select: (id) => {
      setState((state) => {
        state.elements[id].isSelected = true;
      });
    },
    deselect: (id) => {
      setState((state) => {
        state.elements[id].isSelected = false;
      });
    },
    clearSelection: () => {
      setState((state) => {
        state.elements = Object.entries(state.elements)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: { ...value, isSelected: false } }), {});
      });
    },
    setScale: (scale) => {
      setState((state) => {
        state.scale = scale;
      })
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

  return { actions: context.actions, elements: context.state.elements, scale: context.state.scale };
};