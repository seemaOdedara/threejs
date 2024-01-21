import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Preload,
  Image as ImageImpl,
  Environment,
  Float,
  Sparkles,
} from "@react-three/drei";

import { Butterfly } from "./pages/Buttlerfly.jsx";
import { Scroll, ScrollControls } from "./ScrollControls.tsx";

export default function TextOnScroll() {
  return (
    <Canvas>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={2} />
      <Environment preset="warehouse" />
      <ScrollControls
        infinite
        vertical
        damping={4}
        pages={4}
        distance={1}
      >
        <Scroll>
          <Float
            speed={1}
            rotationIntensity={2}
            floatIntensity={0.2}
            floatingRange={[1, 1]}
          >
            <Butterfly scale={0.05} position={[-10, -3, -6]} />
            <Butterfly scale={0.05} position={[0, -2.5, 0]} />
            <Butterfly scale={0.05} position={[10, -4, -10]} />
          </Float>

          <Float
            speed={1}
            rotationIntensity={2}
            floatIntensity={0.2}
            floatingRange={[1, 1]}
          >
            <Butterfly scale={0.05} position={[-1, -12.5, 0]} />
            <Butterfly scale={0.05} position={[12, -14, -10]} />
          </Float>

          <Float
            speed={1} // Animation speed, defaults to 1
            rotationIntensity={2} // XYZ rotation intensity, defaults to 1
            floatIntensity={0.2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
            floatingRange={[1, 1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
          >
            <Butterfly scale={0.05} position={[-3, -19.5, 2]} />
            <Butterfly scale={0.05} position={[8, -23, -10]} />
            <Butterfly scale={0.05} position={[4, -24, 2]} />
          </Float>
          <Sparkles
            noise={0}
            count={500}
            speed={0.01}
            size={0.6}
            color={"#FFD2BE"}
            opacity={10}
            scale={[20, 100, 20]}
          ></Sparkles>
          <Sparkles
            noise={0}
            count={50}
            speed={0.01}
            size={10}
            color={"#FFF"}
            opacity={2}
            scale={[30, 100, 10]}
          ></Sparkles>
        </Scroll>
      </ScrollControls>
      <Preload />
    </Canvas>
  );
}
