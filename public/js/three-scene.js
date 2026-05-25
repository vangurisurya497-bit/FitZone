// FitZone 3D Dumbbell Scene using Three.js

(function () {
  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  let scene, camera, renderer, dumbbellGroup, ringMesh;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  function init() {
    // 1. Create Scene
    scene = new THREE.Scene();

    // 2. Set up Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Primary Electric Blue Light (creates beautiful specular highlights)
    const blueLight = new THREE.PointLight(0x00D4FF, 5, 15);
    blueLight.position.set(2, 3, 3);
    scene.add(blueLight);

    // Accent Fire Red Light from bottom
    const redLight = new THREE.PointLight(0xFF3D00, 3, 10);
    redLight.position.set(-2, -3, -1);
    scene.add(redLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, 5, 5);
    scene.add(dirLight);

    // 5. Create Dumbbell Group
    dumbbellGroup = new THREE.Group();

    // Materials
    // Matte dark chrome steel
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x181818,
      metalness: 0.95,
      roughness: 0.15,
      bumpScale: 0.05
    });

    // Glowing Neon Blue trim material
    const glowBlueMaterial = new THREE.MeshStandardMaterial({
      color: 0x00D4FF,
      emissive: 0x00D4FF,
      emissiveIntensity: 1.5,
      roughness: 0.1
    });

    // Handle (Central Bar)
    const handleGeom = new THREE.CylinderGeometry(0.12, 0.12, 2.8, 32);
    const handle = new THREE.Mesh(handleGeom, metalMaterial);
    handle.rotation.z = Math.PI / 2; // Lie flat horizontally
    dumbbellGroup.add(handle);

    // Grip texture rings (adds realism)
    for (let i = -0.8; i <= 0.8; i += 0.2) {
      if (Math.abs(i) < 0.1) continue;
      const gripRingGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.05, 32);
      const gripRing = new THREE.Mesh(gripRingGeom, metalMaterial);
      gripRing.position.x = i;
      gripRing.rotation.z = Math.PI / 2;
      dumbbellGroup.add(gripRing);
    }

    // Inner stops (stops weights sliding)
    const stopGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32);
    const leftStop = new THREE.Mesh(stopGeom, metalMaterial);
    leftStop.position.x = -1.0;
    leftStop.rotation.z = Math.PI / 2;
    dumbbellGroup.add(leftStop);

    const rightStop = leftStop.clone();
    rightStop.position.x = 1.0;
    dumbbellGroup.add(rightStop);

    // Heavy weight plates (Left Side)
    const plateGeom1 = new THREE.CylinderGeometry(0.85, 0.85, 0.35, 32);
    const leftPlate1 = new THREE.Mesh(plateGeom1, metalMaterial);
    leftPlate1.position.x = -1.25;
    leftPlate1.rotation.z = Math.PI / 2;
    dumbbellGroup.add(leftPlate1);

    const plateGeom2 = new THREE.CylinderGeometry(0.7, 0.7, 0.3, 32);
    const leftPlate2 = new THREE.Mesh(plateGeom2, metalMaterial);
    leftPlate2.position.x = -1.6;
    leftPlate2.rotation.z = Math.PI / 2;
    dumbbellGroup.add(leftPlate2);

    // Heavy weight plates (Right Side)
    const rightPlate1 = leftPlate1.clone();
    rightPlate1.position.x = 1.25;
    dumbbellGroup.add(rightPlate1);

    const rightPlate2 = leftPlate2.clone();
    rightPlate2.position.x = 1.6;
    dumbbellGroup.add(rightPlate2);

    // Glowing Neon Ring Accents inside the outer weights
    const glowRingGeom = new THREE.TorusGeometry(0.68, 0.03, 8, 32);
    
    const leftGlowRing = new THREE.Mesh(glowRingGeom, glowBlueMaterial);
    leftGlowRing.position.x = -1.43;
    leftGlowRing.rotation.y = Math.PI / 2;
    dumbbellGroup.add(leftGlowRing);

    const rightGlowRing = leftGlowRing.clone();
    rightGlowRing.position.x = 1.43;
    dumbbellGroup.add(rightGlowRing);

    // Hex end caps
    const capGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 6);
    const leftCap = new THREE.Mesh(capGeom, metalMaterial);
    leftCap.position.x = -1.8;
    leftCap.rotation.z = Math.PI / 2;
    dumbbellGroup.add(leftCap);

    const rightCap = leftCap.clone();
    rightCap.position.x = 1.8;
    dumbbellGroup.add(rightCap);

    // Add dumbbell group to scene
    dumbbellGroup.rotation.x = 0.4;
    dumbbellGroup.rotation.y = 0.5;
    scene.add(dumbbellGroup);

    // 6. Glowing Orbital Rings
    const orbitRingGeom = new THREE.TorusGeometry(2.3, 0.02, 8, 100);
    const glowRedMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF3D00,
      transparent: true,
      opacity: 0.5
    });
    ringMesh = new THREE.Mesh(orbitRingGeom, glowRedMaterial);
    ringMesh.rotation.x = Math.PI / 2.5;
    scene.add(ringMesh);

    // 7. Mouse Listeners
    window.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
  }

  function onDocumentMouseMove(event) {
    // Get mouse positions relative to center of screen
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
  }

  function onWindowResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth inertia mouse tracking
    targetX = mouseX * 0.15;
    targetY = mouseY * 0.15;

    if (dumbbellGroup) {
      // Idle rotation
      dumbbellGroup.rotation.y += 0.006;
      dumbbellGroup.rotation.z += 0.003;

      // Mouse control tilt
      dumbbellGroup.rotation.x += (targetY - dumbbellGroup.rotation.x) * 0.05;
      dumbbellGroup.rotation.z += (targetX - dumbbellGroup.rotation.z) * 0.05;
    }

    if (ringMesh) {
      ringMesh.rotation.z -= 0.002;
    }

    renderer.render(scene, camera);
  }

  // Run
  init();
  animate();
})();
