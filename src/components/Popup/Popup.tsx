import React, { ReactNode, MouseEventHandler } from 'react';

interface PopupProps {
  title: string;
  close: MouseEventHandler<HTMLElement>;
  children: ReactNode;
}

const Popup = (props: PopupProps) => {
  const { title, close, children } = props;
  return (
    <div>
      { title }
      { children }
      <div onClick={ close }>close</div>
    </div>
  );
};

export default Popup;