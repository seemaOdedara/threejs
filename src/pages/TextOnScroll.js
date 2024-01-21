// import * as THREE from "three";
// import { Canvas } from "@react-three/fiber";
// import { Preload } from "@react-three/drei";
// import { ScrollControls, Scroll } from "../ScrollControls.tsx";

// function Background() {
//   const texture = new THREE.TextureLoader().load("cc.jpg");
//   return (
//     <mesh>
//       <planeGeometry args={[16, 8]} />
//       <meshBasicMaterial map={texture} />
//     </mesh>
//   );
// }

// export default function TextOnScroll() {
//   return (
//     <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
//       <Background />
//       <ScrollControls
//         infinite
//         horizontal={false}
//         damping={4}
//         pages={4}
//         distance={1}
//       >
//         <Scroll html>
//           <div
//             style={{
//               position: "absolute",
//               left: "10",
//               top: "120vh",
//               transform: "translateY(-100vh)",
//             }}
//           >
//             <h1
//               style={{
//                 color: "white",
//               }}
//             >
//               Hello
//             </h1>
//           </div>
//           <div
//             style={{
//               position: "absolute",
//               top: "220vh",
//               left: "50",
//               transform: "translateY(-100vh)",
//             }}
//           >
//             <h1 style={{ color: "white" }}>Three.js</h1>
//           </div>
//           <div
//             style={{
//               position: "absolute",
//               top: "320vh",
//               left: "0",
//               transform: "translateY(-100vh)",
//             }}
//           >
//             <h1 style={{ color: "white" }}>In</h1>
//           </div>
//           <div
//             style={{
//               position: "absolute",
//               top: "420vh",
//               left: "0",
//               transform: "translateY(-100vh)",
//             }}
//           >
//             <h1 style={{ color: "white" }}>Progress</h1>
//           </div>
//         </Scroll>
//       </ScrollControls>
//       <Preload />
//     </Canvas>
//   );
// }




import * as THREE from 'three';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, Image as ImageImpl } from '@react-three/drei';
import { ScrollControls, Scroll, useScroll } from '../ScrollControls.tsx';

export default function App() {
  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ScrollControls infinite vertical damping={4} pages={4} distance={1}>
          <Scroll html>
            <h1 style={{ position: 'absolute', top: '-75vh', left: '20vw' }}>home</h1>
            <h1 style={{ position: 'absolute', top: '25vh', left: '20vw' }}>to</h1>
            <h1 style={{ position: 'absolute', top: '125vh', left: '20vw' }}>be</h1>
            <h1 style={{ position: 'absolute', top: '225vh', left: '20vw' }}>home</h1>
            <h1 style={{ position: 'absolute', top: '325vh', left: '20vw' }}>to</h1>
            <h1 style={{ position: 'absolute', top: '425vh', left: '20vw' }}>be</h1>
          </Scroll>
        </ScrollControls>
        {/* <Preload /> */}
      </Suspense>
    </Canvas>
  );
}
