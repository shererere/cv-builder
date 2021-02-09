import React, { createContext, ReactNode, useState, useMemo, useContext } from 'react';
import { Popup } from '@components/popup';

interface State {
  isOpen: boolean;
  title: string;
  content: ReactNode;
}

interface Actions {
  open: (title: string, content: ReactNode) => void;
}

interface IPopupModule {
  children: ReactNode;
}

const PopupContext = createContext<{
  state: State;
  actions: Actions;
} | null>(null);

const defaultState = ({
  title: '',
  isOpen: false,
  content: null,
});

export const PopupModule = (props: IPopupModule) => {
  const { children } = props;

  const [state, setState] = useState<State>(defaultState);

  const actions = useMemo<Actions>(() => ({
    open: (title, content: ReactNode) => {
      setState({
        isOpen: true,
        title,
        content,
      });
    }
  }), []);

  return (
    <>
      { state.isOpen && (
        <Popup
          close={() => setState(defaultState)}
          title={state.title}
        >
          { state.content}
        </Popup>
      )}
      <PopupContext.Provider value={{ state, actions }}>
        {children}
      </PopupContext.Provider>
    </>
  )
};

export const usePopup = () => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error('PopupContext is not set');
  }

  return context.actions;
};