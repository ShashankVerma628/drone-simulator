import "./app.css";
import { useState, useEffect } from "react";
import Map, { Marker, Source, Layer } from 'react-map-gl';
import * as turf from '@turf/turf';
import { FaMapMarkerAlt, FaPlane } from "react-icons/fa";
import ProgressBar from "./components/ProgressBar";

const App = () => {
  const [origin, setOrigin] = useState({
    longitude: 77.216721,
    latitude: 28.644800,
  });
  const [originPoint, setOriginPoint] = useState({
    longitude: 77.216721,
    latitude: 28.644800,
  });
  const [viewport, setViewport] = useState({
    longitude: 77.216721,
    latitude: 28.644800,
  })
  const [dest, setDest] = useState({
    latitude: 28.381735,
    longitude: 77.296139,
  });
  const [givenTime, setGivenTime] = useState(5000);

  const [counter, setCounter] = useState(0);
  const [running, setRunning] = useState(false);

  const route = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [[originPoint?.longitude, originPoint?.latitude], [dest?.longitude, dest?.latitude]]
        }
      }
    ]
  };
  const layerStyle = {
    'id': 'route',
    'source': 'route',
    'type': 'line',
    'paint': {
      'line-width': 5,
      'line-color': '#90EE90'
    }
  };

  const lineDistance = turf.length(route.features[0]);
  const arc = [];
  const steps = 100;
  // to display arc between the two points
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i);
    arc.push(segment.geometry.coordinates);
  }
  route.features[0].geometry.coordinates = arc;

  const handleSubmit = (e) => {
    e.preventDefault();
    setRunning(true);
    setOrigin(originPoint);
    setCounter(0);
  }
  useEffect(() => {
    if (running) {
      const id = setInterval(() => {
        if (counter <= arc.length - 1) {
          setOrigin({ ...origin, longitude: arc[counter][0], latitude: arc[counter][1] });
          setCounter(counter + 1);
        }
      }, givenTime / steps);
      return () => clearInterval(id);
    }
    setRunning(false);
  }, [counter, running]);


  const handlePause = () => {
    if (running) {
      setRunning(false);
    }
  }

  const handlePlay = () => {
    if (!running) {
      setRunning(true);
    }
  }

  return (
    <div className="app">
      <h1 className="page-title">Drone Simulator</h1>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <h3>Origin: </h3>
          <div className="input-container">
            <label className="form-label">Longitude</label>
            <input name="originLng" placeholder="origin longitude" onChange={(e) => {
              setOriginPoint({ ...originPoint, longitude: e.target.value });
              setOrigin({ ...origin, longitude: e.target.value })
            }} value={originPoint?.longitude} />
          </div>
          <div className="input-container">
            <label className="form-label">Latitude</label>
            <input name="originLat" placeholder="origin latitude" onChange={(e) => {
              setOriginPoint({ ...originPoint, latitude: e.target.value });
              setOrigin({ ...origin, latitude: e.target.value })
            }} value={originPoint?.latitude} />
          </div>
        </div>
        <div className="input-wrapper">
          <h3>Destination : </h3>
          <div className="input-container">
            <label className="form-label">Longitude</label>
            <input name="destLng" placeholder="dest longitude" onChange={(e) => {
              setDest({ ...dest, longitude: e.target.value })
            }} value={dest?.longitude} />
          </div>
          <div className="input-container">
            <label className="form-label">Latitude </label>
            <input name="destLat" placeholder="dest latitude"
              onChange={(e) => {
                setDest({ ...dest, latitude: e.target.value })
              }} value={dest?.latitude} />
          </div>
        </div>
        <div className="input-time-container input-container">
          <label>Time(in millisecond) : </label>
          <input placeholder="running time" value={givenTime} onChange={(e) => setGivenTime(e.target.value)} />
        </div>
        <div className="submit-btn-container">
          <button className="submit-btn btn">
            Simulate
          </button>
          <button disabled={running ? false : true} className={`btn pause-btn action-btn ${running ? "" : "disabled"}`} onClick={handlePause}>Pause</button>
          <button disabled={running ? true : false} className={`btn pause-btn action-btn ${running ? "disabled" : ""}`} onClick={handlePlay}>Play</button>
        </div>
      </form>
      <div className="progress-bar-container">
        <h3>Progress : </h3>
        <ProgressBar steps={steps} activeStep={counter} />
      </div>
      <div className="map-container">

        <Map

          zoom={9}
          mapLib={import("mapbox-gl")}
          {...viewport}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
          style={{ width: "100%", height: "60vh", border: "2px solid #000" }}
          onMove={evt => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
          transitionDuration="10"
        >
          <Marker longitude={originPoint?.longitude} latitude={originPoint?.latitude} anchor="bottom" >
            <FaMapMarkerAlt size={30} color="blue" />
          </Marker>
          {dest?.lat !== null && <Marker
            latitude={dest?.latitude}
            longitude={dest?.longitude}
          >
            <FaMapMarkerAlt size={30} color="red" />
          </Marker>}
          <Source id="my-data" type="geojson" data={route}>
            <Layer {...layerStyle} />
          </Source>
          <Marker
            latitude={origin?.latitude}
            longitude={origin?.longitude}
          >
            <FaPlane color="#000" size={20} />
          </Marker>
        </Map>
      </div>
    </div >
  )
}

export default App
