import React, { useEffect, useState } from "react";
import { useGLTF, Center } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Mapping giữa tên mesh trong model và tên API endpoint
const bodyPartMapping = {
  ChestMesh: "chest",
  BackMesh: "back",
  LeftArmMesh: "upper arms",
  RightArmMesh: "upper arms",
  LeftLegMesh: "upper legs",
  RightLegMesh: "upper legs",
  AbsMesh: "waist",
  ShouldersMesh: "shoulders",
  // Thêm các mapping khác ở đây
};

export function HumanModel({ onBodyPartClick }) {
  const { scene } = useGLTF("/human_model.glb");
  const { camera } = useThree();
  const [hoveredPart, setHoveredPart] = useState(null);

  // Lưu trữ materials gốc để có thể reset
  const originalMaterials = new Map();

  useEffect(() => {
    // Khởi tạo materials
    scene.traverse((object) => {
      if (object.isMesh && bodyPartMapping[object.name]) {
        // Lưu material gốc
        originalMaterials.set(object.name, object.material.clone());

        // Tạo material cho hover state
        const hoverMaterial = object.material.clone();
        hoverMaterial.color = new THREE.Color(0x9f7aea); // purple-500
        hoverMaterial.emissive = new THREE.Color(0x6b46c1); // purple-700
        hoverMaterial.emissiveIntensity = 0.3;
        object.hoverMaterial = hoverMaterial;

        // Thêm properties cho raycasting
        object.isInteractive = true;
      }
    });

    return () => {
      // Cleanup
      originalMaterials.forEach((material) => material.dispose());
      scene.traverse((object) => {
        if (object.hoverMaterial) {
          object.hoverMaterial.dispose();
        }
      });
    };
  }, [scene]);

  // Handle hover
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isInteractive) {
        if (object.name === hoveredPart) {
          object.material = object.hoverMaterial;
        } else {
          object.material = originalMaterials.get(object.name);
        }
      }
    });
  }, [hoveredPart, scene]);

  const handlePointerOver = (event) => {
    event.stopPropagation();
    const mesh = event.object;
    if (mesh.isInteractive) {
      setHoveredPart(mesh.name);
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = (event) => {
    setHoveredPart(null);
    document.body.style.cursor = "default";
  };

  const handleClick = (event) => {
    event.stopPropagation();
    const mesh = event.object;
    if (mesh.isInteractive && bodyPartMapping[mesh.name]) {
      // Camera animation to clicked part
      const targetPosition = new THREE.Vector3();
      mesh.getWorldPosition(targetPosition);
      const distance = mesh.geometry.boundingSphere.radius * 3;
      const offset = new THREE.Vector3(distance, 0, distance);
      camera.position.copy(targetPosition.clone().add(offset));
      camera.lookAt(targetPosition);

      // Callback với body part name
      onBodyPartClick(bodyPartMapping[mesh.name]);
    }
  };

  return (
    <Center>
      <primitive 
        object={scene} 
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </Center>
  );
}