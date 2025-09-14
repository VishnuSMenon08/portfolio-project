import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {SpaceStation, SpaceShip, DeepSpace, Launchpad, Globe} from './scene';
import {canvas, designLabBtn, engineCoreBtn, navConsoleBtn} from './vendor';


let sceneModels = {
  "spaceShip" : null,
  "spaceStation" : null,
  "spaceStation2" : null,
  "launchpad" : null,
  "globe" : null
}

window.addEventListener('resize', () => {
  screenSize.height = window.innerHeight;
  screenSize.width = window.innerWidth;
  camera.aspect = screenSize.width /screenSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(screenSize.width, screenSize.height);

});

// window.addEventListener('dblclick', () => {
//   const fullScreen = document.fullscreenElement;
//   fullScreen?document.exitFullscreen():canvas.requestFullscreen();
// })


window.addEventListener('dblclick', () => {
  fppControls.isLocked?fppControls.unlock():fppControls.lock();  // click to lock mouse
});


designLabBtn.addEventListener('click', () => {
    sceneModels.spaceShip.model.position.set(
    sceneModels.launchpad.model.position.x - 2,
    sceneModels.launchpad.model.position.y,
    sceneModels.launchpad.model.position.z - 4
  );

  sceneModels.spaceShip.model.rotation.y += 2;
});

engineCoreBtn.addEventListener('click', () => {
    sceneModels.spaceShip.model.position.set(
    sceneModels.spaceStation.model.position.x - 2,
    sceneModels.spaceStation.model.position.y,
    sceneModels.spaceStation.model.position.z + 3
  );

  sceneModels.spaceShip.model.rotation.y += 2;
});

navConsoleBtn.addEventListener('click', () => {
    sceneModels.spaceShip.model.position.set(
    sceneModels.spaceStation2.model.position.x - 5,
    sceneModels.spaceStation2.model.position.y,
    sceneModels.spaceStation2.model.position.z + 3
  );

  sceneModels.spaceShip.model.rotation.y += 2;
});


const screenSize = {
  height: window.innerHeight,
  width: window.innerWidth
}

const gltfLoader = new GLTFLoader();

//Function to load textures
const applyTextures = (model, textureMap) => {
  model.traverse((child) => {
    if (child.isMesh) {
      child.material.map = textureMap.colorMap;

      // add PBR maps:
      child.material.normalMap = textureMap.normalMap;
      child.material.roughnessMap = textureMap.roughnessMap;
      child.material.emissiveMap = textureMap.emissiveMap;

      child.material.needsUpdate = true;
    }
  });
}

// For each mesh that needs HTML
function attachHTMLToMesh(mesh, htmlContent) {
  const div = document.createElement('div');
  div.className = 'label';
  div.innerHTML = htmlContent;

  const label = new CSS2DObject(div);
  mesh.add(label); // attaches HTML to mesh
  return div;
}

function updateLabels(meshes, camera) {
  meshes.forEach((mesh) => {
    const screenPos = new THREE.Vector3();
    mesh.getWorldPosition(screenPos);

    const distance = camera.position.distanceTo(screenPos);
    const div = mesh.children.find(c => c.isCSS2DObject)?.element;

    if (div) {
      // Scale inversely with distance
      const scale = THREE.MathUtils.clamp(10 / distance , 0, 0.5);
      // div.style.transform = `scale(${scale})`;
      // div.style.zoom = scale;

      // Fade in when closer than X
      const opacity = THREE.MathUtils.clamp(1 - distance / 10, 0, 0.5);
      div.style.opacity = opacity;
    }
  });
}

// CREATE Scene
const scene = new THREE.Scene()

// Create renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(screenSize.width, screenSize.height);
renderer.setPixelRatio(window.devicePixelRatio);

// Create Label renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

//create camera
const camera = new THREE.PerspectiveCamera(45, screenSize.width/screenSize.height, 0.1, 100);
camera.position.set(-2, 2, 20)

// Add Light
const ambientLight = new THREE.AmbientLight("#faba66", 5);
scene.add(ambientLight);

//create movement controls
const fppControls = new PointerLockControls(camera, canvas);
const keys = {
  "w" : false,
  "a" : false,
  "s" : false,
  "d" : false
};

const speed = 0.1; // movement speed
window.addEventListener('keydown', (e) => { 
  if (keys[e.key] !== undefined){
    keys[e.key] = true;
  }    
  });
window.addEventListener('keyup', (e) => { 
  if (keys[e.key] !== undefined) {
    keys[e.key] = false;
  }
});

// LOAD MODELS

const textureLoader =  new THREE.TextureLoader();
// add labels

sceneModels.spaceShip = new SpaceShip(gltfLoader, textureLoader);
await sceneModels.spaceShip.loadAndInitialize(scene);

sceneModels.spaceStation = new SpaceStation(gltfLoader);
sceneModels.spaceStation.loadAndInitialize(scene);

sceneModels.spaceStation2 = new DeepSpace(gltfLoader);
sceneModels.spaceStation2.loadAndInitialize(scene);

sceneModels.launchpad = new Launchpad(gltfLoader);
sceneModels.launchpad.loadAndInitialize(scene);

sceneModels.globe = new Globe(gltfLoader);
sceneModels.globe.loadAndInitialize(scene);


// Camera orbit state
let yaw = 0;
let pitch = 0;
const sensitivity = 0.002;
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement) {
    yaw -= e.movementX * sensitivity;
    pitch += e.movementY * sensitivity;
    pitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, pitch)); // clamp vertical
  }
});

const cameraOffset = new THREE.Vector3(0, 3, -6);
const clock = new THREE.Clock();

function animate(time){
  const ellpasedTime = clock.getElapsedTime();
  sceneModels.spaceStation.playAnimationLoop();
  sceneModels.spaceStation2.playAnimationLoop();
  sceneModels.globe.playAnimationLoop();
  sceneModels.launchpad.playCustomAnimations(ellpasedTime);
  sceneModels.globe.playCustomAnimations(ellpasedTime);

  if (sceneModels.spaceShip.model) {
    // === Camera Orbit ===
    const rotation = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
    const offset = cameraOffset.clone().applyQuaternion(rotation);
    const targetCamPos = sceneModels.spaceShip.model.position.clone().add(offset);

    // Smooth follow
    camera.position.lerp(targetCamPos, 0.1);
    // camera.rotation.lerp(targetCamPos, 0.1)
    camera.lookAt(sceneModels.spaceShip.model.position.clone().add(new THREE.Vector3(0, 1.5, 0)));

    // === Player Movement ===
    let moveDir = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(rotation);
    forward.y = 0; forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0,1,0)).normalize();

    if (keys.w) moveDir.sub(forward);
    if (keys.s) moveDir.add(forward);
    if (keys.a) moveDir.add(right);
    if (keys.d) moveDir.sub(right);

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize().multiplyScalar(speed);
      sceneModels.spaceShip.model.position.add(moveDir);

      // Rotate player toward move direction
      const targetRot = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        moveDir.clone().normalize()
      );
      sceneModels.spaceShip.model.quaternion.slerp(targetRot, 0.2); // smooth rotation
    }
  }

  renderer.render(scene, camera);
  // updateLabels(labelMeshes, camera);
  sceneModels.spaceStation.updateLabels(camera);
  labelRenderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();