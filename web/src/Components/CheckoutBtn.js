import React from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px #007bff, 0 0 5px #007bff, 0 0 8px #007bff, 0 0 10px #007bff;
  }
  50% {
    box-shadow: 0 0 10px #007bff, 0 0 12px #007bff, 0 0 25px #007bff, 0 0 38px #007bff;
  }
  100% {
    box-shadow: 0 0 5px #007bff, 0 0 5px #007bff, 0 0 8px #007bff, 0 0 10px #007bff;
  }
`;

const Button = styled.button`
  margin-bottom: 1em;
  position: relative;
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  animation: ${glow} 1.5s infinite;
  &:hover {
    animation: none;
    box-shadow: 0 0 5px #007bff, 0 0 12px #007bff, 0 0 25px #007bff, 0 0 38px #007bff;
  }
  &:active {
    animation: none;
    box-shadow: 0 0 5px #007bff, 0 0 5px #007bff, 0 0 9px #007bff, 0 0 10px #007bff;
  }
`;

const CheckoutBtn = ({handleViewCart}) => {
  return (
    <Button className="btn btn-lg" onClick={handleViewCart}>Checkout</Button>
  );
};

export default CheckoutBtn;
