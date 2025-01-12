// Modal.js
import React from "react";

const Modal = ({ show, coordinates, onClose }) => {
  if (!show) return null;

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h3>LineString Coordinates</h3>
        <ul>
          {coordinates.map((coord, index) => (
            <li key={index}>
              Lat: {coord.lat}, Lng: {coord.lng}
            </li>
          ))}
        </ul>
        <button onClick={onClose} style={closeButtonStyle}>
          Close
        </button>
      </div>
    </div>
  );
};

// Modal styles
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto",
};

const closeButtonStyle = {
  marginTop: "10px",
  padding: "10px 15px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Modal;
