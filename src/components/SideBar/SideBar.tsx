import React, { useContext } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import Button from '../Button/Button';
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

const SideBar = () => {
  const { open } = usePopup();

  return (
    <Wrapper>
      <label>Layout</label><br/>
      <Button onClick={ () => open('popup', <>xd</>) } >Choose</Button>
    </Wrapper>
  );
};

export default SideBar;
