import React from 'react';
import styled from 'styled-components';
import theme from '@styles/theme';
import { Button } from '@components/button';
import { usePopup } from '../../modules/Popup/PopupModule';

const Wrapper = styled.div`
  align-self: stretch;
  width: 20vw;
  padding: 25px;
  background: ${theme.sidebar};
`;

Wrapper.defaultProps = {
  theme,
}

export const SideBar = () => {
  const { open } = usePopup();

  return (
    <Wrapper>
      <label>Layout</label><br/>
      <Button onClick={ () => open('popup', <>xd</>) } >Choose</Button>
    </Wrapper>
  );
};
