import React, { createContext, ReactNode, useMemo, useContext, useState } from 'react';
import { IElement } from '@types';


interface Actions {
  setScale: (scale: number) => void;
}

interface IScaleModule {
  children: ReactNode;
}

const ScaleContext = createContext<{
  state: number;
  actions: Actions;
} | null>(null);

export const ScaleModule = (props: IScaleModule) => {
  const { children } = props;

  const [state, setState] = useState<number>(1);

  const actions = useMemo<Actions>(() => ({
    setScale: (scale) => {
      setState(scale);
    },
  }), []);

  return (
    <ScaleContext.Provider value={{ state, actions }}>
      {children}
    </ScaleContext.Provider>
  )
};

export const useScale = () => {
  const context = useContext(ScaleContext);

  if (!context) {
    throw new Error('ScaleContext is not set');
  }

  return {
    scale: context.state,
    setScale: context.actions.setScale,
  };
};