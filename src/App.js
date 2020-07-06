// React and threejs related
import * as THREE from "three";
import React, { useCallback, useRef, useState, Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, PerspectiveCamera, OrthographicCamera, HTML } from "drei";
// Style
import "./App.css";
// Components
import Header from "./components/header";
import { getData, SwarmData } from "./components/data";
import SearchArea from "./components/search";
import { HorizontalSlider, CircuSlider } from "./components/slider";

const Fallback = () => (
  <HTML>
    <div className="loading">Loading...</div>
  </HTML>
)
function App() {
  // Load datasest
  getData();
  // Mouse position
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), []);
  // Camera reference
  const cam = useRef();
  // Component communication
  const [newData, setNewData] = useState(0);
  const [newSel, setNewSel] = useState(0);
  const [totalSel, setTotalSel] = useState(0);
  const [newArea, setNewArea] = useState([]);

  return (
    <>
      <Header />
      {/* Canvas */}
      <div style={{
        width: "100%", height: "88%",
        borderRadius: "5px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.05)"
      }} onMouseMove={onMouseMove} >
        <Canvas
          colorManagement
          shadowMap
          gl={{ logarithmicDepthBuffer: true }}
          onCreated={({ gl }) => {
            gl.setClearColor("#ededed", 0.85)
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.outputEncoding = THREE.sRGBEncoding
          }}
        >
          {/* <PerspectiveCamera makeDefault={true} ref={cam} fov={75} position={[0,0,70]} /> */}
          <OrthographicCamera makeDefault={true} ref={cam} zoom={10} position={[0, 0, 70]} />

          <ambientLight intensity={1.1} />
          <pointLight position={[100, 100, 100]} intensity={0.5} />
          <pointLight position={[-100, -100, -100]} intensity={1.5} />

          {/* Suspend the drawings till loaded */}
          <Suspense fallback={<Fallback />}>
            <SwarmData mouse={mouse} data={newData} area={newArea} nsel={newSel} tsel={totalSel} cam={cam} />
          </Suspense>
          {/* Allow us to move the canvas around */}
          <OrbitControls
            screenSpacePanning={true}
            minPolarAngle={Math.PI * 0.5}
            maxPolarAngle={Math.PI * 0.5}
            enableDamping={true}
            dampingFactor={0.1}
            // enablePan={false}
            minDistance={5}
          />
        </Canvas>
      </div>
      {/* Data Filter Control */}
      <SearchArea update={value => setNewArea(value)} />
      <HorizontalSlider input={value => setNewData(value)} />
      <span className="circular">
        <CircuSlider count="100" label="new cases ≥" color="#8bb4d6" input={value => setNewSel(value)} />
      </span>
      <span className="circular">
        <CircuSlider count="1600" label="total cases ≥" color="#4b98d6" input={value => setTotalSel(value)} />
      </span>
    </>
  );
}

export default App;
