import React, { useRef, useState, useMemo } from "react";
import { useSpring, a } from "react-spring/three";
import { useFrame } from "react-three-fiber";
import { HTML } from "drei";
import usePromise from "react-promise-suspense"
// Date View
const DualMesh = ({ info, cam, mouse, position, rotation, colorn, colort, argsn, argst, switchMode }) => {
    // Produce a fake load and wait for the data 
    usePromise(ms => new Promise(res => setTimeout(res, ms)), [1000]);
    // Reference to control mesh movements
    const mesh = useRef();
    // Area case info state (hovering)
    const [casePos, setCasePos] = useState([-10000, -10000, -10000]);
    // Expand state (hovering)
    const [expand, setExpand] = useState(false);
    // Define the movement pattern
    const particle = useMemo(() => {
        const t = Math.random() * 10;
        const factor = 20 + Math.random() * 200;
        const xFactor = -20 + Math.random() * 40;
        const yFactor = -20 + Math.random() * 40;
        const zFactor = -20 + Math.random() * 40;
        const speed = 0.005 + Math.random() / 500;
        const temp = ({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });

        return temp;
    }, [])
    // Rerender and update the mesh movements by frame
    useFrame(state => {
        let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
        t = particle.t += speed / 10;
        const a = Math.cos(t) + Math.sin(t * 1) / 10;
        const b = Math.sin(t) + Math.cos(t * 2) / 10;
        particle.mx += (mouse.current[0] - particle.mx) * 0.02;
        particle.my += (-mouse.current[1] - particle.my) * 0.02;
        mesh.current.position.x = (particle.mx / 16) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
        mesh.current.position.y = (particle.my / 16) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
        mesh.current.position.z = (particle.my / 16) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;
        // mesh.current.rotation.y += 0.01;
    });
    // React spring expand animation
    const props = useSpring({
        scale: expand ? [1.3, 1.3, 1.3] : [1, 1, 1],
    });
    // Event - hovering 
    function onPointerOver() {
        const pos = mesh.current.position;
        setExpand(true);
        setCasePos(pos);
        // pos.project(cam.current);
        // const x = (pos.x * .5 + .5) * window.innerWidth;
        // const y = (pos.y * .5 + .5) * window.innerHeight;
    }
    // Event - hovering ends
    function onPointerOut() {
        setExpand(false);
        setCasePos([-10000, -10000, -10000])
    }
    // Pass the mode decision to Data.js
    function onClick() {
        switchMode(info[2]);
    }

    return (
        <>
            <mesh
                position={position}
                rotation={rotation}
                ref={mesh}>
                {/* New Case */}
                <a.mesh scale={props.scale}>
                    <coneBufferGeometry attach="geometry" args={argsn} />
                    <meshStandardMaterial attach="material" color={colorn} transparent={false} opacity={1} />
                </a.mesh>
                {/* Total Case */}
                <a.mesh
                    onPointerOver={onPointerOver}
                    onPointerOut={onPointerOut}
                    onClick={onClick}
                    scale={props.scale}>
                    <coneBufferGeometry attach="geometry" args={argst} />
                    <meshStandardMaterial attach="material" color={colort} transparent={true} opacity={0.5} />
                </a.mesh>
                {/* Area Tag */}
                <HTML scaleFactor={0.1}>
                    <div className="content">
                        {info[2]}
                    </div>
                </HTML>
            </mesh>
            {/* Hovering Area Case Info */}
            <HTML scaleFactor={0.5} position={casePos}>
                <div style={{ fontFamily: "Helvetica" }}>
                    {info[2]}<br />
                    {info[0]}/{info[1]}
                </div>
            </HTML>
        </>
    );
};
// Area View
const AMesh = ({ info, position, tagPos, rotation, color, args }) => {
    // Produce a fake load and wait for the data 
    usePromise(ms => new Promise(res => setTimeout(res, ms)), [1000]);
    // Control mesh movements
    const mesh = useRef();
    useFrame(({ clock }) => {
        mesh.current.rotation.y = clock.elapsedTime * 0.1;
        mesh.current.position.x = Math.cos(clock.elapsedTime) * 0.1;
        mesh.current.position.y = Math.sin(clock.elapsedTime) * 0.5;
    });
    return (
        <group>
            {/* New Case */}
            <mesh position={position} rotation={rotation}>
                <a.mesh ref={mesh}>
                    <coneBufferGeometry attach="geometry" args={args} />
                    <meshStandardMaterial attach="material" color={color} />
                </a.mesh>
            </mesh>
            {/* Number and Date */}
            <HTML scaleFactor={0.1} position={tagPos}>
                <div style={{
                    fontFamily: "Helvetica",
                    color: "#b9b9b9",
                    width: "150px"
                }}>
                    {info[0]}          <strong>{info[1]}</strong><strong>{info[2]}</strong>
                </div>
            </HTML>
        </group>
    );
};
// Area View - Title and Back Home
const Title = ({ mode, switchMode }) => {
    // Reference to control ball(Back Home) movements
    const ball = useRef();
    useFrame(({ clock }) => {
        ball.current.position.x += Math.cos(clock.elapsedTime * 2) * 0.01;
        ball.current.position.y += Math.sin(clock.elapsedTime) * 0.01;
        ball.current.position.z += Math.cos(clock.elapsedTime) * 0.05;
    });
    // Expand state (hovering)
    const [expand, setExpand] = useState(false);
    // Switch mode state (click)
    const [update, setUpdate] = useState(false);
    useMemo(() => {
        // Pass the mode decision to Data.js
        switchMode(update);
    }, [update, switchMode])
    // React spring expand animation
    const props = useSpring({
        scale: expand ? [2, 2, 2] : [1, 1, 1],
    });
    return (
        <group>
            <a.mesh
                position={[-72, -12, 5]}
                ref={ball}
                scale={props.scale}
                onPointerOver={() => setExpand(true)}
                onPointerOut={() => setExpand(false)}
                onClick={() => setUpdate(true)}>
                <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
                <meshPhongMaterial attach="material" color="#0d0d0d" />
            </a.mesh>
            <HTML scaleFactor={0.5} position={[-75, -15, 5]}>
                <div style={{ fontFamily: "Helvetica", textAlign: "left" }}>
                    {mode}
                </div>
            </HTML>
        </group>
    );
}

export { DualMesh, AMesh, Title };
