import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RegistrationModel from "./registrationModel";

export default function DrawCanvas() {
  return <Canvas>
    <OrbitControls />
    <pointLight visible={true} intensity={1} />
    <RegistrationModel />
  </Canvas>;

}