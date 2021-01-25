import React, { MouseEventHandler, ReactNode } from 'react';
import styled from 'styled-components';
import theme from '../styles/theme';

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const StyledButton = styled.button`
  padding: 10px 15px;
  background: ${theme.button};
  border-radius: 0;
  border: none;
  color: #fff;
  outline: 0;
  cursor: pointer; 
`;

StyledButton.defaultProps = {
  theme,
};

const Button: React.FC<ButtonProps> = ({ onClick = () => null, children }) => {
  return (
    <StyledButton
      onClick={ onClick }
    >{ children }
    </StyledButton>
  );
};

export default Button;
