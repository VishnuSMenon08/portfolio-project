import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {SpaceStation, SpaceShip, DeepSpace, Launchpad, Globe} from './scene';
import {canvas, designLabBtn, engineCoreBtn, navConsoleBtn, fuelBar, fuelTank, warningBar} from './vendor';
import {LabelHandler} from './labels'
import { engineCoreHtml, NavConsoleHtml, designLabHtml } from './content';
import { AudioMixer } from './audioMixer';


let sceneModels = {
  "spaceShip" : null,
  "spaceStation" : null,
  "spaceStation2" : null,
  "launchpad" : null,
  "globe" : null
}

let sceneLabels = {
  "engineCore" : null,
  "designLab" : null,
  "navConsole" : null
}

let sceneAudios = {
  "space" : null,
  "engineCore" : null,
  "designLab" : null,
  "navConsole" : null,
  "warning" : null,
  "fuelPump" : null
}

let refuelling = false;

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

const refuelShip = async () => {
  fuelTank.innerHTML = "Refueling..."
  refuelling = true;
  while(fuel <= 100){
      let i = 1;
      fuel += i;
      fuelBar.style.width = `${fuel}%`;
      await new Promise(r => setTimeout(r, 100));
    }
  fuelTank.innerHTML = "FUEL";
  refuelling = false;
}

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

// CREATE Scene
const scene = new THREE.Scene()

// Create renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(screenSize.width, screenSize.height);
renderer.setPixelRatio(window.devicePixelRatio);

//create camera
const camera = new THREE.PerspectiveCamera(45, screenSize.width/screenSize.height, 0.1, 100);
camera.position.set(-2, 2, 20)

// Create Label renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

// Add Labels
sceneLabels.engineCore = new LabelHandler(labelRenderer, engineCoreHtml);
sceneLabels.engineCore.attachHtml(scene, [-9, -3.3, -20]);

sceneLabels.designLab = new LabelHandler(labelRenderer, designLabHtml);
sceneLabels.designLab.attachHtml(scene, [12, -3, 1]);

sceneLabels.navConsole = new LabelHandler(labelRenderer, NavConsoleHtml);
sceneLabels.navConsole.attachHtml(scene, [-15, -3, -45]);

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

let speed = 0.1; // movement speed
let accelaration = 0;
fuelBar.style.width = "100%";
let fuel = 100;
window.addEventListener('keydown', (e) => { 
  if (keys[e.key] !== undefined && fuel > 0 && !refuelling){
    keys[e.key] = true;
    accelaration = 0.001;
    fuel -= 2;
    fuelBar.style.width = `${fuel}%`;
  }
  });

window.addEventListener('keyup', (e) => { 
  if (keys[e.key] !== undefined) {
    keys[e.key] = false;
    accelaration = 0;
    speed = 0.1;
  }
});

// LOAD MODELS
const gltfLoader = new GLTFLoader();
const textureLoader =  new THREE.TextureLoader();

sceneModels.spaceShip = new SpaceShip(gltfLoader, textureLoader);
await sceneModels.spaceShip.loadAndInitialize(scene);

sceneModels.spaceStation = new SpaceStation(gltfLoader);
await sceneModels.spaceStation.loadAndInitialize(scene);

sceneModels.spaceStation2 = new DeepSpace(gltfLoader);
sceneModels.spaceStation2.loadAndInitialize(scene);

sceneModels.launchpad = new Launchpad(gltfLoader);
sceneModels.launchpad.loadAndInitialize(scene);

sceneModels.globe = new Globe(gltfLoader);
sceneModels.globe.loadAndInitialize(scene);

//LOAD AUDIO EFFECTS
const listner = new THREE.AudioListener();
camera.add(listner);
sceneAudios.space = new AudioMixer(listner);
sceneAudios.space.loadSoundFx("./audio/space_bgm.mp3");

sceneAudios.warning = new AudioMixer(listner);
sceneAudios.warning.registerSFX("./audio/warning.mp3");

sceneAudios.fuelPump = new AudioMixer(listner);
sceneAudios.fuelPump.registerSFX("./audio/fuel_pump.mp3");


// Camera orbit state
let yaw = 0;
let pitch = 0;
const sensitivity = 0.002;
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement) {
    yaw -= e.movementX * sensitivity;
    pitch += e.movementY * sensitivity;
    pitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, pitch));
  }
});

const cameraOffset = new THREE.Vector3(0, 3, -6);
const clock = new THREE.Clock();
const maxSpeed = 0.15;
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

    if(speed < maxSpeed){
        speed += accelaration;
      }
    
    if( fuel <= 0){
        refuelShip();
        sceneAudios.fuelPump.playAudio(2);
      }
    // Accelaration SFX
    if(sceneAudios.space.audio.isPlaying && speed != 0.1){
        sceneAudios.space.audio.setPlaybackRate(1 + (speed*3));
        // sceneAudios.space.audio.setVolume(Math.min(1, 0.8 + speed * 0.05));
      }else if (sceneAudios.space.audio.isPlaying){
        sceneAudios.space.audio.setPlaybackRate(1);
      }
    
    // Warning SFX
    if(sceneModels.spaceShip.checkWithinZone(sceneModels.spaceStation.model)){
      console.log("WARNING...");
      sceneAudios.warning.playAudio();
      warningBar.classList.remove("hidden");
      warningBar.classList.add("visible");
    }else{
      warningBar.classList.add("hidden");
      warningBar.classList.remove("visible");
    }
  }



  // updateLabels(labelMeshes, camera);
  sceneLabels.engineCore.updateLabels(camera);
  sceneLabels.designLab.updateLabels(camera);
  sceneLabels.navConsole.updateLabels(camera);
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();