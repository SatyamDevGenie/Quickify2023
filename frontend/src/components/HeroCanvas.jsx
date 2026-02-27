import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const containerRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.Fog(0xf1f5f9, 12, 28);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(4, 8, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    scene.add(dirLight);

    const ambient = new THREE.AmbientLight(0x94a3b8, 0.5);
    scene.add(ambient);

    const fill = new THREE.HemisphereLight(0xe2e8f0, 0x0d9488, 0.4);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    const tealMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      metalness: 0.35,
      roughness: 0.35,
      castShadow: true,
      receiveShadow: true,
    });
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.25,
      roughness: 0.4,
      castShadow: true,
      receiveShadow: true,
    });
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });

    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const sphere = new THREE.Mesh(sphereGeo, tealMat);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.y = 0.2;
    group.add(sphere);

    const ringGeo = new THREE.RingGeometry(1.4, 1.8, 64);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    group.add(ring);

    const torusGeo = new THREE.TorusGeometry(0.5, 0.08, 24, 48);
    const torus = new THREE.Mesh(torusGeo, cyanMat);
    torus.position.set(1.2, 0.6, 0.3);
    torus.castShadow = true;
    group.add(torus);

    const torus2 = new THREE.Mesh(torusGeo, tealMat);
    torus2.position.set(-1, -0.3, 0.5);
    torus2.scale.setScalar(0.7);
    torus2.castShadow = true;
    group.add(torus2);

    const boxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const box = new THREE.Mesh(boxGeo, cyanMat);
    box.position.set(-0.8, 0.9, -0.2);
    box.rotation.y = 0.5;
    box.castShadow = true;
    group.add(box);

    const particlesGeo = new THREE.BufferGeometry();
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 6;
      pos[i + 1] = (Math.random() - 0.5) * 4;
      pos[i + 2] = (Math.random() - 0.5) * 4;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x14b8a6,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    group.add(particles);

    const meshes = [sphere, ring, torus, torus2, box, particles];

    function onResize() {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 320;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }

    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      group.rotation.y = t * 0.25;

      sphere.position.y = 0.2 + Math.sin(t * 1.2) * 0.08;
      sphere.rotation.y = t * 0.15;

      ring.rotation.z = t * 0.2;
      ring.material.opacity = 0.4 + Math.sin(t * 0.8) * 0.15;

      torus.rotation.x = t * 0.3;
      torus.rotation.y = t * 0.2;
      torus.position.y = 0.6 + Math.sin(t * 1 + 1) * 0.1;

      torus2.rotation.x = t * 0.2;
      torus2.rotation.z = t * 0.25;
      torus2.position.y = -0.3 + Math.sin(t * 0.9 + 2) * 0.08;

      box.rotation.x = t * 0.15;
      box.rotation.y = 0.5 + t * 0.2;
      box.position.y = 0.9 + Math.sin(t * 1.1 + 3) * 0.06;

      particles.rotation.y = t * 0.1;
      particles.rotation.x = Math.sin(t * 0.5) * 0.05;

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', onResize);
      [sphereGeo, ringGeo, torusGeo, boxGeo, particlesGeo].forEach((g) => g?.dispose());
      [tealMat, cyanMat, ringMat, particlesMat].forEach((m) => m?.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl"
    />
  );
}
