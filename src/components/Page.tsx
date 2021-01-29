import React from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useImmer } from 'use-immer';
import Element from './Element';
import theme from '../styles/theme';

const Wrapper = styled.div`
  position: relative;
  width: 21cm;
  height: 29.7cm;
  background: #fff;
`;

Wrapper.defaultProps = {
  theme,
};

const uuid = uuidv4();
const uuid2 = uuidv4();
const uuid3 = uuidv4();

const mock = {
  [uuid]: {
    id: uuid,
    x: 50,
    y: 50,
    width: 300,
    height: 300,
    background: 'red',
    isSelected: false,
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

interface IPage {
  scale: number;
};

const Page: React.FC<IPage> = (props) => {
  const { scale } = props;
  const [elements, setElements] = useImmer(mock);

  const updatePosition = (id: any, newPosition: any) => {
    setElements((draft) => {
      draft[id].x = newPosition.x;
      draft[id].y = newPosition.y;
    });
  };

  const updateSize = (id: any, newSize: any) => {
    setElements((draft) => {
      // todo
    });
  };

  return (
    <Wrapper>
      { Object.values(elements).map((item) => (
        <Element
          key={ item.id }
          updatePosition={ updatePosition }
          scale={ scale }
          { ...item } 
        />
      )) }
    </Wrapper>
  );
};

export default Page;