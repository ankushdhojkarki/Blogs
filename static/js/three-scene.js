// ============================================================================
// THREE.JS 3D INTERACTIVE SCENE - ENHANCED WITH VISIBLE EFFECTS
// ============================================================================

class InteractiveThreeScene {
  constructor(containerId = 'three-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn('[v0] Container not found');
      return;
    }

    // Check Three.js availability
    if (typeof THREE === 'undefined') {
      console.error('[v0] Three.js is not loaded');
      return;
    }

    this.initialized = false;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.objects = [];
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };
    this.scrollY = 0;

    this.init();
  }

  init() {
    try {
      // Scene setup
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0a0e27);
      this.scene.fog = new THREE.Fog(0x0a0e27, 400, 1000);

      // Camera setup
      this.setupCamera();

      // Renderer setup
      this.setupRenderer();

      // Create 3D elements
      this.createLights();
      this.createParticles();
      this.createFloatingObjects();
      this.createBackgroundGrid();

      // Event listeners
      this.setupEventListeners();

      // Start animation loop
      this.animate();

      this.initialized = true;
      console.log('[v0] 3D scene initialized successfully');
    } catch (error) {
      console.error('[v0] Error initializing scene:', error);
    }
  }

  setupCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspect = width / height;

    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
    this.camera.position.set(0, 0, 60);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: 'highp'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  createLights() {
    // Ambient light - soft global illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main point light - green accent
    const pointLight1 = new THREE.PointLight(0x64f4ac, 2);
    pointLight1.position.set(80, 80, 80);
    pointLight1.castShadow = true;
    this.scene.add(pointLight1);

    // Secondary point light - blue accent
    const pointLight2 = new THREE.PointLight(0x6366f1, 1.5);
    pointLight2.position.set(-80, -80, 80);
    this.scene.add(pointLight2);

    // Directional light for depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  createParticles() {
    // Create floating particle cloud
    const particleCount = window.innerWidth > 1024 ? 200 : window.innerWidth > 768 ? 120 : 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 300;
      positions[i + 1] = (Math.random() - 0.5) * 300;
      positions[i + 2] = (Math.random() - 0.5) * 300;

      velocities[i] = (Math.random() - 0.5) * 0.5;
      velocities[i + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i + 2] = (Math.random() - 0.5) * 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x64f4ac,
      size: 0.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
      fog: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.particles.userData = { velocities };
    this.scene.add(this.particles);
  }

  createFloatingObjects() {
    const geometries = [
      { geo: new THREE.IcosahedronGeometry(8, 3), color: 0x64f4ac },
      { geo: new THREE.OctahedronGeometry(8, 2), color: 0x6366f1 },
      { geo: new THREE.TetrahedronGeometry(8), color: 0xec4899 },
      { geo: new THREE.DodecahedronGeometry(6, 0), color: 0x0ea5e9 }
    ];

    geometries.forEach((item, idx) => {
      const material = new THREE.MeshPhongMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.3,
        wireframe: false,
        transparent: true,
        opacity: 0.85,
        shininess: 100
      });

      const mesh = new THREE.Mesh(item.geo, material);
      
      // Distribute objects in space
      const angle = (idx / geometries.length) * Math.PI * 2;
      const distance = 120;
      
      mesh.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance * 0.5,
        Math.sin(angle * 2) * distance * 0.3
      );

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.005
        },
        originalPosition: mesh.position.clone(),
        floatSpeed: Math.random() * 0.0015 + 0.0005
      };

      this.scene.add(mesh);
      this.objects.push(mesh);
    });
  }

  createBackgroundGrid() {
    // Create an animated grid background for depth
    const gridSize = 200;
    const gridDivisions = 10;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x444444, 0x222222);
    gridHelper.position.z = -50;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.1;
    this.scene.add(gridHelper);
  }

  setupEventListeners() {
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Scroll tracking
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });

    // Touchmove for mobile
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.targetMouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    });

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth mouse interpolation
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;

    // Update camera based on mouse movement
    this.camera.position.x = this.mouse.x * 40;
    this.camera.position.y = this.mouse.y * 40 - (this.scrollY * 0.01);
    this.camera.lookAt(0, 0, 0);

    // Update particles
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      const velocities = this.particles.userData.velocities;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Wrap around edges
        if (Math.abs(positions[i]) > 150) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 150) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 150) velocities[i + 2] *= -1;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
      this.particles.rotation.z += 0.0001;
      this.particles.rotation.x += 0.00005;
    }

    // Update floating objects
    this.objects.forEach((obj, idx) => {
      // Rotation
      obj.rotation.x += obj.userData.rotationSpeed.x;
      obj.rotation.y += obj.userData.rotationSpeed.y;
      obj.rotation.z += obj.userData.rotationSpeed.z;

      // Floating animation
      const time = Date.now() * obj.userData.floatSpeed;
      obj.position.y = obj.userData.originalPosition.y + Math.sin(time) * 15;
      obj.position.x = obj.userData.originalPosition.x + Math.cos(time * 0.5) * 10;
      obj.position.z = obj.userData.originalPosition.z + Math.sin(time * 0.7) * 8;

      // Pulse effect on scale
      const pulse = 0.95 + Math.sin(time * 2) * 0.05;
      obj.scale.set(pulse, pulse, pulse);
    });

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThreeScene);
} else {
  initThreeScene();
}

function initThreeScene() {
  const container = document.getElementById('three-container');
  if (container) {
    new InteractiveThreeScene('three-container');
  }
}
