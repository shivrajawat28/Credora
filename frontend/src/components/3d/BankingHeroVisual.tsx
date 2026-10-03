import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThemeMode } from '../../types/credit';

interface BankingHeroVisualProps {
  theme: ThemeMode;
  isEvaluating?: boolean;
}

export const BankingHeroVisual: React.FC<BankingHeroVisualProps> = ({
  theme,
  isEvaluating = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 380;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Metallic Financial Emblem / Card
    const cardGeo = new THREE.BoxGeometry(2.0, 1.25, 0.08);
    const cardMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x1e3a8a : 0x2563eb,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92,
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    group.add(cardMesh);

    // Card edge trim / chip
    const chipGeo = new THREE.BoxGeometry(0.38, 0.3, 0.09);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);
    chipMesh.position.set(-0.6, 0.2, 0.01);
    cardMesh.add(chipMesh);

    // 2. Outer Orbiting Gyroscope Rings (Risk Dimensions)
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.02, 16, 64), ringMat1);
    ring1.rotation.x = Math.PI / 4;
    group.add(ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.015, 16, 64), ringMat2);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 5;
    group.add(ring2);

    // 3. Subtle Data Points / Nodes
    const pointCount = 120;
    const pointGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount * 3; i += 3) {
      const radius = 1.6 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointMat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const points = new THREE.Points(pointGeo, pointMat);
    group.add(points);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.5);
    dirLight2.position.set(-4, -4, 3);
    scene.add(dirLight2);

    // Mouse Interaction
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetY = x * 0.45;
      targetX = -y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;
      const speed = isEvaluating ? 3.0 : 1.0;

      // Gentle floating and gyroscopic spin
      cardMesh.rotation.y = Math.sin(elapsed * 0.8 * speed) * 0.18 + (targetY * 0.6);
      cardMesh.rotation.x = Math.cos(elapsed * 0.6 * speed) * 0.12 + (targetX * 0.6);
      cardMesh.position.y = Math.sin(elapsed * 1.2) * 0.08;

      ring1.rotation.z += 0.003 * speed;
      ring2.rotation.y += 0.004 * speed;
      points.rotation.y = elapsed * 0.03 * speed;

      group.rotation.y += (targetY - group.rotation.y) * 0.05;
      group.rotation.x += (targetX - group.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      cardGeo.dispose();
      cardMat.dispose();
      chipGeo.dispose();
      chipMat.dispose();
      pointGeo.dispose();
      pointMat.dispose();
      renderer.dispose();
    };
  }, [theme, isDark, isEvaluating]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-1 text-center pointer-events-none">
        <span className="text-[11px] font-medium tracking-wider uppercase px-3 py-1 rounded-full border transition-colors shadow-sm bg-white/90 text-slate-700 border-slate-200 dark:bg-slate-900/90 dark:text-slate-300 dark:border-slate-700">
          {isEvaluating ? '⚡ Real-time TreeSHAP Inference' : 'Interactive ML Risk Engine'}
        </span>
      </div>
    </div>
  );
};
