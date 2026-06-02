// ============================================================================
// THREE.JS 3D SCENE - HERO BACKGROUND
// ============================================================================

class ThreeScene {
  constructor(containerId = 'three-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };

    this.init();
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createParticles();
    this.createGeometries();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
      console.error('[v0] Three.js is not loaded. Please include the CDN script.');
      return;
    }
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e27);
    this.scene.fog = new THREE.Fog(0x0a0e27, 100, 1000);
  }

  createCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 50;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  createParticles() {
    const particleCount = window.innerWidth > 768 ? 100 : 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x64f4ac,
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  createGeometries() {
    // Create floating geometric shapes
    const geometries = [
      new THREE.IcosahedronGeometry(2, 4),
      new THREE.TetrahedronGeometry(2),
      new THREE.OctahedronGeometry(2)
    ];

    geometries.forEach((geom, idx) => {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.3 + idx * 0.1, 0.8, 0.5),
        emissive: new THREE.Color().setHSL(0.3 + idx * 0.1, 0.8, 0.3),
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });

      const mesh = new THREE.Mesh(geom, material);
      mesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        }
      };

      this.scene.add(mesh);
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x64f4ac, 1);
    pointLight.position.set(50, 50, 50);
    this.scene.add(pointLight);
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Scroll interaction
    window.addEventListener('scroll', () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      this.particleSystem.rotation.z += scrollPercent * 0.01;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth mouse follow
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Update camera based on mouse
    this.camera.position.x = this.mouse.x * 20;
    this.camera.position.y = this.mouse.y * 20;
    this.camera.lookAt(this.scene.position);

    // Rotate particles
    if (this.particleSystem) {
      this.particleSystem.rotation.x += 0.0001;
      this.particleSystem.rotation.y += 0.0003;
    }

    // Rotate geometries
    this.scene.children.forEach(child => {
      if (child.userData && child.userData.rotationSpeed) {
        child.rotation.x += child.userData.rotationSpeed.x;
        child.rotation.y += child.userData.rotationSpeed.y;
        child.rotation.z += child.userData.rotationSpeed.z;

        // Subtle floating animation
        child.position.y += Math.sin(Date.now() * 0.001 + child.position.x) * 0.001;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on home page or pages with 3D container
  const container = document.getElementById('three-container');
  if (container) {
    new ThreeScene('three-container');
    console.log('[v0] Three.js scene initialized');
  }
});
