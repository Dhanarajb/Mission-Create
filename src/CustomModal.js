import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 35%;
  max-width: 600px;
  text-align: left;
  position: relative;
  margin-right: 896px;
  margin-bottom: 286px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5em;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
  &:hover {
    color: red;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

const TableRow = styled.tr`
  border: 1px solid #ddd;
`;

const TableData = styled.td`
  padding: 8px;
  text-align: center;
`;

const CustomModal = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onRequestClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {children}
        {/* <Button onClick={onRequestClose}>Close</Button> */}
      </ModalContent>
    </ModalOverlay>
  );
};

export default CustomModal;
