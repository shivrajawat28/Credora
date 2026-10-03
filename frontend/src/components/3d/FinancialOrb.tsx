import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FinancialOrbProps {
  score?: number;
  isEvaluating?: boolean;
}

export const FinancialOrb: React.FC<FinancialOrbProps> = ({ isEvaluating = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all rotating elements
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Inner Glowing Icosahedron (Credit Core)
    const icoGeometry = new THREE.IcosahedronGeometry(1.3, 2);
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    coreGroup.add(icosahedron);

    // 2. Central Energy Sphere
    const sphereGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(innerSphere);

    // 3. Concentric Orbiting Rings (Credit Factors)
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.015, 16, 64), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.012, 16, 64), ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 4. Floating Particles (Data Cloud)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x10b981, 2, 50);
    pointLight2.position.set(-4, -4, 2);
    scene.add(pointLight2);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.5;
      targetRotationX = -mouseY * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;
      const speedMultiplier = isEvaluating ? 2.5 : 1.0;

      // Base rotations
      icosahedron.rotation.x += 0.003 * speedMultiplier;
      icosahedron.rotation.y += 0.005 * speedMultiplier;

      ring1.rotation.z += 0.004 * speedMultiplier;
      ring2.rotation.x += 0.006 * speedMultiplier;
      particles.rotation.y = elapsedTime * 0.04 * speedMultiplier;

      // Pulse inner sphere
      const pulse = 0.85 + Math.sin(elapsedTime * 2) * 0.04;
      innerSphere.scale.set(pulse, pulse, pulse);

      // Smooth inertia towards mouse target
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      icoGeometry.dispose();
      icoMaterial.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [isEvaluating]);

  return (
    <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute -bottom-2 text-center pointer-events-none">
        <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400/70 bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-md">
          {isEvaluating ? '⚡ Running TreeSHAP Inference...' : 'Interactive Financial Intelligence Core'}
        </span>
      </div>
    </div>
  );
};
