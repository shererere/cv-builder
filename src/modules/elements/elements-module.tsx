import React, { createContext, ReactNode, useState, useMemo, useContext } from 'react';
import { Popup } from '@components/popup';
import { IElement, TPosition, TSize } from '@types';

interface State {
  elements: IElement[];
  selected: string[];
}

interface Actions {
  dispatchOnSelected: (fn: Function) => void;
  updateSize: (id: string, payload: TSize) => void;
  updatePosition: (id: string, payload: TPosition) => void;
  select: (id: string) => void;
}

interface IElementsModule {
  children: ReactNode;
}

const ElementsContext = createContext<{
  state: State;
  actions: Actions;
} | null>(null);

const defaultState = {
  elements: [],
  selected: [],
};

export const ElementsModule = (props: IElementsModule) => {
  const { children } = props;

  const [state, setState] = useState<State>(defaultState);

  const actions = useMemo<Actions>(() => ({
    dispatchOnSelected: () => {

    },
    updateSize: (id: string, payload: TSize) => {
      const element = state.elements.find(e => e.id === id);

      if (!element) return;

      element.width = payload.width;
      element.height = payload.height;
    },
    updatePosition: () => { },
    select: () => { },
  }), []);

  return (
    <ElementsContext.Provider value={{ state, actions }}>
      {children}
    </ElementsContext.Provider>
  )
};