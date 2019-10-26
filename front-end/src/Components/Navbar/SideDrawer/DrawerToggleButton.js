import React from 'react';
import styled from 'styled-components';

export default function DrawerToggleButton(props) {
  return (

    <ToggleButton className='toggle_button' onClick={props.toggleButton}>

      <ToggleButtonLines />
      <ToggleButtonLines />
      <ToggleButtonLines />
    </ToggleButton>
  )
}

//* Styled Components 

const ToggleButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 3vh;
  width: 4vw;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;

  @media (min-width: 768px) {
      display: none;
      
    }

  &:focus{
    outline: none;
  }
`

const ToggleButtonLines = styled.div`
  height: 2px;
  width:5vw;
  background: white;
`


