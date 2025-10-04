import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("blackhole").appendChild(renderer.domElement); // trocando para plotar onde eu quiser

// Cena e câmera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 2.5, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Estrelas
function createStars() {
  const geo = new THREE.BufferGeometry();
  const count = 12000;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 400 + Math.random() * 600;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
  return new THREE.Points(geo, mat);
}
scene.add(createStars());

// Pós-processamento
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Shader de Lente Gravitacional
const GravityShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    center: { value: new THREE.Vector2(0.5,0.5) },
    strength: { value: 0.08 } // intensidade da distorção
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
  `,
  /* Distorcendo o buraco negro, melhor sem
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform vec2 center;
    uniform float strength;
    varying vec2 vUv;
    void main(){
      vec2 d = vUv - center;
      float r = length(d);
      float warp = strength / (r*r + 0.02);
      vec2 uv = vUv - normalize(d) * warp * 0.2;
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `
  */
  fragmentShader: `
  uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform vec2 center;
uniform float strength;
varying vec2 vUv;

void main(){
  // deslocamento relativo ao centro
  vec2 d = vUv - center;

  // corrigir proporção da tela
  d.x *= resolution.x / resolution.y;

  // raio normalizado
  float r = length(d);

  // intensidade da curvatura
  float warp = strength / (r*r + 0.02);

  // aplicar distorção no UV
  vec2 uv = vUv - normalize(d) * warp * 0.2;

  gl_FragColor = texture2D(tDiffuse, uv);
}
 `
};
composer.addPass(new ShaderPass(GravityShader));

// Bloom
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.4, 0.9, 0.1));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2,  // intensidade
  0.4,  // raio
  0.85  // limiar
);
// Buraco negro (disco de acreção animado)
const diskGeometry = new THREE.RingGeometry(2.0, 6.0, 512);
const diskMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    time: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float time;

    float noise(vec2 p){
      return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453);
    }

    void main(){
      float r = vUv.x * 8.0;
      float angle = vUv.y * 6.283;
      float n = noise(vec2(r*2.0, angle*5.0 + time*0.5));

      float intensity = smoothstep(2.0,6.0,r) * (0.5+n*1.5);
      vec3 col = mix(vec3(1.0,0.8,0.4), vec3(1.0,0.5,0.1), n);
      col *= 2.0 / (r*0.3);

      gl_FragColor = vec4(col*intensity, intensity);
    }
  `
});

// --- Cauda de gás (partículas sugadas) ---

// Criar geometria para as partículas
const tailParticles = new THREE.BufferGeometry();
const particleCount = 2000;

const positions = new Float32Array(particleCount * 3);
const speeds = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  let angle = Math.random() * Math.PI * 2;
  let radius = 3.0 + Math.random() * 5.0; // distância inicial
  let height = (Math.random() - 0.5) * 2.0; // pequena variação vertical

  positions[i * 3] = Math.cos(angle) * radius;
  positions[i * 3 + 1] = height;
  positions[i * 3 + 2] = Math.sin(angle) * radius;

  speeds[i] = 0.002 + Math.random() * 0.003; // velocidade de queda
}

tailParticles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
tailParticles.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));

// Material brilhante para as partículas
const tailMaterial = new THREE.PointsMaterial({
  color: 0xffaa55,
  size: 0.05,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// Criar sistema de partículas
const gasTail = new THREE.Points(tailParticles, tailMaterial);
scene.add(gasTail);

// --- Animação das partículas ---
function updateGasTail() {
  const pos = tailParticles.attributes.position.array;
  const spd = tailParticles.attributes.speed.array;

  for (let i = 0; i < particleCount; i++) {
    let x = pos[i * 3];
    let y = pos[i * 3 + 1];
    let z = pos[i * 3 + 2];

    let dx = -x;
    let dz = -z;
    let dist = Math.sqrt(dx * dx + dz * dz);

    // força de atração (mais perto = mais rápido)
    let pull = spd[i] * (3.0 / (dist + 0.5));

    // mover levemente em espiral
    let angle = Math.atan2(z, x) + 0.05 * spd[i];
    let radius = dist - pull;

    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 2] = Math.sin(angle) * radius;
    pos[i * 3 + 1] += (0 - y) * 0.01; // "puxando" para o plano do buraco negro

    // reinicia partícula se cair no centro
    if (dist < 0.3) {
      let newAngle = Math.random() * Math.PI * 2;
      let newRadius = 3.0 + Math.random() * 5.0;
      pos[i * 3] = Math.cos(newAngle) * newRadius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      pos[i * 3 + 2] = Math.sin(newAngle) * newRadius;
    }
  }

  tailParticles.attributes.position.needsUpdate = true;
}
const disk = new THREE.Mesh(diskGeometry, diskMaterial);
disk.rotation.x = Math.PI / 2;
scene.add(disk);

// Loop
const clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  disk.material.uniforms.time.value = clock.getElapsedTime();
  updateGasTail();
  controls.update();
  composer.render();
  
}
animate();

// Resize
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});