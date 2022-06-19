import React from "react";
// import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
// import { Physics } from "@react-three/cannon";
// import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import RegistrationModel from "./registrationModel";

// const camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.y = 5;
// camera.position.z = 5;
// camera.position.x = 0;


export default function DrawCanvas(props) {
  // console.log(props)
  return <Canvas>
    <OrbitControls />
    <pointLight visible={true} intensity={1} />
    <RegistrationModel />
  </Canvas>;

}