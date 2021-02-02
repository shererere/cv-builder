import React, { ReactNode, MouseEventHandler } from 'react';

interface PopupProps {
  title: string;
  close: MouseEventHandler<HTMLElement>;
  children: ReactNode;
}

export const Popup = (props: PopupProps) => {
  const { title, close, children } = props;
  return (
    <div>
      { title }
      { children }
      <div onClick={ close }>close</div>
    </div>
  );
};