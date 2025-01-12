import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { v4 as uuidv4 } from "uuid";
import CustomModal from "./CustomModal";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MissionCreation = () => {
  const [waypoints, setWaypoints] = useState([]);
  const [polyline, setPolyline] = useState([]);
  const [polygon, setPolygon] = useState([]);
  const [drawingMode, setDrawingMode] = useState(null);
  const [missionModalOpen, setMissionModalOpen] = useState(true);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activePolygonIndex, setActivePolygonIndex] = useState(null);
  const [polygonInsertionIndex, setPolygonInsertionIndex] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);

  const calculateDistance = (lat, lng) => {
    if (waypoints.length === 0) return 0;
    const lastPoint = waypoints[waypoints.length - 1].coordinates;
    const R = 6371;
    const dLat = ((lat - lastPoint.lat) * Math.PI) / 180;
    const dLng = ((lng - lastPoint.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lastPoint.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        if (drawingMode === "line") {
          const newWaypoint = {
            id: uuidv4(),
            coordinates: { lat, lng },
            distance: calculateDistance(lat, lng),
          };
          setWaypoints((prev) => [...prev, newWaypoint]);
          setPolyline((prev) => [...prev, [lat, lng]]);
        } else if (drawingMode === "polygon") {
          setPolygon((prev) => [...prev, [lat, lng]]);
        }
      },
      mousemove: (e) => {
        const { lat, lng } = e.latlng;
        setCurrentCoordinates({ lat, lng });
      },
    });
    return null;
  };

  const startDrawing = () => {
    setDrawingMode("line");
    setWaypoints([]);
    setPolyline([]);
    setMissionModalOpen(false);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const renderWaypointsModal = () => {
    const generateCSV = () => {
      const headers = ["WP ID", "Coordinates", "Distance (m)"];
      const rows = waypoints.map((wp, index) => [
        `WP${index + 1}`,
        `${wp.coordinates.lat.toFixed(6)}, ${wp.coordinates.lng.toFixed(6)}`,
        wp.distance.toFixed(2),
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join(",") +
        "\n" +
        rows.map((row) => row.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "waypoints.csv");
      link.click();
    };

    return (
      <CustomModal
        isOpen={missionModalOpen}
        onRequestClose={() => setMissionModalOpen(false)}
        contentLabel="Waypoints"
        style={{
          content: {
            padding: "0px 20px 20px 20px ",
            maxWidth: "600px",
            margin: "0 auto",
            zIndex: "1",
            height: "auto",
            position: "relative",
          },
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ textAlign: "left", marginBottom: "20px" }}>
            Mission Creation
          </h2>
          <button
            style={{
              top: "10px",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "black",
            }}
            onClick={() => setMissionModalOpen(false)}
          >
            &#10005;
          </button>
        </div>
        <hr style={{ marginTop: "-12px", border: "1px solid #ddd" }} />
        <p
          onClick={startDrawing}
          style={{
            border: "2px dotted #9b9b9d",
            padding: "12px",
            backgroundColor: "#ebebeb",
            color: "#9b9b9d",
            cursor: "pointer",
          }}
        >
          Waypoint Navigation: Click on the map to mark points of the route and
          then press the button below to complete the route.
        </p>
        <hr style={{ marginTop: "20px", border: "1px solid #ddd" }} />
        <table
          border="1"
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "5px" }}>Select</th>
              <th style={{ padding: "5px" }}>WP ID</th>
              <th style={{ padding: "5px" }}>Coordinates</th>
              <th>Distance (m)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {waypoints.map((wp, index) => (
              <tr
                key={wp.id}
                style={{
                  backgroundColor: selectedRows.includes(wp.id)
                    ? "#f0f8ff"
                    : "white",
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(wp.id)}
                    onChange={() => handleCheckboxChange(wp.id)}
                  />
                </td>
                <td>{`WP${index + 1}`}</td>
                <td>
                  {wp.coordinates.lat.toFixed(6)},{" "}
                  {wp.coordinates.lng.toFixed(6)}
                </td>
                <td>{wp.distance.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedWaypoint(wp);
                      setShowDetailsModal(true);
                    }}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      fontSize: "16px",
                      color: "#007bff",
                    }}
                  >
                    Show Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={generateCSV}
            style={{
              cursor: "pointer",
              backgroundColor: "#685cdc",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
              boxShadow: "0px 4px 10px rgba(104, 92, 204, 0.5)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#4b43a1";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#685cdc";
              e.target.style.transform = "scale(1)";
            }}
          >
            Generate data
          </button>
        </div>
      </CustomModal>
    );
  };

  const renderWaypointDetailsModal = () => {
    if (!selectedWaypoint) return null;

    return (
      <CustomModal
        isOpen={showDetailsModal}
        onRequestClose={() => setShowDetailsModal(false)}
        contentLabel="Waypoint Details"
        style={{
          content: {
            padding: "20px",
            maxWidth: "500px",
            margin: "0 auto",
            zIndex: "1",
            height: "auto",
            position: "relative",
          },
        }}
      >
        <h2>Waypoint Details</h2>
        <button
          onClick={() => setShowDetailsModal(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "black",
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          &#10005;
        </button>
        <div>
          <p>
            <strong>WP ID:</strong> {selectedWaypoint.id}
          </p>
          <p>
            <strong>Coordinates:</strong>{" "}
            {selectedWaypoint.coordinates.lat.toFixed(6)},{" "}
            {selectedWaypoint.coordinates.lng.toFixed(6)}
          </p>
          <p>
            <strong>Distance (m):</strong>{" "}
            {selectedWaypoint.distance.toFixed(2)}
          </p>
        </div>
      </CustomModal>
    );
  };

  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "500px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {polyline.length > 0 && <Polyline positions={polyline} />}
        {polygon.length > 0 && <Polygon positions={polygon} />}
      </MapContainer>
      <button
        onClick={() => setMissionModalOpen(true)}
        style={{
          position: "absolute",
          bottom: "13%",
          left: "40%",
          transform: "translateX(-50%)",
          border: "2px solid black",
          padding: "22px",
          fontSize: "23px",
          borderRadius: "50px",
          backgroundColor: "#38f",
          color: "white",
          cursor: "pointer",
          boxShadow: "0px 4px 20px rgba(56, 56, 255, 0.5)",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#3a8fd9";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#38f";
          e.target.style.transform = "scale(1)";
        }}
      >
        Generate Waypoints
      </button>

      {renderWaypointsModal()}
      {renderWaypointDetailsModal()}
    </div>
  );
};

export default MissionCreation;
