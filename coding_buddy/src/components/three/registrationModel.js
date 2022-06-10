import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.y = 5;
// camera.position.z = 5;
// camera.position.x = 0;

// const filePath = './resources/scene.gltf'; // 테스트
const filePath = './resources/coding_buddy.glb';

export default function RegistrationModel() {

  let mixer;
  let animate;
  const [model, setModel] = useState();
  useEffect(() => {
    new GLTFLoader().load(filePath, gltf => {
      console.log(gltf);
      const scale = gltf.scene.scale;
      gltf.scene.traverse(child => {
        child.castShadow = true;
      });
      scale.set(0.9, 0.9, 0.9);
      mixer = new THREE.AnimationMixer(gltf.scene);
      const clips = gltf.animations;
      const clip1 = THREE.AnimationClip.findByName(clips, "Text.001Action")
      const clip2 = THREE.AnimationClip.findByName(clips, "ArmatureAction")
      
      const action1 = mixer.clipAction(clip1)
      const action2 = mixer.clipAction(clip2)
      console.log(mixer);
      setModel(gltf);
      scene.add(gltf.scene);
      animate = () => {
        mixer.update(clock.getDelta());
        requestAnimationFrame(animate);
      }
      // animation faster
      // mixer.timeScale = "2"
      // animation stop loop
      action1.setLoop(THREE.LoopOnce)
      action2.setLoop(THREE.LoopOnce)
      // animation stop at last frame
      action1.clampWhenFinished = true;
      action2.clampWhenFinished = true;
      action2.play()
      action1.play()
      // animate();

    }, () => {
      // 아직 모델을 받아오지 못했을 경우(로딩중)
      console.log("model loading...");
    });

    const light = new THREE.DirectionalLight(0x000000, 0, 0);
    light.position.set(0, 0, 0);
    scene.add(light);
    const clock = new THREE.Clock();

    document.addEventListener("click", () => {
      animate()
    })

  }, []);

  return model ? <primitive object={model.scene} /> : null;
}